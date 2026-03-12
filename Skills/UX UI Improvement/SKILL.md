---
name: ux-ui-improvement
description: Improve the user experience (UX) and user interface (UI) of any website, web app,component, or page. Use this skill when the user asks for help making something easier, more intuitive, more attractive, or more accessible. Trigger whenever you see phrases like "improve the UX", "better UI", "make it more user friendly", "accessibility audit", "design review", "polish the interface", or any request to redesign, critique, or enhance visual/layout/interaction quality. This skill should fire even for casual wording such as "this looks clunky" or "users keep getting lost".
---

# UX/UI Improvement Skill

This skill helps you think like a designer and front‑end engineer at the same time.
When applied, it guides Claude through the process of auditing existing interfaces,
proposing concrete layout and style changes, suggesting accessibility fixes and
performance tweaks, and generating or revising code snippets that implement the
recommendations.

## Key Principles

1. **Clarity first** – every screen or component should answer "What is this?" and
   "What can I do next?" in under a second. Reduce cognitive load with clear labels,
   consistent patterns, and sensible defaults.
2. **Consistency** – use a unified typographic scale, color palette, spacing system,
   and interaction vocabulary. Components across the site should behave the same way.
3. **Accessibility for all** – follow WCAG guidelines. Ensure color contrast,
   keyboard navigation, focus states, aria roles, and semantic HTML are all correct.
4. **Mobile‑first & responsive** – design from small screens up. Ensure layouts
   collapse gracefully, tap targets are large, and images/fonts scale efficiently.
5. **Feedback & affordance** – actions should have visible responses (loading
   spinners, button state changes, success/error messages). Make it obvious what is
   interactive versus static.
6. **Performance matters** – limit DOM size, defer offscreen images, minimize layout
   thrashing, and avoid heavy animations that slow rendering.
7. **User flows & hierarchy** – map the most common tasks and optimize the path to
   completion. Highlight primary actions and downplay secondary ones.
8. **Design tokens & theming** – encourage use of a central token set (colors,
   spacing, radii, shadows) to make wholesale style updates painless.

> _Note:_ this skill is generic and should be married to a concrete project context
> whenever possible. When the user supplies code, layout screenshots, or a style
> guide, the recommendations should reference those assets directly.

## Workflow

1. **Gather context** – look at the provided code, screenshot, description of the
   problem, or user complaints. If none is given, ask the user to describe what’s
   feeling broken or what they want to achieve.
2. **Audit & diagnose** – list specific UX/UI issues (e.g. "button text is vague",
   "contrast ratio < 3:1", "form fields too close", "no mobile nav"). Base this
   on the principles above.
3. **Recommend changes** – propose concrete solutions (rewording, spacing fixes,
   component refactor, new ARIA attributes, color adjustments). When possible,
   supply code snippets illustrating the fix, ideally using the stack the project
   is already using (React/Tailwind, plain HTML/CSS, etc.).
4. **Validate with examples** – show before/after comparisons or explain why one
   choice is better, referencing best practices and accessibility guidelines.
5. **Iterate** – encourage follow‑up questions, revise suggestions based on user
   feedback, and help implement final UI code if requested.

## Example patterns

### Simple contrast fix
> **Problem:** "The gray text on the card is hard to read."

Recommend adjusting CSS to a darker shade or increasing font weight. Provide
contrast ratio advice.

### Form usability
> **Problem:** "Users are submitting repeatedly because they don't know their form
has been sent."

Suggest disabling the submit button and showing a spinner/message after click,
plus clear success/error messaging.

### Navigation hierarchy
> **Problem:** "Our top nav has six links and looks cluttered on mobile."

Propose collapsing into a hamburger menu or a secondary drawer and highlight the
primary link, giving a visual design sample.

### Accessibility audit snippet
```html
<label for="email" class="sr-only">Email address</label>
<input id="email" type="email" required
       class="w-full border rounded px-3 py-2
              focus:outline-none focus:ring-2 focus:ring-blue-500" />
```
Explain `sr-only` utility and focus ring for keyboard users.

## When to ask for more info

- If the user hasn't specified a tech stack, politely enquire: "Is this a React
  project, plain HTML/CSS, or something else?"
- If performance is a concern, request metrics or tools they are using.
- When accessibility is mentioned but no details are given, ask about specific
  issues they've observed (e.g. screen reader problems).

## Trigger examples

- "How can I make my checkout page look more modern and less overwhelming?"
- "Can you audit this UI for accessibility problems?"
- "The buttons don’t feel clickable—any ideas?"
- "Users say they don’t know how to start with the form."


*This skill lives solely in SKILL.md; no external resources are required.*
