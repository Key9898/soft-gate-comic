---
title: Impl 3 — Hero banner overlay readability
type: note
date: 2026-07-17
tags: [hero, banner, overlay, navigation, logo, impl-3]
impl: 3
---

# Impl 3 — Hero Banner Overlay Readability and Brightness

**Date**: 2026-07-17

## Context

The main website user portal's homepage hero section features a custom graphic banner `/banner/banner.png` carrying the brand's key artwork ("SoftGate Comics" Speach Bubble design). Previously, the overlay layer of this section utilized a heavy diagonal gradient overlay mask (`bg-gradient-to-br from-gray-950/85 via-gray-950/75 to-primary-950/65`).

This full-bleed dark cover resulted in the brand speech bubble graphic appearing muddy, dark, and hard to see in production.

## Action Taken

1. **Overlay Mask Redesign**:
   - Replaced the heavy diagonal dark mask with a balanced left-to-right fade linear gradient mask:
     `bg-gradient-to-r from-gray-950/70 via-gray-950/30 to-gray-950/45`
   - Result: brand artwork remains readable while text on the left still has contrast.

2. **Navigation logo**:
   - Increased logo mark size for legibility.
   - Removed the redundant `<span>SoftGate Comic</span>` next to the header logo icon, leaving only the logo as the home navigation anchor.

## Outcome

Hero brand art is brighter and more visible; header chrome is cleaner on smaller screens.
