---
date: 2024-03-05T08:37:11+08:00
images:
  - /assets/images/posts/web-direct.jpg
tags:
  - css
  - html
  - design
  - devlife
title: "The value of live web design"
---

Over the years, I've regularly seen blog posts or articles talking about "should designers code?" (less of "should developers learn design?" <span class="emoji" role="img" tabindex="0" aria-label="person shrugging">&#x1F937;</span>). I even chimed in with a tangential [opinion piece back in the day](/blog/a-better-web-design-process). Tangential because I never said designers should code. Haha.

What I found is that after 9 years, my experiences have not changed my opinion back then. Namely:

> An ideal web design process involves close collaboration between the users, designers and developers.

I also think I was a better writer back then. My brain has deteriorated since, and it's just all downhill from here. Oh well. Age.

Maybe better isn't a good descriptor, but I think I tended to write about how I wished things would be, and that aspiration translated into stronger language?

## Less aspiration, more implementation

If you look at my job title and scope today, you'll see that I'm still building websites. The difference is, I can build them more polished in less time. And I've also amassed experience across a large variety of projects with different industries, budgets and people.

I might be more jaded and less opinionated about the little things now, i.e. “I still don't like Tailwind, but I can write it the way it was intended if it pays my bills”, but I've also become more grateful when pleasant situations arise.

My pleasant situation is my main team at work these days. I technically am not part of any dedicated project team, and more like a CSS/frontend janitor that goes around the whole place wherever something needs tidying. But I do work a lot with our talented designer, [Madalina Tantareanu](https://www.madalinatantareanu.com/).

I say designer, but that doesn't accurately describe her talent. She's an artist and illustrator, who has helped us craft and create numerous visual assets, as well as our recent new visual branding.

Our work process is what makes my job so pleasant these days. And I'm definitely not saying that everyone should work like this. I'm fairly sure it works because we both serendipitously have a similar way of thinking and visualising about designs.

## Real-time design discussions in the browser

As a fully remote organisation, we're always working together via video calls, usually Slack huddles. Whenever there's a new request or design idea, we literally do the discussion and evaluation part live in the browser. From straight-forward things like font size and colour changes, to more complex things like layout adjustments.

I guess all that time spent building layout demos and speaking about devtools in the past did have actual job benefits because I can now move things around the web page almost at the same speed as someone moving bits around in a Figma file. And we can immediately resize the browser to see how the content flows.

Personally, after all these years, I can more or less already tell how some content is going to look like on a browser at specific widths (just purely due to experience) but I fully understand that this is not a given for most normal people. After all, normal people do not resize their browser a thousand times a day.

Which is why being able to immediately show people why something doesn't work or recommend an alternative, directly in the browser, is so convincing and time-saving.

We have lots of different projects, so the actual approach is a mix between making the change in devtools and updating the code base directly. It depends if my local machine version matches the production/staging content or not.

## Most common scenarios

I'm trying to think about the most common things I adjust in the browser and what CSS properties I mess around with most. In other words, CSS properties that helps if you know like the back of your hand.

1. **Flex** and **grid**  
   I often make layout changes when we add a new element to the component, so `justify-*` and `align-*` as well as the `flex` properties get adjusted a lot. Knowing how the HTML should be structured also plays into this.
1. **Background**  
   Bet you didn't expect this one, but I do make a lot of `background-*` adjustments to see how our choices of photography or illustrations play out, especially in combination with text content.
1. **Shadows** and **gradients**  
   Did I memorise the syntax? Of course not. That's what devtools is for. But gradients are a big part of our visual brand, so [OKLCH](https://oklch.com/) for the win! Really makes a big quality difference. Shadows are generally nice for adding some visual depth, but again, depends on your visual direction.
1. **Text-related** tweaks  
   This is more edge-case tweaking, like when I'm discussing with the team, then squish the viewport really small and realise we overflow because of that single long word in the headline. So the `white-space`, `hyphens` and others for typography come in handy to quickly resolve the problem so we can focus on the actual design stuff.
1. **Logical properties**  
   I've converted to logical properties for all my projects so `block-*` and `inline-*` folks!

Generally, these cover most of the ideas that get thrown around as we build out the required pages. It also helps that Madalina can also tweak and update her illustrations real quick and send over the SVGs so we can see how things shape up in the same meeting.

Because we're all not in the same timezone, the efficiency of this style of working really shines through even more. Like I stated earlier, I'm definitely NOT saying that everyone should work like this. I'm just saying, I feel blessed that I can work like this.

## The point is communicating ideas well

These days, to me, it doesn't really matter whether someone can do or knows all the web design things any more. I put more onus on myself to explain the reasons why certain approaches work better than others, and make my recommendations accordingly.

I'm not sure what the other folks who work with me think, but I do try my best to say yes to most ideas because honestly, CSS and Javascript has evolved to a point where making beautiful things on web pages requires less effort than before.

The upside is that, when I really do say no, folks are more inclined to be receptive of my explanation of why not. I guess it's that over time, there is a trust that builds up where people understand that I'm not rejecting the proposal on some personal whims.

And what worked for me most of the time, is showing in real-time what things look like in the browser, for good and for bad. I find that this shortens the discussion time quite a bit (but maybe it's also because I'm working with very reasonable team mates), and we make decisions without too much back and forth.

## Wrapping up

I guess I'm just enamoured with having web design discussions directly in the browser because, in my mind, that's the best way to approach building anything that lives in the browser. And to work with a team that's so receptive to this concept is really the cherry on top of a delicious cake.

Mmmmm, cake… <span class="emoji" role="img" tabindex="0" aria-label="shortcake">&#x1F370;</span>
