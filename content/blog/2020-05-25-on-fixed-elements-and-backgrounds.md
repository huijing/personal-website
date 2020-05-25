---
date: 2020-05-25T20:40:20+08:00
hascodepen: true
tags:
- css
title: "On fixed elements and backgrounds"
---
I thought this was going to be a short-ish note on fixed positioning and jank, but as with almost everything I write, it grew into a long-ish post about containing blocks, rendering and scroll performance.

The original point of writing this was to remind myself that whenever I want to fix the position of anything on a web page, performance considerations must be **top-of-mind**. It wasn't like I didn't *know*, I just wasn't actively thinking about it.

*\*cue look of disapproval from webperf folk everywhere\** <span class="kaomoji">ಠ_ಠ</span>

But then it spiralled off into other things, so I'm moving the conclusions up to the top, and if anyone is interested in the whys, you can read on after that.

## TL:DR the practical bits

If you have a fixed element on your page, which means it doesn't move when you scroll, you might realise that it no longer acts fixed if you apply a CSS filter on its nearest ancestor.

Go ahead, try it on the Codepen.

<p class="codepen" data-height="400" data-theme-id="9162" data-default-tab="result" data-user="huijing" data-slug-hash="wvKZJQa" data-pen-title="Fixed positioning and CSS filters">
  <span>See the Pen <a href="https://codepen.io/huijing/pen/wvKZJQa">
  Fixed positioning and CSS filters</a> by Chen Hui Jing (<a href="https://codepen.io/huijing">@huijing</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

This is because applying a `filter` on the fixed element's immediate parent makes it becoming the containing block instead of the viewport. I encountered this when I was trying to archive v1 of my website.

I wanted to keep everything exactly the same but with a grey-scale filter applied so it would look, well you know, archived. The website has a un-performant dark mode toggle that is an immediate child of the `body` element.

It was positioned in the bottom left corner of the viewport with `position: fixed`. I thought the most efficient one-line fix was to apply `filter: grayscale(1);` on the `body` element, but that unfixed my toggle.

In the end I applied the filter to the header, main and footer separately so the toggle wasn't affected by this. This is **not** a bug, it's a legitimate feature, please read on if you want to know more.

Also, if you plan to have fixed backgrounds on your site, try using a pseudo-element to house the image instead of using `background-attachment: fixed` for better scrolling performance.

I was dealing with a more than 3-year-old procrastination series of blog posts, which I decided to move into [a site of its own](https://zh-typography.commons.host/). Because a new site means a new layout and design to build. Yes, I'm still procrastinating the actual writing part.

Anyway, I wanted some fixed decorative elements on the site to fill up excess space on either side of the text for large viewport widths. If you came across and remember [Chris Ruppel](https://www.fourkitchens.com/blog/article/fix-scrolling-performance-css-will-change-property/)'s article on the `will-change` property, this will look familiar.

Instead of doing something like this:

```css
main {
  background: url('/some-beautiful-image.png') no-repeat center center;
  background-attachment: fixed;
  background-size: cover;
}
```

Do something like this:

```css
main::before {
  content: '';
  position: fixed;
  width: 100%;
  height: 100%;
  background: url('/some-beautiful-image.png') no-repeat center center;
  background-attachment: fixed;
  background-size: cover;
  will-change: transform;
  z-index: -1;
}
```

Paul Lewis explained in [Using Chrome DevTools to profile the jsconf.eu site](https://www.youtube.com/watch?v=QU1JAW5LRKU) (somewhere around the 2.30 mark) that `background-attachment: fixed` causes a paint operation whenever you scroll.

The solution brings the background image in question into its own layer, so when the main content is being scrolled, it does not have to constantly be repainted.

`will-change` should **not** be rampantly used all over your site though. Refer to [Sara Soueidan](https://twitter.com/sarasoueidan)'s [Everything You Need to Know About the CSS will-change Property](https://dev.opera.com/articles/css-will-change-property/).

You can stop here and go do something more useful with your life at this point. Everything after here is my rabbit-hole research. You have been warned.

## The containing block

Oh, you're still here? Okay then, let's talk a bit about how fixed positioning works in the context of browser rendering. Boxes are always positioned **relative to a containing block**. If there isn't one explicitly defined, that containing block is the viewport.

Understanding how the containing block works is very useful when it comes to troubleshooting your CSS positioning woes. A recommended resource for this is [Layout and the containing block](https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block) on the [MDN web docs](https://developer.mozilla.org/en-US/).

A box's `position` property determines what it's containing block will be. `static` (which is the default value), `relative` and `sticky` uses the nearest ancestor element's content box. This ancestor must be either a block container, or has established a formatting context.

`absolute` uses the nearest ancestor element's padding box. This ancestor must have a `position` value of anything other than `static`. If you've ever wondered why people toss in a `position: relative` on a parent element to “trap” a child element within itself.

Now, we come to `fixed`. A fixed box usually uses the viewport as its containing block. Common use-case for this is sticky headers or footers, where we usually slap on `position: fixed` on those elements and call it a day.

*However*, there are situations where the containing block is the nearest ancestor's padding box. This only occurs when the ancestor fulfils any of the following conditions:
1. A `transform` or `perspective` value other than `none`
2. A `will-change` value of `transform` or `perspective`
3. A `filter` value other than `none`
4. A `will-change` value of `filter` (only for Firefox)
5. A `contain` value of `paint`

To better understand why, let's segue into some browser internals. Just superficially. Because I'm as far away from being a browser engineer as I am from living on the moon. <span class="emoji" role="img" tabindex="0" aria-label="first-quarter moon">&#x1F313;</span>

## Browser rendering

My favourite explanation of how a CSS engine works is by [Lin Clark](https://twitter.com/linclark) in [Inside a super fast CSS engine: Quantum CSS (aka Stylo)](https://hacks.mozilla.org/2017/08/inside-a-super-fast-css-engine-quantum-css-aka-stylo/), so do check that out. Generally, all CSS engines go through the process of parse → style → layout → paint → composite & render.

<img src="/assets/images/posts/css-positioning/css-engine.svg" alt="Steps every CSS engines take">

For a really in-depth look into how browser internals work, I recommend [Tali Garsiel](https://taligarsiel.com/)'s [How Browsers Work: Behind the scenes of modern web browsers](https://www.html5rocks.com/en/tutorials/internals/howbrowserswork/#Layout).

Other than the DOM tree, browsers also construct a render tree, which represents where elements should go on a page based on information like width, height and position, and how it should look. Every CSS property value is calculated for every element in the document.

Layout involves the computation of position and size of all the boxes. Paint renders the boxes (with all their visual styles) as pixels on your screen. This can happen on multiple layers. Composite mushes the layers together, applies compositor-only styles then renders it all on the screen.

Keep in mind this is a very simplified description. I don't think “mush” is a technical term.

Have you ever heard folks say there are certain CSS properties that are “safe” to animate, and others that are not? If you haven't, please refer to [High Performance Animations](https://www.html5rocks.com/en/tutorials/speed/high-performance-animations/).

The TL:DR of that article is that if you have to animate something, use either `transform` or `opacity` wherever possible. These are the compositor-only properties. Everything else is more expensive. Think of the above diagram as those toddler toy stacking ring things.

<img src="/assets/images/posts/css-positioning/stacking-toy.jpg" srcset="/assets/images/posts/css-positioning/stacking-toy@2x.jpg 2x" alt="Stacking wooden toy thingy">

Rendering is more or less sequential, so when I say expensive, think about how you would replace one of these rings. If compositing happens again, that's all the browser has to do. But as you go earlier in the sequence, the browser has to do more work.

<img src="/assets/images/posts/css-positioning/stacking.svg" alt="Effort required">

So properties like `position`, `display`, and even `font-size` will trigger layout. Properties like `color` or `background-position` will trigger paint. As of time of writing, only `transform`s and `opacity` are fully handled by the compositor. You can check the full list at [http://goo.gl/lPVJY6](http://goo.gl/lPVJY6).

Having work being handled by the compositor helps performance because modern browsers have two threads of execution, main and compositor. Layout and paint is done on the main thread while the compositing and rendering is done on the compositor thread, by the GPU.

The main thread is very busy. It has a lot of stuff to calculate. But it's pretty good at that, much power, all compute. GPUs aren't that great at quick computation, but they are great at drawing stuff.

Drawing pixels to the screen? No problem. Drawing the same bitmap of pixels to the screen repeatedly? Piece of cake. Transforming that same bitmap of pixels into different positions, rotations or scale? Easy-peasy-lemon-squeezy.

By now, some of you might be like, omg when is she gonna get to the point??

We-ll… the point was covered at the beginning of this post.

So let's talk about scrolling!

## Scroll performance

Have you wondered what happens when you scroll a page? Doesn't it feel like there are magical elves rotating a long ream of content, like those player piano things?

<img srcset="/assets/images/posts/css-positioning/piano-480.jpg 480w, /assets/images/posts/css-positioning/piano-640.jpg 640w, /assets/images/posts/css-positioning/piano-960.jpg 960w, /assets/images/posts/css-positioning/piano-1280.jpg 1280w" sizes="(max-width: 400px) 100vw, (max-width: 960px) 75vw, 640px" src="/assets/images/posts/css-positioning/piano-640.jpg" alt="Vintage player piano">

As Paul Lewis explains in [Avoiding Unnecessary Paints](https://www.html5rocks.com/en/tutorials/speed/unnecessary-paints/), every time you scroll up or down a browser, content needs to be repainted before it appears on screen. And paint work will affect performance.

I did the opposite of burying the lede earlier, so you would have realised (if had read the first part) why `background-attachment: fixed` performs much worse than if you moved the background image to its own layer and fixed that instead. Minimal repainting. That's what it does.

That being said, I'm not sure how much browser have since improved and optimised the rendering process and if that has made some of these techniques obsolete? I'd like to think they still help, because we have yet to see any radical changes in the rendering process.

Would love for someone to tell me more about rendering performance in today's latest browsers. *\*hint, hint\**

## Wrapping up

I think I should stop here for now. I've already read through the design document for [GPU accelerated compositing in Chrome](http://www.chromium.org/developers/design-documents/gpu-accelerated-compositing-in-chrome) and probably need to extricate myself from this rabbit hole. Don't worry, I find rendering most fascinating and will definitely revisit this again.

## References

<ul>
    <li class="no-margin"><a href="https://www.w3.org/TR/css-position-3/#def-cb">CSS Positioned Layout Module Level 3</a></li>
    <li class="no-margin"><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block">Layout and the containing block</a></li>
    <li class="no-margin"><a href="https://www.html5rocks.com/en/tutorials/internals/howbrowserswork/#Layout">How Browsers Work: Behind the scenes of modern web browsers</a></li>
    <li class="no-margin"><a href="https://www.html5rocks.com/en/tutorials/speed/scrolling/">Scrolling Performance</a></li>
    <li class="no-margin"><a href="https://www.html5rocks.com/en/tutorials/speed/unnecessary-paints/">Avoiding Unnecessary Paints</a></li>
    <li class="no-margin"><a href="https://blogs.adobe.com/webplatform/2014/03/18/css-animations-and-transitions-performance/">CSS animations and transitions performance: looking inside the browser</a></li>
    <li class="no-margin"><a href="https://dev.opera.com/articles/css-will-change-property/">Everything You Need to Know About the CSS will-change Property</a></li>
    <li class="no-margin"><a href="https://www.fourkitchens.com/blog/article/fix-scrolling-performance-css-will-change-property/">Fix scrolling performance with CSS will-change property</a></li>
    <li><a href="https://dassur.ma/things/forcing-layers/">Layers and how to force them </a></li>
</ul>
