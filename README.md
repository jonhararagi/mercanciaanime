# NekoPrint — tienda de remeras y estampas anime

Tienda web estática, responsive y pensada primero para celulares. No necesita instalar Node, pagar hosting ni usar una base de datos para mostrar el catálogo y preparar pedidos.

## Qué incluye

- Catálogo filtrable por series/categorías.
- Personalizador de producto, talle, color, ubicación de estampa y notas.
- Vista previa ilustrativa de la remera.
- Carrito y total estimado.
- Mensaje de pedido armado para WhatsApp o Telegram.
- Diseño adaptable a celular y PC, sin dependencias externas.

## Configuración obligatoria antes de recibir pedidos

1. Abrí [index.html](./index.html) en GitHub y presioná el lápiz para editar.
2. Buscá la línea `const products=[` y, justo antes, agregá:

   ```js
   window.STORE_CONFIG = {
     whatsapp: "54911XXXXXXXX", // código de país + número, solo dígitos
     telegram: "TuUsuarioTelegram" // usuario público, sin @
   };
   ```

3. Reemplazá los dos valores por los datos reales del negocio y guardá el cambio con **Commit changes**.
4. En WhatsApp usá el código de país de Argentina (54), el 9 para celular y el número completo sin el 15. Verificá que el enlace abra el chat correcto.

**Importante:** los botones no cobran ni envían automáticamente. Abren el canal elegido con el texto preparado para que el cliente lo revise y lo envíe. Telegram puede variar según la app/dispositivo. No se recopilan datos en un servidor ni se guardan pedidos al cerrar la página.

## Publicar gratis con GitHub Pages

1. Entrá en **Settings → Pages** en este repositorio.
2. En **Build and deployment**, elegí **Deploy from a branch**.
3. Seleccioná la rama `main` y la carpeta `/(root)`; guardá.
4. Esperá la publicación y abrí la URL que GitHub muestre en esa pantalla.

La URL normalmente tendrá el formato `https://jonhararagi.github.io/mercanciaanime/`. Usá la URL exacta que muestre Settings → Pages.

## Editar catálogo y precios

En `index.html`, el catálogo está en el arreglo `products`. Cada producto contiene `id`, `name`, `series`, `icon`, `label` y `price`. Los precios son ejemplos y deben ajustarse a los costos reales de prenda, estampado, mano de obra, embalaje y margen.

La tabla `prices` contiene los precios base de remera clásica, oversize, buzo, pack de stickers y taza. El adicional por estampa frente y espalda también está indicado en el código.

## Antes de vender

- Reemplazá precios de ejemplo, nombre, logo y diseños ilustrativos.
- Añadí fotos reales de prendas y estampas que efectivamente puedas producir.
- Indicá talles, medidas, colores disponibles, tiempos de producción, envíos, medios de pago y política de cambios.
- Verificá los derechos comerciales antes de vender estampas de personajes, logos o ilustraciones de franquicias de anime. Que una serie sea popular no significa que sus personajes se puedan comercializar sin autorización.
- Probá ambos botones de pedido desde un celular y una computadora.

## Alcance actual

Es un **catálogo y armador de pedidos**, no una plataforma de e-commerce con backend. No tiene cuentas de clientes, pagos online, inventario sincronizado ni panel administrativo. GitHub Pages publica archivos estáticos y no recibe pedidos por sí solo. Para administrar pedidos automáticamente hará falta integrar un servicio/backend más adelante.
