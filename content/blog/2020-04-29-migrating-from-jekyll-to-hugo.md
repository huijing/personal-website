---
date: "2020-04-29T00:00:00Z"
hastweet: true
images: 
- /assets/images/posts/migrate-hugo.jpg
tags:
- hugo
- netlify
title: Migrating from Jekyll to Hugo
---
After 1992 days on Jekyll hosted on GitHub Pages, all the nonsense I have published on my website is now being built on Hugo hosted on Netlify. I still love Jekyll, I mean, it was the first static-site generator I ever used. I even [spoke at JekyllConf](https://youtu.be/CERXESTZ5w4) last year, so yeah, always a spot in my heart.

*Warning: this post is so long. So so long. There is practical stuff in it, I promise. But maybe use the search function. Or just scroll through to find what's relevant. I use headers, if that helps.*

I suppose the question most people would ask is, why switch? It was a multitude of little things which added up to push me over the edge. I've contemplated making the switch as early as 2017 when quite a few folks I knew were moving over from Jekyll to Hugo.

But I was comfortable with Jekyll, and I also poured in a lot of hours customising features with data files, adding tags (which was convoluted when I started with 2.5.1, okay?) and so on. Back in the days during my first job, I was a consultant on a major bank's core system replacement. It was a 20-year-old heavily customised beast, and nobody wanted to do the replacement. Until they had to.

This website is not even a tiny fraction of the scope of that project, but I now truly understand the psychology behind letting the beast continue to grow over the years. It's a trade-off, because the more effort you sink into the current system, the more painful the migration will be. Eventually.

When I did the migration, there were 186 posts. 186! That is a lot of shit I wrote over the years. Most of it just ramblings and brain dumps. Well, I laid in the bed I made, didn't I? By the time I got to about 100 posts (probably around 2017), the build was really starting to slow. I could sort of live with it though (the slowness was gradual).

Jekyll eventually introduced incremental builds, which gave me more reason to stay put. A large part of it was also because the site was hosted on GitHub Pages, and GitHub Pages played best with Jekyll. Recently I found out that there was [no plan to support Jekyll 4](https://github.com/github/pages-gem/issues/651), at least, not with the current [pages-gem](https://github.com/github/pages-gem).

The kicker for me was [this issue](https://github.com/jekyll/jekyll/issues/7947) causing a flurry of deprecation warnings on Ruby 2.7 every time I tried to run the site locally. The solution was to wait for the 4.1 release, which would never happen on GitHub Pages.

A smarter person would probably have just upgraded to the latest Jekyll and moved hosting to Netlify, but I'm stooooopid. Also, you know how newly hired football managers feel compelled to make some big moves? Same mindset. Go big or GO HOME! (Or stay home, this happened during the COVID-19 pandemic, readers from the far future).

## Research first, actual work later

To be fair, I had done the research portion before. I just never got PAST that phase. At some point I always just threw my hands up and said, too much work kthxbye. But not this time. So I dug up [Sara Souidan's migration article](https://www.sarasoueidan.com/blog/jekyll-ghpages-to-hugo-netlify/) again and actually tried to follow it. Please read that first. It's much better written than this.

First things first, install Hugo. I use a Mac for development work, so [Homebrew](https://brew.sh/) is my package manager of choice. Apparently it works for Linux, but I never tried.

```bash
brew install hugo
```

Hugo has an `import` option, so I ran that as the next step, after creating a blank folder as the migration destination. (`jing` is my Jekyll source, and `migrate` is the destination)

```bash
mkdir migrate
hugo import jekyll jing migrate
```

If all went well, you should see the following output in your terminal.

```bash
Importing...
Congratulations! 186 post(s) imported!
Now, start Hugo by yourself:
$ git clone https://github.com/spf13/herring-cove.git migrate/themes/herring-cove
$ cd migrate
$ hugo server --theme=herring-cove
```
Here's a comparison of the two project folders, left one being Jekyll and right one being Hugo.

<img src="/assets/images/posts/migrate-hugo/folder.png" srcset="/assets/images/posts/migrate-hugo/folder@2x.png 2x" alt="Jekyll project folder structure versus Hugo project folder structure">

The migration populated only two folders, *content* and *static*. All my posts went into a *post* folder in *content* and some of the stuff in my root folder went into *static*. Not too bad. I tried just running `hugo server` without a theme. Bad idea.

You get a whole bunch of warnings in the terminal (way more than what I'm showing below). The server will run, but your browser will render NOTHING.

```bash
Building sites … WARN 2020/04/29 12:39:49 found no layout file for "HTML" for kind "page": You should create a template file which matches Hugo Layouts Lookup Rules for this combination.
WARN 2020/04/29 12:39:49 found no layout file for "HTML" for kind "page": You should create a template file which matches Hugo Layouts Lookup Rules for this combination.
WARN 2020/04/29 12:39:49 found no layout file for "HTML" for kind "page": You should create a template file which matches Hugo Layouts Lookup Rules for this combination.
WARN 2020/04/29 12:39:49 found no layout file for "HTML" for kind "page": You should create a template file which matches Hugo Layouts Lookup Rules for this combination.
WARN 2020/04/29 12:39:49 found no layout file for "HTML" for kind "page": You should create a template file which matches Hugo Layouts Lookup Rules for this combination.
```

Sara's post also highlights the importance of getting the [template lookup rules](https://gohugo.io/templates/lookup-order/) right for your pages to render correctly, and I spent quite a bit of time on it as well. So something to take note of.

I continued with Sara's post and after setting up Hugo, she touches upon the Hugo configuration file. You can use `.toml` but I went with `.yml` because I was lazy to rewrite the format from Jekyll. This is what Hugo starts you off with:

```yaml
baseURL: https://www.chenhuijing.com
disablePathToLower: true
languageCode: en-us
title: Chen Hui Jing
```

I recommend going through the Hugo's [Site Variables](https://gohugo.io/variables/site/) documentation to figure out what you need in yours. When using Jekyll I had two configuration files, `_config.yml` for production and `_config_dev.yml` for development.

For Hugo, the configuration files are put in the *config* folder, further broken down into the *_default* and *production* folders. The *config* folder is not created by default, and is only required if you have multiple configuration files. If you only have the one, keep it in the root folder and carry on.

## Template migration

This was half the work. And to serve as documentation to my future self, I'm noting down all the one-to-one functionality matching in case I want to subject myself to another migration project in future. My audience for this post is really **myself**. You have been warned.

As of time of writing, Hugo is at version [0.69.2](https://github.com/gohugoio/hugo/releases/tag/v0.69.2), which supports the concept of a [base template](https://gohugo.io/templates/base/) that can be extended by blocks. This came in at `v0.63.0`.

First thing to do is to define a base template in the *layouts/_default/* folder called `baseof.html`. This is mine:

```html
<!DOCTYPE html>
<html lang="{{ .Site.LanguageCode }}">
  {{ partial "head.html" . }}
  <body>
    <div class="blender" id="blender"></div>
    <input type="checkbox" class="blend-checkbox" id="blendToggle">
    <label for="blendToggle" class="blend-toggle"></label>
    {{ partial "header.html" . }}

    <main class="content">
      {{ block "main" . }}{{ end }}
    </main>

    {{ partial "footer.html" . }}
    {{ partial "scripts.html" . }}
  </body>
</html>
```

The original base layout from Jekyll looked like this:

```html
{% include head.html %}

<body>
  <div class="blender" id="blender"></div>
  <input type="checkbox" class="blend-checkbox" id="blendToggle">
  <label for="blendToggle" class="blend-toggle"></label>
  {% include header.html %}

  <main class="content">
    {{ content }}
  </main>

  {% include footer.html %}
{% include foot.html %}
```

### Re-using HTML in many places

There was a bit of a restructuring of the partials like moving scripts to its own partial etc. but that's the general idea. So the first one-to-one mapping I learned was for modularising HTML to re-use on multiple pages:

<div class="note">
  <code>{% include FILE_NAME.html %}</code> maps to <code>{{ partial "FILE_NAME.html" }}</code>
</div>

I also use [Nunjucks](https://mozilla.github.io/nunjucks/) in my Eleventy projects and I feel Hugo's blocks are rather similar to Nunjucks'. Jekyll lets you do inheritance by using the `layout` variable in your template's front matter, so I guess that's why they don't need blocks? I don't know.

With multiple HTML blocks of varying logic complexity in my *includes* folder, I started with the least complicated ones, i.e. those with no conditionals, just site variables. Like the `header.html` file. This is the Jekyll version:

```html
<header class="site-header">
  <div class="site-header__wrapper">
    <div class="site-branding">
      <a class="no-underline" href="{{ site.baseurl }}/"><span class="site-branding__image">Home</span></a>
      <div class="site-branding__wrapper">
        <h1 class="site-branding__title"><a class="no-underline" href="{{ site.baseurl }}/">{{ site.title }}</a></h1>
        <p class="site-branding__description">{{ site.description }}</p>
      </div>
    </div>

    <nav class="site-nav">
      <a class="site-nav__link no-underline" href="/about/">About</a>
      <a class="site-nav__link no-underline" href="/work/">Work</a>
      <a class="site-nav__link no-underline" href="/talks/">Talks</a>
      <a class="site-nav__link no-underline" href="/blog/">Blog</a>
    </nav>
  </div>
</header>
```

Which mapped to this Hugo version:

```html
<header class="site-header">
  <div class="site-header__wrapper">
    <div class="site-branding">
      <a class="no-underline" href="{{ .Site.BaseURL }}"><span class="site-branding__image">Home</span></a>
      <div class="site-branding__wrapper">
        <h1 class="site-branding__title"><a class="no-underline" href="{{ .Site.BaseURL }}">{{ .Site.Title }}</a></h1>
        <p class="site-branding__description">{{ .Site.Params.description }}</p>
      </div>
    </div>

    <nav class="site-nav">
      <a class="site-nav__link no-underline" href="/about/">About</a>
      <a class="site-nav__link no-underline" href="/work/">Work</a>
      <a class="site-nav__link no-underline" href="/talks/">Talks</a>
      <a class="site-nav__link no-underline" href="/blog/">Blog</a>
    </nav>
  </div>
</header>
```

Site variables are available in both Jekyll and Hugo. You can access them in Jekyll using `site.VARIABLE_NAME`. Jekyll does not differentiate between its own native site variables and those custom ones you defined yourself. But in Hugo, you would use `Site.VARIABLE_NAME` for the ones that Hugo natively supports or `Site.Params.VARIABLE_NAME` for those you define yourself in the configuration file.

<div class="note">
  <code>{{ site.VARIABLE_NAME }}</code> maps to <code>{{ Site.VARIABLE_NAME }}</code> or <code>{{ Site.Params.VARIABLE_NAME }}</code>
</div>

Take note of how the cases are dealt with, I spent an inordinate amount of time wondering why things refused to render only to realise I used the wrong case on my variable names. <span class="emoji" role="img" tabindex="0" aria-label="person facepalming">&#x1F926;</span>

### Conditionals in your templates

Conditionals themselves are not too tricky to wrap your head around, but HOW to implement them in the various templating languages, now that will send you on a Google trip all over the interwebs. So Jekyll uses Liquid as the templating language and it has its quirks, like `unless`. But every templating language has these. It's a matter of **figuring each of them out**.

Let's start with a condition in plain English: *if the content type is “post” and it has the variable “hascaniuse” in the front matter*.

In Jekyll, it looks like this:

```html
{% if page.is_post and page.hascaniuse %}
<!--Do something if condition is true-->
{% endif %}
```

In Hugo, it looks like this:

```html
{{ if (and (eq .Type "blog") (isset .Params "hascaniuse")) }}
<!--Do something if condition is true-->
{{ end }}
```

`page.is_post` came out the box with Jekyll so I never gave it a second thought. Even though the Hugo documentation mentions `.Type` returns you the content type of the page, I could not find how to equate its value to something. Until I found [this article on the `cond` function](https://kodify.net/hugo/functions/hugo-cond-function/), which had `eq` in its example.

<img src="/assets/images/posts/migrate-hugo/angry.jpg" srcset="/assets/images/posts/migrate-hugo/angry@2x.jpg 2x" alt="An angry Shiba puppy">

I only thought to refer to the [Go templating documentation](https://golang.org/pkg/text/template/) much much later.

*Page* and *Post* are recognised content types by Jekyll out the box. For Hugo, it feels more flexible, because you can either specify the `type` variable of a piece of content in the front matter or structure your content folder based on the content types you want.

For example, all my posts are in the *content/blog* folder, so the content type of each post is “blog”. Again, naming is important and exact. Singular means singular, plural means plural. Double-check your folder names if you don't want to add `type: blog` to 186 of your posts' front matter. More on this when I talk about list pages.

<div class="note">
  <code>{{ page.is_post }}</code> maps to <code>(eq .Type "YOUR_POST_TYPE")</code>
</div>

I also have front matter variables that only appear sporadically on certain posts, specifically posts with embedded tweets, CodePens or Can I Use tables. 

So if the post has a CodePen, in the front matter I would have `hascodepen: true`. In Jekyll, I'd do `{% page.hascodepen %}` as the condition, while in Hugo, the equivalent would be `(isset .Params "hascaniuse")`.

<div class="note">
  <code>{{ page.VARIABLE_NAME }}</code> maps to <code>(isset .Params "VARIABLE_NAME")</code>
</div>

### Hugo's internal templates

Once I figured that out (after too much Googling), the rest of the partials came over without too much trouble. I managed to shorten the `head.html` because Hugo has internal templates for Open Graph and Twitter meta tags, which I found pretty useful.

My Jekyll `head.html` was ridiculous. Most of it is probably unnecessary? I don't know. It's legacy, I can't remember why anymore.

```html
<meta content="{{ site.title }}" property="og:site_name">

{% if page.title %}
  <meta content="{{ page.title }}" property="og:title">
  <meta content="article" property="og:type">
{% else %}
  <meta content="{{ site.title }}" property="og:title">
  <meta content="website" property="og:type">
{% endif %}

{% if page.is_post %}
  {% if page.description %}
    <meta content="{{ page.description }}" property="og:description">
  {% else %}
    <meta content="{{ page.content | strip_html | truncatewords:20}}" property="og:description">
  {% endif %}

  {% if page.project %}
    <meta content="{{ site.url }}/assets/images/posts/projects/{{ page.image }}.png" property="og:image">
    <meta name="twitter:card" content="summary_large_image">
  {% endif %}
{% else %}
  <meta content="{{ site.description }}" property="og:description">
{% endif %}

{% if page.url %}
  <meta content="{{ site.url }}{{ page.url }}" property="og:url">
{% endif %}

{% if page.image %}
  {% unless page.project %}
    <meta content="{{ site.url }}/assets/images/posts/{{ page.image }}.jpg" property="og:image">
    <meta name="twitter:image" content="{{ site.url }}/assets/images/posts/{{ page.image }}.jpg" />
    <meta name="twitter:card" content="summary_large_image">
  {% endunless %}
{% else %}
  <meta content="{{ site.url }}/assets/images/avatar.jpg" property="og:image">
  <meta name="twitter:image" content="{{ site.url }}/assets/images/avatar.jpg" />
  <meta name="twitter:card" content="summary">
{% endif %}
```

Now, I just let Hugo handle it internally. Seems to work so far.

```html
{{ template "_internal/opengraph.html" . }}
{{ template "_internal/twitter_cards.html" . }}
```

### A single page in root, e.g. About

Okay, time for some actual content. I started with what I thought was the simplest page, the About page. It was a markdown file with some HTML thrown in because I wanted CSS classes on some things. I copied the `About.md` file over to the *content* folder 

After you have the `baseof.html`, you're not out of the woods yet. Your browser still renders NOTHING.

That's because you need a `single.html` file that acts as the actual page template for your single pages. Add that to the *layouts/_default/* folder as well. This is mine:

```html
{{ define "main" }}
<header class="page-header">
  <h1 class="page-header__title">{{ .Params.title }}</h1>
</header>

<div class="page-content">
  {{ .Content }}
</div>
{{ end }}
```

Which was ported over from this Jekyll version:

```html
---
layout: default
---
<header class="page-header">
  <h1 class="page-header__title">{{ page.title }}</h1>
</header>

<div class="page-content">
  {{ content }}
</div>
```

Page variables are available in both Jekyll and Hugo. They are defined in the content file's front matter. You can access them in Jekyll using `page.VARIABLE_NAME` but in Hugo, you would use `.VARIABLE_NAME` for the ones that Hugo natively supports or `.Params.VARIABLE_NAME` for those you define yourself in the front matter. Check the [Page Variables](https://gohugo.io/variables/page/) documentation to figure out which ones you need.

<div class="note">
  <code>{{ page.VARIABLE_NAME }}</code> maps to <code>{{ .VARIABLE_NAME }}</code> or <code>{{ .Params.VARIABLE_NAME }}</code>
</div>

The difference between Jekyll and Hugo is that you **cannot** access variables in your content files. So no `{{ VARIABLE }}` in your content file expecting it to be parsed and replaced accordingly. It will just render as is, curly braces and all. If you do need to somehow access your page variable, write [a custom shortcode](https://gohugo.io/templates/shortcode-templates/).

### List pages, e.g. home page or blog posts page

Pages with lists of content are their own thing in Hugo, and their template name is `list.html`. Earlier when I talked about naming the folder where all my posts lived to `blog`. This makes each of my posts have a `type` of `blog`. Hugo also does this thing called sections.

Sections are collections of pages that are defined according to the structure of your *content* folder. All first-level directories under *content/* are their own section. So my site has a section called `blog` because I have that folder in *content/*. If that didn't make sense, [docs](https://gohugo.io/content-management/sections/).

Also, keep the [Hugo's Lookup Order](https://gohugo.io/templates/lookup-order/) page open in some tab. You'll look at it a lot. For me, I went with `index.html` in the root of the *layouts* folder as the template specificity.

So in this sense, I felt Jekyll was a bit more straightforward. Because you were allowed to access template variables anywhere, the home page was `index.html` in the root of my project. But maybe it's neater to do it Hugo's way? I don't have strong opinions on this.

A list of content on the home page, that's like the most straightforward thing right? 

No.

I have logic in there, okay? So in plain English, the conditions are, if it is an external post, clicking the title leads out of the site to where the post lives. If it's a normal post, act normally. Each post also has tags, and when you click a tag it leads to a page that lists other posts with the same tag.

Without the tags bit, the listing logic looks like this on Jekyll:

```html
<ul class="post-list">
  {% for post in site.posts limit:10 %}
  <li class="no-list-style">
    <span class="post-meta">{{ post.date | date: "%b %-d, %Y" }}</span>
    <h2 class="post-title">
      {% if post.external_url %}
      <a class="post-link external-url no-underline {{ post.external_site }}" href="{{ post.external_url }}">{{ post.title }}</a>
      {% else %}
      <a class="post-link no-underline" href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a>
      {% endif %}
    </h2>
    {% if post.external_site %}
    <p class="note italicise">This article was originally published on {{ site.data.publications[post.external_site].name }}.</p>
    {% endif %}
    <p class="post-summary">{{ post.content | markdownify | strip_html | truncatewords:20 }}</p>
  </li>
  {% endfor %}
</ul>
```

It's more or less the same length for Hugo, methinks, with significant syntax differences for the same functionality.

```html
<ul class="post-list">
  {{ range $page := first 10 (where .Site.RegularPages "Section" "in" .Site.Params.mainSections) }}
  <li class="no-list-style">
    <span class="post-meta">{{ .Date.Format "Jan 2, 2006" }}</span>
    <h2 class="post-title">
      {{ if .Params.external_url }}
      <a class="post-link external-url no-underline {{ .Params.external_site }}" href="{{ .Params.external_url }}">{{ .Title }}</a>
      {{ else }}
      <a class="post-link no-underline" href="{{ .Permalink }}">{{ .Title }}</a>
      {{ end }}
    </h2>
    {{ if .Params.external_site }}
    <p class="note italicise">This article was originally published on {{ (index .Site.Data.publications .Params.external_site).name }}.</p>
    {{ end }}
    <p class="post-summary">{{ .Summary | truncate 130 }}</p>
  </li>
  {{ end }}
</ul>
```

The suggestion is to use `site.Params.mainSections` instead of hard-coding the value to equate type to some string, so I just copied it off the documentation. Someone smarter please figure this one out.

<div class="note">
  <code>{% for post in site.posts limit:10 %}{% endfor %}</code> maps to <code>{{ range $page := first 10 (where .Site.RegularPages "Section" "in" .Site.Params.mainSections) }}{{ end }}</code>
</div>

Date formatting is also different. I literally had zero experience with Go prior to this so [trust the docs](https://gohugo.io/functions/format/), don't trust me.

<div class="note">
  <code>{{ post.date | date: "%b %-d, %Y" }}</code> maps to <code>{{ .Date.Format "Jan 2, 2006" }}</code>
</div>

Both Jekyll and Hugo lets you generate summaries. Again with different syntax. Also, different counting algorithm to determine the cut-off. I eye-balled it for this one.

<div class="note">
  <code>{{ post.content | markdownify | strip_html | truncatewords:20 }}</code> maps to <code>{{ .Summary | truncate 130 }}</code>
</div>

### Tags

Tags are displayed inline delimited by a comma. To the left of the tags is a small icon. If there is only a single tag, the icon is a single tag icon. But if there are multiple tags, the tag icon is a double tag icon.

I implemented tags on my posts on 3 February 2015. Jekyll had support for tags already but most implementations of having a list of posts with the same tag involved some sort of custom plugin.

GitHub Pages does not do plugins, so I searched around for a plugin-free solution and went with [How To Use Tags And Categories On GitHub Pages Without Plugins](http://www.minddust.com/post/tags-and-categories-on-github-pages/) by Stephan Groß.

Wasn't the prettiest thing around, but at least it worked. <span class="kaomoji">¯\\\_(ツ)_/¯</span>

```html
{% if post.tags.size > 0 %}
  {% capture tags_content %}
  {% if post.tags.size == 1 %}
<span class="icon icon--tag">
  <svg><!--It's an inline SVG okay? Brevity here--></svg>
</span>
  {% else %}
<span class="icon icon--tags">
  <svg><!--It's an inline SVG okay? Brevity here--></svg>
</span>
  {% endif %}
  {% endcapture %}
  {% for post_tag in post.tags %}
    {% assign tag = site.data.tags[post_tag] %}
    {% if tag %}
    {% capture tags_content_temp %}
      {{ tags_content }}
<a class="post-content__tag small" href="/blog/{{ post_tag }}/">{{ tag.name }}</a>
      {% if forloop.last == false %}, {% endif %}
    {% endcapture %}
    {% assign tags_content = tags_content_temp %}
    {% endif %}
  {% endfor %}
{% else %}
  {% assign tags_content = '' %}
{% endif %}
<p class="post-meta">{{ tags_content }}</p>
```

Tags with Hugo were so simple. It was literally the simplest part of this migration. That is all I have to say about it.

```html
<p class="post-meta">
  {{ $count := (len .Params.tags) }}
  {{ if gt $count 1 }} 
  <span class="icon icon--tags">
    <svg><!--It's an inline SVG okay? Brevity here--></svg>
  </span>
  {{ else }}
  <span class="icon icon--tag">
    <svg><!--It's an inline SVG okay? Brevity here--></svg>
  </span>
  {{ end }}
  {{ range $i, $e := .Params.tags }}
    {{ if $i }}, {{ end }}
    <a class="post-content__tag small" href='{{ "/tags/" | relLangURL }}{{ . | urlize }}'>{{ $e }}</a>
  {{ end }}
</p>
```

### Data files

Ah, we have come to one of my favourite things about Jekyll, which are data files. Hugo supports them too, so plus points here. In the original site, I needed to use a data file to manage tags (which I didn't bother to explain or show, haha). But I also had one for managing my talks page. Here's what some of the entries look like:

```yaml
- title: "What is this? Why must bind?"
  id: what-is-this
  count: "80"
  video: https://youtu.be/qKG7a8mTqqE?t=899
  event: React Knowledgeable
  type: meetup
  released: true
  pdf: true

- title: "East Asian typography on the modern web"
  id: typetechmunich-2020
  count: "81"
  event: TypeTechMunich Meetup 2020
  website: https://type-tech.net/
  type: conference
  released: false
  pdf: false

- title: "DevTools, more than just a debugger"
  id: jsfwdays-2020
  host: https://devtools-jsfwdays.herokuapp.com/devtools
  count: "82"
  video: https://youtu.be/QRyE2cHk8Q4
  event: JavaScript fwdays'20
  website: https://fwdays.com/en/event/js-fwdays-2020
  type: conference
  released: true
  pdf: false
```

Because Hugo supports YAML nicely, I just moved my *_data* folder as-is to the *data* folder without changing anything in the data files themselves. Perfect. The logic for working with data files also matched, but figuring out the syntax was not smooth sailing.

Also, “Talks” like “About” is a **single page**. Based on the rules, the template I chose to use was `talks.html` in the *layouts/_default* folder. It needed a customised template because of the customised logic. I'm too lazy to write out the logic in plain English. This logic monster grew over the years. It started out much simpler.

```html
<h2>Conferences</h2>
<div class="grid">
  {% assign conferences = site.data.slides | sort: 'count' | reverse %}
  {% for conference in conferences %}
  {% if conference.type == 'conference' %}
    {% if conference.released %}
  <div class="talk">
      {% if conference.host %}
    <a class="no-underline" href="{{ conference.host }}">
      {% else %}
    <a class="no-underline" href="{{ site.baseurl }}/slides/{{ conference.count }}-{{ conference.id }}">
      {% endif %}
      <img srcset="{{ site.baseurl }}/assets/images/slides/{{ conference.id }}@2x.jpg 2x" src="{{ site.baseurl }}/assets/images/slides/{{ conference.id }}.jpg" alt="{{ conference.title }}">
    </a>
      {% if conference.video.size %}
    <p class="no-margin"><a class="talk__video" href="{{ conference.video }}">
    Watch video</a></p>
      {% else %}
    <p class="no-margin"><span style="font-size:85%;" class="emoji" role="img" tabindex="0" aria-label="no">&#x274C;</span><span style="font-size:85%;" class="emoji" role="img" tabindex="0" aria-label="video">&#x1F4F9;</span><span style="font-size:85%;" class="emoji" role="img" tabindex="0" aria-label="sorry">&#x1F937;</span> <a href="https://github.com/huijing/slides/tree/gh-pages/{{ conference.count }}-{{ conference.id }}">Read transcript</a></p>
      {% endif %}
      {% if conference.pdf %}
    <p><a class="talk__pdf no-margin" href="{{ site.baseurl }}/slides/pdf/{{ conference.id }}.pdf">Download PDF</a></p>
      {% else %}
    <p>No slides, no pdf</p>
      {% endif %}
  </div>
    {% else %}
  <div class="talk">
    <img srcset="{{ site.baseurl }}/assets/images/slides/{{ conference.id }}@2x.jpg 2x" src="{{ site.baseurl }}/assets/images/slides/{{ conference.id }}.jpg" alt="{{ conference.title }}"/>
    <p class="no-margin">Coming soon!</p>
    <p><a class="no-margin" href="{{ conference.website }}">Event details</a></p>
  </div>
    {% endif %}
  {% endif %}
  {% endfor %}
</div>
```

The logic ported over just fine after I figured out the corresponding syntax.

```html
<h2>Conferences</h2>
<div class="grid">
  {{ $slidesUrl := .Site.Params.githubURL }}
  {{ range sort .Site.Data.slides ".count" "desc" }}
  {{ if eq .type "conference" }}
    {{ if eq .released true }}
  <div class="talk">
      {{ if eq .host true }}
    <a class="no-underline" href="{{ .host }}">
      {{ else }}
    <a class="no-underline" href="{{ $slidesUrl }}/slides/{{ .count }}-{{ .id }}">
      {{ end }}
      <img srcset="{{ .Site.BaseURL }}/assets/images/slides/{{ .id }}@2x.jpg 2x" src="{{ .Site.BaseURL }}/assets/images/slides/{{ .id }}.jpg" alt="{{ .title }}">
    </a>
      {{ if isset . "video" }}
    <p class="no-margin"><a class="talk__video" href="{{ .video }}">Watch video</a></p>
      {{ else }}
    <p class="no-margin"><span style="font-size:85%;" class="emoji" role="img" tabindex="0" aria-label="no">&#x274C;</span><span style="font-size:85%;" class="emoji" role="img" tabindex="0" aria-label="video">&#x1F4F9;</span><span style="font-size:85%;" class="emoji" role="img" tabindex="0" aria-label="sorry">&#x1F937;</span> <a href="https://github.com/huijing/slides/tree/gh-pages/{{ .count }}-{{ .id }}">Read transcript</a></p>
      {{ end }}
      {{ if eq .pdf true }}
    <p><a class="talk__pdf no-margin" href="{{ $slidesUrl }}/slides/pdf/{{ .id }}.pdf">Download PDF</a></p>
      {{ else }}
    <p>No slides, no pdf</p>
      {{ end }}
  </div>
    {{ else }}
  <div class="talk">
    <img srcset="{{ .Site.BaseURL }}/assets/images/slides/{{ .id }}@2x.jpg 2x" src="{{ .Site.BaseURL }}/assets/images/slides/{{ .id }}.jpg" alt="{{ .title }}"/>
    <p class="no-margin">Coming soon!</p>
    <p><a class="no-margin" href="{{ .website }}">Event details</a></p>
  </div>
    {{ end }}
  {{ end }}
  {{ end }}
</div>
```

<div class="note">
  <code>{{ site.data.DATA_FILE_NAME }}</code> maps to <code>{{ .Site.Data.DATA_FILE_NAME }}</code>
</div>

There was a bit of a gotcha in terms of accessing custom site variables within a loop hence the line which assigns it to a variable first, `{{ $slidesUrl := .Site.Params.githubURL }}`, before referencing `$slideUrl` inside the loop. No idea about the why. Maybe I'll find out. One day.

## Content migration

This should have taken way less time than it actually did. But I oscillated between using Hugo's custom shortcodes versus writing out HTML in full for my responsive images because I kept thinking what would happen if I migrated again. That would mean writing the stuff in the shortcodes within my content.

Did I mention at this point I was already at 186 posts? Can you imagine what I would do if I migrated at 380 posts? I can't. In the end, I left most of the images as they were, fixed the file paths and called it done. However, if you peek, one of the years uses shortcodes. But just that one year (I think, I can't remember any more nor do I want to check).

The earliest posts were the worst. Because I hadn't discovered that long paragraphs were annoying to read yet, and my formatting was off for nested lists. I wonder if this was because somewhere along the lines Jekyll switched markdown engines and I just didn't notice things broke. So I pretty much went through each post (some of them multiple times) and that took a lot of time.

Had to modify front matter for images, because I wanted to use Hugo's internal templates for Open Graph and Twitter. Also, permalinks for each blog post. This is where I wanted to slap myself. Hugo, by default, uses the post title word for word as the path. Jekyll, however, uses the file name.

By the time I got halfway through 2016, changing all the internal references along the way, I realised this was a bad idea, because it would break links to my posts from everywhere. Hugo has a `slug` variable that lets ypu override the title-as-path implementation.

So I had to go back and change the internal references **back to the original**, then add the correct `slug` which matched the file name instead.

<img src="/assets/images/posts/migrate-hugo/angry2.jpg" srcset="/assets/images/posts/migrate-hugo/angry2@2x.jpg 2x" alt="An angry-looking red panda">

### RSS, yes it's still a thing in 2020

I have an RSS feed. I have a kind of customised RSS feed, because there are certain posts that I don't want in the feed, specifically those that I write for other publications. I just want a **link** to them, but I also draft all my writing on this site, and I don't delete the post.

Because I didn't set things up properly, I got into some trouble with one of the publications I wrote for. And it was my fault for not being conscientious enough. Anyway, RSS template has logic too! By now I pretty much figured out the conditionals I used most often, so it was a matter of tweaking it to be the same as before.

Getting the name of the generated file to be `feed.xml` instead of the default `index.xml` took long and I still can't figure out what happened. It's a configuration setting in the `config.yml` file which I managed to get right [following these instructions](https://discourse.gohugo.io/t/how-can-i-change-the-rss-url/118/17) but it didn't reflect until I restarted the server. Life happens.

## Changing hosts from GitHub Pages to Netlify

At this point I was expecting the migration to explode and my site to be down for hours but surprisingly, it took all of ten minutes to pull this off. Netlify is magical. Slight complication was the fact that I ran my site through Cloudflare.

But the documentation was pretty clear, and I found this post by [Jake Trent](https://jaketrent.com/post/cloudflare-dns-netlify-host/) which I followed to a tee together with the [Netlify instructions](https://docs.netlify.com/domains-https/custom-domains/configure-external-dns/).

1. On Cloudflare, change the `A` record to point to `104.198.14.52`, which is Netlify's load balancer as of time of writing. This may or may not change in future. Check the docs!
2. Also change the `CNAME` for `www` (if you have it) to point to `YOUR_SITE_NAME.netlify.app` from `GITHUB_USERNAME.github.io`
3. Make sure the *Proxy status* says **DNS only** (your cloud icon should be greyed out not orange)
4. On Netlify, add your custom domain under *Domain Settings*. Click verify when you see it. You don't have to point your name servers and stuff.
5. Also do the SSL stuff in the section below. This takes a tiny bit of time to sort itself out (less than ten minutes for me) and your site should work fine with HTTPS and all.

### Netlify forms are AH-MAZING

My broke-ass solution for a contact form was to run it through [Simple Form](https://getsimpleform.com/). It used to work fine, but some where along the lines, the spam filter stopped working. I got massive amounts of spam. MASSIVE.

[Netlify](https://www.netlify.com/products/forms/) offers 100 submissions per month on the free tier, which is more than enough because **SPAM SUBMISSIONS DON'T COUNT**. And all I needed to do was add the `data-netlify=true` attribute to my form. Easy-peasy lemon-squeezy.

## Wrapping up

My eyeballs were falling out of my skull at this point. But after three days, and oh-so-much Googling, <kbd>⌘</kbd>-<kbd>S</kbd> and <kbd>⌘</kbd>-<kbd>Tab</kbd> / <kbd>⌘</kbd>-<kbd>~</kbd> pressing, muttering and swearing, the site was migrated successfully.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">finally bit the bullet and migrated my website from <a href="https://twitter.com/jekyllrb?ref_src=twsrc%5Etfw">@jekyllrb</a> on <a href="https://twitter.com/hashtag/githubpages?src=hash&amp;ref_src=twsrc%5Etfw">#githubpages</a> to <a href="https://twitter.com/GoHugoIO?ref_src=twsrc%5Etfw">@GoHugoIO</a> on <a href="https://twitter.com/Netlify?ref_src=twsrc%5Etfw">@Netlify</a>. it took 3 days and my eyeballs are falling out of my skull. <br>can u see a difference? (the answer should be no, unless u have a photographic memory to spot the tiny diff)</p>&mdash; HJ Chen (@hj_chen) <a href="https://twitter.com/hj_chen/status/1254789779192864770?ref_src=twsrc%5Etfw">April 27, 2020</a></blockquote>

The last bit of housekeeping was to check for broken links and boy did I break things. I had to fix all the GitHub project links which assumed that `huijing.github.io` was still equivalent to `https:www.chenhuijing.com` and replace those accordingly.

I also kept the Jekyll site up at the original GitHub pages host with some added styles to indicate it was an archival site and not active any more. If you read through this whole thing, I'm genuinely amazed. It's so long. So many words. I write too much nonsense but don't plan to change.

Anyway. I'm off enjoying my lightning fast builds now. kthxbye. <span class="emoji" role="img" tabindex="0" aria-label="tumbler glass">&#x1F943;</span>