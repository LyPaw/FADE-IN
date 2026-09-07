# FADE IN

> Galería de prompts para arte generado con Inteligencia Artificial.

**FADE IN** es una web que funciona como un museo interactivo de obras creadas con IA. Cada obra expuesta puede copiarse: el visitante accede al **prompt de estilo** que la originó y puede reutilizarlo para crear la suya propia.

## La idea

En lugar de guardar prompts en un bloque de notas privado, la web los convierte en piezas expuestas. Cada prompt es un **estilo** reutilizable, no la receta de una imagen puntual: el mismo prompt puede adaptarse a cualquier sujeto que el visitante quiera generar. La galería intenta devolver a las personas que hacen arte con IA el control sobre sus técnicas, compartiéndolas como una expresión artística abierta.

## Estética

- Tema **Cine Antiguo**: negro profundo, rojo cinematográfico y dorado envejecido.
- Efecto de **grano de película** en toda la interfaz.
- Grid tipo **Pinterest / masonry**, con animaciones suaves de aparición al hacer scroll.
- Tipografías: **Playfair Display** (títulos) + **Inter** (cuerpo).

## Tecnologías

| Tecnología | Uso |
|---|---|
| **HTML5** | Estructura semántica de la página |
| **CSS3** | Estilos, grid masonry y diseño responsive |
| **JavaScript (vanilla ES6+)** | Lógica de la galería: renderizado, búsqueda, filtros, modal y portapapeles (`navigator.clipboard`) |
| **JSON** | Fuente de datos local (obras y prompts) |
| **GitHub Pages** | Alojamiento 100 % estático, sin backend ni bases de datos externas |

Sin frameworks ni dependencias de terceros: solo HTML, CSS y JavaScript puro.

## Estructura

```
├── index.html          # Página principal
├── css/style.css       # Estilos y tema visual
├── js/app.js           # Lógica de la aplicación
├── data/prompts.json   # Datos: obras, prompts, estilos y temas
├── images/
│   ├── gallery/        # Imágenes de las obras
│   └── assets/         # Recursos complementarios
└── LICENSE             # Licencia del código (MIT)
```

## Cómo funciona

1. La web carga `data/prompts.json` al entrar y construye la galería dinámicamente.
2. El visitante puede buscar por texto o filtrar por **estilo** y **tema**.
3. Al hacer clic en una obra se abre un modal con la imagen en grande y el prompt.
4. Tras **Copiar Prompt**, el visitante obtiene el prompt de estilo acompañado de su crédito.

Cada obra pertenece a un estilo y a un tema, y un mismo prompt puede agrupar varias imágenes que lo comparten.

## Licencia

### Código (HTML, CSS, JavaScript) — Licencia MIT

El código fuente de este sitio está bajo la **Licencia MIT**: libre y permisivo, con la única condición de incluir el aviso de copyright. El autor no asume responsabilidad legal sobre el uso que se haga de él.

Ver [`LICENSE`](LICENSE).

### Contenido (prompts e imágenes) — CC BY 4.0 (Atribución)

Los prompts y las imágenes publicadas son de libre uso bajo **Creative Commons Atribución 4.0 (CC BY 4.0)**, siempre que se reconozca la autoría. Todos los prompts y obras son de autoría de `@lypaw_`.

### Derechos de imagen — Restricciones adicionales

> Las imágenes que contengan el **rostro del creador/autor** conservan sus **derechos de imagen personal** de forma más estricta y **no** pueden utilizarse para:
>
> - Suplantación de identidad o imitación de la persona,
> - Entrenamiento no autorizado de modelos con fines de imitación,
> - Uso comercial injurioso o que dañe la reputación del autor.
>
> En estos casos se requiere el consentimiento explícito del autor.