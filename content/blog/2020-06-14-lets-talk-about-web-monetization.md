---
date: "2020-06-14T00:00:00Z"
hastweet: true
tags:
- web-monetization
title: Let's talk about Web Monetization
---
Some of you may have been seeing some buzz around the [Web Monetization API](https://webmonetization.org/) recently, especially if you hang out on [DEV.to](https://dev.to/) quite a bit. Perhaps you've seen mentions of “[Grant for the Web](https://www.grantfortheweb.org/)”, “[Coil](https://coil.com/)” or “[Interledger](https://interledger.org/)” among many other names and terms and are trying to make sense of it all. Let me try to lay it all out for you.

I'll be honest, the first time I heard about Web Monetization was at View Source 2019 when I met [Christopher Lawrence](https://www.linkedin.com/in/chrislarry/) for a chat over coffee. He shared with me what [Grant for the Web](https://www.grantfortheweb.org/) was all about and what they wanted to achieve. And that's how I eventually got involved as one of the ambassadors for the program.

The concept of an alternative to ads for content creators to earn money sounded intriguing. For the longest time, there were not that many options to earn money for content you put on the web. You could either ask folks to pay you for your content somehow via payment platforms or subscriptions or you could place ads all over your site.

## Let's rewind back a couple of years

In October 2015, [Stefan Thomas](https://twitter.com/justmoon) and [Evan Schwartz](https://twitter.com/_emschwartz) released a whitepaper titled [A Protocol for Interledger Payments](https://interledger.org/interledger.pdf) which proposed a protocol for payments across payment systems by enabling secure transfers between ledgers. At the time, both gentlemen were part of [Ripple](https://ripple.com/), at enterprise blockchain company founded in 2012.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Read the <a href="https://twitter.com/hashtag/Interledger?src=hash&amp;ref_src=twsrc%5Etfw">#Interledger</a> white paper for a more thorough exploration of our protocol: <a href="http://t.co/qxDkHVIZgq">http://t.co/qxDkHVIZgq</a></p>&mdash; Interledger Protocol 💸 (@Interledger) <a href="https://twitter.com/Interledger/status/651474220304564224?ref_src=twsrc%5Etfw">October 6, 2015</a></blockquote>

The [Interledger Project](https://interledger.org/) itself is open-source and **not** tied to any single company, blockchain or currency. [Interledger](https://interledger.org/overview.html#what-is-interledger) itself is a network of computers that enable the sending of value across independent payment networks, and the [Interledger Protocol](https://interledger.org/rfcs/0027-interledger-protocol-4/) defines how it all works.

Along with the publication of the whitepaper, [Adrian Hope-Bailie](https://twitter.com/ahopebailie), also proposed the [Interledger Payments Community Group](https://www.w3.org/community/interledger/) at the W3C. As commerce moves increasingly to the web, the W3C has a vested interest in developing open standards for web payments and security by getting those with interest and knowledge involved with the W3C.

[Web Payments Activity](https://www.w3.org/Payments/) at the W3C's main focus is to develop web standards for APIs that increase the convenience and security of Web Payments. There are two working groups and multiple community groups who are involved in this endeavour, Interledger Payments among them.

## And then we get to 2019

In August 2019, Adrian Hope-Bailie proposed the [Web Monetization API](https://discourse.wicg.io/t/proposal-web-monetization-a-new-revenue-model-for-the-web/3785) on the [WICG Discourse](https://discourse.wicg.io/). It is a Javascript browser API that allows the creation of a payment stream from the user agent to the website. Web Monetization depends on two critical technologies to work, the aforementioned *Interledger protocol* and something called *payment pointers*.

[Payment pointers](https://paymentpointers.org/) are a standardised identifier for payment accounts which resolve to a URL that can be used to discover available [Open Payment](https://openpayments.dev/) endpoints for interacting with the account. Open Payments is an application level protocol **built on top of** the Interledger protocol.

<p class="no-margin">Here's the list of specifications that have been mentioned so far:</p>
<ul>
    <li class="no-margin"><a href="https://interledger.org/rfcs/0027-interledger-protocol-4/draft-9.html">Interledger Protocol V4</a></li>
    <li class="no-margin"><a href="https://paymentpointers.org/">Payment Pointers</a>, <a href="https://w3c.github.io/webpayments/proposals/interledger/">W3C Interledger Payment Method Unofficial Draft</a></li>
    <li class="no-margin"><a href="https://docs.openpayments.dev/introduction">Open Payments</a></li>
    <li><a href="https://webmonetization.org/docs/api">Web Monetization</a>, <a href="https://webmonetization.org/specification.html">W3C Community Group Draft Report</a></li>
</ul>

## Why are you talking about Web Monetization?

I'm one of the [Grant for the Web Ambassadors](https://www.grantfortheweb.org/post/ambassadors-hj-chen-and-cris-beasley) and if you poke around the stuff I do, you'll find that I pretty much do standard web developer things.

Since I'm reasonably competent at that, I figured I would document the whole process of implementing the Web Monetization API, explain how the ecosystem works and basically build out a comprehensive guide to web monetization.

Which means, yes, of course, I'm building a website. I **really like** building websites. It's like totally my jam. I mean, I *could* draw a zine or something, but nah, I'll leave that up to all the way more artistic folks out there.

I just got the site up and running and will be working on content, design and layout all in “real-time” moving forward, and you can check it out at [https://webmonetization.dev/](https://webmonetization.dev/).

<img srcset="/assets/images/posts/web-monetization/website-480.png 480w, /assets/images/posts/web-monetization/website-640.png 640w, /assets/images/posts/web-monetization/website-960.png 960w, /assets/images/posts/web-monetization/website-1280.png 1280w" sizes="(max-width: 400px) 100vw, (max-width: 960px) 75vw, 640px" src="/assets/images/posts/web-monetization/website-640.png" alt="Home page of webmonetization.dev">

The site is built with [Eleventy](https://www.11ty.dev/) <span class="emoji" role="img" tabindex="0" aria-label="red heart">&#x2764;&#xFE0F;</span>, and its source code is on [GitHub](https://github.com/huijing/webmonetization). If you find anything broken, feel free to raise an issue, or even better, submit a pull request. You can also let me know what content would be useful to you.

