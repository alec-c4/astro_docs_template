# Astro Docs Template

A reusable static documentation portal built with Astro and MDX, without Starlight, Svelte, or a client UI framework. The shadcn-inspired design uses neutral colors, subtle borders, shared CSS tokens, and light/dark themes.

## Create your own portal

Use a Node.js version supported by `package.json` and Git. Copy the template without its Git history with [degit](https://github.com/Rich-Harris/degit):

```sh
npx degit alec-c4/astro_docs_template my-docs
cd my-docs
git init -b main
npm ci
npm run dev -- --background
```

This copies the default branch of [the template repository](https://github.com/alec-c4/astro_docs_template). The template must be published there before this command can download it. For a reproducible starting point, append a published tag or commit to the source after `#`. You do not need to install degit as a project dependency: it is only used to create the initial copy. Subsequent template changes are not applied automatically.

Initialize your new Git repository before `npm ci` so Lefthook can install its hooks. If you initialize Git afterward, run `npm run hooks:install`. Change the package name and repository URL in `package.json` to match your new project.

Alternatively, use GitHub's **Use this template** action if the repository is enabled as a template, or clone it to contribute to the template itself:

```sh
git clone https://github.com/alec-c4/astro_docs_template.git
cd astro_docs_template
npm ci
```

## Run locally

```sh
npm run dev -- --background
npm run astro -- dev status
npm run astro -- dev logs
npm run astro -- dev stop
```

Open `http://localhost:4321`.

## Configure a portal

1. Edit `src/portal.config.ts` to set the title, description, interface language (`en` or `ru`), and navigation sections with translated labels.
2. Replace the examples in `src/content/docs/` with your own Markdown/MDX documents.
3. Customize the CSS tokens in `src/styles/portal.css`. You do not need shadcn-svelte to use this design.
4. Set `SITE_URL` when publishing and `BASE_PATH` when hosting in a subdirectory. For example: `SITE_URL=https://example.com BASE_PATH=/docs npm run build`.

The default interface language and included examples are English. Changing the interface language does not translate documents. Interface translations live in `src/lib/i18n.ts`; translate content separately. Concurrent language editions and documentation versioning are not implemented.

## Content and navigation

```yaml
---
title: Product setup
description: Prepare your product for use.
section: guides
order: 1
draft: false
updated: 2026-11-13
---
```

- `title`, `description`, and a `section` from the portal configuration are required. Schema errors fail the build.
- The path inside `src/content/docs/` determines the URL: `guides/setup.md` becomes `/guides/setup/`.
- Navigation is generated automatically: sections follow configuration order, then pages follow `order` (default 100) and the title in the configured locale.
- Second- and third-level headings appear in the table of contents. Previous and Next links connect adjacent documents.
- `draft: true` displays the document with a warning in development. Production excludes it from routes, navigation, the homepage, and the search index.
- `updated` is optional. Dates are formatted in the selected locale using UTC, independently of the build machine's time zone.
- Maintain a changelog at the end of a document when needed.

MDX content is trusted source code: it can import and execute components during the build. Do not accept unreviewed files as user uploads.

## MDX components

### API parameter table

```mdx
import ApiParamsTable from '@components/ApiParamsTable.astro';

<ApiParamsTable
	params={[
		{ name: 'id', type: 'string', required: true, description: 'Identifier' },
	]}
/>
```

Filter by name and sort by name, type, or required status. The table is rendered during the build and remains readable without JavaScript. Sort direction is exposed to screen readers.

### Environment switcher

```mdx
import EnvSwitcher from '@components/EnvSwitcher.astro';

<EnvSwitcher envs={['dev', 'stage']} defaultEnv="dev">
	<div data-env="dev">Local setup</div>
	<div data-env="stage">Staging setup</div>
</EnvSwitcher>
```

`?env=stage` selects an environment on load. Arrow keys, Home, and End switch tabs. Unknown values fall back to a valid default or the first environment. All panels remain available without JavaScript. Environment names must be unique, with one child block per name. Multiple instances work independently but read the same initial `env` query parameter.

### Mermaid

Code blocks with the `mermaid` language work in Markdown and MDX. Mermaid is loaded dynamically only when diagrams are present, without an external CDN, using `securityLevel: strict`. Theme changes redraw diagrams. The source remains available without JavaScript or if loading fails. Add `accTitle` and `accDescr` to make diagrams accessible.

## Theme

Choose **Light**, **Dark**, or **System** in the top navbar. System is the default and follows the device color scheme, including changes while the page is open. An explicit choice overrides the device setting. The selected mode is saved locally and restored on the next visit. If local storage is unavailable, switching still works for the current page.

## Search

Search is located in the top navbar. Press Cmd+K on macOS or Ctrl+K on Windows/Linux to focus it and select the current query. Results appear in a dropdown without moving the document. Local search matches document titles, descriptions, and Markdown/MDX source text. The `/search.json` index is loaded on the first query, with results limited to ten links. Errors are reported and requests can be retried. This is substring search without stemming or ranking; consider Pagefind for a large knowledge base.

Production pages and the search index are public. Keep secrets out of your content. Implement authentication and access control at the hosting layer or in a separate server application.

## Git hooks

[Lefthook](https://lefthook.dev/) runs the following checks in parallel before each commit:

- `npm run format:check`
- `npm test`
- `npm run check`

The configuration is in `lefthook.yml`. The npm package installs hooks automatically during `npm ci` when Git has already been initialized. Its installation script is explicitly allowed in `package.json`. Hooks only check files; they do not reformat or stage changes. They check the whole working tree, so fix any reported issues before committing. Use `npm run format` to fix formatting, then review and stage the changes yourself.

```sh
npm run hooks:install # install or restore hooks in this checkout
npm run hooks:check   # run all pre-commit checks, even without staged files
```

After changing `lefthook.yml`, reinstallation is not required. The full build and browser suite remain in `npm run verify`; run it before opening a pull request.

## Checks

```sh
npm test                             # all logic tests: node:test, offline
node --test tests/environment.test.ts # a single test file
npm run format:check                 # check formatting
npm run format                       # fix formatting
npm run check                        # Astro and TypeScript
npm run build                        # production build
npx playwright install chromium      # install the browser before the first run
npm run test:e2e                      # browser scenarios, after building
npx playwright test tests/browser/portal.spec.ts # a single browser test file
npm run verify                       # all checks
```

There is no separate linter: the project uses Prettier and Astro/TypeScript checks. Browser tests start a preview server at `127.0.0.1:4339` and stop it afterward. They cover search and network failures, draft exclusion, tables, keyboard tabs, operation without JavaScript, Mermaid, theme persistence, and mobile layout.

## Build and host

`npm run build` generates `dist/` for static hosting. Run `npm run preview -- --background` to inspect the result locally, and `npm run astro -- preview stop` to stop it. `SITE_URL` enables canonical URLs. `BASE_PATH` is included in generated internal links and the search index URL. Links written inside Markdown must account for the selected base path.

## Further development

- Pagefind for larger documentation collections and ranked results.
- Language and version routes for concurrent editions.
- Internal link and accessibility checks in CI.
- Document ownership metadata and a review schedule.
- A sitemap and RSS when indexing and subscriptions are required.
- Svelte/shadcn-svelte for future forms, dialogs, and more complex interactive sections.

Mermaid includes large modules for some diagram types, so Vite reports a warning about chunk sizes. These modules load on demand; ordinary documentation pages do not load Mermaid.
