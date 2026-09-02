# Portfolio — Agustín Gutiérrez Mora

Portfolio personal publicado con **GitHub Pages**. Sitio estático, sin dependencias ni build:
solo HTML, CSS y JavaScript.

Diseño basado en el prototipo [Portfolio Design (Figma Community)](https://www.figma.com/community),
adaptado a mi perfil.

🔗 **En vivo:** https://agugutierrezz.github.io

---

## Estructura

```
.
├── index.html    # Todo el contenido del sitio
├── styles.css    # Estilos (paleta y medidas en :root, al principio)
├── script.js     # Tipeo, parallax, inclinación 3D, apariciones y navegación
├── .nojekyll     # Evita que GitHub Pages procese el sitio con Jekyll
└── assets/
    ├── memoji.png    # Avatar del inicio (PNG con fondo transparente)
    ├── gescom.jpg    # Captura de GESCOM
    ├── footdata.jpg  # Captura de FootData
    └── sisinv.jpg    # Captura de SISINV
```

## Cómo editarlo

- **Textos, proyectos y datos** → `index.html`. Cada sección arranca con un comentario
  (`<!-- ══ EXPERIENCIA ══ -->`), así que se encuentra rápido.
- **Colores** → primeras líneas de `styles.css`, en `:root`. Cambiando `--bg`, `--card-a`,
  `--card-b` y `--violet` cambia el sitio entero.
- **Frases del título** → array `PHRASES` en `script.js`.
- **Agregar una tarjeta de experiencia** → copiar un bloque
  `<article class="exp-card reveal">…</article>` dentro de `.exp-grid`. Si quedan impares, la
  última ocupa el ancho completo sola (lo resuelve el CSS).
- **Agregar un proyecto** → copiar un bloque `<article class="feature reveal">…</article>` y
  alternar la clase `feature-alt` para que la captura cambie de lado.
- **Cambiar el avatar** → reemplazar `assets/memoji.png` manteniendo el nombre. Conviene que sea
  un PNG cuadrado con fondo transparente; el degradado que lo desvanece por abajo lo pone el CSS
  (`.avatar-img`, propiedad `mask-image`).
- **Cambiar una captura** → reemplazar el `.jpg` en `assets/` con el mismo nombre. Se muestran a
  la mitad de su tamaño real, así que conviene subirlas a 1600px de ancho para que se vean nítidas
  en pantallas retina.

## Verlo en local

Se puede abrir `index.html` directamente en el navegador. Para servirlo igual que en producción:

```bash
python3 -m http.server 8000
# luego abrir http://localhost:8000
```

## Publicación

Cada `push` a la rama `main` republica el sitio automáticamente
(Settings → Pages → Source: *Deploy from a branch* → `main` / `root`).
El deploy tarda entre 30 segundos y un par de minutos.

## Detalles de implementación

- Movimiento en scroll: halos de fondo y mockups con parallax sobre `requestAnimationFrame`,
  y apariciones con `IntersectionObserver` (las tarjetas entran desde los costados).
- La constelación de tecnologías es un único SVG: líneas curvas, círculos y órbitas animadas con CSS.
- Efecto de tipeo en el título, con varias frases rotando.
- Todo se desactiva si el sistema pide movimiento reducido (`prefers-reduced-motion`).
- Accesible: enlace de salto al contenido, foco visible, etiquetas ARIA y HTML semántico.
- Sin dependencias externas más allá de la tipografía (Google Fonts).
