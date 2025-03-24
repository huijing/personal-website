---
date: 2025-03-28T05:14:50+08:00
images:
  - /assets/images/posts/learning-web-extensions.jpg
tags:
  - astro
title: "Migrating content collections from Astro 4 to 5"
---

In case you missed it, [Astro](https://astro.build/) 5 has been out and about since [Dec 3, 2024](https://github.com/withastro/astro/releases/tag/astro%405.0.0). As of time of writing, we're at 5.5.4 already. What can I say, the team moves fast. <span class="kaomoji">¯\\\_(ツ)\_/¯</span>

I have 2 projects that make use of Astro's [content collections](https://docs.astro.build/en/guides/content-collections/) and I migrated the first of those back on Dec 16, 2024. What can I say, I'm one of THOSE people. <span class="kaomoji">¯\\\_(ツ)\_/¯</span>

Anyway, I finally got around to migrating the second project in February, and because I'm old(er) now, I can't remember shit any more. Just in case I have to do the migration a third time for whatever reason, it's probably a good idea to write all the gotchas down.

## Documentation is great, refer to it

The Astro team has provided a really good [migration guide](https://docs.astro.build/en/guides/upgrade-to/v5/), and that should be your first stop. Keep it open the whole time you're doing the migration. It's good stuff. The part that was most relevant to me was [Legacy: v2.0 Content Collections API](https://docs.astro.build/en/guides/upgrade-to/v5/#legacy-v20-content-collections-api).
