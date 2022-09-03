---
date: 2022-09-03T10:50:07+08:00
draft: true
images: 
- /assets/images/posts/XX/XX.jpg
tags:
title: "So your designer wants stuff to overlap"
---
I started my first full-time web developer job back in September of 2013 (not counting the period where I built random sites for random people). So it's kind of like my 9 year anniversary of being able to earn a stable living by building on the web. Thanks, Sir Tim Berners-Lee.

Throughout these 9 years, I have encountered quite a good number of designs that involve overlapping elements. Both directly and indirectly. I can already hear you frown and ask, “what do you mean, indirectly?”, hang on, I'm getting there.

Everything on the web is boxes, quadrilateral boxes (i.e. having 4 straight sides), to be precise. Boxes stacked atop boxes next to boxes nested within boxes. You get the picture. Even if your content doesn't take up the entire box, the browser still recognises and lays out your bits of content as boxes.

*boxie fam*

Before 2017, if you wanted your content to overlap, you had multiple options but all of them were tricky to implement. Especially if you wanted the design to look good at every possible viewport size. What happened in 2017, you might be asking? Well, Grid was rolled out in one of the most coordinated feature releases the web had ever seen.

*grid calendar*

To me, Grid is the perfect solution for building designs with overlap. But before we get into the fun stuff, let's remember what we had to do before Grid came along.

## Legacy option #1: Absolute positioning

## Legacy option #2: Negative margins

## Legacy option #3: Translate using transform

## My favourite option: Grid
