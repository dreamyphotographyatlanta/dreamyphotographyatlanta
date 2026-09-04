# Dreamy Photography Atlanta

The website for **Dreamy Photography Atlanta** — an Atlanta-based photography business shooting weddings, portraits, events, and drone work across Georgia. It's a fast, static site hosted on GitHub Pages, with one nice trick up its sleeve: the photo and video galleries update themselves whenever you add new files. No hand-editing HTML, ever.

**Live at:** https://dpatl.com

---

## What's in the box

This is a plain HTML/CSS/JavaScript site — no database, no server to babysit, nothing to break at 2 a.m. That's on purpose. Static sites are fast, cheap (free on GitHub Pages), and dependable.

A few things worth knowing about:

- **Self-updating galleries.** Drop photos into a folder, push to GitHub, and they appear on the site a minute or two later. A small script and a GitHub Action do the busywork for you.
- **Video support too.** YouTube and Vimeo links can live alongside photos in any category.
- **Built for search engines.** Each key page carries canonical tags, Open Graph and Twitter cards, and the homepage includes structured business data (LocalBusiness JSON-LD). There's a `sitemap.xml` and `robots.txt` so Google knows what to crawl.
- **Custom domain with HTTPS.** Served securely over `https://dpatl.com`.
- **Responsive design.** Looks right on phones, tablets, and desktops.

---

## Project layout

Here's the lay of the land, so you know where things live:

```
dreamyphotographyatlanta/
├── index.html              # Homepage
├── about.html              # About page
├── services.html           # Services
├── pricing.html            # Pricing
├── portfolio.html          # Portfolio grid
├── portfolio-details.html  # Individual portfolio view
├── blog.html               # Blog listing
├── blog-details.html       # Individual blog post
├── contact.html            # Contact page
│
├── img/                    # All images, organized by category folder
│   ├── gallery/
│   ├── portrait/
│   ├── wedding/
│   ├── landscape/
│   ├── drone/
│   └── videography/
│
├── js/
│   └── gallery-data.js     # AUTO-GENERATED — do not edit by hand
├── css/                    # Styles
├── sass/                   # Source styles (compile to css/)
├── fonts/                  # Web fonts
│
├── build_gallery.py        # The script that builds gallery-data.js
├── category.txt            # The list of gallery categories
├── CNAME                   # The custom domain (dpatl.com)
├── sitemap.xml             # For search engines
├── robots.txt              # For search engines
└── .github/workflows/
    └── build-gallery.yml   # The GitHub Action that runs the build
```

---

## Adding photos and videos (the fun part)

This is the feature that saves you the most time, so here's exactly how it works.

### Adding photos

1. Find the right category folder inside `img/` — for example `img/wedding/` for a wedding shoot.
2. Copy your image files in. Supported formats: **JPG, JPEG, PNG, GIF, WEBP**.
3. Commit and push to GitHub.

That's it. Within a minute or two, the new photos show up in that gallery on the live site.

A couple of handy tricks:

- **Want to stage a file without publishing it yet?** Rename it so it starts with an underscore (e.g. `_draft.jpg`). The builder skips anything starting with `_`.
- **Ordering** follows the filename alphabetically, so prefix names like `01-`, `02-` if you care about sequence.

### Adding videos

1. Inside the category folder (e.g. `img/videography/`), create or open a file called `video_link.txt`.
2. Paste in your YouTube or Vimeo links — one per line, or separated by commas.
3. Commit and push.

Only links containing `youtube`, `youtu.be`, or `vimeo` are picked up, so you don't have to worry about stray text.

### Adding or removing a whole category

Categories are controlled by `category.txt` — one folder name per line. To add a category, add its name there and create a matching `img/<name>/` folder. To hide one, delete or comment out the line (put a `#` in front). Push, and the site follows suit.

---

## How deployment works

You never deploy manually. Pushing to the `main` branch *is* the deploy.

Here's the chain of events when you push new images:

1. Your push lands on `main`.
2. The GitHub Action in `.github/workflows/build-gallery.yml` notices the change (it only wakes up for changes to `img/`, `category.txt`, or `build_gallery.py`).
3. It runs `build_gallery.py`, which scans every category folder and rebuilds `js/gallery-data.js`.
4. If that file changed, the Action commits it back to the repo automatically (as `github-actions[bot]`).
5. That commit triggers GitHub Pages to redeploy, and the new content is live at `https://dpatl.com`.

GitHub Pages is set to **deploy from the `main` branch, root folder** — no separate build branch to think about.

### Running the build yourself (optional)

If you want to preview the gallery data locally before pushing:

```bash
python build_gallery.py
```

Then open `index.html` in your browser. The script regenerates `js/gallery-data.js` from whatever's currently in your `img/` folders.

---

## Changing the domain

If you ever move to a new domain (this is exactly what happened when the site moved from `dreamyphotographyatlanta.com` to `dpatl.com`), here's the full checklist. It's not hard — it's just easy to miss a step, so follow it top to bottom.

### 1. Update the repo

- **`CNAME`** — replace the contents with the new bare domain, e.g. `dpatl.com` (no `https://`, no trailing slash).
- **Hardcoded references** — the old domain is baked into a few files for SEO. Update every one of them:
  - `robots.txt` (the `Sitemap:` line)
  - `sitemap.xml` (the `<loc>` URLs)
  - `index.html` (canonical, `og:url`, `og:image`, `twitter:image`, and the JSON-LD block)
  - `services.html`, `pricing.html`, `contact.html` (canonical, `og:url`, `og:image`)

  The quickest way to catch them all is to search the repo for the old domain before you push:

  ```bash
  # list every file still mentioning the old domain
  grep -rl "olddomain.com" .
  ```

- Commit and push.

### 2. Point DNS at GitHub (at your registrar — e.g. Namecheap → Advanced DNS)

Add these records for the **apex** domain:

```
Type    Host   Value                 TTL
A       @      185.199.108.153       Automatic
A       @      185.199.109.153       Automatic
A       @      185.199.110.153       Automatic
A       @      185.199.111.153       Automatic
CNAME   www    dreamyphotographyatlanta.github.io.   Automatic
```

Optional but recommended, for IPv6:

```
AAAA    @      2606:50c0:8000::153   Automatic
AAAA    @      2606:50c0:8001::153   Automatic
AAAA    @      2606:50c0:8002::153   Automatic
AAAA    @      2606:50c0:8003::153   Automatic
```

Two things to watch for: delete any default parking/redirect records the registrar added, and note that the `www` CNAME always points to `dreamyphotographyatlanta.github.io` — that's the GitHub account's Pages address, which stays the same no matter what your public domain is.

### 3. Update GitHub Pages settings

Go to the repo → **Settings → Pages**. The custom domain should pick up the new value from the `CNAME` file automatically; if not, type it in and Save. Wait for the "DNS check" to pass (usually minutes, up to 24h), then tick **Enforce HTTPS** once the certificate is ready.

### 4. Re-verify with Google Search Console

A new domain is a new property in Search Console. Add it as a **Domain** property, drop the `google-site-verification=...` TXT record into your DNS (alongside any existing TXT records — don't replace them), verify, and resubmit the sitemap (`sitemap.xml`).

---

## Good to know

- The auto-build **only** runs when you touch `img/`, `category.txt`, or `build_gallery.py`. Editing a regular HTML page just redeploys normally — no gallery rebuild needed.
- The build Action commits `gallery-data.js` and nothing else, so it will **never** wipe your `CNAME` file. Your domain survives every auto-update.
- `js/gallery-data.js` is machine-generated. If you edit it by hand, the next build overwrites you. Change the source (`img/` folders and `category.txt`) instead.
- Keep the Google verification TXT record in place permanently — removing it un-verifies the domain in Search Console.

---

## Tech notes

Static HTML/CSS/JS, styles authored in SASS, gallery build in Python 3, automation via GitHub Actions, hosting on GitHub Pages.

Repo: `github.com/dreamyphotographyatlanta/dreamyphotographyatlanta`
