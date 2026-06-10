# Claude Project Guide

This repo is the frontend workspace for the YueTian AI website.

## Project

- Production site: https://yuetianai.com/
- GitHub remote: https://github.com/fc842598/my-webpage.git
- Local path on the owner's machine: `C:\Users\1\Desktop\家里用的图标`
- Main product: Chinese Ziwei / astrology AI site with homepage, chart flow, AI reading, Liuyao, Yangzhai, auth, payment, and mobile app entry.

## Key Files

- `index.html` - public homepage.
- `pages/mingbook-onepage.html` - main Ziwei chart / paid reading page.
- `pages/liuyao.html` - Liuyao page.
- `pages/yangzhai.html` - Yangzhai page.
- `js/mingbook-onepage.js` - main chart/auth/payment front-end logic.
- `js/config.js` - public site config and API base.
- `css/mingbook-onepage.css` - main chart page styling.
- `src/ziping/` and `scripts/validate-ziping-*.js` - Ziwei/Ziping validation logic.
- `docs/` - project notes, handoff logs, and rule research.

## Working Rules

- Keep answers concise and practical.
- Read the current files before editing.
- Do not revert user or Codex changes unless the owner explicitly asks.
- Do not stage unrelated dirty files.
- Keep visual changes consistent with the current black/gold Ziwei design language.
- Treat chart calculation, true-solar-time, Liunian, payment, auth, and API config as high-risk.
- For UI changes, verify with a browser screenshot at desktop and mobile or narrow desktop where relevant.

## Verification

Use the smallest meaningful check for the changed surface.

```powershell
npm run validate:ziping
npm run validate:ziping:all
npm run smoke:overall-piming
```

Known caveat: `npm run smoke:overall-piming` may return `404 Application not found` if the remote backend/deployment target is not available from the local environment. Report it clearly instead of hiding it.

## Collaboration With Codex

Codex has been maintaining this repo locally and usually commits/pushes focused changes to `master`. If Claude and Codex both work on the repo, coordinate through:

- GitHub commits on `master` or focused branches.
- `docs/handoff/` notes for completed work and open risks.
- Clean diffs that touch only the requested files.

Before starting a substantial change, inspect `git status --short` and avoid unrelated dirty files.
