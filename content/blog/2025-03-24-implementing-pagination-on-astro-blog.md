---
date: 2025-03-24T05:14:50+08:00
images:
  - /assets/images/posts/astro-pagination.jpg
tags:
  - astro
title: "Implementing pagination on an Astro blog"
---

Even though I built the blog for our tech team to share their insights and knowledge with the rest of the interwebs, I wasn't necessarily the one writing the actual blogs. Now that I think about it, I do not think I've published a single article on the blog. Haha.

Realistically, it was pretty much a build it and move on with life situation, where there were not many feature requests, it was mainly dependency updates and very minor CSS tweaks. So it did take me a while to realise that, I hadn't actually built the pagination for the blog.

Back when I built the whole thing in March 2024, the only blog posts we had were 3 that were ported over from a Medium account we'd lost access to. Anyway, with 3 blog posts, and no commitment from anybody on the team that we would publish blog posts regularly, I figured we would get to pagination later, much later.

![I did not add the pagination component after 12 articles](/assets/images/posts/astro-pagination/future-proof.png)

Well, by the time we had to upgrade Astro from 4 to 5 (there will be a blog post on this), I saw that we had 13 blog posts and yikes, the first blog post was gone from the listing. Yikes.

## See how other people do stuff

In my feeble attempt to be future-proof, I did consult the Googles on how other people did it, and I'm pretty sure [Creating A Pagination Component With Astro](https://rimdev.io/creating-a-pagination-component-with-astro) by [Ted Krueger](https://github.com/tedk13) was the article I had referred to.

Most other results were for pagination components other people had built and packaged into something you could just import. I'm not against importing and using components in general, but come on, it's a pagination. I'd rather use my self-imposed import quota on something grander, if you know what I mean.

So the implementation I ended up with had the dynamic `[...page].astro` component for when you paginate the entire listing and end up with multiple blog listing pages but no actual pagination component.

```js
---
import type { Page } from "astro";
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';

type Props = {
  page: Page<any>;
};

export async function getStaticPaths({ paginate }: any) {
  const blogEntries = (await getCollection("blog")).sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  return paginate(blogEntries, { pageSize: 12 });
}

const { page } = Astro.props;
---
<BaseLayout title="Engineering blog">
  <main>
    <div class="content-wrapper">
      <ol class="breadcrumbs" itemscope itemtype="https://schema.org/BreadcrumbList">
        <li itemprop="itemListElement" itemscope
            itemtype="https://schema.org/ListItem">
          <a itemprop="item" href="/developers">
          <span itemprop="name">Developers Portal</span></a>
          <meta itemprop="position" content="1" />
        </li>
      </ol>
      <h1>Engineering Blog</h1>
      <ol class="postlist">
        {((page as any).data || []).map((blogPostEntry: any) => (
          <li class="postlist-item">
            <a href={`/developers/blog/${blogPostEntry.slug}`} class="postlist-link heading--6">{blogPostEntry.data.title}</a>
            <time class="postlist-date" datetime={blogPostEntry.data.date.toISOString()}>
              {blogPostEntry.data.date.toDateString()}
            </time>
          </li>
        ))}
      </ol>
    </div>
  </main>
</PageLayout>

<style>
/* all my blog listing styling */
</style>
```

And for the individual blog posts, the dynamic page for those was `[...slug].astro`.

```js
---
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const blogEntries = await getCollection('blog');
  return blogEntries.map(entry => ({
    params: { slug: entry.slug }, props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await entry.render();
---
<Content />
```

I'm just missing the Pagination component that Ted built out in his article. What's the reason for this blog post if the implementation simply follows what Ted has already explained in his article?

Well, my project's implementation has a URL suffix problem, i.e. the entire Astro site is not served on the root domain, but instead on `<ROOT_DOMAIN>/developers`. Oh, that `/developers` suffix. <span class="emoji" role="img" tabindex="0" aria-label="exhaling face">&#x1F62E;&#x200D;&#x1F4A8;</span>

So I had diverged from how Ted implemented the parameters for this pagination component.

<p class="no-margin">There are 5 "types" of links on a pagination component, or at least for this particular UI pattern I was trying to follow.</p>

<ul>
  <li class="no-margin">Go to first page</li>
  <li class="no-margin">Go to previous page</li>
  <li class="no-margin">Go to X page number</li>
  <li class="no-margin">Go to next page</li>
  <li>Go to last page</li>
</ul>

Astro has [built-in Pagination support](https://docs.astro.build/en/guides/routing/#pagination), and with use of the `paginate()` function, each page gets page-related data via a [`page` prop](https://docs.astro.build/en/guides/routing/#the-page-prop).

The `page` prop provided all the parameters I need to fulfil the above 5 types of links on the Pagination component I was trying to build. So on the `[...page].astro` listing component, the parameters where passed into the Pagination component as follows:

```js
<Pagination
  length="{page.lastPage}" /** number of last page */
  currentPage="{page.currentPage}" /** the current page number, starting from 1 */
  firstUrl="{page.url.first}" /** url of the first page (if the current page is not the first page) */
  prevUrl="{page.url.prev}" /** url of the previous page (if there is one) */
  nextUrl="{page.url.next}" /** url of the next page (if there is one) */
  lastUrl="{page.url.last}" /** url of the last page (if the current page in not the last page) */
/>
```

Now, because the `url` data returns `undefined` when it doesn't exist, we can build logic to make sure there are no broken links in the pagination. The "edge" cases are when you hit the first page and when you hit the last page.

So the checks can be done like so:

```js
{
  firstUrl ? (
    <a href={`/developers${firstUrl}`} class="pagination__link">
      &#171;
    </a>
  ) : (
    <span class="pagination__link disabled">&#171;</span>
  );
}
```

And so on and so forth for the rest of the cases. Putting everything together, the pagination component ends up looking like this:

```js
---
const { length, currentPage, firstUrl, prevUrl, nextUrl, lastUrl } = Astro.props;
const paginationList = Array.from({length}, (_, i) => i + 1);
---
<nav aria-label="Blog pages" class="pagination">
  {firstUrl ? (
    <a href={`/developers${firstUrl}`} class="pagination__link">&#171;</a>
  ) : (
  <span class="pagination__link disabled">&#171;</span>
  )}

  {prevUrl ? (
    <a href={`/developers${prevUrl}`} class="pagination__link">&#8249;</a>
  ) : (
    <span class="pagination__link disabled">&#8249;</span>
  )}

  {paginationList.map((num) => (
    <a
      href={`/developers/blog${num == 1 ? "" : "/" + num}`}
      class={`pagination__link ${currentPage == num ? "disabled active" : ""}`}
    >
      {num}
    </a>
  ))}

  {!nextUrl ? (
    <span class="pagination__link disabled">&#8250;</span>
  ) : (
    <a href={`/developers${nextUrl}`} class="pagination__link">&#8250;</a>
  )}

  {lastUrl ? (
    <a href={`/developers${lastUrl}`} class="pagination__link">&#187;</a>
  ) : (
    <span class="pagination__link disabled">&#187;</span>
  )}
</nav>

<style>
/* all my pagination styling */
</style>
```

## Wrapping up

Did I do all this by myself? Of course not. I had the help of the most patient human rubber duck / TypeScript therapist / overall programming whiz that I've had the privilege of being friends with, [See Yishu](https://github.com/yishus).

Astro uses TypeScript by default, and 80% of the time, we're fine. We have a cordial relationship, TypeScript and I. But then, there are times when TypeScript yells at me, and I just don't know why.

I have a bad analogy using terrible stereotype but it's like when the girlfriend gets mad at her partner and when the partner asks, "Why are you mad at me?", the girlfriend responds "You should know. <span class="emoji" role="img" tabindex="0" aria-label="mad face">&#x1F624;</span>"

Do you know who I call when TypeScript yells at me? Yes, I call Yishu. Because she's the best TypeScript therapist I know.

Anyway, times are chaotic. Take care of yourselves, my friends. <span class="emoji" role="img" tabindex="0" aria-label="person in lotus position">&#x1F9D8;</span>
