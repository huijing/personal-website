---
date: 2022-06-22T10:50:11+08:00
draft: true
hastweet: true
images:
- /assets/images/posts/XX/XX.jpg
tags:
- css
title: "Can we enterprise CSS grid?"
---
Regardless of whether the title of this blog post is grammatically correct or not, this is a question that I've had the opportunity to tackle recently. And after meeting and chatting with a bunch of CSS folks at [CSS Day](https://cssday.nl/2022), I figured it'd be a good time to organise my thoughts around this topic.

I am known to be long-winded. <span class="kaomoji">¯\\\_(ツ)_/¯</span> You have been warned.

So, CSS grid has been supported in major browsers for around 5 years now. And back even before it shipped, [Jen Simmons](https://jensimmons.com/) had this to say:

<blockquote class="twitter-tweet" data-conversation="none"><p lang="en" dir="ltr">You don’t need a framework to use CSS Grid. CSS Grid *is* a framework. — says <a href="https://twitter.com/rachelandrew?ref_src=twsrc%5Etfw">@rachelandrew</a>, about to be ruthlessly copied by me</p>&mdash; Jen Simmons (@jensimmons) <a href="https://twitter.com/jensimmons/status/771019489915891712?ref_src=twsrc%5Etfw">August 31, 2016</a></blockquote>

Personally, I very much agree with her. CSS grid was developed to tackle the use-case of web applications. If you go to [1.1. Background and Motivation]() of the CSS Grid Layout Module Level 1 specification, it clearly states:

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

@media screen and (min-width: 320px) {
  .grid {
    grid-template-columns: repeat(8, 1fr);
    margin-left: 30px;
    margin-right: 30px;
  }
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

