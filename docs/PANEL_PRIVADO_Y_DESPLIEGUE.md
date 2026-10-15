# Panel privado y despliegue seguro

## Estado

El repositorio ahora incluye una primera implementación del backend: Cloudflare Pages Functions en functions/api/[[path]].js, esquema de base de datos D1 en migrations/0001_init.sql, configuración inicial en wrangler.toml y panel de administración en admin/index.html.

**No está publicado ni listo para recibir pedidos todavía.** GitHub Pages no ejecuta estas funciones. El proyecto debe desplegarse en Cloudflare Pages y configurarse con una base D1 y secretos privados. No guardes contraseñas, tokens ni identificadores secretos en archivos del repositorio.

## Qué protege

- El panel requiere una contraseña configurada como secreto del servidor y una sesión firmada en cookie HttpOnly, Secure y SameSite=Strict.
- La tienda obtiene el catálogo/precios de la API y envía el pedido al servidor.
- El servidor vuelve a calcular los precios usando la base de datos. Nunca confía en el total calculado por el navegador.
- Los pedidos se guardan en D1 y se pueden consultar/cambiar de estado desde el panel.
- El panel permite cambiar los precios base por producto, los adicionales por diseño y ocultar/mostrar diseños.
- Los colores permitidos por el servidor son solo Negro y Blanco.

La autenticación y la validación del servidor reducen el riesgo de manipulación; no sustituyen una auditoría de seguridad ni una protección antiabuso completa. No publiques la tienda para producción hasta completar la configuración y las pruebas.

## Despliegue inicial en Cloudflare Pages

1. Iniciá sesión en Cloudflare y creá una base de datos en Workers & Pages → D1 SQL Database. Usá el nombre nekoprint-db.
2. Copiá el Database ID que Cloudflare muestra y reemplazá REEMPLAZAR_CON_EL_ID_DE_D1 en wrangler.toml. Ese ID identifica la base; no es una contraseña, pero debe ser el ID real para que el binding funcione.
3. En la consola SQL de esa base, ejecutá el contenido completo de migrations/0001_init.sql una sola vez. Incluye precios de ejemplo: cambiá los valores desde el panel luego de desplegar.
4. En Workers & Pages, creá un proyecto Pages conectado al repositorio jonhararagi/mercanciaanime. Elegí la rama main, sin comando de build y con el directorio de salida . Confirmá que Cloudflare detecte la configuración de Pages Functions.
5. En la configuración del proyecto, agregá el binding de D1 con variable DB y la base nekoprint-db, tanto para Production como para Preview si vas a usar previews. Verificá que coincida con wrangler.toml.
6. En Settings → Variables and Secrets, agregá estos secretos para Production:
   - ADMIN_PASSWORD: contraseña larga, única, que no uses en otros sitios.
   - SESSION_SECRET: cadena aleatoria criptográficamente segura de al menos 32 caracteres.
   
   No los escribas en index.html, wrangler.toml, commits, capturas públicas ni mensajes.
7. Desplegá y abrí la URL que Cloudflare asignó. Probá /api/health, después /api/catalog, y entrá a /admin/.
8. Iniciá sesión en el panel, cambiá un precio, guardá, recargá la tienda y verificá que el valor oficial cambió. Hacé un pedido de prueba y comprobá que aparece en el panel. Probá también un pedido con color distinto de negro/blanco y confirmá que el servidor lo rechaza.
9. Configurá el WhatsApp/Telegram del negocio en index.html antes de habilitar pedidos reales. Los botones abren el canal para que el cliente confirme el mensaje; el registro del pedido se guarda en el backend antes de abrirlo.

## Operación segura

- No compartas la contraseña del panel. Cerrá sesión en computadoras compartidas.
- Usá Production para los pedidos reales; no uses datos reales en Preview.
- Revisá y actualizá la plataforma cuando corresponda.
- Antes de vender, probá login incorrecto, logout, sesión vencida, cambios de precios, diseños desactivados y validación de pedidos.
- La API aplica límites básicos por IP (5 intentos de acceso en 15 minutos y 20 intentos de pedido por hora), pero estos no sustituyen las reglas de rate limiting/WAF de Cloudflare ni una revisión de seguridad antes de producción.
- Los pedidos incluyen información personal que escriba el cliente. Definí cuánto tiempo conservarlos y quién puede acceder a la base.
- Los enlaces de anime son referencias, no licencias de explotación comercial. Priorizá diseños propios o con licencia comercial documentada.

## Limitaciones actuales

- El backend no procesa pagos ni confirma stock.
- El pedido se registra con estado Nuevo; el contacto por WhatsApp/Telegram sigue siendo manual.
- La sesión de administrador expira tras ocho horas.
- Los precios semilla son ilustrativos y hay que reemplazarlos por tus costos reales.
