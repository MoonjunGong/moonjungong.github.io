# Academic Portfolio Website

An elegant, fully-featured, and modern academic portfolio and personal website designed for scholars, researchers, and students. Built with React, TypeScript, and Tailwind CSS, this static single-page application provides a clean, fast, and responsive showcase for biographical details, publications, research focus areas, and career timelines.

Designed specifically for easy editing via source files and zero-maintenance static deployment (e.g., Cloudflare Pages, GitHub Pages, Vercel, or Netlify).

---

## 🌟 Key Features

### 1. Re-designed Biography & Profile
* **Google Scholar**: Direct link button to citation metrics.
* **Copy Email**: Interactive copy-to-clipboard button with visual checkmark feedback, preventing email scraping while keeping contact seamless.
* **Full-length Curriculum Vitae**: Dedicated button for direct downloading of CV (PDF format).
* **Social Links**: Clean buttons for LinkedIn and X (Twitter) profiles.
* **Proportional Avatar**: Dedicated image aspect ratio with clean borders to fit natural photo dimensions without blank space.

### 2. Tabbed Scientific Dashboard
* **About / Biography**: Clean display of academic narrative, office coordinates, and research interests.
* **Focus Areas**: Interactive cards showcasing core research focus areas, complete with configurable Lucide icons and detailed descriptions.
* **Publications Section**: Chronologically grouped scholarly articles (Conferences, Journals, Workshops, Preprints). Includes:
  * Filterable tags and search keywords
  * Teaser image / diagram previews with lightbox zoom
  * External DOI links, PDF direct links, and code repositories
  * One-click pre-formatted **BibTeX** clipboard copying
* **Academic Timeline**: Vertical timeline tracking Education, Professional Positions, and Academic Honors or Awards.

### 3. Static & Host-Ready Architecture
* **File-Based Configuration**: All personal information, research areas, publication lists, and career history are defined in `/src/data.ts` with inline documentation and type definitions.
* **Local Asset Folder**: Store your avatar image, paper teaser diagrams, and CV PDF in `/public/data/` and reference them cleanly in `/src/data.ts`.
* **Zero Backend Required**: Completely static site with zero database or server dependencies, guaranteeing top performance and security.

---

## 📂 Directory & File Structure

```text
├── index.html                 # Main entrypoint HTML
├── metadata.json              # Applet metadata configuration
├── package.json               # Project dependencies and build scripts
├── vite.config.ts             # Vite configuration with Tailwind CSS
├── public/
│   └── data/                  # Static media assets (avatar, CV PDF, teaser images)
│       ├── README.md
│       ├── avatar.jpg
│       ├── cv.pdf
│       └── paper1_teaser.jpg
└── src/
    ├── main.tsx               # Application entry point
    ├── App.tsx                # Main layout, sticky navigation bar, and tab switching
    ├── data.ts                # Primary content configuration file (Profile, Papers, Focus Areas, Timeline)
    ├── types.ts               # TypeScript types and interfaces
    ├── index.css              # Global styles importing Tailwind CSS
    └── components/
        ├── HeaderCard.tsx            # Biography header, copy email button, and social links
        ├── ResearchInterestsCard.tsx  # Focus areas grid with dynamic icon rendering
        ├── PublicationsSection.tsx    # Categorized publication list, teasers, and BibTeX viewer
        └── AcademicTimeline.tsx      # Vertical academic career timeline
```

---

## ⚙️ Content Customization Guide

### Editing Your Profile & Papers
To update your website content, simply open `src/data.ts` in any code editor:

1. **Profile Data**: Update `INITIAL_PROFILE` with your name, title, affiliation, bio, email, and social links.
2. **Research Focus Areas**: Edit `INITIAL_RESEARCH_AREAS` and choose Lucide icon names (e.g., `"Brain"`, `"Sparkles"`, `"Users"`, `"Code"`).
3. **Publications**: Add or edit papers in `INITIAL_PAPERS` with titles, authors, venues, DOIs, BibTeX entries, and teaser image paths.
4. **Academic Timeline**: Update `INITIAL_EXPERIENCES` with education history, positions, and awards (type: `"education" | "position" | "award"`).

### Managing Media & Assets
Place all static files inside `public/data/`:
* `public/data/avatar.jpg` -> reference as `"/data/avatar.jpg"` in `src/data.ts`
* `public/data/cv.pdf` -> reference as `"/data/cv.pdf"` in `src/data.ts`
* `public/data/paper1_teaser.jpg` -> reference as `"/data/paper1_teaser.jpg"` in `src/data.ts`

---

## 🛠️ Tech Stack

* **Framework**: React 19 + Vite 6 (Single Page Application)
* **Language**: TypeScript for strict type checking (`/src/types.ts`)
* **Styling**: Tailwind CSS v4 for clean, responsive styling
* **Icons**: [Lucide React](https://lucide.dev/) + Custom SVG icons for Google Scholar and X/Twitter
* **Animations**: `motion/react` layout transitions

---

## 🚀 Local Development & Deployment

### Local Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run dev server:
   ```bash
   npm run dev
   ```

### Building & Deploying
To deploy to **Cloudflare Pages**, **Vercel**, **GitHub Pages**, or **Netlify**:

1. Build static production assets:
   ```bash
   npm run build
   ```
2. Set the build output directory to `dist` in your static hosting provider's configuration.
