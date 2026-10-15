const COOKIE = "nekoprint_admin";
const SESSION_SECONDS = 8 * 60 * 60;
const allowedColors = new Set(["Negro", "Blanco"]);
const allowedSizes = new Set(["XS", "S", "M", "L", "XL", "XXL", "Sin talle"]);
const allowedGarments = new Set(["Remera clásica", "Remera oversize", "Buzo", "Sticker", "Taza"]);

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "x-content-type-options": "nosniff", ...headers }
  });
}
function constantTimeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
async function hashIp(request) {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ip));
  return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, "0")).join("");
}
function b64url(bytes) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
async function sign(payload, secret) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return b64url(sig);
}
async function makeSession(secret) {
  const payload = b64url(new TextEncoder().encode(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS, nonce: crypto.randomUUID() })));
  return payload + "." + await sign(payload, secret);
}
async function validSession(request, secret) {
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.split(";").map(x => x.trim()).find(x => x.startsWith(COOKIE + "="));
  if (!match) return false;
  const token = decodeURIComponent(match.slice(COOKIE.length + 1));
  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) return false;
  if (!constantTimeEqual(signature, await sign(payload, secret))) return false;
  try {
    const padded = payload.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(payload.length / 4) * 4, "=");
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
    const info = JSON.parse(new TextDecoder().decode(bytes));
    return Number.isFinite(info.exp) && info.exp > Math.floor(Date.now() / 1000);
  } catch { return false; }
}
function cookieHeader(value, maxAge) {
  return COOKIE + "=" + value + "; Path=/api/admin; HttpOnly; Secure; SameSite=Strict; Max-Age=" + maxAge;
}
async function readJson(request, maxBytes = 16000) {
  const type = request.headers.get("content-type") || "";
  if (!type.toLowerCase().includes("application/json")) throw new Error("Se requiere JSON.");
  const raw = await request.text();
  if (raw.length > maxBytes) throw new Error("Solicitud demasiado grande.");
  return JSON.parse(raw);
}
async function requireAdmin(request, env) {
  if (!env.ADMIN_PASSWORD || !env.SESSION_SECRET || env.SESSION_SECRET.length < 32) return false;
  return validSession(request, env.SESSION_SECRET);
}
async function rateCount(env, table, ipHash, since) {
  const row = await env.DB.prepare("SELECT COUNT(*) AS count FROM " + table + " WHERE ip_hash = ? AND attempted_at > ?").bind(ipHash, since).first();
  return Number(row?.count || 0);
}
async function api(request, env) {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, "") || "/";
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: { "access-control-allow-methods": "GET,POST,PUT,DELETE,OPTIONS", "access-control-allow-headers": "content-type" } });
  if (!env.DB) return json({ error: "La base de datos no está configurada." }, 503);
  const origin = request.headers.get("Origin");
  if (origin && origin !== url.origin) return json({ error: "Origen no permitido." }, 403);

  if (path === "/api/health" && request.method === "GET") return json({ ok: true, service: "NekoPrint API" });

  if (path === "/api/catalog" && request.method === "GET") {
    const { results } = await env.DB.prepare("SELECT id, name, series, label, price, image, source, enabled FROM products WHERE enabled = 1 ORDER BY sort_order, id").all();
    const prices = await env.DB.prepare("SELECT garment, price FROM garment_prices ORDER BY garment").all();
    return json({ products: results, garmentPrices: prices.results });
  }

  if (path === "/api/orders" && request.method === "POST") {
    const ipHash = await hashIp(request);
    const now = new Date().toISOString();
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    await env.DB.prepare("DELETE FROM order_attempts WHERE attempted_at < ?").bind(new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()).run();
    if (await rateCount(env, "order_attempts", ipHash, since) >= 20) return json({ error: "Se alcanzó el límite temporal de pedidos desde esta conexión. Intentá más tarde." }, 429);
    await env.DB.prepare("INSERT INTO order_attempts (ip_hash, attempted_at) VALUES (?, ?)").bind(ipHash, now).run();
    let body;
    try { body = await readJson(request, 12000); } catch (e) { return json({ error: e.message || "JSON inválido." }, 400); }
    if (!Array.isArray(body.items) || body.items.length < 1 || body.items.length > 20) return json({ error: "El pedido debe contener entre 1 y 20 artículos." }, 400);
    const customerName = typeof body.customerName === "string" ? body.customerName.trim().slice(0, 100) : "";
    const delivery = typeof body.delivery === "string" ? body.delivery.slice(0, 100) : "Coordinar por mensaje";
    const lines = [];
    let total = 0;
    for (const item of body.items) {
      const garment = allowedGarments.has(item.garment) ? item.garment : null;
      const size = allowedSizes.has(item.size) ? item.size : null;
      const color = allowedColors.has(item.color) ? item.color : null;
      const placement = ["Frente grande", "Frente pequeño", "Espalda", "Frente y espalda"].includes(item.placement) ? item.placement : null;
      const quantity = item.quantity === undefined ? 1 : Number(item.quantity);
      if (!garment || !size || !color || !placement || !Number.isInteger(quantity) || quantity < 1 || quantity > 10) return json({ error: "Hay un producto con opciones inválidas. Revisá talle, color, ubicación y cantidad." }, 400);
      const base = await env.DB.prepare("SELECT price FROM garment_prices WHERE garment = ?").bind(garment).first();
      if (!base) return json({ error: "Producto no disponible." }, 400);
      let name, series, unitPrice;
      if (item.customText !== undefined && item.customText !== null && String(item.customText).trim()) {
        const text = String(item.customText).trim().replace(/[<>\r\n]/g, " ").slice(0, 36);
        name = "Texto: " + text; series = "Diseño personalizado"; unitPrice = Number(base.price);
      } else {
        const product = await env.DB.prepare("SELECT id, name, series, price FROM products WHERE id = ? AND enabled = 1").bind(Number(item.productId)).first();
        if (!product) return json({ error: "Una estampa ya no está disponible. Actualizá el catálogo." }, 400);
        name = product.name; series = product.series;
        unitPrice = garment === "Remera clásica" ? Math.max(Number(base.price), Number(product.price)) : garment === "Remera oversize" ? Number(base.price) + Math.max(0, Number(product.price) - 12000) : Number(base.price);
      }
      if (placement === "Frente y espalda") unitPrice += 3000;
      const note = typeof item.notes === "string" ? item.notes.trim().slice(0, 400) : "";
      total += unitPrice * quantity;
      lines.push({ name, series, garment, size, color, placement, notes: note, quantity, unitPrice, subtotal: unitPrice * quantity });
    }
    if (total > 10000000) return json({ error: "El total supera el límite permitido. Consultanos por separado." }, 400);
    const id = crypto.randomUUID();
    await env.DB.prepare("INSERT INTO orders (id, created_at, customer_name, delivery, items_json, total, status) VALUES (?, ?, ?, ?, ?, ?, 'Nuevo')")
      .bind(id, now, customerName, delivery, JSON.stringify(lines), total).run();
    return json({ ok: true, order: { id, createdAt: now, customerName, delivery, items: lines, total, status: "Nuevo" } }, 201);
  }

  if (path === "/api/admin/login" && request.method === "POST") {
    if (!env.ADMIN_PASSWORD || !env.SESSION_SECRET || env.SESSION_SECRET.length < 32) return json({ error: "Falta configurar secretos del administrador." }, 503);
    const ipHash = await hashIp(request);
    const now = new Date().toISOString();
    const since = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    await env.DB.prepare("DELETE FROM admin_login_attempts WHERE attempted_at < ?").bind(new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()).run();
    if (await rateCount(env, "admin_login_attempts", ipHash, since) >= 5) return json({ error: "Demasiados intentos. Esperá 15 minutos antes de volver a probar." }, 429);
    await env.DB.prepare("INSERT INTO admin_login_attempts (ip_hash, attempted_at) VALUES (?, ?)").bind(ipHash, now).run();
    let body;
    try { body = await readJson(request, 2000); } catch { return json({ error: "Solicitud inválida." }, 400); }
    if (!constantTimeEqual(String(body.password || ""), env.ADMIN_PASSWORD)) return json({ error: "Contraseña incorrecta." }, 401);
    await env.DB.prepare("DELETE FROM admin_login_attempts WHERE ip_hash = ?").bind(ipHash).run();
    const token = await makeSession(env.SESSION_SECRET);
    return json({ ok: true }, 200, { "set-cookie": cookieHeader(token, SESSION_SECONDS) });
  }
  if (path === "/api/admin/logout" && request.method === "POST") return json({ ok: true }, 200, { "set-cookie": cookieHeader("", 0) });

  if (path.startsWith("/api/admin/")) {
    if (!await requireAdmin(request, env)) return json({ error: "Acceso no autorizado. Iniciá sesión como administradora/or." }, 401);
    if (path === "/api/admin/me" && request.method === "GET") return json({ authenticated: true });
    if (path === "/api/admin/products" && request.method === "GET") {
      const result = await env.DB.prepare("SELECT id, name, series, label, price, image, source, enabled, sort_order FROM products ORDER BY sort_order, id").all();
      const prices = await env.DB.prepare("SELECT garment, price FROM garment_prices ORDER BY garment").all();
      return json({ products: result.results, garmentPrices: prices.results });
    }
    if (path === "/api/admin/products" && request.method === "PUT") {
      let body;
      try { body = await readJson(request, 20000); } catch (e) { return json({ error: e.message || "Solicitud inválida." }, 400); }
      if (!Array.isArray(body.products) || body.products.length > 100) return json({ error: "Lista de productos inválida." }, 400);
      const batch = [];
      for (const p of body.products) {
        const id = Number(p.id), price = Number(p.price);
        if (!Number.isInteger(id) || !Number.isFinite(price) || price < 0 || price > 10000000) return json({ error: "ID o precio inválido." }, 400);
        batch.push(env.DB.prepare("UPDATE products SET price = ?, enabled = ?, sort_order = ? WHERE id = ?")
          .bind(Math.round(price), p.enabled ? 1 : 0, Number.isInteger(p.sort_order) ? p.sort_order : 0, id));
      }
      if (Array.isArray(body.garmentPrices)) {
        for (const p of body.garmentPrices) {
          if (!allowedGarments.has(p.garment) || !Number.isFinite(Number(p.price)) || Number(p.price) < 0 || Number(p.price) > 10000000) return json({ error: "Precio de producto inválido." }, 400);
          batch.push(env.DB.prepare("UPDATE garment_prices SET price = ? WHERE garment = ?").bind(Math.round(Number(p.price)), p.garment));
        }
      }
      if (batch.length) await env.DB.batch(batch);
      return json({ ok: true });
    }
    if (path === "/api/admin/orders" && request.method === "GET") {
      const result = await env.DB.prepare("SELECT id, created_at, customer_name, delivery, items_json, total, status FROM orders ORDER BY created_at DESC LIMIT 200").all();
      return json({ orders: result.results.map(o => ({ ...o, items: JSON.parse(o.items_json), items_json: undefined })) });
    }
    if (path.startsWith("/api/admin/orders/") && request.method === "PUT") {
      const id = decodeURIComponent(path.slice("/api/admin/orders/".length));
      let body;
      try { body = await readJson(request, 2000); } catch { return json({ error: "Solicitud inválida." }, 400); }
      if (!["Nuevo", "Confirmado", "En producción", "Listo", "Entregado", "Cancelado"].includes(body.status)) return json({ error: "Estado inválido." }, 400);
      const result = await env.DB.prepare("UPDATE orders SET status = ? WHERE id = ?").bind(body.status, id).run();
      if (!result.meta.changes) return json({ error: "Pedido no encontrado." }, 404);
      return json({ ok: true });
    }
    return json({ error: "Ruta administrativa inexistente." }, 404);
  }
  return json({ error: "Ruta inexistente." }, 404);
}

export async function onRequest(context) {
  try { return await api(context.request, context.env); }
  catch { return json({ error: "Error interno. No se expusieron detalles del servidor." }, 500); }
}
