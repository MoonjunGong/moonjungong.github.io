# Academic Portfolio Website

An elegant, fully-featured, high-performance academic portfolio and personal website designed for scholars, researchers, and students. Built with React 19, TypeScript, and Tailwind CSS, this single-page static application provides a clean, fast, and responsive showcase for biographical details, publications, research focus areas, and career timelines.

Designed specifically for effortless editing via source files and zero-maintenance static deployment to **GitHub Pages**, **Cloudflare Pages**, **Vercel**, or **Netlify**.

---

## 🌟 Key Features

### 1. Biography & Contact Showcase
* **Brand-Colored Contact Actions**: Official Gmail logo copy-to-clipboard button with visual feedback, Google Scholar (`#4285F4`), CV download button, LinkedIn (`#0A66C2`), and current X logo.
* **Proportional Avatar**: Aspect-ratio-contained profile photo with optimized responsive sizing and eager priority loading.
* **Sticky Top Floating Navigation**: Translucent glassmorphic header bar with quick section navigation, dynamic scroll-spy, and dark/light mode toggle.

### 2. Scholarly Research Dashboard
* **Biography / About**: Academic narrative and research mission styled with optimized custom typography.
* **Focus Areas**: Interactive cards highlighting core research themes with dynamic Lucide icons and hover transitions.
* **Publication Engine**: Chronologically organized articles (Conferences, Journals, Workshops, Preprints) featuring:
  * Real-time search by title, author, venue, and tag keywords
  * Teaser diagram previews with zoom lightbox modal
  * External links to paper PDFs, code repositories, and DOI identifiers
  * One-click pre-formatted **BibTeX** clipboard copying
  * **BibTeX `.bib` File Download**: Direct one-click download button for `.bib` citation files using citekeys
  * High-legibility abstract accordion drawer
* **Academic Career Timeline**: Vertical timeline for Education, Professional Experience, and Honors / Awards.

### 3. Performance & Asset Optimization
* **Automated WebP Image Pipeline**: `npm run build` uses `sharp` to automatically convert `.png`, `.jpg`, and `.jpeg` images into compressed `.webp` assets (often saving **70–90%** bandwidth).
* **HTML5 `<picture>` Fallbacks**: Serves next-gen WebP to modern browsers while preserving full backward compatibility with PNG/JPG fallbacks.
* **Optimized Font Loading**: Custom `Fast_Sans.woff2` font with CLS (Cumulative Layout Shift) fallback matching and preconnected Google Fonts.
* **Tree-Shaken JavaScript Bundle**: Vendor chunk splitting for React, Motion, and Lucide icons for maximum caching and rapid initial load.

---

## 📂 Directory Structure

```text
├── index.html                 # Main entrypoint HTML with font preloading & stylesheet links
├── metadata.json              # Applet metadata configuration
├── package.json               # Dependencies and build scripts
├── vite.config.ts             # Vite configuration with chunk splitting
├── scripts/
│   └── optimize-images.js     # Image optimization script (PNG/JPG -> WebP)
├── public/
│   ├── Fast_Sans.woff2        # Custom font file
│   └── data/                  # Static media assets (avatar, CV PDF, teaser images, webp)
│       ├── README.md          # Guide for managing public assets
│       ├── avatar.jpg
│       ├── avatar.webp
│       ├── cv.pdf
│       ├── sscbench.png
│       └── sscbench.webp
└── src/
    ├── main.tsx               # React application root mount
    ├── App.tsx                # Sticky navbar, section layout, dark mode state
    ├── data.ts                # Main content configuration (Profile, Papers, Focus Areas, Timeline)
    ├── types.ts               # Shared TypeScript types and interfaces
    ├── index.css              # Global styles importing Tailwind CSS & font face declarations
    └── components/
        ├── HeaderCard.tsx            # Profile header with avatar, bio, and contact buttons
        ├── ResearchInterestsCard.tsx  # Focus areas cards with dynamic Lucide icons
        ├── PublicationsSection.tsx    # Publication filters, teaser images, BibTeX modal & download
        ├── AcademicTimeline.tsx      # Vertical academic experience timeline
        └── OptimizedImage.tsx        # Responsive <picture> element with WebP + fallback
```

---

## ⚙️ How to Update Your Content

All content and configuration is centralized in **`src/data.ts`** with comprehensive inline TypeScript types:

### 1. Update Profile & Contact Info (`INITIAL_PROFILE`)
```ts
export const INITIAL_PROFILE: Profile = {
  name: "Your Name",
  title: "Ph.D Student / Postdoc / Professor",
  affiliation: "Your University / Institution",
  email: "your.email@example.com",
  avatarUrl: "./data/avatar.jpg", // path inside public/
  bio: "Your biography narrative...",
  researchInterests: "Summary of your overarching research mission...",
  googleScholar: "https://scholar.google.com/citations?user=...",
  linkedin: "https://www.linkedin.com/in/...",
  twitter: "https://x.com/...",
  cvUrl: "./data/cv.pdf",
  websiteTitle: "Your Name",
};
```

### 2. Configure Focus Areas (`INITIAL_RESEARCH_AREAS`)
Choose any Lucide icon name (e.g., `"Brain"`, `"Eye"`, `"Cpu"`, `"Sparkles"`, `"Users"`, `"BookOpen"`):
```ts
{
  id: "ra-1",
  name: "Computer Vision",
  description: "3D scene understanding, neural rendering, and Gaussian Splatting.",
  iconName: "Eye",
}
```

### 3. Add Publications (`INITIAL_PAPERS`)
```ts
{
  id: "pub-1",
  title: "Paper Title",
  authors: "Author One, Author Two, Your Name",
  journal: "CVPR 2026",
  year: 2026,
  category: "conference", // "conference" | "journal" | "workshop" | "preprint"
  featured: true,
  teaserImage: "./data/my_paper_teaser.png", // Optional teaser diagram
  tags: ["Computer Vision", "Gaussian Splatting"],
  link: "https://arxiv.org/...",
  codeUrl: "https://github.com/...",
  abstract: "Full paper abstract here...",
  bibtex: `@inproceedings{...}`
}
```

### 4. Update Academic Timeline (`INITIAL_EXPERIENCES`)
```ts
{
  id: "exp-1",
  title: "Ph.D. in Computer Science",
  institution: "Your University",
  period: "2024 — Present",
  description: "Advised by Prof. Jane Doe.",
  type: "education" // "education" | "position" | "award"
}
```

---

## 🖼️ Adding & Optimizing Images

1. Place your new image (`.png`, `.jpg`, or `.jpeg`) into the `public/data/` folder (e.g., `public/data/my_teaser.png`).
2. Reference it in `src/data.ts`:
   ```ts
   teaserImage: "./data/my_teaser.png"
   ```
3. To generate optimized WebP versions locally, run:
   ```bash
   node scripts/optimize-images.js public
   ```
4. When you build with `npm run build`, all images in both `public/` and `dist/` are automatically converted and optimized into `.webp` format.

---

## 🚀 Development & Deployment

### Local Development
```bash
# 1. Install dependencies
npm install

# 2. Start local Vite development server (port 3000)
npm run dev
```

### Building for Production
```bash
# Compiles TypeScript, bundles assets with Vite, and generates WebP images
npm run build
```

### Deploying to Static Hosts
This application builds into the **`dist/`** directory.

* **GitHub Pages**: Ensure your GitHub Actions workflow runs `npm ci` and `npm run build`, then deploys the `./dist` folder.
* **Cloudflare Pages / Vercel / Netlify**:
  * **Build command**: `npm run build`
  * **Output directory**: `dist`
  * **Node.js version**: 18+ or 20+

---

## 🛠️ Technology Stack

* **UI Framework**: [React 19](https://react.dev/)
* **Bundler & Dev Server**: [Vite 6](https://vitejs.dev/)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
* **Image Processing**: [Sharp](https://sharp.pixelplumbing.com/) (automated WebP pipeline)
* **Icons**: [Lucide React](https://lucide.dev/)
* **Animations**: [Motion](https://motion.dev/)
* **Type Safety**: [TypeScript](https://www.typescriptlang.org/)
