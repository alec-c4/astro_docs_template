---
title: Getting started
description: Create a portal for a product, team, or knowledge base.
section: guides
order: 1
---

## Run locally

```sh
npm install
npm run dev -- --background
```

## Configure your portal

Set the title, description, language, and sections in `src/portal.config.ts`.
The interface supports English and Russian. Component translations are in `src/lib/i18n.ts`.
Translate documents separately: changing the interface language does not translate page content.

## Add a document

Add a `.md` or `.mdx` file to `src/content/docs/`. The file path determines its URL, and `section` selects its navigation group.

```yaml
---
title: Document title
description: A short description
section: guides
order: 10
updated: 2026-11-13
---
```

Pages are sorted by section, `order`, and then title. Required fields are validated during the build.

### Drafts

Set `draft: true`. A draft is available in development with a warning, but is excluded from production routes, navigation, and the search index.

## Publish

Run `npm run verify`. Static files are generated in `dist/`.
Set `SITE_URL` for canonical URLs and `BASE_PATH` to host the portal in a subdirectory.

Keep keys, tokens, and private data out of the content: published pages and the search index are accessible to visitors.
