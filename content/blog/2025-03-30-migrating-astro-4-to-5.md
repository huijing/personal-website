---
date: 2025-03-30T05:14:50+08:00
images:
  - /assets/images/posts/migrate-astro-4-5.jpg
tags:
  - astro
title: "Migrating content collections from Astro 4 to 5"
---

In case you missed it, [Astro](https://astro.build/) 5 has been out and about since [Dec 3, 2024](https://github.com/withastro/astro/releases/tag/astro%405.0.0). As of time of writing, we're at 5.5.4 already. What can I say, the team moves fast. <span class="kaomoji">¯\\\_(ツ)\_/¯</span>

I have 2 projects that make use of Astro's [content collections](https://docs.astro.build/en/guides/content-collections/) and I migrated the first of those back on Dec 16, 2024. What can I say, I'm one of THOSE people. <span class="kaomoji">¯\\\_(ツ)\_/¯</span>

Anyway, I finally got around to migrating the second project in February, and because I'm old(er) now, I can't remember shit any more. Just in case I have to do the migration a third time for whatever reason, it's probably a good idea to write all the gotchas down.

## Documentation is great, refer to it

The Astro team has provided a really good [migration guide](https://docs.astro.build/en/guides/upgrade-to/v5/), and that should be your first stop. Keep it open the whole time you're doing the migration. It's good stuff. The part that was most relevant to me was [Legacy: v2.0 Content Collections API](https://docs.astro.build/en/guides/upgrade-to/v5/#legacy-v20-content-collections-api).

There are step by step instructions on exactly what to do, so follow the 4 steps outlined in the documentation.

1. Move (and rename) the content config file (_content.config.ts_). This file (_config.ts_) no longer lives within the src/content/ folder. This file should now exist at src/content.config.ts.

2. Edit the collection definition within the content config file. For me, it went from:

   ```js
   import { z, defineCollection } from "astro:content";
   import { docsSchema, i18nSchema } from "@astrojs/starlight/schema";

   const blogCollection = defineCollection({
     type: "content",
     schema: z.object({
       title: z.string(),
       description: z.string(),
       date: z.date(),
       image: z.string().optional(),
       tags: z.array(z.string()),
     }),
   });

   export const collections = {
     docs: defineCollection({ schema: docsSchema() }),
     i18n: defineCollection({ type: "data", schema: i18nSchema() }),
     blog: blogCollection,
   };
   ```

   to:

   ```js
   import { z, defineCollection } from "astro:content";
   import { glob } from "astro/loaders";
   import { docsLoader, i18nLoader } from "@astrojs/starlight/loaders";
   import { docsSchema, i18nSchema } from "@astrojs/starlight/schema";

   const blogCollection = defineCollection({
     loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/blog" }),
     schema: z.object({
       title: z.string(),
       description: z.string(),
       slug: z.string(),
       date: z.date(),
       image: z.string().optional(),
       tags: z.array(z.string()),
       authors: z.array(z.string()),
       author_urls: z.array(z.string()),
     }),
   });

   export const collections = {
     docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
     i18n: defineCollection({ loader: i18nLoader(), schema: i18nSchema() }),
     blog: blogCollection,
   };
   ```

3. Change references from `slug` to `id` and switch to the new `render()` function (this combines step 3 and 4 from the documentation). This one I had some trouble with. Not instructions per se. That was relatively straightforward. The file went from:

   ```js
   ---
   import { getCollection } from 'astro:content';

   export async function getStaticPaths() {
     const blogEntries = await getCollection('blog');
     return blogEntries.map(entry => ({
       params: { slug: entry.slug },
       props: { entry },
     }));
   }
   const { entry } = Astro.props;
   const { Content } = await entry.render();
   ---
   <Content />
   ```

   to:

   ```js
   ---
   import { getCollection, render } from 'astro:content';
   import BlogLayout from '../../layouts/BlogLayout.astro';

   export async function getStaticPaths() {
     const blogEntries = await getCollection('blog');
     return blogEntries.map(entry => ({
       params: { id: entry.id },
       props: { entry },
     }));
   }

   const { entry } = Astro.props;
   const { Content } = await render(entry);
   ---
   <BlogLayout frontmatter={entry.data}>
     <Content />
   </BlogLayout>
   ```

   The total amount of changes seem trivial when I write it down like that but it took me forever to figure out why the routes for the individual blog posts just refused to render and kept 404-ing.

   Things finally started to work when I changed the file name from _[...slug].astro_ to _[...id].astro_. Do I know why that works? Not really, except that it matches the API change from `slug` to `id`. Someone smarter than me and more experienced in Astro please tell me why this fixes the problem.

   In addition, one of the [breaking changes](https://docs.astro.build/en/guides/upgrade-to/v5/#breaking-changes-to-legacy-content-and-data-collections) outlined in the upgrade docs was the bit about the `layout` field no longer being supported in Markdown collection entries.

   This one was mildly annoying to fix, but it was merely a matter of importing the layout file at the dynamic route page template instead of the individual blog post. The `BlogLayout` had relied on the frontmatter directly from the markdown or MDX post, which now had to be passed in via `frontmatter={entry.data}`.

I also had issues rendering blog posts that were written in MDX instead of markdown. The solution for me was to install the latest `@astrojs/mdx` and import it in my _astro.config.js_ file. This is possibly related to [how Astro 5 handles JSX and MDX rendering](https://docs.astro.build/en/guides/upgrade-to/v5/#astrojsmdx).

## Wrapping up

Again, I'm just trying to document gotchas that I'm most likely going to forget otherwise and then get that annoying feeling of deja vu that I fixed it before. But then again, Astro moves so fast that the API might change again the next time I have to do this. Oh well, just the price of progress, I suppose. <span class="emoji" role="img" tabindex="0" aria-label="person shrugging">&#x1F937;</span>
