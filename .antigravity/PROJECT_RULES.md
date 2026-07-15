# WebPad - Project Rules

## Development Rules

### 1. CSS Rules (IMPORTANT!)

#### ⛔ STRICTLY FORBIDDEN

- **NEVER use inline CSS** - `style={{ color: 'red' }}` is FORBIDDEN
- **NEVER use inline style tags** - `<style>...</style>` is FORBIDDEN
- **NEVER use hex color codes directly** - Use Tailwind classes instead
- **NEVER create separate CSS files** - Only `src/index.css` is allowed

#### ✅ REQUIRED APPROACH

- Use **Tailwind CSS classes only** for all styling
- Use **`src/index.css`** (located in src folder) for:
  - Custom CSS classes or utilities using `@theme` or standard classes
  - Custom animations using `@keyframes`
  - CSS variables for theme colors
  - Global base styles

#### Example: Correct vs Incorrect

```tsx
// ❌ WRONG - Inline CSS
<button style={{ backgroundColor: '#9333EA', padding: '8px 16px' }}>
  Click me
</button>

// ❌ WRONG - Hex color in className
<button className="bg-[#9333EA] px-4 py-2">
  Click me
</button>

// ✅ CORRECT - Tailwind classes only
<button className="bg-primary-600 px-4 py-2 rounded-full">
  Click me
</button>

// ✅ CORRECT - Using src/index.css custom class
<button className="btn-primary">
  Click me
</button>
```

#### Tailwind Class Order

Follow this order when writing Tailwind classes:

1. **Layout** - `flex`, `grid`, `block`, `hidden`
2. **Positioning** - `relative`, `absolute`, `fixed`
3. **Spacing** - `p-*`, `m-*`, `gap-*`
4. **Sizing** - `w-*`, `h-*`, `min-*`, `max-*`
5. **Typography** - `text-*`, `font-*`, `leading-*`
6. **Visual** - `bg-*`, `border-*`, `rounded-*`, `shadow-*`
7. **Interactivity** - `hover:*`, `focus:*`, `transition-*`

---

### 2. Storybook Rules (IMPORTANT!)

#### File Location

- Story files (`*.stories.tsx`) **MUST** be in the **SAME FOLDER** as the component
- This ensures UI/UX and Storybook files are always together

#### Example Structure

```
src/components/Button/
├── Button.tsx           # UI Component
├── Button.stories.tsx   # Storybook (SAME FOLDER!)
├── index.ts             # Export
└── types.ts             # Types (if needed)
```

#### Story File Template

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import Button from './Button'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
}
```

---

### 3. TypeScript Rules

- Use strict TypeScript configuration
- Define types in `src/types/` directory
- Use interfaces for object shapes
- Use type aliases for unions/primitives
- Avoid `any` type - use `unknown` when type is uncertain

#### Component Rules

- One component per file
- Component name must match file name
- Use PascalCase for component names
- Export components as default
- Use named exports for utilities

---

### 4. Project Architecture

#### Modular Component Structure

```
src/components/ComponentName/
├── ComponentName.tsx        # UI/UX (Dumb Component)
├── ComponentName.stories.tsx # Storybook stories (SAME FOLDER)
├── index.ts                  # Export
└── types.ts                  # Component-specific types (if needed)
```

#### Smart Logic Separation

- **UI (Dumb):** Component `.tsx` files contain only UI/UX
- **Logic (Smart):** Extract to `src/hooks/` for reusability
- **API/Functions:** Place in `src/utils/`

#### Directory Structure

| Directory         | Purpose                           |
| ----------------- | --------------------------------- |
| `src/components/` | Modular UI components             |
| `src/hooks/`      | Custom React hooks (Smart logic)  |
| `src/utils/`      | API calls, formatters, validators |
| `src/types/`      | TypeScript type definitions       |
| `src/pages/`      | Page components                   |
| `src/layouts/`    | Layout components                 |
| `src/context/`    | React Context providers           |
| `src/services/`   | API service functions             |
| `src/constants/`  | Constants and configurations      |
| `src/assets/`     | Static assets                     |
| `src/demo/mocks/` | Mock data for testing             |

#### Global CSS Location

- `index.css` is located in **`src/`** (not in project root)
- Import in `src/main.tsx`: `import './index.css'`

---

### 5. Git Rules

#### Commit Messages

- Use conventional commits format
- `feat:` for new features
- `fix:` for bug fixes
- `refactor:` for code refactoring
- `style:` for styling changes
- `docs:` for documentation
- `test:` for tests
- `chore:` for maintenance

#### Gitignore

- Always update `.gitignore` before pushing
- Never commit:
  - `node_modules/`
  - `.env` files
  - `dist/` or `build/`
  - `.DS_Store`
  - IDE settings
  - Log files

#### Push Workflow

1. Run `npm run lint` check
2. Run `npm run format` format
3. Run `npm run build-storybook` (if UI changes)
4. Update `CHANGELOG.md`
5. Update `LAST_SESSION.md`
6. Commit with proper message
7. Push to remote

---

### 6. ESLint & Prettier Rules

#### ESLint

- Run `npm run lint` before committing
- Fix all linting errors before pushing
- No `console.log` in production code (use logger)

#### Prettier

- Run `npm run format` before committing
- Use project `.prettierrc` configuration
- Format on save in IDE

---

### 7. Image & Asset Rules

#### Lazy Loading

- All images must use lazy loading
- Use `loading="lazy"` attribute
- Use Cloudinary for optimized images

#### Asset Organization

```
src/assets/
├── images/
│   ├── logo/
│   ├── icons/
│   └── placeholders/
├── fonts/
└── favicon/
```

#### Image Naming

- Use kebab-case: `hero-background.png`
- Include size in name for variants: `logo-small.png`, `logo-large.png`

---

### 8. Agent Rules (CRITICAL!)

#### Mind Your Own Business Rule

- **NEVER** modify existing, working UI/UX code
- **NEVER** modify existing, working Logic code
- **NEVER** modify existing, working Functions
- **ONLY** modify what you were asked to change
- Respect other agents' work

#### Change Documentation

- Always update `CHANGELOG.md` after changes
- Always update `LAST_SESSION.md` after session
- Document what was changed, why, and by whom

#### Before Making Changes

1. Read `LAST_SESSION.md` to understand context
2. Read `CHANGELOG.md` to see recent changes
3. Only modify the specific task requested
4. Update documentation after completion

---

### 9. Testing Rules

#### Unit Tests

- Test utility functions in `src/utils/`
- Test hooks in `src/hooks/`
- Use Vitest for unit testing

#### Component Tests

- Test component rendering
- Test user interactions
- Test accessibility

---

### 10. Accessibility Rules

- All interactive elements must be keyboard accessible
- Use semantic HTML elements
- Include alt text for images
- Use ARIA labels when necessary
- Maintain color contrast ratios
- Support screen readers

---

### 11. Performance Rules

- Use lazy loading for images
- Use code splitting for routes
- Minimize bundle size
- Optimize images before upload
- Use memoization when appropriate
- Avoid unnecessary re-renders

---

### 12. Security Rules

- Never commit secrets or API keys
- Use environment variables for sensitive data
- Validate all user inputs
- Sanitize user-generated content
- Use HTTPS for all API calls
- Implement rate limiting

---

### 13. Documentation Rules

- Update `README.md` for project setup changes
- Update `PROJECT_PLAN.md` for feature changes
- Update `CHANGELOG.md` for all changes
- Update `LAST_SESSION.md` after each session
- Comment complex logic (in English)
- Use JSDoc for function documentation

---

### 14. Internationalization (i18n) Rules (IMPORTANT!)

#### Before Working on New Pages

- **ALWAYS** read `LAST_SESSION.md` to understand current i18n implementation
- **ALWAYS** read `CHANGELOG.md` to see recent i18n changes
- **ALWAYS** check `src/locales/mm/translation.json` and `src/locales/en/translation.json` for existing translations

#### Creating New Pages - i18n Checklist

When creating a new page, follow these steps to ensure i18n works correctly:

1. **Import useTranslation hook**

   ```tsx
   import { useTranslation } from 'react-i18next'
   ```

2. **Initialize in component**

   ```tsx
   const { t, i18n } = useTranslation()
   const lang = i18n.language as 'mm' | 'en'
   ```

3. **Replace all hardcoded text with translations**

   ```tsx
   // ❌ Wrong
   <h1>Welcome</h1>
   <p>{webtoon.title}</p>

   // ✅ Correct
   <h1>{t('home.welcome')}</h1>
   <p>{webtoon.title[lang]}</p>
   ```

4. **Access mock data with language key**

   ```tsx
   // ❌ Wrong
   {
     mockWebtoons.map((w) => <span>{w.title}</span>)
   }

   // ✅ Correct
   {
     mockWebtoons.map((w) => <span>{w.title[lang]}</span>)
   }
   ```

5. **Add new translation keys if needed**
   - Add to `src/lib/i18n/locales/mm/translation.json`
   - Add to `src/lib/i18n/locales/en/translation.json`

### Myanmar Text Rendering (IMPORTANT!)

Myanmar text has diacritics (လုံးကြီးတင်, တစ်ချောင်းပင်, ဝစ္စခတ်) that can overlap with adjacent lines. This is automatically handled by CSS rules in `src/index.css`.

**How it works:**

- HTML `lang` attribute is automatically updated when language changes
- CSS selector `html[lang="mm"]` applies special line-height rules
- No additional code needed in new pages

**Line-height values for Myanmar:**
| Element | Line-height |
|---------|-------------|
| Headings (h1-h6) | 1.5 |
| Body text (p, span, a, li) | 1.8 |
| Form elements (button, input) | 1.6 |

\*\*Do NOT override these values in new pages unless necessary.

#### Using Translations

```tsx
import { useTranslation } from 'react-i18next'

const MyComponent = () => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as 'mm' | 'en'

  return (
    <div>
      <h1>{t('home.featured')}</h1>
      <p>{mockData.title[lang]}</p>
    </div>
  )
}
```

#### Mock Data Structure

- All text content in mock data MUST be bilingual
- Use `{ mm: 'မြန်မာ', en: 'English' }` format
- Access with `data.field[lang]` pattern

#### Adding New Translations

1. Add translation key to `src/locales/mm/translation.json` (Myanmar - default)
2. Add same key to `src/locales/en/translation.json` (English)
3. Use `t('category.key')` in components

#### Language Switcher

- Located in `src/components/LanguageSwitcher/`
- Shows opposite language (Myanmar → shows "English", English → shows "မြန်မာ")
- Click to toggle between languages
- Language preference saved to localStorage

#### Default Language

- **Myanmar (mm)** is the default language
- Set in `src/i18n.ts` with `lng: 'mm'`

---

## Quick Reference

### Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run format       # Run Prettier
npm run storybook    # Start Storybook
npm run test         # Run tests
```

### File Naming Conventions

| Type       | Convention                  | Example              |
| ---------- | --------------------------- | -------------------- |
| Components | PascalCase                  | `Button.tsx`         |
| Stories    | PascalCase + .stories       | `Button.stories.tsx` |
| Hooks      | camelCase with `use` prefix | `useModal.ts`        |
| Utils      | camelCase                   | `formatters.ts`      |
| Types      | PascalCase                  | `User.ts`            |
| Constants  | SCREAMING_SNAKE_CASE        | `API_ENDPOINTS.ts`   |
| CSS        | lowercase                   | `src/index.css`      |

---

## Last Updated

**Date:** 2026-07-13
