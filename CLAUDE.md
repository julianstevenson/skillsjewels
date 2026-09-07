# CLAUDE.md

Context for Claude Code working in this repository. Read `README.md` for the full picture — this file covers the rules that are easy to break.

## What this is

The SkillsJewels marketing site. Two static pages, no build step, no framework beyond a runtime shim. Deployed by GitHub Pages from the branch root.

The site makes one argument: ~800,000 people sit on employment services caseloads across Workforce Australia, IEA, RAES and Transition to Work, that population is overwhelmingly equity-relevant, and almost none of it is counted toward the Universities Accord's attainment and equity targets.

## Rules that matter

**Don't convert these pages into a normal React app.** Each page is a Claude Design export: an `<x-dc>` template with a `<script type="text/x-dc">` logic block, parsed and rendered at runtime by `support.js`. It looks like something that wants refactoring. It isn't. Work within the existing structure.

**Don't touch `_ds/`.** That's the generated "Industry" design system the pages were built against. Override its tokens in the page's own `<style>` block instead.

**Don't delete `.nojekyll`.** Without it, GitHub Pages runs Jekyll, Jekyll skips underscore-prefixed directories, and the entire `_ds/` folder stops serving. The site deploys with no styling and the cause is not obvious.

**Layout lives in inline `style` attributes.** Responsive behaviour therefore uses `@media` blocks in the `<helmet>` `<style>` that override `sj-`-prefixed classes with `!important`. Breakpoints are 900px and 560px. A new two-column section needs `class="sj-split"` on its wrapper or it stays two-column on a phone.

**The two pages don't share a stylesheet.** A colour change has to be made in both.

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
- `CNAME` reads `www.julianstevenson.com`, not `skillsjewels.com.au`.
- Nothing on the landing page links to the flier.
