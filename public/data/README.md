# Data Directory for Static Assets

Place your static files in this folder (`public/data/`) so they can be referenced in `src/data.ts`:

- **Avatar Image**: `public/data/avatar.jpg` -> reference as `"/data/avatar.jpg"` in `src/data.ts`
- **Curriculum Vitae (PDF)**: `public/data/cv.pdf` -> reference as `"/data/cv.pdf"` in `src/data.ts`
- **Paper Teaser Images**: `public/data/paper1_teaser.jpg`, `public/data/paper2_teaser.jpg`, etc. -> reference as `"/data/paper1_teaser.jpg"` in `src/data.ts`

When deployed to Cloudflare Pages or any static host, all files inside `public/data/` will be served directly at `/data/<filename>`.
