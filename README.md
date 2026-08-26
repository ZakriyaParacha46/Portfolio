# zakriyaparacha.com

Personal portfolio site for Zakriya Asif Paracha, Software Engineer with an embedded systems and computer engineering background. Fully static (plain HTML, CSS, and vanilla JS), no build step, deployed via GitHub Pages.

Live at [zakriyaparacha.com](https://zakriyaparacha.com).

## Structure

```
/
  index.html          Home: hero, about teaser, featured projects
  about.html           Full bio, work experience timeline, education, skills
  projects.html        Software projects (full-stack, backend)
  projects/*.html      One detail page per software project
  beyond-software.html  Embedded/hardware/robotics projects, kept as a personal hobby
  beyond-software/*.html One detail page per hobby project
  courses.html          Self-learning: Coursera specializations and courses
  resume.html          Print-friendly resume with a PDF download
  css/style.css         Shared styles (dark theme, layout, components)
  js/main.js            Nav toggle, boot-sequence heading animation, project filters, scroll reveal
  js/animations.js      Per-project canvas/DOM animations, IntersectionObserver-driven
  assets/               Favicon, circuit background, OG image, resume.pdf, project photos
  robots.txt, sitemap.xml, CNAME
```

## Local development

No build step. Serve the folder with any static file server and open it in a browser, for example:

```
python3 -m http.server 8000
```

then visit `http://localhost:8000`. Don't open the HTML files directly via `file://`: the embedded YouTube demos will fail to load (YouTube rejects the `null` origin a `file://` page sends), and this doesn't happen once served over `http(s)://`, including on the live site.

## Deployment

GitHub Pages is configured to deploy from the `main` branch (source: root). Every push to `main` redeploys automatically, usually within a minute. The custom domain is set via the `CNAME` file and DNS records on the registrar's side (GoDaddy), with HTTPS enforced.

## Content sources

Project write-ups, course descriptions, and Coursera verify links were pulled from the previous version of this site (a Google Sites page) and are logged in `SCRAPED_CONTENT.md` for reference.

Some project photos referenced under `assets/projects/<project>/` are pending manual download, see `assets/projects/IMAGES_TO_DOWNLOAD.md` for the list. Pages hide the image gracefully if the file isn't present yet, so dropping the files in later needs no other changes.

## Animations

Per-project animations in `js/animations.js` are plain canvas/JS, no libraries. Each one only runs while its element is visible on screen (via `IntersectionObserver`) and is skipped under `prefers-reduced-motion`.
