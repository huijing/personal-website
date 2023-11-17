---
date: 2023-11-17T15:30:40+08:00
images:
  - /assets/images/posts/astro-frontmatter.jpg
tags:
  - astro
  - css
title: "Customising content markdown via frontmatter in Astro"
---

The use case I had for this was to have customisable bits of a content collection that was rendered from markdown. Basically, a newsletter template where every newsletter could potentially have a different top banner and highlight colour.

There are different ways to implement this but I went with this frontmatter approach because there might be situations where a non-technical person had to publish the newsletter, and asking them to pass variables into a component is more confusing for them than you'd think.

If you consult the [Astro documentation on CSS variables](https://docs.astro.build/en/guides/styling/#css-variables), it is possible to to pass CSS variables from component frontmatter using the `define:vars` directive. If you think about it, isn't frontend development all about passing data from one component to another?

Anyway, how this would work for my use case is, on my newsletter layout, I can access the frontmatter props, assign them to variables. Then pass these server-side variables into the client `<style>` tags.

```javascript
---
const { frontmatter } = Astro.props;

const headerImg = `url('${frontmatter.theme.header_img}')`;
const gradientColour1 = frontmatter.theme.gradient_colour_1;
const gradientColour2 = frontmatter.theme.gradient_colour_2;
const headerTxt = frontmatter.theme.header_txt;
const highlightColour = frontmatter.theme.highlight_colour;
---

<header
  class="content-wrapper"
  style="background-image: var(--header-img), linear-gradient(90deg, var(--gradient-colour-1) 0%, var(--gradient-colour-2) 100%); color: var(--header-txt)">
  <h1>{frontmatter.title}</h1>
</header>

<style define:vars={{ headerImg, gradientColour1, gradientColour2, headerTxt, highlightColour }}>
header {
	--header-img: var(--headerImg, url('img/ernie.svg'));
	--gradient-colour-1: var(--gradientColour1, var(--color-purple--lighter));
	--gradient-colour-2: var(--gradientColour2, var(--color-pink--lighter));
	--header-txt: var(--headerTxt, #fff);
}

:global(h2::after) {
	--highlight-colour: var(--highlightColour, var(--color-pink--lightest));
}
</style>
```

So the frontmatter on the markdown side of things would look like this:

```yaml
---
layout: ../../layouts/NewsletterLayout.astro
title: Newsletter format of update email.
description: Monthly update for July 2023
date: 2023-07-01
theme:
  gradient_colour_1: "yellow"
  gradient_colour_2: "limegreen"
  header_img: "/img/ernie.svg"
  header_txt: "#333"
  highlight_colour: "yellow"
tags:
  - newsletter
---
```

One thing to note is that the frontmatter values have to exist, otherwise the site will error out. But they can be empty.

```yaml
---
layout: ../../layouts/NewsletterLayout.astro
title: Acts as an archive.
description: Monthly update for July 2023
date: 2023-07-01
theme:
  gradient_colour_1: ""
  gradient_colour_2: ""
  header_img: ""
  header_txt: ""
  highlight_colour: ""
tags:
  - newsletter
---
```

But this might cause the display to look weird, so to prevent that, we need to remember to add fallback to the CSS custom property values. The syntax for that looks like this, where the second argument of the `var()` function is the fallback value:

```css
.SELECTOR {
  /* limegreen if --some-variable is not defined */
  color: var(--some-variable, limegreen);
}
```

Took some time to fiddle around before figuring this one out, so it's worth a short documentation for future me, as I've reached the stage in my career where I have to read my own blog posts to relearn how to solve problems I've solved before. <span class="kaomoji">乁 ⁠(⁠ ⁠•⁠_⁠•⁠ ⁠)⁠ ㄏ </span>
