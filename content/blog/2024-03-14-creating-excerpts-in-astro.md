---
date: 2024-03-14T11:05:05+08:00
tags:
  - astro
title: "Creating excerpts in Astro"
---

This blog is running on [Hugo](https://gohugo.io/). It had previously been running on [Jekyll](https://jekyllrb.com/). Both these SSGs ship with the ability to create excerpts from your markdown content in 1 line or thereabouts.

```go
/* Hugo */
{{ .Summary | truncate 130 }}
```

```ruby
# Ruby
{{ post.content | markdownify | strip_html | truncatewords: 20 }}
```

I was mildly surprised Astro does not have a corresponding way to do it. To be fair, there is an integration for it: [Post Excerpt component for 🚀 Astro](https://github.com/igorskyflyer/npm-astro-post-excerpt#readme). And I'm all for keeping the core product streamlined.

But I'm also THAT annoying developer that likes to keep the dependency count as low as I can. Which means I'm constantly playing this balance game in my head of building the feature myself versus installing it.

I usually give myself an hour or so, and if I feel it's going to take me more than an hour, I'll fold.

In this particular case, I'm like, I just need to access the post content, right? That has to exist already, right?

We-ll, kind of?

## Someone else already did it!

Cool kids use ChatGPT for all the things now. But I'm not cool. And not young. So I still Google my shit. Which brought me to [Paul Scanlon](https://www.paulie.dev/)'s post [How to Create Excerpts With Astro](https://www.paulie.dev/posts/2023/09/how-to-create-excerpts-with-astro/).

Paul's website is pretty. Go visit Paul's website.

The gist of the self-rolled solution is:

1. Grab the `post.body`, which is in Markdown
2. Parse it into HTML using [markdown-it](https://github.com/markdown-it/markdown-it)
3. Extract usable text content from the HTML
4. Cut off the text to whatever length you'd like
5. Use excerpt and profit

I tried Paul's instructions exactly, but it didn't quite work out for my particular use-case. Because I had articles where the `<figure>` and `<img>` tag show up very early. And that somehow got parsed into the excerpt.

My solution deviates at step 3. Because I'm not a Computer Science major. I am not well-versed in the art of regex and parsing. Therefore, I cede the responsibility to a professional: [html-to-text](https://www.npmjs.com/package/html-to-text). Who am I to doubt more than 1 million downloads a week?

## Same but different

If it isn't broke, don't fix it. So I used a similar implementation strategy as Paul. The source of the script goes into an `utils` folder and I import it into the layout file that needs it.

The script itself isn't rocket science. No, I did not use Typescript for this. Don't @ me.

```js
import MarkdownIt from "markdown-it";
import { convert } from "html-to-text";
const parser = new MarkdownIt();

export const createExcerpt = (body) => {
  const html = parser.render(body);
  const options = {
    wordwrap: null,
    selectors: [
      { selector: "a", options: { ignoreHref: true } },
      { selector: "img", format: "skip" },
      { selector: "figure", format: "skip" },
    ],
  };
  const text = convert(html, options);
  const distilled = convert(text, options);
  return distilled;
};
```

The fun part is `distilled`. Why on earth would I run `convert()` twice? That took me the better part of the hour to figure out.

At first I thought I wasn't configuring the options correctly, but after reading [the documentation](https://github.com/html-to-text/node-html-to-text/blob/master/packages/html-to-text/README.md) and [this issue](https://github.com/html-to-text/node-html-to-text/issues/297), I realised it was more likely a source issue.

After a couple rounds of `console.log`, I realised that the first parse from Markdown to HTML sanitised the `<figure>` and `<img>` tags to `&lt;figure&gt;` and `&lt;img&gt;` because they were wrapped in a `<p>` tag.

So the first `convert()` returned all the text content plus these tags. That's why a second round is needed to clean out these caused-by-sanitisation tags.

Naming things is hard. I just called it distilled. Because you distil booze multiple times.

Actual usage on the `[...page].astro` file looks something like this:

```js
import { createExcerpt } from '../../utils/create-excerpt';
---

<ol class="postlist">
  {((page as any).data || []).map((blogPostEntry: any) => {
    const excerpt = `${createExcerpt(blogPostEntry.body).substring(0, 300)}...`;
    return (
      <li class="postlist-item">
        <a href={`${blogPostEntry.slug}`} class="postlist-link heading--6">{blogPostEntry.data.title}</a>
        <p>{blogPostEntry.data.description ? blogPostEntry.data.description : excerpt}</p>
      </li>
    )}
  )}
</ol>
```

## Wrapping up

Was it worth the effort to roll this feature myself? I do think so. The code wasn't complicated. And yes, I succumbed to installing 2 parsers. What can I say, I'm not a rational human being. <span class="kaomoji">乁 ⁠(⁠ ⁠•⁠_⁠•⁠ ⁠) ㄏ</span>
