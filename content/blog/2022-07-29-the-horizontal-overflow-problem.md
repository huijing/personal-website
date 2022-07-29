---
date: 2022-07-29T12:35:59+08:00
hascodepen: true
images:
- /assets/images/posts/horizontal-overflow.jpg
tags:
- css
title: "The horizontal overflow problem"
---
My good friend, [Wei](https://wgea.io/), has a pet peeve: unintended horizontal over-scrolling on mobile. Which is very different from intentional horizontal scrolling on mobile. Anyway, we thought it was worth a discussion, from why this phenomenon exists to how we can do our best to avoid it.

As you can see, I have chosen the reasonably “loose” phrase “do our best”. This is because there will inevitably be some edge cases where a trade-off needs to be made on whether to just let things be. We'll talk about those as well.

## But did you test it at all?

But first, let's go with the broad strokes situation of simply not testing at a narrow enough viewport. The last I checked, Firefox stops at `435px`, Chrome stops at `500px` and Safari stops at `559px`. That is, if you have your Devtools in a separate window.

If you dock your Devtools to the left or right of your viewport, then you can shrink the viewport down to near `0px` if you really wanted to. So the tip here is, dock your Devtools for testing narrow viewports. Or you could, I don't know, ACTUALLY test on a narrow mobile device?

<img src="/assets/images/posts/horizontal-overflow/mobile-devtools.png" srcset="/assets/images/posts/horizontal-overflow/mobile-devtools@2x.png 2x" alt="Mobile Chrome Devtools" />

For what it's worth, my phone is a Realme 3 Pro which is still happily chugging along, and it has a viewport width of `360px`. Also, according to [iOS resolution](https://www.ios-resolution.com/), even the iPhone 13 has a logical width of `390px`, so dock those Devtools, I say.

## Fine, it's overflowing. Now what?

Well, since you already have those Devtools open, that's already starting on the solution, eh? A common cause is having items in your layout that are fixed width or have some min-width value that ends up larger than your viewport width at that point in time.

If you have a really long page and can't really figure out what the offending element is, try scrolling all the way to the right and scroll from the top to bottom and see if you can find any bits sticking out. Make the viewport narrower than is reasonable so it's more obvious.

Once you've managed to locate said element with an unshrinkable width, you need to ask yourself if you REALLY need that minimum width on the item itself, or is it still okay to have some shrinkage beyond that set width.

Say you're very firm on not having the item shrink beyond the designated width. Not to worry, you still have options. Quite a few, to be honest. Let's first set up a scenario. The problem is occurring on a 3 column grid where items have a `min-width: 180px` applied.

### Let the browser do it

First option, you could consider ditching the `min-width` on the item, then apply that value into the `minmax()` function for your column width, and let the browser figure out how many columns you need instead.

```css
.grid {
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}
```

The downside of this is, you can't control how many columns you get at different viewports. Is this something you can live with? If so, cool. If not, let's think of something else. Because even though the minimum width is accounted for, perhaps the item sizes when the column count first changes is too big for your liking.

### You do it yourself

Okay, in that case, maybe what you'd like is a little more control. You can always add a breakpoint and tweak things from there. <span class="kaomoji">¯\\\_(ツ)_/¯</span>

```css
.grid-s2 {
  grid-template-columns: repeat(2, 1fr);
}

@media screen and (min-width: 30em) {
  .grid-s2 {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### Break the words? Maybe…?

Maybe your issue isn't even width values at all. It's the fact that you have some really long word in the item that the browser won't break. Because the browser respects words like that. The intricacies of line-breaking and word-breaking are deep and complicated. Also very interesting. I recommend watching [Line breaking and related properties from CSS Text](https://youtu.be/hXP0M7Um1dI) by [Florian Rivoal](https://florian.rivoal.net/cv.html).

Anyways, if the offending string is a URL, then there are even less qualms about breaking that up (IMHO, feel free to disagree). The property you are looking for is `word-break: break-all`, and its an inheritable property so you can choose to put it on the grid container or the grid item, up to you.

```css
.grid {
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  word-break: break-all;
}
```

What about hyphenation? Is that even a thing in CSS? Well, the answer is kinda sort of? If you haven't watched the video linked above yet, there's a section on hyphenation at the 15.16 minute mark which I'm linking here so you don't have to scrub: [The hyphens property](https://youtu.be/hXP0M7Um1dI?t=916).

By default, hyphenation is set to `manual`, which means that you are responsible for the hyphens themselves. For visible hyphens use `U+2010` or `&dash;`, while for invisible hyphens, use `U+00AD` or `&shy;`. This approach only makes sense if you have absolute control over the content and markup.

Often, the content is not even written by you, can you even coordinate all your content writers to use `&shy;` in their writing? What if you're using markdown? Then your content will end up being littered with a weird mix of HTML and markdown? Tricky, tricky.

Browsers can do automatic hyphenation, but you must have the `lang` attribute set correctly. Incorrect hyphenation makes the text really difficult to read. Browsers use dictionaries to figure out when hyphenations need to kick in, so tell your browser what language your content is in.

Browser support for hyphens has improved since Florian's talk, so this is a viable option. But if the word happens to not be in the dictionary, well, no hyphens for you then. The CSS you're looking for is `hyphens` like so:

```css
.grid {
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  hyphens: auto;
}
```

### Intentional overscroll

Okay, so you hate all the options and want your original implementation to stay. I have a proposal to counter the “let things be” argument right here. Localised your overscroll to the impacted content only. In other words, move the overscroll from the scope of the entire page down to your long-ish content.

You'll need an extra wrapper around the markup for this, but the CSS is just one line.

```html
<div class="grid-scroll-wrapper">
    <div class="grid">
      <!-- All your lovely long items ¯\_(ツ)_/¯ -->
  </div>
</div>
```

```css
.grid-scroll-wrapper {
  overflow-x: scroll;
}

.grid {
  grid-template-columns: repeat(3, 1fr);
}
```

Depending on where your content gets cut-off, you could even consider this an affordance to encourage people to try to scroll the thing.

If you want to see all the discussed solutions in action, here's a handy Codepen.

<p class="codepen" data-height="406" data-default-tab="result" data-slug-hash="mdxyRgV" data-user="huijing" style="height: 406px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/huijing/pen/mdxyRgV">
  The horizontal overflow problem</a> by Chen Hui Jing (<a href="https://codepen.io/huijing">@huijing</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

## Wrapping up

Our conclusion to this issue is that the case of unintentional horizontal overflow on mobile really can be avoided with a litle bit more care and awareness that the problem exists. There are many ways to solve problems in CSS, and that's a huge plus, not something to be annoyed about.

Anyway, if you actually do have a “let things be and overscroll the page” use-case, do let us know. I'd like to broaden my horizons to edge cases I've never heard of.
