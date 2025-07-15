# SGSite 🚀  

Event microsite powered by Next.js (App Router), SCSS, and Supabase.

This project powers event pages like `/event/devkit`, with structured sections like primers (`/event/devkit/01`) and resource links (`/event/devkit/01/assets`)(WIP). Content is managed dynamically via Supabase for easier updates and scalability.

---

## 🛠 Tech Stack

- **Next.js 15+** — App Router, dynamic routing, server components
- **TypeScript** — Basic type safety and structure
- **Sass/SCSS** — Clean modular styling
- **Supabase** — Stores all event content (titles, descriptions, links, etc.)
- **pnpm** — Fast, disk-efficient package manager
- **Volta** — (optional) Pins Node & pnpm versions across devs

---

## 📁 Folder Structure

```txt
app/
├─ page.tsx                  # Homepage (optional)
├─ layout.tsx                # Global layout
└─ event/
   └─ [eventId]/             # Dynamic event slug (e.g. devkit, remixjam)
      ├─ page.tsx            # Main event landing page
      ├─ layout.tsx          # Shared layout per event (optional)
      └─ [slug]/             # Subpages (e.g. 01, primer)
         ├─ page.tsx         
components/                  # Reusable UI components (WIP)
lib/
└─ supabase.ts               # Supabase client setup
styles/
└─ global.scss               # App-wide styles
````

---

## ⚙️ Environment Setup

Create `.env.local` with your Supabase credentials:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_public_anon_key
```

Generate icons

```sh
mkdir -p public/icons
convert logo.png -define icon:auto-resize=64,48,32,16 public/favicon.ico
convert logo.png -resize 192x192 public/icons/icon-192.png
convert logo.png -resize 512x512 public/icons/icon-512.png
convert logo.png -resize 1200x630^ -gravity center -extent 1200x630 public/og-image.png
convert logo.png -resize 256x64 public/logo-wide.png
```

---

## 🧪 Local Development

```bash
pnpm install         # Install dependencies
pnpm dev             # Start local dev server
```

---

## 🚀 Deployment

### ✅ Vercel (Recommended)

Deploy with one click or using CLI:

```bash
vercel --prod
```

### ⚠️ Cloudflare Workers

Use [next-on-pages](https://github.com/slicingdice/next-on-pages)
Note: `fs`, `process.cwd()`, and other Node APIs are not allowed. Use edge-safe code only.

---

## ✨ Features

- 🔁 Dynamic routing via `/event/[eventId]/[slug]/assets`
- 💾 Content pulled live from Supabase (`testevent` table)
- 🧱 Extendable: add Markdown or JSON support later
- ✅ Works with both static and dynamic event data

---

## 🧠 Notes

- Pages that use Supabase must include:

  ```ts
  export const dynamic = 'force-dynamic';
  ```

- Avoid using `params` as a `Promise` — treat it as a plain object in production builds.

- For Supabase array fields (like `subevent`), ensure your DB column is of type `text[]`.

---

## 📬 Future To‑Dos

- [ ] Add `generateMetadata` for SEO/social previews
- [ ] Markdown support via MDX or `next-mdx-remote`
- [ ] Custom error pages (`notFound`, `notAuthorized`)
- [ ] Admin panel for uploading event content

---

## 🧊 Example Live Routes

- `/event/devkit`
- `/event/devkit/01`
- `/event/devkit/01/assets`

---

Built with 💻 and ☕ by \[you].
