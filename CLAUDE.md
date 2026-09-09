# CLAUDE.md

Context for Claude Code working in this repository. Read `README.md` for the full picture — this file covers the rules that are easy to break.

## What this is

The SkillsJewels marketing site. Four static pages, no build step, no framework beyond a runtime shim. Deployed by GitHub Pages from the branch root.

| Page | File | Covers |
|---|---|---|
| Home | `index.html` | Hub page — the shared thesis, three summary cards, general enquiry form. This is the site's entry point. |
| Employment Services | `employment-services.html` | The original proposition: ~800,000 people sit on employment services caseloads across Workforce Australia, IEA, RAES and Transition to Work, that population is overwhelmingly equity-relevant, and almost none of it is counted toward the Universities Accord's attainment and equity targets. |
| Workforce Development | `workforce-development.html` | Post-experience microcredentials designed with industry, delivered through university partners — the link between industry upskilling and a recognised, stackable qualification. |
| Product Consulting | `product-consulting.html` | Placeholder — the proposition isn't shaped yet. Deliberately thin, and `noindex`ed until it is. |

All four share the same nav (logo → home, a link to each proposition page, a CTA) and the same brand and layout conventions below. `SkillsJewels Flier.dc.html` is a separate print artefact, not part of this set.

## Rules that matter

**Don't convert these pages into a normal React app.** Each page is a Claude Design export: an `<x-dc>` template with a `<script type="text/x-dc">` logic block, parsed and rendered at runtime by `support.js`. It looks like something that wants refactoring. It isn't. Work within the existing structure.

**Don't touch `_ds/`.** That's the generated "Industry" design system the pages were built against. Override its tokens in the page's own `<style>` block instead.

**Don't delete `.nojekyll`.** Without it, GitHub Pages runs Jekyll, Jekyll skips underscore-prefixed directories, and the entire `_ds/` folder stops serving. The site deploys with no styling and the cause is not obvious.

**Layout lives in inline `style` attributes.** Responsive behaviour therefore uses `@media` blocks in the `<helmet>` `<style>` that override `sj-`-prefixed classes with `!important`. Breakpoints are 900px and 560px. A new two-column section needs `class="sj-split"` on its wrapper or it stays two-column on a phone.

**None of the pages share a stylesheet.** Each of the four carries its own `<style>` block in its own `<helmet>`. A colour change has to be made in all four (five, counting the flier's own block).

**Nav links are hardcoded per page, not generated.** Each page's nav repeats the same four links (logo, Employment Services, Workforce Development, Product Consulting) with the current page's link marked active (`font-weight: 600` + underline) by hand. Adding a fifth page means editing the nav block in all four existing files, not just the new one.

**The flier is not responsive, deliberately.** It's an A4 print artefact.

## Brand

| Role | Name | Hex |
|---|---|---|
| Primary — headings, CTAs, dark section | Sapphire | `#1B3A5C` |
| Background | Chalk | `#F7F5F0` |
| Links, secondary emphasis | Amethyst | `#5B3A73` |
| Data highlight | Emerald | `#0B5D3B` |
| Sparing accent only | Topaz | `#C89B3C` |

Headlines: Source Serif 4, 600. Body, forms, data: Public Sans — the same family used across Australian government digital services, chosen deliberately for a DEWR/ATEC and TAFE audience.

`.blueprint` and its four `<i class="corner">` children come from the design system: square corners, hairline border, registration marks. Don't round them, don't drop the corner marks.

## Writing copy

Five voice pillars: direct, systems-fluent, evidence-led, non-bureaucratic, quietly ambitious. Name the structural problem plainly. Back claims with real figures, not adjectives. Short sentences.

Never use: leverage, seamless, unlock, empower, journey, revolutionise, disrupt, game-changing, simply, just, easy, exclamation marks.

Figures on the site are indicative and need checking against current DEWR reporting before the site goes in front of a government or provider audience. Don't invent or adjust a caseload number to make a sentence work — flag it instead.

## SEO

Every page carries its own title, meta description, canonical link, and Open Graph/Twitter card tags in the real `<head>` (not `<helmet>`) — Facebook, LinkedIn and Slack unfurlers don't execute JS, so anything meant for link previews has to be in the raw HTML, not compiled in at runtime. Keep title ≈60 chars, description ≈150-155 chars. `product-consulting.html` is intentionally `noindex, follow` and left out of `sitemap.xml` — it's a thin placeholder; flip it to `index` once it has real content, and add it back to the sitemap at the same time. `robots.txt` and `sitemap.xml` point at the same live domain as everything else — see the CNAME item under Known outstanding.

## The enquiry form

Posts to Web3Forms, which relays to an inbox. The access key in the page is public by design. The destination is set by the key, not by the address shown in the footer. Don't "fix" the footer address expecting mail to follow it. See README for the full wiring.

## Deploying

Push to the default branch. Pages redeploys in about a minute. There is no staging environment, so preview locally first:

```bash
python3 -m http.server 8000
```

Commit in small, single-purpose commits. This site has no tests and no build, so `git revert` is the safety net.

## Known outstanding

- The flier still has its export filename, `SkillsJewels Flier.dc.html`. Renaming it to `flier.html` is safe — nothing links to it.
- `CNAME` reads `www.julianstevenson.com`, not `skillsjewels.com.au`. Every canonical/OG URL, `robots.txt` and `sitemap.xml` carries a `TODO` pointing at this — when the domain moves, all of them need the swap, not just `CNAME`.
- Nothing on any page links to the flier.
- `product-consulting.html` is a placeholder — copy, `noindex` and sitemap exclusion all need revisiting once that proposition is shaped.
- `og:image` on every page points at `assets/favicon.png`, which is 32×32 — far short of the ~1200×630 social platforms want. Link previews will look thin until a real share image exists.
