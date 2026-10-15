# Estampas y fuentes de referencia

La tienda muestra una primera selección de **logos/símbolos** en la vista previa de la remera. Las imágenes se cargan desde Wikimedia Commons mediante enlaces `Special:FilePath`; por ahora no son archivos descargados y guardados dentro del repositorio. Se necesita conexión a internet para verlas.

## Catálogo inicial

| Estampa | Serie | Fuente de imagen |
|---|---|---|
| Nube de Akatsuki | Naruto | [Akatsuki nuage.svg](https://commons.wikimedia.org/wiki/File:Akatsuki_nuage.svg) |
| Logo Kimetsu no Yaiba | Demon Slayer | [Kimetsu no Yaiba logo.svg](https://commons.wikimedia.org/wiki/File:Kimetsu_no_Yaiba_logo.svg) |
| Logo Dragon Ball | Dragon Ball | [Dragonball Anime-Serie Original-Logo.svg](https://commons.wikimedia.org/wiki/File:Dragonball_Anime-Serie_Original-Logo.svg) |
| Esfera de una estrella | Dragon Ball | [Dragon ball.svg](https://commons.wikimedia.org/wiki/File:Dragon_ball.svg) |
| Logo Jujutsu Kaisen | Jujutsu Kaisen | [Jujutsu Kaisen logo.svg](https://commons.wikimedia.org/wiki/File:Jujutsu_Kaisen_logo.svg) |
| Logo Bleach: Thousand-Year Blood War | Bleach | [Bleach Thousand-Year Blood War Logo.svg](https://commons.wikimedia.org/wiki/File:Bleach_Thousand-Year_Blood_War_Logo.svg) |
| Logo Naruto | Naruto | [Naruto logo.svg](https://commons.wikimedia.org/wiki/File:Naruto_logo.svg) |

## Licencias y uso comercial

Wikimedia Commons indica en las fichas individuales las condiciones aplicables a cada archivo. Algunos logotipos se consideran texto/logo simple para fines de copyright en ciertas jurisdicciones, pero pueden seguir protegidos como marcas y esas conclusiones no garantizan permiso para imprimirlos y venderlos en Argentina. La imagen de Bleach TYBW indica CC BY-SA 4.0; la esfera de Dragon Ball indica CC BY 3.0; la nube de Akatsuki indica licencias CC BY-SA/GFDL. Revisá cada ficha y conservá atribución cuando corresponda antes de reutilizar o modificar un archivo.

**Importante:** tener una imagen disponible en Commons no equivale a tener una licencia comercial de la franquicia. Para vender estampas de anime de forma regular, lo más seguro es contar con autorización de los titulares o usar diseños originales/no infractores. Esta guía es un registro de fuentes, no asesoramiento legal.

## Cómo se conectan con la web

En `index.html`, los elementos que tienen el campo `image` muestran ese SVG en la tarjeta y en la vista previa de la prenda. El campo `source` enlaza a la ficha original para revisar autoría/licencia. Para incorporar archivos locales más adelante, descargá cada SVG desde su ficha, guardalo bajo `assets/prints/`, verificá que la licencia permita el uso planeado y cambiá `image` a una ruta local como `assets/prints/akatsuki.svg`.
