---
title: Diagrams
description: Describe architecture and processes alongside your documentation.
section: guides
order: 2
---

## Mermaid

Use a code block with the `mermaid` language in Markdown or MDX.
Diagrams follow the selected theme. Without JavaScript, the source remains available.

```mermaid
flowchart LR
    accTitle: Publishing documentation
    accDescr: An author writes Markdown, then a static build publishes the portal.
    Author[Author] --> Markdown[Markdown / MDX]
    Markdown --> Build[Static build]
    Build --> Portal[Documentation portal]
```

## Changelog

For important documents, maintain a changelog with the date, change, and reason.
