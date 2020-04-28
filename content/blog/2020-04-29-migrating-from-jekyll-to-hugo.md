---
date: "2020-04-29T00:00:00Z"
draft: true
images: 
- /assets/images/posts/css-i18n.jpg
tags:
- hugo
- netlify
title: Migrating from Jekyll to Hugo
---
After 1992 days on Jekyll hosted on GitHub Pages, all the nonsense I have published on my website is now being built on Hugo hosted on Netlify. I still love Jekyll, I mean, it was the first static-site generator I ever used. I even [spoke at JekyllConf](https://youtu.be/CERXESTZ5w4) last year, so yeah, always a spot in my heart.

I suppose the question most people would ask is, why switch? It was a multitude of little things which added up to push me over the edge. I've contemplated making the switch as early as 2017 when quite a few folks I knew were moving over from Jekyll to Hugo.

But I was comfortable with Jekyll, and I also poured in a lot of hours customising features with data files, adding tags (which was convoluted when I started with 2.5.1, okay?) and so on. Back in the days during my first job, I was a consultant on a major bank's core system replacement. It was a 20-year-old heavily customised beast, and nobody wanted to do the replacement. Until they had to.

This website is not even a tiny fraction of the scope of that project, but I now truly understand the psychology behind letting the beast continue to grow over the years. It's a trade-off, because the more effort you sink into the current system, the more painful the migration will be. Eventually.

When I did the migration, there were 186 posts. 186! That is a lot of shit I wrote over the years. Most of it just ramblings and brain dumps. Well, I laid in the bed I made, didn't I? By the time I got to about 100 posts (probably around 2017), the build was really starting to slow. I could sort of live with it though (the slowness was gradual).

Jekyll eventually introduced incremental builds, which gave me more reason to stay put. A large part of it was also because the site was hosted on GitHub Pages, and GitHub Pages played best with Jekyll. Recently I found out that there was [no plan to support Jekyll 4](https://github.com/github/pages-gem/issues/651), at least, not with the current [pages-gem](https://github.com/github/pages-gem).

The kicker for me was [this issue](https://github.com/jekyll/jekyll/issues/7947) causing a flurry of deprecation warnings on Ruby 2.7 every time I tried to run the site locally. The solution was to wait for the 4.1 release, which would never happen on GitHub Pages.

A smarter person would probably have just upgraded to the latest Jekyll and moved hosting to Netlify, but I'm stooooopid. Also, you know how newly hired football managers feel compelled to make some big moves? Same mindset. Go big or GO HOME! (Or stay home, this happened during the COVID-19 pandemic, readers from the far future).

## Research first, actual work later

To be fair, I had done the research portion before. I just never got PAST that phase. At some point I always just threw my hands up and said, too much work kthxbye. But not this time. So I dug up [Sara Souidan's migration article](https://www.sarasoueidan.com/blog/jekyll-ghpages-to-hugo-netlify/) again and actually tried to follow it.

