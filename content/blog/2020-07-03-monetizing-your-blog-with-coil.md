---
date: 2020-07-03T22:16:41+08:00
images:
- /assets/images/posts/monetize-site.jpg
monetise: true
tags:
- web-monetization
title: "Monetizing Your Blog With Coil"
---
I've had quite a bit on my plate lately, a sort of bit-off-more-than-I-could-chew situation, which is not an uncommon occurrence for me. Which is why, amid all the excitement about building up [webmonetization.dev](https://webmonetization.dev/), learning more about the underlying technology and so on, I was reminded that I had yet to implement web monetization on my own site.

<figure>
    <figcaption>Pretty much my face when I realised…</figcaption>
    <img alt="Jellyfish blob emoji with sweat drop" src="/assets/images/posts/web-monetization/sweat.png">
</figure>

However, I'm very glad to announce that, even though I spent a lot of time digging into the technology documents, articles and talks around web monetization and interledger, the actual implementation of it on my own site took less than a fraction of the time.

The bulk of the set up involved registering an account with the relevant services so you could have a payment pointer that you would put in the `<head>` of your site. My content is this blog, which is simply a static site (which made it reasonably straightforward to implement Web Monetization).

## Who's who in the world of Web Monetization

[Web Monetization](https://webmonetization.org/) is a **Javascript browser API** which allows the creation of a payment stream from the user agent to the website. This is what it says on the website. But what that means is that you can passively generate income by implementing a meta tag on your site.

This payment stream runs on the [Interledger Protocol](https://interledger.org/), which is an open protocol suite, analogous to TCP/IP. Instead of data packets, this protocol handles the routing of payment packets. So far, these 2 commonly seen terms are referring to the technology.

So then, what is [Coil](https://coil.com/)? It is a San Francisco based startup that provides a platform for creators to get paid for their content. Their current product is a flat-rate subscription **for consumers** to support their favourite content creators with payouts made via Web Monetization.

The difference between Coil and platforms like Patreon or Buy me a coffee is that you don't have to pick which creators you want to pay. With your monthly subscription to Coil, you are free to browser any creators' content and Coil will pay them accordingly.

On the creator side (e.g. myself), your Coil account is free. You don't have to pay Coil to use web monetization because it is not tied to any corporation or entity. It is simply a meta tag which contains your payment pointer. Coil will ask you for your payment pointer so it knows where to send you payments.

It is natural to associate Coil with this technology because right now, they seem to be the only folks using it, but hopefully in the near future, there will be more platforms that utilise web monetization as well.

[Grant for the Web](https://www.grantfortheweb.org/) is a fund. To be more precise, it is a $100M fund to promote web monetization by encouraging open, fair and inclusive standards as well as innovation in this space.

## Setting up the required accounts

Even though you don't need a Coil subscription as a creator, you do need a payment pointer and a free creator account. And for that, you need a digital wallet that supports the Interledger Protocol. For now, there are 3 providers listed on the documentation, namely [Uphold](https://www.uphold.com/signup), [Gatehub](https://gatehub.net/) and [Stronghold](https://stronghold.co/real-time-payments#coil).

<img srcset="/assets/images/posts/web-monetization/coil-480.jpg 480w, /assets/images/posts/web-monetization/coil-640.jpg 640w, /assets/images/posts/web-monetization/coil-960.jpg 960w, /assets/images/posts/web-monetization/coil-1280.jpg 1280w" sizes="(max-width: 400px) 100vw, (max-width: 960px) 75vw, 640px" src="/assets/images/posts/web-monetization/coil-640.jpg" alt="Screen showing wallet provider options when you first sign up for Coil account">

I am currently based in Singapore and ideally would like a fuss-free way to get Singapore dollars (SGD). That's why I went with Uphold, because it supports a rather wide range of currencies and commodities, including Singapore dollars.

My only complaint with Uphold at the moment is that lots of things that I'm used to self-serve, like updating my full name and changing my email address, requires you to raise a support ticket. But maybe this will change once they get more users? Who knows…

Coil is currently working on their documentation and you can check it out at the [Coil Help Center](https://help.coil.com/). If you're a creator trying to monetize your site, you should go to the section on [Digital wallet accounts & payment pointers](https://help.coil.com/accounts/digital-wallets-payment-pointers).

Links to the 3 wallet providers I mentioned are available there, and no matter who you choose, you should end up with a [payment pointer](https://paymentpointers.org/). There are very detailed step-by-step instructions for each of the wallet providers, so I won't repeat them here. Here's the one for [Uphold](https://help.coil.com/accounts/digital-wallets-payment-pointers/uphold).

Once you have your payment pointer, Coil will ask you to enter it as part of the registration process. This is so they can help you generate the requisite meta tag to put in the `head` of your website. That can be found later under the *Monetize content* section of your account page.

Coil also offers the option to post content on their site, either as a full blog post or a link to wherever else your content might be hosted. If the link you're posting is not web monetized, Coil will let you know to include the requisite meta tag.

<img srcset="/assets/images/posts/web-monetization/notify-480.jpg 480w, /assets/images/posts/web-monetization/notify-640.jpg 640w, /assets/images/posts/web-monetization/notify-960.jpg 960w, /assets/images/posts/web-monetization/notify-1280.jpg 1280w" sizes="(max-width: 400px) 100vw, (max-width: 960px) 75vw, 640px" src="/assets/images/posts/web-monetization/notify-640.jpg" alt="Notification message from Coil informing that the link you are posting is not web monetized">

## Monetize your content

If you have a website or blog, copy the generated meta tag and include it in your site. Regardless of whether you have full control of the structure of your site, or you are using some service like Wix, as long as you can add a custom meta tag to your site, you will be good to go.

There are also numerous plugins and integrations folks in the community have created and shared so I suggest searching for “YOUR_TECH_STACK web monetization” on Google and see what hits you get.

For my blog, which is a Hugo-generated static site, I added this line to the *head* partial of my base layout:

```html
<meta name="monetization" content="$ilp.uphold.com/UHgjUa7kRNJF" />
```

That's it really. One line in the `head` of your website. I had never monetized anything on my site before ever since its inception in 2013, so it was pretty cool to get a notification saying that I got 3 cents from the Interledger Protocol.

I have since amassed a grand total of 43 cents, and I think it's amazing. Will I get rich from this? Probably not in the near future, but hey, I hadn't earned a cent for the past 6 years, so 43 cents is amazing.

<img srcset="/assets/images/posts/web-monetization/uphold-480.jpg 480w, /assets/images/posts/web-monetization/uphold-640.jpg 640w, /assets/images/posts/web-monetization/uphold-960.jpg 960w, /assets/images/posts/web-monetization/uphold-1280.jpg 1280w" sizes="(max-width: 400px) 100vw, (max-width: 960px) 75vw, 640px" src="/assets/images/posts/web-monetization/uphold-640.jpg" alt="Activity page on Uphold showing all the transactions to date">

To be fair, the biggest reason I never got into including ads on my blog is simply because my design/layout doesn't have any spare room for ads. Also, it would totally ruin the overall theme of my site to have ads to begin with. Web monetization doesn't have these issues, so I'm very happy to add it to my site.

## Wrapping up

I am currently working on writing up content for [A Guide to Web Monetization](https://webmonetization.dev/), which basically is trying to fill the gap for information most relevant to content creators who want to use web monetisation. If there is anything you are interested or have questions about, feel free to reach out. I'd love to hear what type of information is most useful to you.

<em><small>Credits: OG:image from <a href="https://www.instagram.com/p/CCDvuKUB2uN/">framereim on Instagram</a></small></em>
