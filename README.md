# LYPAW_ Prompt Gallery

Galería web dinámica (estática) para mostrar prompts de arte generado con IA. Creada para ser alojada en **GitHub Pages** sin necesidad de base de datos ni servicios externos.

## Estética

- Tema **Cine Antiguo** (negro, rojo y dorado)
- Tipografías: Playfair Display (títulos) + Inter (cuerpo)
- Grid tipo Pinterest (masonry) responsive
- Animaciones suaves de aparición al hacer scroll
- Efecto de grano de película sobre toda la web

## Estructura

```
├── index.html          # Página principal
├── css/style.css       # Estilos
├── js/app.js           # Lógica (galería, filtros, modal, copiar)
├── data/prompts.json   # ← Base de datos local (la editas vos)
└── images/
    ├── gallery/        # ← Tus imágenes van acá
    └── assets/         # Recursos complementarios
```

## Cómo publicar en GitHub Pages

1. Creá un repositorio en GitHub (ej: `prompt-gallery`).
2. Subí todo el contenido de este proyecto al repo.
3. En GitHub: `Settings → Pages → Source: Deploy from a branch` y elegí `main` / `master`.
4. Tu web quedará disponible en `https://tuusuario.github.io/prompt-gallery/`.
5. Si es un repo de usuario (`tuusuario.github.io`), quedará en la raíz.

## Cómo agregar una nueva obra

### 1. Subí la imagen

Colocá la imagen en la carpeta `images/gallery/`.

> **Importante:** GitHub Pages es estático, no comprime imágenes. Para buena velocidad usá imágenes `.jpg` o `.webp` optimizadas (idealmente menos de ~500KB).

### 2. Agregá la entrada en `data/prompts.json`

Edita `data/prompts.json` y agregá un objeto al array `prompts`:

```json
{
  "id": "mi-nuevo-estilo",
  "title": "Nombre que se muestra",
  "style": "nombre-estilo",       // ⇦ debe existir en el array "styles"
  "theme": "nombre-tema",         // ⇦ debe existir en el array "themes"
  "prompt": "el prompt de estilo aquí...",
  "images": [
    { "src": "gallery/mi-imagen-1.jpg", "alt": "Descripción 1" },
    { "src": "gallery/mi-imagen-2.jpg", "alt": "Descripción 2" }
  ]
}
```

### 3. (Opcional) Agregá nuevas categorías

Si trabajás con un estilo o tema nuevo, agregalo también a los arrays `styles` o `themes` al inicio del JSON.

## Lista predefinida de Estilos y Temas

Los valores de `style` y `theme` en cada prompt **deben pertenecer a estas listas**. Referite a las listas existentes cuando escribas un JSON.

**Estilos disponibles:**
```
neon-noir          oil-painting
surrealism         anime
realismo-cinematografico
fantasia-oscura    retro-futurismo
acuarela-onirica
```

**Temas disponibles:**
```
retrato    paisaje    abstracto    fantasia
sci-fi     naturaleza arquitectura animales
```

> Si agregás un estilo o tema nuevo, debe existir también en el array `styles` o `themes` al inicio de `data/prompts.json` para que aparezca en los filtros de la web.

## Cómo funciona el prompt

Los prompts son **de estilo**, no de imagen específica. Es decir, un mismo prompt puede servir para generar un perro, un gato, una persona, etc. El visitante copia el prompt de estilo y lo adapta a su sujeto. Al copiar se agrega automáticamente:

```
Creador del Prompt: @lypaw_
```

## Personalización

- **Crédito**: el texto que se copia con el prompt está en `js/app.js`, en la constante `CREDIT`.
- **Instagram**: buscá `lypaw_` en `index.html` para cambiar el link.
- **Colores**: editá las variables CSS en `css/style.css` (sección `:root`).

## Licencia

### Código (HTML, CSS, JavaScript) — Licencia MIT

El código fuente de este sitio web (estructura, estilos y lógica) está bajo la **Licencia MIT**. Es libre y permisivo: cualquiera puede ver, usar, modificar y distribuir el código, con la única condición de incluir el aviso de copyright. El autor no asume responsabilidad legal alguna sobre el uso que se haga del código.

Ver el archivo [`LICENSE`](LICENSE).

### Contenido (prompts e imágenes) — CC BY 4.0 (Atribución)

Los prompts y las imágenes publicadas en esta galería son de libre uso bajo la licencia **Creative Commons Atribución 4.0 (CC BY 4.0)**, es decir, pueden copiarse, usarse y adaptarse siempre que se reconozca la autoría del creador.

Todos los prompts y obras son de autoría del creador de la cuenta `@lypaw_`.

### Derechos de imagen — Restricciones adicionales

> **Importante:** Las imágenes que contengan el **rostro del creador/autor** conservan sus **derechos de imagen personal** de forma más estricta y **no** pueden utilizarse para:
>
> - Suplantación de identidad o imitación de la persona,
> - Entrenamiento no autorizado de modelos con fines de imitación,
> - Uso comercial injurioso o que dañe la reputación del autor.
>
> En estos casos se requiere el consentimiento explícito del autor.
