# NekoPrint — tienda de remeras y estampas

Tienda responsive, pensada primero para celulares, con catálogo, personalizador, pedidos por WhatsApp/Telegram y una primera versión de backend para proteger precios y gestionar pedidos.

## Funciones

- Catálogo de referencias de diseños de anime y opción de texto personalizado.
- Remeras en negro o blanco, selección de talle y ubicación de estampa.
- Precios oficiales cargados desde el servidor; el servidor recalcula el total al registrar el pedido.
- Panel privado en /admin/ para actualizar precios, ocultar/mostrar diseños y gestionar estados de pedidos.
- API y base de datos Cloudflare Pages Functions + D1.

## Importante: aún requiere configuración

**No publiques esta versión en GitHub Pages para vender:** GitHub Pages no ejecuta el backend y las funciones de administración/pedidos no funcionarán allí. Primero hay que configurar Cloudflare Pages, D1 y los secretos privados. Seguí la guía docs/PANEL_PRIVADO_Y_DESPLIEGUE.md.

No se guardan contraseñas en el repositorio. Configurá ADMIN_PASSWORD y SESSION_SECRET como secretos en el panel de Cloudflare. No los pongas en archivos públicos.

## Configuración de contacto

En index.html, reemplazá los valores de ejemplo de esta línea existente:

    window.STORE_CONFIG = { whatsapp: "54911XXXXXXXX", telegram: "TuUsuarioTelegram" };

En WhatsApp usá el código de país de Argentina (54), el 9 para celular y el número completo sin el 15. Verificá que el enlace abra el chat correcto. No agregues una segunda configuración.

## Precios

Después de desplegar y configurar D1, administrá los precios desde /admin/. La base empieza con valores de ejemplo. Cambialos por tus costos reales antes de recibir pedidos. El navegador no es la fuente oficial del precio.

## Derechos de las estampas

Los logos, nombres, personajes y marcas de anime pertenecen a sus respectivos titulares. Mostrar una imagen como referencia no implica permiso para fabricar o vender prendas con ella. Verificá las licencias aplicables; priorizá diseños propios o con licencia comercial documentada. Consultá docs/ESTAMPAS_Y_FUENTES.md.

## Estado y limitaciones

El código de la API y el panel está en el repositorio. GitHub Actions valida automáticamente la sintaxis JavaScript y el esquema inicial de la base; el despliegue y las pruebas de integración reales aún están pendientes. Esta versión no procesa pagos ni confirma stock. Antes de vender, completá los pasos de despliegue, probá el panel y los pedidos, y activá protección antiabuso en Cloudflare.
