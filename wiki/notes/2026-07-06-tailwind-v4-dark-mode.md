---
title: Tailwind v4 Dark Mode
type: note
date: 2026-07-06
tags: [tailwind, css, dark-mode]
---

# Tailwind v4 Dark Mode

Tailwind v4 မှာ dark mode configuration က v3 နဲ့ ကွဲပြားတယ်။

## Key points

- `tailwind.config.js` မလိုတော့ဘူး — config က `src/index.css` ထဲ `@theme` block မှာ ရေးတယ်။
- Dark mode က default `prefers-color-scheme: dark` media query ကို support လုပ်တယ်။
- `dark:` variant က media query အပြင် class-based toggle (`dark` class) ကိုလည်း support လုပ်တယ်။

## Manual toggle (class-based) pattern

```html
<html class="dark">
  <body class="bg-white dark:bg-slate-950">
    ...
  </body>
</html>
```

```ts
// Toggle
document.documentElement.classList.toggle('dark')
```

## localStorage persistence

```ts
const stored = localStorage.getItem('theme')
if (stored === 'dark' || (!stored && matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark')
}
```

## Gotchas

- `@theme` block ထဲ define လုပ်ထားတဲ့ color tokens တွေ အကုန် auto-dark variant ရနိုင်တယ်။
- Custom CSS variables (`--color-brand-*`) တွေကို `@theme` block မှာ declare လုပ်ရတယ်။
