---
date: 2021-05-08T13:53:22+08:00
images: 
- /assets/images/posts/vertical-2021.jpg
tags:
- devtools
- css
title: "Debugging vertical layouts in 2021"
---
This blog has been around for more than 7 years. Where has the time gone? I first started messing around with vertical layouts after discovering the existence of `writing-mode`. It was a “cannot unsee” life event that happened around 5 years ago?

CSS had seen a number of milestones in the last 5 years, and we are so much better equipped to build layouts today. When I take a moment to look back, I find myself appreciating all the work done to push CSS forward even more. With the DevTools updates that came out last month, I've decided to revisit my favourite demo once again: [CSS grid in vertical writing mode](https://huijing.github.io/demos/grids-vertical/)

Feel free to try it out with whichever DevTools you have on hand (I understand that not everyone has 9 browsers installed on their machine).

This was the second iteration of a vertical writing demo that used CSS grid for layout. In 2016, I did **not** use Grid for this because DevTools was kinda broken when `writing-mode` was set to `vertical-rl`. And trying to debug using just my imagination gave me a headache.

Considering the scale of the web, I think use of vertical writing is still fairly tiny, and perhaps that may be why bugs related to vertical writing tend to exist. Time for a quick test of debugging vertical layouts with 2021 DevTools.

## Firefox Devtools

Even before doing any verification, I was fairly confident Firefox Devtools would perform admirably for the Grid test. I say this because I had checked when the team fixed all the related bugs for this issue:
- [Support RTL and Vertical Writing Modes in the Grid Inspector](https://bugzilla.mozilla.org/show_bug.cgi?id=1303171)
- [Rotate grid line numbers when writing modes / RTL are used](https://bugzilla.mozilla.org/show_bug.cgi?id=1430916)
- [Rotate grid outline in Layout panel when writing modes / RTL are used](https://bugzilla.mozilla.org/show_bug.cgi?id=1430918)
- [Enable writing mode / RTL support for Grid Inspector](https://bugzilla.mozilla.org/show_bug.cgi?id=1430919)

So unless the team introduced some regression bugs, I would expect no issues at all.

Moment of truth!

<img srcset="/assets/images/posts/grid-vertical/dt-ffgrid-480.png 480w, /assets/images/posts/grid-vertical/dt-ffgrid-640.png 640w, /assets/images/posts/grid-vertical/dt-ffgrid-960.png 960w, /assets/images/posts/grid-vertical/dt-ffgrid-1280.png 1280w" sizes="(max-width: 400px) 100vw, (max-width: 960px) 75vw, 640px" src="/assets/images/posts/grid-vertical/dt-ffgrid-640.png" alt="Firefox Grid inspector overlay on a vertical layout">

Beautiful. The overlay doesn't affect scrolling at all, the line numbers are labelled correctly. Just the way I expected things to work. Certified fresh!

As for the Flexbox inspector, there aren't that many moving parts that could break due to bugs. The calculations are most probably taken from the actual browser calculations so as long as the browser is sizing the flex items correctly, the layout tool will report the correct size as well.

<img srcset="/assets/images/posts/grid-vertical/dt-ff-flex-480.png 480w, /assets/images/posts/grid-vertical/dt-ff-flex-640.png 640w, /assets/images/posts/grid-vertical/dt-ff-flex-960.png 960w, /assets/images/posts/grid-vertical/dt-ff-flex-1280.png 1280w" sizes="(max-width: 400px) 100vw, (max-width: 960px) 75vw, 640px" src="/assets/images/posts/grid-vertical/dt-ff-flex-640.png" alt="Firefox Flex inspector overlay on a vertical layout">

I guess if I wanted to nitpick this, it would be nice if the shape of the flex item rectangle looks similar to that of the rendered flex item. Or maybe a direction indicator might be nice to have. That being said, I'm fine with the current Flexbox inspector as it is.

Also, not directly related to Devtools but CSS logical properties is the total hotness, my friends! Specifically, logical properties for sizing. I should probably do a dedicated post on why logical properties are a godsend for layouts that are not in the default left-to-right, top-to-bottom flow.

## Chrome Devtools

Honestly, I didn't expect it to work as well in Chrome, because even when Firefox first released its Grid inspector, support for vertical and RTL layouts wasn't great. So given that Chrome only released their enhanced Grid inspector late last year, I expected some buggy behaviour.

Okay, let's give it a shot.

<figure>
    <figcaption>Hmmm, something is a little bit off here…</figcaption>
    <video src="/assets/videos/dt-chrome-bug.mp4" controls autoplay loop></video>
</figure>

Scrolling with the overlay active was a little janky, and the overlay lines are off-kilter. Again, this is not unexpected. And when I checked the Chromium bug tracker, lo and behold, someone already filed the issue: [Issue 1203251: Grid overlay is misplaced for CSS grids with a vertical writing mode](https://bugs.chromium.org/p/chromium/issues/detail?id=1203251&q=devtools%20grid&can=2).

Please do me a favour and star this issue! It's not a guarantee that this will make the bug get fixed immediately, but it is a signal that folks care about this working correctly.

Time to give Chrome's new Flexbox inspector a spin as well. The overlay looked fine, so nothing much to say there. I was very fond of the Alignment tool and for the most part, it seemed to work okay. But as I was messing around, I found a pretty obscure “blink-and-you-might-miss-it” bug.

<figure>
    <figcaption>Wait a minute… did my text just get left behind?</figcaption>
    <video src="/assets/videos/dt-chrome-flex-bug.mp4" controls autoplay loop></video>
</figure>

I did log a bug on the Chromium bug tracker, if anyone is interested. [Issue 1206903: Alignment tool causes incorrect rendering for vertical layout](https://bugs.chromium.org/p/chromium/issues/detail?id=1206903). I think my issue is related to this one: [Issue 1120156: CSS Grid `align-items: end;` with vertical `writing-mode` doesn't work properly in a Flexbox](https://bugs.chromium.org/p/chromium/issues/detail?id=1120156).

And in the process to trying to document the bug properly, I found another weird behaviour for Flex items in a `vertical-rl` environment in Chrome (or Chromium, since Edge has this issue as well).

<figure>
    <figcaption>Hey, why is my text lagging?</figcaption>
    <video src="/assets/videos/chrome-flex-bug.mp4" controls autoplay loop></video>
</figure>

If I were to describe this in words, it would be, when the document is in `vertical-rl` mode, content within a flex item does not respond to viewport resizing on the x-axis.

I wonder if all these issues are somehow related. But I also raised a separate issue to document my specific use-case. [Issue 1206914: Content within flex item renders incorrectly when writing-mode is vertical-rl](https://bugs.chromium.org/p/chromium/issues/detail?id=1206914)

## Safari Devtools

Safari's Grid inspector in Devtools is even newer than Chrome's, and technically haven't been released yet, since it is only in Safari Technology Preview at the moment. I suppose this is the best time to test it out.

Let's see how this goes:

<img srcset="/assets/images/posts/grid-vertical/dt-webkit-bug-480.png 480w, /assets/images/posts/grid-vertical/dt-webkit-bug-640.png 640w, /assets/images/posts/grid-vertical/dt-webkit-bug-960.png 960w, /assets/images/posts/grid-vertical/dt-webkit-bug-1280.png 1280w" sizes="(max-width: 400px) 100vw, (max-width: 960px) 75vw, 640px" src="/assets/images/posts/grid-vertical/dt-webkit-bug-640.png" alt="Safari TP 123 Grid inspector overlay on a vertical layout">

Okay, something is a little off at the moment. Scrolling performance with the overlays active was fine, but the line numbers do not respect the writing-mode direction, and the overlay wasn't accurately positioned over the grid element either.

But I went over to [Webkit's bug tracker](https://bugs.webkit.org/) and found: [Bug 224051 - Web Inspector: Grid overlay does not honor writing modes and RTL layout direction](https://bugs.webkit.org/show_bug.cgi?id=224051). It appears that the issue had been flagged and fixed, so I'm guessing the next Safari Technology Preview release would contain this fix. <span class="emoji" role="img" tabindex="0" aria-label="rocket">&#x1F680;</span>

*Update!*  
*The bug has been fixed and resolved in Safari 124. Updating here because I just got the version bump. What a difference a day makes <span class="emoji" role="img" tabindex="0" aria-label="person dancing">&#x1F483;</span>.*

<img srcset="/assets/images/posts/grid-vertical/dt-safari-fix-480.png 480w, /assets/images/posts/grid-vertical/dt-safari-fix-640.png 640w, /assets/images/posts/grid-vertical/dt-safari-fix-960.png 960w, /assets/images/posts/grid-vertical/dt-safari-fix-1280.png 1280w" sizes="(max-width: 400px) 100vw, (max-width: 960px) 75vw, 640px" src="/assets/images/posts/grid-vertical/dt-safari-fix-640.png" alt="Safari TP 124 Grid inspector overlay on a vertical layout">

## Wrapping up

Hokay, it's time to wrap up “Hui Jing breaks things yet again” segment. I want to say thank you to all the browser engineers who are busy fixing all these bugs and working hard to make the web a better experience for all of us. <span class="emoji" role="img" tabindex="0" aria-label="person bowing">&#x1F647;&#x200D;&#x2640;&#xFE0F;</span>

<em><small>Credits: OG:image from <a href="https://www.instagram.com/p/B9iEXx6hJzh/">alto0908 on Instagram</a></small></em>
