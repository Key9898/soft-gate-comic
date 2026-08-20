---
title: Prelaunch quality bar
type: convention
date: 2026-08-18
tags: [quality, prelaunch, ia, ui, international, softgate]
impl: 105
---

# Prelaunch quality bar

SoftGate Comic is **founded and not public yet**. Pages are finished to a client hand-off bar: international standard, then **better** than current webtoon sites on layout, information, and UI/UX. The client swaps real data. They do not design the page from a thin stub.

This is a standing product rule. Wiki-only is not enough — agents also load it from always-on rule `07-prelaunch-quality-bar.mdc` and root `AGENTS.md`.

## Bar

| Axis                   | Requirement                                                                                                                                |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| International standard | Match the **page type** peer (e.g. curated submit ≈ Lezhin Creators IA; About ≈ company story + people + product).                         |
| Layout                 | Clearer hierarchy, section rhythm, and chrome than typical webtoon marketing/info pages.                                                   |
| Information            | Every information **kind** those sites show for that page (specs, process, rights, earnings, FAQ, CTA). Numbers may be Demo / client-swap. |
| UI/UX                  | 44px targets, focus-visible, i18n, honest labels, info-page chrome. Perfect before hand-off.                                               |

## Must

- Ship **complete information architecture** even when client names, photos, rates, SLA, or pixel numbers are missing.
- Use industry-standard defaults the client can edit (cover ratio, episode count, review steps). Label unknowns **Demo** or client-swap — same pattern as About fact chips and stand-in team photos.
- Compare to WEBTOON / Tapas / Lezhin (and peers) on **the page**, then exceed layout, completeness, and UX. Other sites having a live uploader or payouts does **not** mean SoftGate’s page may stay thinner.
- Keep honest Demo labels. Complete section ≠ fake live backend.

## Must not

- Omit a section because “the client has not sent data yet.”
- Omit a section because “we are not public yet.”
- Say SoftGate cannot beat a peer page because that peer has live Canvas upload, ads, or revenue share.
- Fake a working publisher dashboard, live payout, or fabricated MAU / scale.
- Treat `wiki/notes/` as the operating law (notes are session mirrors). This convention + rule 07 + `AGENTS.md` are the law.

## Not blockers

Client data incomplete, pre-public status, and live tools on other webtoon sites are **not** reasons to ship a thin page.

## Honesty vs completeness

| Wrong                                                        | Right                                                                                          |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| Empty “TBD” page until the client writes copy                | Full sections; swap-ready strings and slots                                                    |
| Trophy MAU / fake “we pay 50%”                               | Earnings/rights section that explains the model; rates labeled Demo until the client sets them |
| “Contact Admin” + no pitch fields because Contact is generic | Pitch checklist + editorial CTA; wire Contact when implementing that page                      |
| Fake Upload button that does nothing                         | Editorial intake (or real upload when it exists) plus a complete how-you-publish path          |

`AGENTS.md` “no placeholder-first code” still holds: do not fake a live surface. It does **not** mean skip the section.

## How agents load this

| Layer          | Path                                                                                          | When                                     |
| -------------- | --------------------------------------------------------------------------------------------- | ---------------------------------------- |
| Always-on rule | `.cursor/rules/07-prelaunch-quality-bar.mdc` (Antigravity mirror under `.antigravity/rules/`) | Every chat                               |
| Agent contract | Root [`AGENTS.md`](../../AGENTS.md) Quality bar                                               | Every chat (tools that load `AGENTS.md`) |
| Short reminder | [`.agents/AGENTS.md`](../../.agents/AGENTS.md)                                                | Tools that only load `.agents/`          |
| Detail         | This file                                                                                     | When implementing or reviewing a page    |

## Related

- [info-page-chrome.md](info-page-chrome.md) — masthead, 7xl shell, CTA targets
- [discovery-honesty.md](discovery-honesty.md) — catalog truth vs decoration
- [forced-product-motion.md](forced-product-motion.md) — product motion is also always-on (rule 00 + `AGENTS.md`)
