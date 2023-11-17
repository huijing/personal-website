---
drupalfeed: true
date: 2023-11-17T14:30:40+08:00
images:
  - /assets/images/posts/drupal-10.jpg
tags:
  - drupal10
  - theming
title: "OMG, I'm doing Drupal again"
---

I've not written proper blog posts for a while now but I have come nearly full circle back to the start of my web career (albeit with a decade more experience and not necessarily any much smarter) to once again build a Drupal site. This is more a testament to the longevity of Drupal than my own career but that's beside the point.

It's time for yet another “setting up Drupal from scratch” blog post, but this time for Drupal 10. Which means I completely skipped Drupal 9 but what hey. The backstory as to why I'm writing this blog post can be its own blog post itself, we'll see. It's Opinionated and mildly spicy IMHO and at my age, I'm too tired for conflict if I can avoid it.

## Oh how things have changed

If I check back to the [last Drupal-related blog post](/blog/revisiting-drupal-8-after-2-years) I wrote back in 2020, [Composer](https://getcomposer.org/) was already the new workflow for setting up new sites. So that wasn't a surprise. But even before the actual Drupal stuff, there is the issue of environment setup.

I learned that Docker-based solutions are the [recommended development environment](https://www.drupal.org/docs/develop/local-server-setup) but I'm not that big a fan so I went for the old school option of installing things on my local machine instead. Instructions here: [macOS 14.0 Sonoma Apache Setup: Multiple PHP Versions](https://getgrav.org/blog/macos-sonoma-apache-multiple-php-versions).

Now for the Drupal stuff, first things first, read and follow [the documentation](https://www.drupal.org/docs/getting-started/installing-drupal/get-the-code):

```
composer create-project drupal/recommended-project my_site_name_dir
```

For database management, I'm using a GUI tool called [Sequel Ace](https://sequel-ace.com/) but you do you. The instructions on the documentation worked fine for me without issue, and I'm on MacOS Sonoma 14.1 at this point, so if you do run into problems, Google is your friend?

Anyway, my personal best practice for local Drupal development is to never have errors on the Status report page, even on local, and to always use a local _settings.php_ file. Copy the _example.settings.local.php_ file to the _default_ folder and rename it _settings.local.php_. Do the uncommenting on the bottom of the actual _settings.php_ file and you will see some new errors related to rebuild access and the like.

If you also have these problems, set

```php
$settings['skip_permissions_hardening'] = FALSE;
```

and

```php
$settings['rebuild_access'] = FALSE;
```

in the settings.local.php file. (instructions from here: [misreported settings.local.php and settings.php permissions in Status Report](https://www.drupal.org/project/social/issues/2853246)). You should then have a nice all-green Status report. Yay.

Another basic setup thing I suggest doing is installing [Drush](https://www.drush.org/12.x/), which is a CLI for Drupal. It does not come out the box with Drupal hence we need to run

```bash
composer require drush/drush
```

You then call Drush via `vendor/bin/drush` to run drush commands like clearing cache with `vendor/bin/drush cr`. Yay.

I tried to add `drush` to `$PATH` but that somehow made this local installation of drush the global one, messing up my other site so I just left it.

## My bread and butter

Theming. That's what pays my bills. Essentially, making websites look pretty. CSS (to a certain extent) does feed me and pay for my hobbies, so thanks, Håkon Wium Lie! I vaguely remember having something set up years ago as a starter theme but seeing that it hadn't been updated for 5 years, that's not really useful anymore.

Let's see how Drupal 10 recommends we do this. Turns out there's a thing called [Starterkit theme](https://www.drupal.org/docs/core-modules-and-themes/core-themes/starterkit-theme) which we can use to generate a brand new contrib theme.

```bash
php core/scripts/drupal generate-theme my_new_theme
```

Drupal 10 uses Twig 3, so if your code editor doesn't have support for that, installing an extension for `.twig` files wouldn't hurt. I went with [vscode-twig-language-support](https://github.com/rholdos/vscode-twig-language-support/), but again, you do you.

I'll be honest. I forgot EVERYTHING. But I did write some things down about Drupal 8 theming 3 years ago, so thank you past me. I think some of that stuff is still relevant, but let's see if anything has changed much in Drupal 10.

### Generate a new theme

I don't remember this being a thing back then but you can generate a theme from another starter theme with a command now.

```bash
php core/scripts/drupal generate-theme my_new_theme
```

There's a theme that ships out the box called Starterkit theme which this command generates your custom theme from. I tried it, and it had essentially all the templates that you needed to override what was out of the box Drupal I think.

I didn't think I would need all that, given that my last starter theme was really barebones and based of the Stark theme (I think). So you can also use other themes for the generation, but you have to tweak the `*.info.yml` file of Stark, setting `starterkit: true`. Then running:

```bash
php core/scripts/drupal generate-theme --starterkit stark my_new_theme
```

The Stark theme doesn't come with much, so past me noted that adding a THEME_NAME.libraries.yml file is almost a mandatory exercise. This is the file that tells the theme where your styles and scripts are and refer to them accordingly.

```
.
└── YOUR_THEME_NAME/
    ├── config
    ├── css/
    │   └── styles.css
    ├── js/
    │   └── scripts.js
    ├── templates
    ├── YOUR_THEME_NAME.breakpoints.yml
    ├── YOUR_THEME_NAME.info.yml
    ├── YOUR_THEME_NAME.libraries.yml
    ├── logo.svg
    ├── README.md
    └── screenshot.png
```

This time, I'm not going to do the SCSS setup that I did all those years ago. Yet. I just want to see how far I can get without SCSS at this point. So the libraries file from back then still seems to work.

```
global-styling:
  version: 1.x
  css:
    theme:
      css/styles.css: {}
  js:
    js/scripts.js: {}

```

But what this means is that the `styles.css` file needs to be found in the _css_ folder and the `scripts.js` file should exist in the _scripts_ folder as well. Also, when you make changes that may impact how the application locates and reads files, it's a good idea to clear the cache. Just in case.

### Templating pages

Drupal still uses the namespace override pattern for template files so things still felt familiar. According to my previous blog posts, I made use of [Panels](https://www.drupal.org/project/panels) a lot but apparently that's not a thing any more. And there's a new thing called [Layout Builder](https://www.drupal.org/docs/8/core/modules/layout-builder/layout-builder-overview).

The long and short of things is that to customise the markup, you can override the system page templates by putting your own templates in your theme's template folder. That's way turning on [Twig debug mode](https://www.drupal.org/docs/develop/theming-drupal/twig-in-drupal/debugging-twig-templates) is a very good idea. You can do that from the GUI now. Yay.

Now, when you inspect your page, the debug tool helpfully tells you where the markup for each section is coming from, and makes suggestions on what you could name your overriding template to change things how you want to.

{{<img2x filename="posts/drupal-10/twig-debug" filetype="png" alt="Twig debugging tool activated in inspector">}}

## Wrapping up

After this point, any further work depends on the actual site design you will be building so you're on your own for that. The yet-to-be-written-maybe-never blogpost about the backstory of this entire endeavour might cover it. We'll see.

Live on and prosper, Drupal.
