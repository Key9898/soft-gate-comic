# Design Decision: Hero Banner Overlay Readability and Brightness

**Date**: 2026-07-17

## Context

The main website user portal's homepage hero section features a custom graphic banner `/banner/banner.png` carrying the brand's key artwork ("SOFT GATE Comics" Speach Bubble design). Previously, the overlay layer of this section utilized a heavy diagonal gradient overlay mask (`bg-gradient-to-br from-gray-950/85 via-gray-950/75 to-primary-950/65`).

This full-bleed dark cover resulted in the brand speech bubble graphic appearing muddy, dark, and hard to see in production.

## Action Taken

1. **Overlay Mask Redesign**:
   - Replaced the heavy diagonal dark mask with a balanced left-to-right fade linear gradient mask:
     `bg-gradient-to-r from-gray-950/70 via-gray-950/30 to-gray-950/45`

2. **Result**:
   - **Balanced Brightness**: The left/center portions are brightened (starting at 70% and fading to 30%) to let the speech bubble logo pop clearly, while keeping white typography text readable.
   - **Softened Right Edge**: The right side is slightly dimmed down to 45% (instead of 100% bright transparent) to eliminate harsh high-contrast brightness, creating a harmonious and balanced look across the entire banner width.

---

## Header & Footer Logo Adjustments

### Context

In the top white sticky navigation bar, the logo image size was set to `h-8 w-8` (32px), which made the actual graphics inside the logo illegible. Furthermore, the text label "Soft-Gate Comic" next to the logo icon was redundant and cluttered the header spacing on smaller screens.

### Action Taken

1. **Removed Logo Brand Text**:
   - Removed the `<span>Soft-Gate Comic</span>` element next to the header logo icon, leaving only the clean logo icon as the home navigation anchor.
2. **Enlarged Logo Images**:
   - Enlarged the navigation header logo icon size to `h-11 w-11` (44px) and increased rounding to `rounded-xl` with soft shadows (`shadow-sm`) to ensure the brand mark details are clearly legible.
   - Consistently updated the footer branding logo size to `h-10 w-10` and `rounded-xl` for design uniformity.
