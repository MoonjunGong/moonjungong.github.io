# Public Data Directory (`public/data/`)

Place all your static media assets (profile avatars, CV PDFs, publication diagrams) in this folder.

## File Organization & Naming

| Asset Type | Recommended Location | Example Reference in `src/data.ts` |
| :--- | :--- | :--- |
| **Profile Photo** | `public/data/avatar.jpg` | `avatarUrl: "./data/avatar.jpg"` |
| **Curriculum Vitae** | `public/data/cv.pdf` | `cvUrl: "./data/cv.pdf"` |
| **Paper Teasers** | `public/data/<name>.png` | `teaserImage: "./data/<name>.png"` |

## Automatic WebP Optimization

When you place a `.png` or `.jpg` image in this directory, you can generate an optimized `.webp` file alongside it by running:

```bash
node scripts/optimize-images.js public
```

During deployment, `npm run build` will also automatically convert and compress all images in `./dist` for ultra-fast loading with zero loss in visual quality.
