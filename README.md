# SkillsJewels — website

Marketing site for SkillsJewels: the bridge between tertiary education and the rest of the system — employment services, industry, and the products in between.

The site covers three propositions, one page each, summarised on a homepage:

- **Employment Services** (the original, most developed proposition). Around 800,000 people sit on employment services caseloads across Workforce Australia, Inclusive Employment Australia, RAES and Transition to Work. That population is overwhelmingly equity-relevant, and almost none of it is counted toward the Universities Accord's tertiary attainment and equity targets. SkillsJewels makes public tertiary providers into operational, claimable training partners inside the reformed system, and gets the resulting enrolments recorded where the targets are measured.
- **Workforce Development.** Post-experience microcredentials designed with industry and delivered through university partners — real workplace projects, university-grade assessment, credit that stacks toward a recognised qualification.
- **Product Consulting.** Not yet shaped — currently a placeholder page.

Four pages, no build step, no backend beyond a hosted form relay.

---

## What's in here

| Path | What it is |
|---|---|
| `index.html` | The homepage — the shared thesis across all three propositions, three summary cards linking out, a general enquiry form. Site entry point. |
| `employment-services.html` | The Employment Services proposition — hero, the gap, the four-step model (Translate, Package, Connect, Count), enquiry form. This was the original `index.html`, renamed when the site went multi-page. |
| `workforce-development.html` | The Workforce Development proposition — university/industry post-experience microcredentials, the four-step model (Design, Embed, Credential, Stack), enquiry form. |
| `product-consulting.html` | Placeholder for the Product Consulting proposition. Deliberately thin; `noindex`ed until it has real content. |
| `SkillsJewels Flier.dc.html` | A one-page A4 flier for the Employment Services proposition, built to print or export to PDF. Still carries the export filename — see Deploying |
| `sitemap.xml` | Lists the three indexable pages (home, Employment Services, Workforce Development). `product-consulting.html` is left out while it's `noindex` |
| `robots.txt` | Allows all crawlers, points at `sitemap.xml` |
| `assets/` | Logo SVGs — horizontal lockup and mark, each in standard and reversed |
| `_ds/industry-…/` | The "Industry" design system the pages were generated against: `styles.css`, token manifest, lint config |
| `support.js` | Claude Design runtime — parses the `<x-dc>` template and its logic block, renders via React |
| `doc-page.js` | Paged-document shell used by the flier for A4 pagination |
| `uploads/logo-….zip` | Original logo delivery (PNG + SVG in all variants, including stacked lockups not used on the site) |
| `CNAME` | Custom domain for GitHub Pages |
| `.nojekyll` | Stops Jekyll eating the `_ds/` folder |

### Navigation

All four pages share the same nav: the logo links to `index.html`, three text links go to each proposition page (the current page's link is marked active by hand — bold plus a bottom border), and a CTA button on the right. On the three pages with a real enquiry form, the CTA scrolls to it (`#enquire` or `#contact`); on `product-consulting.html`, which has no form, it scrolls to a `mailto:` block instead. There's no shared nav component — it's the same markup pasted into each file, consistent with how styling works on this site (see Editing, below).

`uploads/` is an export leftover, but worth keeping — it holds the stacked lockups and the PNG sizes down to 16px, which the site itself doesn't use but a favicon or deck will.

---

## Running it locally

The pages fetch React, Babel and Google Fonts at runtime, so open them over HTTP rather than double-clicking:

```bash
python3 -m http.server 8000
```

Then go to `http://localhost:8000/`. The flier is at `http://localhost:8000/SkillsJewels%20Flier.dc.html` until it is renamed.

You need a network connection for a correct render. `support.js` pulls React 18.3.1, ReactDOM and Babel standalone from unpkg, and every page pulls Public Sans and Source Serif 4 from Google Fonts. Offline, the type falls back to Arial/Georgia and the enquiry forms stop working.

To produce a PDF of the flier: open it, print, A4, no margins, background graphics on.

---

## Deploying to GitHub Pages

Served from the branch root. Three things matter here — the first is done, the other two are not.

**1. `.nojekyll` at the repository root — done, leave it there.** GitHub Pages runs Jekyll by default, and Jekyll skips any directory starting with an underscore, which is the entire `_ds/` design system folder. Delete this file and the site deploys with no stylesheet and no design tokens.

**2. The flier still has its export filename.** The Employment Services page was renamed first (to `index.html`, later renamed again to `employment-services.html` when the site went multi-page); the flier never was. It sits at `SkillsJewels Flier.dc.html`, so it is only reachable through a URL with `%20` in it, and nothing on any page links to it. Asset paths are relative and no page links to another, so renaming is safe:

```bash
git mv "SkillsJewels Flier.dc.html" flier.html
```

Update the file table above when this is done.

**3. `CNAME` currently reads `www.julianstevenson.com`.** The site serves off the personal domain, not `skillsjewels.com.au`. That is fine while the thing is still being built. Change it before the URL goes to a TAFE, university or DEWR audience — the page shows a `@skillsjewels.com.au` contact address, and the mismatch reads as unfinished.

---

## The enquiry form

Three of the four pages carry their own copy of this form (`index.html`, `employment-services.html`, `workforce-development.html`); `product-consulting.html` has a plain `mailto:` link instead. Each posts to [Web3Forms](https://web3forms.com), which relays submissions to an inbox. There is no backend and nothing is stored in the repo.

Four hidden inputs sit at the top of the `<form>`:

| Field | What it does |
|---|---|
| `access_key` | The Web3Forms key. Public by design — it is visible in page source and cannot be kept secret |
| `subject` | Subject line on the relayed email |
| `from_name` | Sender name on the relayed email |
| `botcheck` | Honeypot. Hidden with `display: none`, so bots tick it and people never see it |

The handler in each page's `<script type="text/x-dc">` block serialises the form to JSON, POSTs it to `https://api.web3forms.com/submit`, and only flips the `sent` flag once the API confirms success. On failure it re-enables the button and reveals the `#enquiry-error` message. Field names are shared where the fields exist (`name`, `institution`, `email`, `scope`, `notes` on all three; `role` on `employment-services.html` and `workforce-development.html` only — the homepage form is lighter). The `subject` hidden input and the `scope` dropdown's option wording differ per page, so a submission's origin page is identifiable from the subject line even though all three land in the same inbox.

Two things that are easy to get wrong:

- **The key sets the destination, not the page.** The `hello@skillsjewels.com.au` in the footer is display text. Submissions go to whichever inbox the access key was registered against. Changing the address shown on the page does not change where mail lands.
- **The free tier keeps no copy.** 250 submissions a month, no dashboard, and submissions are dropped after 30 days. The email is the only record, so if it lands in spam it is gone.

Send one test submission from the live domain after any change to the form or the key, and confirm it arrives.

---

## Editing

The pages carry their styling inline and override the Industry design system's tokens in a `<style>` block in each `<helmet>`. If you change a colour, change it in all four pages — none of them share a stylesheet of their own. The nav markup is likewise pasted into each file rather than shared; see Navigation, above.

Brand values used across all four pages:

| Role | Name | Hex |
|---|---|---|
| Primary — headings, CTAs, dark section | Sapphire | `#1B3A5C` |
| Background | Chalk | `#F7F5F0` |
| Links and secondary emphasis | Amethyst | `#5B3A73` |
| Data highlight (the 80% figure) | Emerald | `#0B5D3B` |
| Headline type | Source Serif 4 | 600 weight |
| Body, forms, data | Public Sans | — |

These follow the SkillsJewels brand guidelines. Public Sans is the same family used across Australian government digital services, which is deliberate for a DEWR/ATEC and TAFE audience.

The `.blueprint` class with its four `<i class="corner">` children comes from the Industry design system — square corners, hairline border, registration marks. Don't round them and don't drop the corner marks.

### Responsive layout

Every page sets layout in inline `style` attributes, and inline styles beat class rules. So the responsive behaviour in each page is a set of `@media` blocks in its own `<helmet>` `<style>` that override `sj-`-prefixed classes with `!important`. Two breakpoints:

| Width | What changes |
|---|---|
| ≤900px | Two-column sections collapse to one; padding and heading sizes come down; the nav's own gap and logo width shrink a step (`.sj-nav`, `.sj-logo`) |
| ≤560px | Nav text links hide (logo and CTA stay), paired form fields stack, CTAs go full width, inputs go to 16px so iOS doesn't zoom the page on focus |

Between those two breakpoints the nav also carries a `flex-wrap` fallback of its own: if a page's three nav links plus the CTA ever get too tight for the row (a long CTA label, a narrow custom viewport), the row wraps to a second line instead of overflowing. This isn't a named breakpoint — it just protects the space between the two above.

If you add a new two-column section, give its wrapper `class="sj-split"` or it will stay two-column on a phone. If you add a fifth page, its `<style>` block needs the same three rule sets (`sj-split`/`sj-section`/`sj-hero`/`sj-nav`/`sj-logo` at ≤900px, the ≤560px block) or it won't behave like the rest of the site.

The flier is deliberately not responsive. It is an A4 print artefact, not a page anyone reads on a phone.

---

## SEO

Each page carries its own `<title>`, meta description, canonical link, and Open Graph/Twitter card tags — all in the real `<head>`, above `<script src="./support.js">`, not inside `<helmet>`. That's deliberate: `<helmet>` content is compiled into the document by `support.js` after the page's JS runs, but link-preview crawlers (Facebook, LinkedIn, Slack) don't execute JavaScript, so anything meant to control how a shared link looks has to already be in the HTML the server sends.

| Page | Robots | In sitemap.xml |
|---|---|---|
| `index.html` | `index, follow` | Yes |
| `employment-services.html` | `index, follow` | Yes |
| `workforce-development.html` | `index, follow` | Yes |
| `product-consulting.html` | `noindex, follow` | No |

`product-consulting.html` is `noindex`ed on purpose — it's a thin placeholder, and indexing it now would just get a weak page ranked. Flip its `robots` meta to `index, follow` and add it to `sitemap.xml` once it has real content.

Every page's canonical/OG URL, plus `robots.txt` and `sitemap.xml`, point at `https://www.julianstevenson.com/…` and carry a `TODO` comment to that effect — see the CNAME item under Known outstanding in `CLAUDE.md`. When the domain changes, all of these need updating together, not just `CNAME`.

`og:image` on every page is currently `assets/favicon.png`, which is 32×32. It renders, but it's well under the ~1200×630 that Facebook/LinkedIn/Slack want for a real link-preview card — treat it as a placeholder until a proper share image exists.

---

## Figures used on the site

The headline `800,000+` is the combined caseload across the four main contracts. Indicative composition:

| Contract | Approximate caseload |
|---|---|
| Workforce Australia | ~600,000 |
| Inclusive Employment Australia (formerly DES) | ~200,000 |
| Transition to Work | Youth cohort, many early school leavers |
| Remote Australia Employment Services | Remote participants, majority Aboriginal and Torres Strait Islander |

Workforce Australia and IEA carry the bulk of the number. TTW and RAES are smaller but matter disproportionately to the equity argument — they are precisely the cohorts the Accord's parity target is aimed at, and the ones least well served by a campus-attendance model.

Attainment and equity targets are from the Australian Universities Accord Final Report (2024): 80% of working-age Australians holding a tertiary qualification by 2050, and parity in participation for underrepresented groups.

Update the caseload figures against current DEWR reporting before the site is used in front of a government or provider audience, and keep the footer source note in step with whatever the numbers become.

**`workforce-development.html` deliberately carries no invented statistics.** Its hero blueprint panel uses three qualitative labels (Industry-designed / University-assessed / Stackable) instead of the numeric-stat pattern used on the Employment Services and Home pages, because there's no sourced figure yet for the post-experience learning market this page describes. If a real, citable number turns up (market size, reskilling volume, a WEF/NCVER stat), it can replace the labels — but don't back-fill a number just to match the visual pattern.

---

## Status

**Public repository.** Anyone can clone it. Nothing in the tree is sensitive — the Web3Forms access key is public by design and there are no credentials here — but this should be a deliberate choice rather than a default. To change it: Settings → General → Danger Zone → Change visibility. Note that a private repository needs GitHub Pages on a paid plan to keep serving.

Content and design generated with Claude Design; figures and positioning are SkillsJewels' own.
