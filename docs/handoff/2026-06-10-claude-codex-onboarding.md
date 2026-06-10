# Claude + Codex Onboarding for YueTian AI

## What to Send Claude

Send Claude this:

```text
This is my YueTian AI website project.

Production site:
https://yuetianai.com/

GitHub repo:
https://github.com/fc842598/my-webpage.git

Main local path on my Windows machine:
C:\Users\1\Desktop\家里用的图标

Please read CLAUDE.md first, then inspect the repo before editing.
Codex is also working on this project, so do not revert unrelated changes.
When you make code changes, keep the diff focused, run the relevant checks, and tell me what changed, what was verified, and what was not verified.
```

## Current Repo Shape

- Static frontend repo with HTML/CSS/JS pages.
- Public homepage is `index.html`.
- Main Ziwei chart and paid reading page is `pages/mingbook-onepage.html`.
- Important frontend logic is in `js/mingbook-onepage.js`.
- Shared public config is in `js/config.js`.
- AI backend base is currently configured as `https://api.yuetianai.com`.
- Production domain is controlled by `CNAME`.

## Main Product Areas

- Homepage visual entry.
- Ziwei chart / AI reading / paid Mingbook flow.
- Auth and account state.
- Payment entry and membership state.
- Liuyao page.
- Yangzhai page.
- Mobile app entry page.
- Ziping/Ziwei validation and rule research in `src/`, `scripts/`, and `docs/`.

## Safe Workflow

1. Run `git status --short`.
2. Read the relevant files first.
3. Edit only the requested files.
4. Verify with the smallest relevant command.
5. For UI work, capture a local screenshot.
6. Commit only intended files.
7. Push only after the owner asks or confirms that push is expected.

## Useful Commands

```powershell
npm run validate:ziping
npm run validate:ziping:all
npm run smoke:overall-piming
```

Known issue: `npm run smoke:overall-piming` can return a remote `404 Application not found`. If that happens, report it as a deployment/backend availability issue, not as a local syntax failure.

## Current Collaboration Note

Codex normally works in this same local folder and pushes focused commits to:

```text
https://github.com/fc842598/my-webpage.git
```

Claude cannot use the Windows local path unless it is running on the same machine with filesystem access. If Claude is only in chat, give it the GitHub repo link or upload a zip of the project. The local path alone is not enough for cloud Claude.
