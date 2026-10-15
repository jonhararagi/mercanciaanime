# Guía fácil de NekoPrint (sin programar)

Esta guía es para administrar la mini-tienda una vez que esté publicada y configurada. No necesitás abrir GitHub ni editar código para las tareas del día a día.

## Abrir la tienda y el panel

- **Tienda para clientes:** abrí el enlace público de la tienda en el navegador.
- **Panel privado:** abrí el mismo dominio y agregá `/admin/` al final de la dirección.
- Iniciá sesión con la contraseña privada del panel. No la compartas con clientes.

> Si todavía no te dieron una dirección pública de Cloudflare, la tienda no está publicada. La configuración inicial se hace una sola vez y requiere crear la base de datos y guardar secretos en Cloudflare; mirá [la guía de puesta en marcha](PANEL_PRIVADO_Y_DESPLIEGUE.md). No hace falta hacer esos pasos cada vez que vendés.

## Las tres tareas habituales

### 1. Cambiar precios

1. Entrá en **1. Precios y estampas**.
2. Buscá el producto que querés cambiar.
3. Tocá el número del precio y escribí el nuevo valor en pesos.
4. Si también necesitás cambiar el precio base de la remera, modificá el número en la sección de precios base.
5. Tocá **Guardar cambios**.
6. Esperá el aviso de confirmación. Después abrí la tienda como cliente y revisá el precio.

Los precios de ejemplo deben reemplazarse por tus precios reales antes de vender.

### 2. Mostrar u ocultar una estampa

1. En **1. Precios y estampas**, buscá la estampa.
2. Dejá marcada la casilla **Visible** para mostrarla en la tienda; quitá la marca para ocultarla.
3. Tocá **Guardar cambios** y esperá la confirmación.

### 3. Atender pedidos

1. Entrá en **2. Ver pedidos**.
2. Tocá **Buscar pedidos nuevos**.
3. Abrí cada pedido y revisá el talle, color, estampa, cantidad, entrega y total.
4. Contactá al cliente por WhatsApp para confirmar disponibilidad, entrega y forma de pago.
5. Cambiá el estado del pedido y tocá **Actualizar estado** para guardar el avance.

Estados sugeridos: Nuevo → Confirmado → En producción → Listo → Entregado. Usá Cancelado si no se realizará.

## Reglas simples para evitar problemas

- Las remeras disponibles son **negras o blancas**.
- No confirmes un pedido hasta revisar el precio, el diseño y la entrega con el cliente.
- El pedido por sí solo **no significa que esté pagado**: esta versión no cobra online.
- Si no aparece un pedido o un precio no se guarda, revisá la conexión y el mensaje que muestra la página.
- Tocá **Salir del panel** cuando termines, especialmente si usaste una computadora compartida.
- Si olvidás la contraseña o la página muestra un error de configuración, pedí ayuda técnica; no cambies archivos al azar.

## WhatsApp y publicación

Antes de abrir la tienda al público, la persona que configure el sitio debe cargar el número correcto de WhatsApp y probar un pedido completo. La tienda y el panel deben estar publicados en Cloudflare Pages con la base de datos conectada. **El repositorio por sí solo no es todavía una tienda publicada.**

La guía técnica de configuración está en [Panel privado y despliegue](PANEL_PRIVADO_Y_DESPLIEGUE.md).
