---
date: 2023-11-17T14:53:51+08:00
hastweet: true
images:
  - /assets/images/posts/wut-is-dis.jpg
tags:
  - devlife
title: "Back from blogging hiatus? Maybe…"
---

What is with a sudden publication of blog posts after a seemingly indefinite hiatus? I have no answer except that I do things when I feel like it. More specifically, I do things that are not mandatory (like my job) when I feel like it. That's why I still have one.

Speaking of jobs, to be honest, ever since the pandemic started in 2020, I've been keeping a relatively low profile. Partly because I felt that a gazillion people were having a hard time because of it, but I was extremely lucky to retain gainful employment throughout that time.

So I just didn't feel like announcing to the whole world my employment status, you know what I mean? I was with Shopify for 3 years until they laid me off in May this year. Then I got picked up by the [Interledger Foundation](https://interledger.org/). And now [Alex Lakatos](https://alexlakatos.com/about/) is my boss.

{{<img4w filename="posts/wut-is-dis/bossman" filetype="jpg" alt="Myself and the Boss Man">}}

I bet he regrets this hiring decision. But at least I'm reasonably competent at my job, which is building websites and making them pretty. So the bills are still getting paid. Thanks, bossman. Fun fact, he is still using the theme I helped create from 3 years ago (go click on the avocado on his profile photo in the About page).

## So how's life?

This blog has been around for quite a long time. I've never changed the domain name, nor have I changed the site's design. The only major change was migrating from Jekyll to Hugo. But I still like my site design after all these years so that's that.

There have been a couple of career “checkpoint” posts, [the last one](/blog/1827-days-working-on-the-web) was written in 2018. I passed the 10-year mark of being a salaried web developer last month to absolutely no fanfare.

I must say I'm pretty happy working at the Interledger Foundation right now because I literally get to build websites as my main job (AWS is very unfortunately part of the deal, me sad). We are open source by nature, so everything is viewable on Github (me likey).

The premise of Interledger is to make sending payments as easy as sending an email. Interledger is a global interoperable network for financial services that implement [the Interledger Protocol](https://interledger.org/developers/rfcs/interledger-protocol/).

If you never met me, I think a relatively accurate idea of how I am as a person can be summarised by [my AirBnb reviews](https://www.airbnb.com.sg/users/show/16527790) (the most common descriptor is “clean/tidy”) and feedback from conference talks.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Catching up on the talks I&#39;ve missed, <a href="https://twitter.com/hj_chen?ref_src=twsrc%5Etfw">@hj_chen</a> opening talk so funny, I laugh til die, almost. But got learn new things. Moral of story, i18n is hard: Use a library please, check the numbers in CJK languages, and talk to your designers about the font stack for diff languages.</p>&mdash; Shi Ling (@taishiling) <a href="https://twitter.com/taishiling/status/1684925855200694272?ref_src=twsrc%5Etfw">July 28, 2023</a></blockquote>

So it seems like to some people, I'm reasonably entertaining, and also, I like to keep things organised. Therefore, it should come as no surprise that I standardised all our documentation sites to use [Starlight](https://starlight.astro.build/getting-started/), which is built on [Astro](https://docs.astro.build/en/getting-started/).

## Astro is your shiny new toy, huh?

Well, in a way, yes. I'm currently at 7 Astro sites, 6 of which are Starlight (the other one isn't for docs). It's been fun learning the ins and outs of what it can do, largely because the [documentation](https://docs.astro.build/en/getting-started/) is great, and the [Discord community](https://astro.build/chat) is amazing.

The [developers section](https://interledger.org/developers/) of the Interledger website, [Rafiki documentation](https://rafiki.dev/), [OpenPayments documentation](https://openpayments.guide/) and [Web Monetization documentation](https://webmonetization.org/) are all running on Starlight. I did not build the main Interledger.org, that is a different story which I may tell later. We'll see.

There's a lot more work to be done off this stable foundation of docs we're trying to build out but it's a good start I think. If you're curious about our family of docs, here's the [meta docs site](https://interledger.tech/) about the docs sites.

The interoperability of Astro with the most popular framework components is pretty cool as I've managed to port over React components from the previous implementation and have things work just fine. It does depend heavily on your use-case, but for mine, rewriting all the presentational React components to Astro felt great.

I did hold onto the React components that needed interactivity and state management but we do documentation, not some future-altering magical app that needs multi-dimensional data binding or whatever.

Making my beautiful tech writers' lives easier, now that's what I care about. I'm happy being the mechanism that the content writers and designers use to convert their output into a website. If there are particularly notable ways to implement something, I might write about it.

Or not. I'm very lazy.

Words are hard.

My team is great though. And we got to meet in person multiple times this year. That's more than I could say for my previous team.

{{<img4w filename="posts/wut-is-dis/tech-team" filetype="jpg" alt="The Interledger tech team">}}

## See you around, maybe…

There might be more blog posts soon, or not-so-soon. I don't plan my life. Who knows, I might be dead tomorrow (hopefully not, the handover will be chaotic since I haven't documented everything properly yet). But in the meantime, we'd love it if you took some time to learn more about Interledger and its ecosystem.

- [Rafiki](https://rafiki.dev/introduction/overview/): open source software that allows an Account Servicing Entity to enable Interledger functionality on its users’ accounts
- [OpenPayments](https://openpayments.guide/introduction/overview/): an open RESTful API and API standard that enables clients to interface with Open Payments-enabled accounts
- [Web Monetization](https://webmonetization.org/docs/): a proposed standard that allows your visitors to pay an amount of their choosing with little to no user interaction by enabling a website to automatically signal to web browsers that it can accept payments

Stay safe, and remember to conserve water <span class="emoji" role="img" tabindex="0" aria-label="droplet">&#x1F4A7;</span> and electricity <span class="emoji" role="img" tabindex="0" aria-label="high voltage">&#x26A1;</span>!
