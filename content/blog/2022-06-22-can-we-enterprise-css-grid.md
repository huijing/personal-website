---
date: 2022-06-23T10:50:11+08:00
hastweet: true
images:
- /assets/images/posts/enterprise-css.jpg
tags:
- css
title: "Can we enterprise CSS grid?"
---
Regardless of whether the title of this blog post is grammatically correct or not, this is a question that I've had the opportunity to tackle recently. And after meeting and chatting with a bunch of CSS folks at [CSS Day](https://cssday.nl/2022), I figured it'd be a good time to organise my thoughts around this topic.

I am known to be long-winded. <span class="kaomoji">¯\\\_(ツ)_/¯</span> You have been warned.

So, CSS grid has been supported in major browsers for around 5 years now. And back even before it shipped, [Jen Simmons](https://jensimmons.com/) had this to say:

<blockquote class="twitter-tweet" data-conversation="none"><p lang="en" dir="ltr">You don’t need a framework to use CSS Grid. CSS Grid *is* a framework. — says <a href="https://twitter.com/rachelandrew?ref_src=twsrc%5Etfw">@rachelandrew</a>, about to be ruthlessly copied by me</p>&mdash; Jen Simmons (@jensimmons) <a href="https://twitter.com/jensimmons/status/771019489915891712?ref_src=twsrc%5Etfw">August 31, 2016</a></blockquote>

Personally, I very much agree with her. CSS grid was developed to tackle the use-case of web applications. If you go to [1.1. Background and Motivation](https://www.w3.org/TR/css-grid-1/#background) of the CSS Grid Layout Module Level 1 specification, it clearly states:

> As websites evolved from simple documents into complex, interactive applications, techniques for document layout, e.g. floats, were not necessarily well suited for application layout. […] The capabilities of grid layout address these problems. It provides a mechanism for authors to divide available space for layout into columns and rows using a set of predictable sizing behaviors.

We should be seeing CSS grid being used all over the place these days, right? I, sadly, have not bore witness to this yet though. It's not that nobody is using CSS grid, far from it. It's just that I've mostly seen it used in personal sites or smaller scale applications. I have yet to see it used as the backbone of a huge application's layout.

I have some theories on why. Again, personal opinion only, but let me know if you think it makes sense.

## The enterprise software problem

The term “enterprise software” somehow has a negative connotation, doesn't it? I'll be honest, if I play the word association game here, my words off the top of my head would be: bureaucratic, hard to update, clunky UI. Which is a little unfair, I suppose.

Sure, there **IS** enterprise software that fits that description, but that doesn't mean **ALL** enterprise software is like that. However, the reason why I have those word associations is because enterprises themselves are large.

And this large-ness *can* often result in bureaucracy, where decisions have to be approved by dozens of levels up the chain, so enhancements or feature updates take a long time to ship. Large organisations tend to have many competing priorities as welll.

Most organisations also have some sort of process to determine who should work on what, so it takes some strong champion-ing and compelling arguments to get the requisite support for a new intiative or project.

Enterprises did not grow to their current size overnight. They are very much like trees, in my opinion, the bigger and stronger they grow, the deeper their roots are and the harder it is to move them. Change is just harder once something has been established.

## What's the point here? 🤔

I'm getting there. You read the opening warning, right? My spicy take on why I'm not seeing CSS grid being used in the manner I had expected due to these combination of factors:
1. Developers still aren't familiar with it yet
2. Large applications are built with numerous libraries and frameworks and often, layout styles are dependent on whether the choice of library or framework supports certain features or not
3. Frontend has got to a point where it covers a very large range of domains, and CSS is just not sexy or lucrative enough for people to be specialists in it

Integrating CSS grid into an existing application, especially a large one, is not a trivial affair. And unless folks are willing to invest the time and effort to do it, I'm positing this is one of the main reasons adoption in those contexts have been relatively low.

That being said, I don't think it's an impossible task though. On the contrary, I found it immensely interesting to explore the different possible approaches and working out actual implementation details.

So let me get to the actual point. From the moment CSS grid was supported in all major browsers, the issue became less of a technical problem, and more of a people problem. But let's talk about the technical details first, because to me, that's the fun stuff.

## 3 options for implementing CSS grid in a React application

I'm going with React here, because that's what I had on hand to work with at the time. But I'm quite sure the approaches themselves are transferrable to different frameworks or even tech stacks.

Most applications have some sort of a design system or at least, design guidelines, to help introduce some consistency across different pages and components. Let's use a generic 12-column grid as the basis for discussion today.

<div class="overflow-scroll">
  <table>
    <thead>
      <tr>
        <th>Size</th>
        <th>Min</th>
        <th>Max</th>
        <th>Cols</th>
        <th>Margin</th>
        <th>Gutter</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>xs</td>
        <td>320px</td>
        <td>639px</td>
        <td>4</td>
        <td>16px</td>
        <td>16px</td>
      </tr>
      <tr>
        <td>sm</td>
        <td>640px</td>
        <td>899px</td>
        <td>8</td>
        <td>30px</td>
        <td>16px</td>
      </tr>
      <tr>
        <td>md</td>
        <td>900px</td>
        <td>1199px</td>
        <td>12</td>
        <td>50px</td>
        <td>16px</td>
      </tr>
      <tr>
        <td>lg</td>
        <td>1200px</td>
        <td>1599px</td>
        <td>12</td>
        <td>90px</td>
        <td>24px</td>
      </tr>
      <tr>
        <td>xl</td>
        <td>1600px</td>
        <td>-</td>
        <td>12</td>
        <td>&gt;180px</td>
        <td>24px</td>
      </tr>
    </tbody>
  </table>
</div>

A grid system with these specifications is surprisingly straightforward to implement with CSS grid.

### Option 1: Just write the CSS

The rationale for this approach is that the grid would inform where everything on the application would sit within the interface. Hence, it could live in the **global stylesheet** that gets loaded everywhere, since the expectation is that it would be used everywhere.

Grid, like Flexbox, introduces the concept of a parent-child relationship between the grid container and its items.

All of the specifications from the table above would be defined on the grid container, while placement of items within the grid can be assigned to each individual grid item (if necessary) or be auto-placed by the browser.

```css
.grid {
  min-width: 320px;
  max-width: 1600px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1em;
  margin-left: 16px;
  margin-right: 16px;
}

@media screen and (min-width: 640px) {
  .grid {
    grid-template-columns: repeat(8, 1fr);
    margin-left: 30px;
    margin-right: 30px;
  }
}

@media screen and (min-width: 900px) {
  .grid {
    grid-template-columns: repeat(12, 1fr);
    margin-left: 50px;
    margin-right: 50px;
  }
}

@media screen and (min-width: 1200px) {
  .grid {
    gap: 1.5em;
    margin-left: 90px;
    margin-right: 90px;
  }
}

@media screen and (min-width: 1600px) {
  .grid {
    margin-left: 180px;
    margin-right: 180px;
  }
}
```

This approach allows the item placement code to go on the component styles. And if there are common placement patterns that recur very often in the design, then you could consider having some pre-written styles to cater to those situations.

```css
.grid__item--full,
.grid__item--half,
.grid__item--third,
.grid__item--quarter {
  grid-column: 1 / -1;
}

@media screen and (min-width: 640px) {
  .grid__item--quarter {
    grid-column: span 4;
  }
}

@media screen and (min-width: 900px) {
  .grid__item--half {
    grid-column: span 6;
  }

  .grid__item--third {
    grid-column: span 4;
  }

  .grid__item--quarter {
    grid-column: span 3;
  }
}
```

And if you do need some custom placement, those styles could be part of the component styles like this:

```css
.custom-thingy {
  grid-column: 1 / -1;
  font-size: var( --step-1);
}

@media screen and (min-width: 640px) {
  .custom-thingy {
    grid-column: 1 / 6;
    padding-top: 2em;
    padding-bottom: 1em;
  }
}

@media screen and (min-width: 900px) {
  .custom-thingy {
    grid-column: 1 / 7;
  }
}
```

### Option 2: Container and Item components

Another approach is to have wrapper components for the container and item respectively. This means the grid code is tied to the wrapper components instead of being loaded in the global stylesheet.

I ran into some specificity issues with this approach with CSS modules that I managed to workaround relatively painlessly, but it *is* something to take note of.

The setup involves creating a Grid component and a Col component and their corresponding stylesheets.

```bash
src/
  └── components/
      ├── Col/
      │   ├── Col.module.css
      │   └── Col.tsx
      └── Grid/
          ├── Grid.module.css
          └── Grid.tsx
```

These components don't do much other than provide grid-related styling, so they're not very big or complicated. They have props for passing custom class names, modifying the element tag (which defaults to `div`) but generally does not restrict users from passing in other props either.

**Grid.tsx**
```tsx
import { ReactNode, createElement } from "react";
import styles from "./Grid.module.scss";

interface GridProps extends React.HTMLProps<HTMLElement> {
  className?: string;
  children: ReactNode;
  tag?: keyof JSX.IntrinsicElements;
}

export default function Grid({
  className = "",
  children,
  tag = "div",
  ...props
}: GridProps) {
  const Wrapper = tag;
  return createElement(
    Wrapper,
    {
      className: `${styles.grid} ${className}`,
      ...props
    },
    children
  );
}
```

**Col.tsx**
```tsx
import { ReactNode, createElement } from "react";
import cn from "classnames";
import styles from "./Col.module.scss";

interface ColProps extends React.HTMLProps<HTMLElement> {
  className?: string;
  children: ReactNode;
  colWidth?: "full" | "half" | "third" | "quarter";
  tag?: keyof JSX.IntrinsicElements;
}

export default function Col({
  className = "",
  children,
  colWidth,
  tag = "div",
  ...props
}: ColProps) {
  const Wrapper = tag;

  return createElement(
    Wrapper,
    {
      className: cn(className, { [styles[`${colWidth}`]]: colWidth }),
      ...props
    },
    children
  );
}
```

The styles would be the same as in option 1 but because this approach uses CSS modules, you can sort of be more “casual” with naming your classes? The grid container styles are literally exactly the same as option 1, while the item classes can look like this or however you like to name them:

**Col.module.css**
```css
.full,
.half,
.third,
.quarter {
  grid-column: 1 / -1;
}

@media screen and (min-width: 640px) {
  .quarter {
    grid-column: span 4;
  }
}

@media screen and (min-width: 900px) {
  .half {
    grid-column: span 6;
  }

  .third {
    grid-column: span 4;
  }

  .quarter {
    grid-column: span 3;
  }
}
```

The issue I ran into when using these components was that, if I wanted to override the pre-written item styles, I had to bump the specificity of my component styles up a little bit because CSS modules loaded the component styles *before* the wrapper styles. <span class="kaomoji">¯\\\_(ツ)_/¯</span>

I like to keep specificity low in general, so I went with bumping up by 1 element tag's worth.

```css
p.customThingy {
  grid-column: 1 / -1;
  font-size: var( --step-1);
}

@media screen and (min-width: 640px) {
  p.customThingy {
    grid-column: 1 / 6;
    padding-top: 2em;
    padding-bottom: 1em;
  }
}

@media screen and (min-width: 900px) {
  p.customThingy {
    grid-column: 1 / 7;
  }
}
```

If someone more knowledgeable has advice on a better way of dealing with this style loading order, please let me know.

### Option 3: Using Tailwind classes

This may or may not be a spicy option. I'll be up front about this, I do not think the way Tailwind does CSS is ideal. The major issue I have with Tailwind is, if you use it the way it was intended, the cascade is almost completely negated.

It is called Cascading Stylesheets for a reason. Maybe call it “Tailwind SS” instead? That being said, I'm not a very dogmatic person. I may write a longer Tailwind-specific blog post in future (but do I really want Opinionated tech bros telling me why I'm very very wrong?), we'll see.

For now, I accept the reality that there are quite a number of teams that use Tailwind CSS in their applications and it's working well for them. That's great. What if those teams want to use CSS grid? Well, it is absolutely doable.

Even though I'm not a big fan of how the CSS is being done in Tailwind, I must admit its build process is very solid and the documentation is also great. Tailwind has exposed almost every API possible for you to modify the default configuration to suit your custom specifications.

So the grid specification can be set up like so (abstracted to just show the breakpoints):

```js
module.exports = {
  theme: {
    screens: {
      xs: "320px",
      sm: "640px",
      md: "900px",
      lg: "1200px",
      xl: "1600px",
      maxSm: { max: "639px" },
      maxMd: { max: "899px" },
      btwSmMd: { min: "640px", max: "899px" }
    },
  },
  prefix: "tw-"
};
```

You would then have to apply these classes to your component accordingly:

```tsx
export default function Option3() {
  return (
    <section className="tw-grid xs:tw-grid-cols-4 sm:tw-grid-cols-8 md:tw-grid-cols-12 xs:tw-gap-3 lg:tw-gap-4 xs:tw-mx-3 sm:tw-mx-[30px] md:tw-mx-[50px] lg:tw-mx-[90px] xl:tw-mx-[180px]">
      <p className="tw-col-span-full">Full width</p>
      <p className="tw-col-span-full md:tw-col-span-6">Half width</p>
      <p className="tw-col-span-full md:tw-col-span-4">Third width</p>
      <p className="tw-col-span-full md:tw-col-span-3">Quarter width</p>
    </section>
  );
}
```

I'm sure the Tailwind experts have come up with something to abstract regularly used combinations of classes into something else but this is the most basic version and it achieves the same end result as the other options.

### Code and demo

If you'd like to see how the code performs in an actual design, you can check out this CodeSandbox:
[https://codesandbox.io/s/enterprise-css-grid-vnjozr](https://codesandbox.io/s/enterprise-css-grid-vnjozr)

<img srcset="/assets/images/posts/enterprise-css/mockup-480.jpg 480w, /assets/images/posts/enterprise-css/mockup-640.jpg 640w, /assets/images/posts/enterprise-css/mockup-960.jpg 960w, /assets/images/posts/enterprise-css/mockup-1280.jpg 1280w" sizes="(max-width: 400px) 100vw, (max-width: 960px) 75vw, 640px" src="/assets/images/posts/enterprise-css/mockup-640.jpg" alt="Imaginary hotel website mockup">

I put the code on Github: [https://github.com/huijing/enterprise-css-grid](https://github.com/huijing/enterprise-css-grid), since I found that if you try to clone the CodeSandbox, you don't get the container version (which you want for Tailwind styles to compile properly).

## The people problem

I only proposed 3 options but I'm sure there are more possible approaches to writing styles. Are any one of these approaches the “correct” one or the “best” one? The answer is a resounding **NO**. At least, not without taking into account the context in which the code needs to be used.

Technically, every approach does the job. The level of difficulty of the technical implementation sometimes pale in comparison to the issues and considerations around code organisation, maintainability and developer experience. Especially for larger teams.

There is always the chance that someone from above you in the hierarchy “mandates” that you use a certain technology. Have I heard some executive (who used to code) say “I could have built this myself in a day with INSERT_SUGGESTED_LIBRARY_HERE”? Well, yes. <span class="kaomoji">( ⚆ _ ⚆ )</span>

Sometimes there are things out of your control. And that's okay. But in those instances you are able to influence technical decisions, I think is more important during the assessment process is to ask the following questions:

<ul>
  <li class="no-margin">Are there preferred technologies used within the organisation?</li>
  <li class="no-margin">How is big is your application and how is it structured?</li>
  <li class="no-margin">Are there cases where code is contributed by new developers often?</li>
  <li class="no-margin">Who is responsible for the maintenance and development of new components or pages on the application?</li>
  <ul>
    <li class="no-margin">Is it a small team of full-time developers overseeing the entire project?</li>
    <li class="no-margin">Is it numerous teams responsible for their own respective set of components and pages?</li>
    <li class="no-margin">What is the overall CSS skill level of the developers contributing to the codebase?</li>
    <li class="no-margin">What is the overall React skill level of the developers contributing to the codebase?</li>
  </ul>
  <li>How flexible does the design system need to be? Can a small set of components cater for most of the use cases? Or do bespoke requirements come up a lot?</li>
</ul>

On-boarding folks onto a new codebase is not a trivial matter. And it does help if we can articulate and document the reasons behind why certain decisions were made. Having this “paper trail” will also make it easier to clear off technical debt, especially if something was done due to a circumstance/constraint that no longer exists.

## Wrapping up

Well, that's about all I have for now. If you thought that CSS is just a simple annoyance that's getting in your way of writing “real code”, you're probably not reading this article right now, eh? But seriously, I think CSS at scale is an interesting problem to reason about.

The future is impossible to predict. We do need to find a balance between trying to cater for all possible scenarios versus building for the most obvious use-case.

In a large organisation, it's common for us to focus only on our small part, but we do need an awareness of the bigger picture to ensure our decisions don't cause major problems down the road.
