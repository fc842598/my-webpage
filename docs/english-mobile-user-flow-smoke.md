# English Mobile User Flow Smoke

Generated: 2026-07-08T22:25:55.177Z

Scope: English mobile real-user flows at 390x844. APIs are controlled mocks for payment, account, and chat so the flow is repeatable without charging real money. Text, label, and image overlap remain covered by `npm run audit:en-mobile`; this smoke checks dynamic flow state, English residue, and horizontal overflow.

Special child rule: current advice for a two-year-old must stay parent-facing and avoid adult work/romance pressure. A lifetime reading may mention future partnership and vocation only as long-term tendencies, not as present duties.

| Gate | Flow | Screen | Score | Screenshot | Notes |
| --- | --- | --- | ---: | --- | --- |
| Pass | Overseas new user creates a Ziwei chart | screen-27 | 100 | tmp/english-mobile-user-flows/latest/screenshots/01-new-user-chart.png | Pass |
| Pass | Internship user gets practical English Master Xu advice | screen-4 | 100 | tmp/english-mobile-user-flows/latest/screenshots/02-internship-chat.png | Pass |
| Pass | Two-year-old current advice vs lifetime tendencies | screen-4 | 100 | tmp/english-mobile-user-flows/latest/screenshots/03-child-boundary.png | Pass |
| Pass | Logged-in paid user completes mock payment | screen-30 | 100 | tmp/english-mobile-user-flows/latest/screenshots/04-paid-mock.png | Pass |
| Pass | Logged-in user saves and syncs English profile | screen-39 | 100 | tmp/english-mobile-user-flows/latest/screenshots/05-profile-sync.png | Pass |

## Summary

- Flows reviewed: 5
- Flows at or above 95: 5/5
- Lowest flow score: 100
- Current result: all current user-flow gates pass

## Overseas new user creates a Ziwei chart

Score: 100

Screenshot: `tmp/english-mobile-user-flows/latest/screenshots/01-new-user-chart.png`

- Pass: Chart flow reaches report screen - Zi Wei Chart

•••

‹

Quan
Lu
Tai Yang Wang
Ju Men Miao
Tian Yue
Tian De
Bing
Xi Shen
Geng Yin
115-124
Parents
Tian Xian
- Pass: No visible Chinese residue - English screen text only
- Pass: No dynamic residue or horizontal overflow findings - []

## Internship user gets practical English Master Xu advice

Score: 100

Screenshot: `tmp/english-mobile-user-flows/latest/screenshots/02-internship-chat.png`

- Pass: Long English answer rendered - 75 words
- Pass: Answer fits internship context - For an overseas internship user,

I would translate the chart into practical positioning rather than vague fate language.

Your stronger pattern is useful for r
- Pass: No visible Chinese residue - English chat text only
- Pass: No dynamic residue or horizontal overflow findings - []

## Two-year-old current advice vs lifetime tendencies

Score: 100

Screenshot: `tmp/english-mobile-user-flows/latest/screenshots/03-child-boundary.png`

- Pass: Child current advice avoids adult template - This is a parent-facing child reading. I would focus on temperament,

learning rhythm, sleep, appetite, attachment,

and the kind of environment that helps the child feel safe.

Th
- Pass: Child lifetime answer may discuss future adult topics carefully - For a two-year-old,

a lifetime reading can mention future partnership and vocation only as distant tendencies,

not as present duties.

Right now the reading should still speak to
- Pass: Both child answers are substantial English - 65/72 words
- Pass: No visible Chinese residue - English child-flow text only
- Pass: No dynamic residue or horizontal overflow findings - []

## Logged-in paid user completes mock payment

Score: 100

Screenshot: `tmp/english-mobile-user-flows/latest/screenshots/04-paid-mock.png`

- Pass: Mock payment reaches paid state - ‹

Plan Payment

Paid

Yuetian AI

80/day

Resets daily, no monthly quota

¥19.90

Product

Yuetian AI

Order No.

mock_en_flow_20260708

Paid plan is active. Your quota has been 
- Pass: Payment is bound to logged-in account - Authenticated session stayed active
- Pass: No visible Chinese residue - English payment text only
- Pass: No dynamic residue or horizontal overflow findings - []

## Logged-in user saves and syncs English profile

Score: 100

Screenshot: `tmp/english-mobile-user-flows/latest/screenshots/05-profile-sync.png`

- Pass: Local profile save works - ‹

Profile

I

Intern Tester

Save locally first, then sync to your account.

Nickname

Email

Phone

After syncing, this profile follows yo
- Pass: Account sync success is visible - ‹

Profile

I

Intern Tester

Save locally first, then sync to your account.

Nickname

Email

Phone

After syncing, this profile follows your account on another device.

Synced to
- Pass: No visible Chinese residue - English profile text only
- Pass: No dynamic residue or horizontal overflow findings - []
