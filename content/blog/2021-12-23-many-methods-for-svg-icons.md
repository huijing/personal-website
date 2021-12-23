---
date: 2021-12-23T13:53:22+08:00
hascodepen: true
tags:
- svg
- css
title: "The many methods for using SVG icons"
---
Recently at work, I ran into a situation where we had to revisit how SVG icons were being implemented on our pages. And that gave me the opportunity to dig into the myriad of options we have for doing so. I thought this was worth documenting for future me (and maybe some of you who actually read this blog), because there are a LOT of options.

## As a pseudo-element via CSS

```css
.a-cleverly-named-css-class {
  /* bunch of pretty styles, oh wow */
  &::after {
    content: url('./some_icon.svg');
    display: block;
    height: 1.5em;
    width: 1.5em;
  }
}
```
    
This is good for icons that do not require modifications to the SVG itself (i.e. different colour?). If you look at the styles in the example above, we can modify the icon's positioning and sizing but we will not be able to change the icon itself. The FAQ accordion uses this method at the moment.

## As a background-image on pseudo-element via CSS

This is almost exactly the same thing as option 1 except that instead of using the SVG directly as the `content`, we attach it using `background-image` to the pseudo-element instead.

```css
.a-cleverly-named-css-class {
  /* bunch of pretty styles, oh wow */
  &::after {
    content: '';
    display: block;
    height: 1.5em;
    width: 1.5em;
    background-image: url('./some_icon.svg');
    background-position: initial;
    background-size: initial;
    background-repeat: initial;
  }
}
```

This does allow slightly more control over the image because then you would have access to `background-position`, `background-size` etc. This approach does allow you to do what was usually done for sprite sheets, where all the icons were in a single image file.

Developers then specified the "coordinates" of each icon based on the `background-position` and maybe `background-size` depending on the icon being specified.

The main issue with both CSS approaches is that you cannot change the colour of the icon via CSS. There might be cases where your icons need to appear in different contexts, where they need to match different colours of content for example.

If you are using monochrome icons, there is a solution to this. Some people might think this is hacky but I think it's kinda smart. The trick here is using CSS filters to get just the right shade you want. And no, I cannot write the filters by hand, but there's this filter calculator by [Barrett Sonntag](https://twitter.com/bsonntag) that can do it for us.

<p class="codepen" data-height="440" data-default-tab="result" data-slug-hash="Pjoqqp" data-preview="true" data-user="sosuke" style="height: 440px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/sosuke/pen/Pjoqqp">
  CSS filter generator to convert from black to target hex color</a> by Barrett Sonntag (<a href="https://codepen.io/sosuke">@sosuke</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

You may or may not get the exact shade that you're looking for, but odds are if you run the thing enough times, you can get something that's close enough.

## Inline SVG rendered on the page itself
    
```html
<a href="https://namu.wiki/w/Redd">
  음색 요정 휘인의 첫 번째 미니앨범 [Redd]
  <svg viewBox="0 0 24 24"><path d="M21 12.424V11a9 9 0 0 0-18 0v1.424A5 5 0 0 0 5 22a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2v-1a7 7 0 0 1 14 0v1a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 5 5 0 0 0 2-9.576ZM5 20a3 3 0 0 1 0-6Zm14 0v-6a3 3 0 0 1 0 6Z"/></svg>
</a>
```

This approach allows us to modify the icon itself via CSS because `svg` and `path` are accessible to us via this inline approach. This might be fine for SVG files that have reasonably short path data but would litter the markup if more complicated SVGs are required. But it does allow very granular control with CSS classes.

If you needed to animate the SVG, this is a pretty good option. But if you really don't want to have the markup be so messy, another approach to inline SVG is via the `use` attribute, which allows you to reference an SVG shape from elsewhere in the file.

You can also choose to place the SVG file somewhere else in your document and just reference the identifier. For multiple SVG icons, they can each be symbols without the main SVG element, and referenced with the hash symbol. This makes the markup much neater.

```html
<!-- This is rendered but hidden with CSS -->
<svg xmlns="http://www.w3.org/2000/svg">
  <symbol id="icon-headphones" viewBox="0 0 24 24">
    <path d="M21 12.424V11a9 9 0 0 0-18 0v1.424A5 5 0 0 0 5 22a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2v-1a7 7 0 0 1 14 0v1a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 5 5 0 0 0 2-9.576ZM5 20a3 3 0 0 1 0-6Zm14 0v-6a3 3 0 0 1 0 6Z"/>
  </symbol>
</svg>
<!-- Totally invisible, you're not supposed to know it's here… -->

<a href="https://namu.wiki/w/Redd">
  음색 요정 휘인의 첫 번째 미니앨범 [Redd]
  <svg class="icon__headphones" aria-hidden="true" focusable="false">
    <use href="#icon-headphones"></use>
  </svg>
</a>
```

Regardless of how the inline SVG is implemented, this seems to be the preferred approach because it gives us full control over the styling of the icon.

## As an externally referenced image file

The last option is to reference the SVG from an external file altogether. You might be thinking, isn't this the same as the first option where you won't be able to change anything on the SVG? Well, turns out there are *some* things that are possible.

Let's say the icons are all in an SVG file named *icons.svg*.

```xml
<svg xmlns="http://www.w3.org/2000/svg">
  <symbol id="icon-headphones" viewBox="0 0 24 24">
    <path d="M21 12.424V11a9 9 0 0 0-18 0v1.424A5 5 0 0 0 5 22a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2v-1a7 7 0 0 1 14 0v1a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 5 5 0 0 0 2-9.576ZM5 20a3 3 0 0 1 0-6Zm14 0v-6a3 3 0 0 1 0 6Z"/>
  </symbol>
</svg>
```

It is possible to reference this external SVG file like so:

```html
<a href="https://namu.wiki/w/Redd">
  음색 요정 휘인의 첫 번째 미니앨범 [Redd]
  <svg class="icon__headphones" aria-hidden="true" focusable="false">
    <use href="icons.svg#icon-headphones"></use>
  </svg>
</a>
```

Changing the colour of the icon via CSS is do-able because the fill property cascades in through the shadow DOM boundary as long as there is no existing fill attribute on the paths in the file, but you wouldn't be able to modify individual paths like in the second option.

The benefit of this approach is that the external file can be cached for performance gains, and if your use case only requires mono-coloured icons, this is a pretty good approach. But if you have multi-coloured icons, then you're out of luck, and would probably have to use the second option.

Learned about this approach from [SVG \`use\` with External Reference, Take 2](https://css-tricks.com/svg-use-with-external-reference-take-2/) by [Chris Coyier](https://chriscoyier.net/) and ended up going for this approach in my project.

One thing to note is there might be CORS issues if you are serving assets from a different URL from your web page: [Understanding CORS and SVG](https://oreillymedia.github.io/Using_SVG/extras/ch10-cors.html). This is a problem I'm going to be facing, so we'll see how that goes.

## As a mask layer with `mask-image`

After I wrote up these methods, I read [Which SVG technique performs best for way too many icons? ](https://cloudfour.com/thinks/svg-icon-stress-test/) by [Tyler Sticka](https://tylersticka.com/) and learned about the [mask-image](https://developer.mozilla.org/en-US/docs/Web/CSS/mask-image) approach.

This is the CSS property that allows us to set an image as the mask layer for an element. So I guess this kind of falls into the first 2 categories of using CSS to do it, because I would most likely do this with pseudo-elements as well.

```css
.a-cleverly-named-css-class {
  /* bunch of pretty styles, oh wow */
  &::before {
    -webkit-mask-image: url('./some_icon.svg');
    mask-image: url('./some_icon.svg');
    background-color: forestgreen;
    height: 1.5em;
    width: 1.5em;
  }
}
```

## Wrapping up

Given there are so many methods to implement the same thing, hopefully there is a technique available that suits your particular situation and use-case. Anywayz, stay safe, my friends! <span class="emoji" role="img" tabindex="0" aria-label="face with medical mask">&#x1F637;</span>
