---
drupalfeed: true
date: "2015-04-06T00:00:00Z"
slug: drupal-101-display-suite-field-settings
tags:
  - drupal7
  - site-building
title: "Drupal 101: Customising field markup with Display Suite"
---

A minor complaint I often have about Drupal is the mess of markup it generates. Don't get me wrong, there are times when all those default classes help when it comes to styling, but there are also times when there is so much nesting it puts Inception to shame. (This is a repeat joke, excuse me if you've heard me mention it before.)

This post actually came about because I was trying to include using Display Suite to set up fields as an optional step in the [alternative method for accordions](/blog/drupal-101-alternative-accordion) post. However, that step ended up being so ridiculously long it warranted its own post.

1. Install Display suite.
<pre><code class="language-bash">drush dl ds -y</code></pre>
2. Enable Display Suite, Display Suite Extras and Display Suite UI.
<pre><code class="language-bash">drush en ds ds_extras ds_ui -y</code></pre>
3. Enabling Display Suite Extras allows you to customise field displays. If you go to <code>admin/structure/ds</code>, you should see an _Extras_ section in the top right corner. Click on that, and check _Enable Field Templates_.

   You can set the default field template for all fields on all your content types using Display Suite here. Unless you're certain you don't want any of Drupal's default markup, I recommend sticking to _Drupal defaults_ here and customising each field when you need to.
   ![Enable field templates](/assets/images/posts/field-template/ds-extras.jpg)

4. Navigate to the _Manage display_ tab of a content type you want to use Display Suite with. Activate the display suite settings for your content type by choosing a layout and click Save. I'm using <em>One column</em> for this example.
   ![Turn on display suite](/assets/images/posts/maps/display-suite.jpg)
5. Upon saving, you should now see _Field template_ options for your fields.
   ![DS field template](/assets/images/posts/field-template/ds-field-settings.jpg)
6. Click on the gear icon to reveal the field template settings. You have four options here, and all of them come with the option to hide the label colon:

   - Drupal default: The classic Drupal markup, deep and nested, just the way it's always been.
     ![Drupal default](/assets/images/posts/field-template/drupal-default.jpg)
   - Full reset: For people who hate wrappers.
     ![Full reset](/assets/images/posts/field-template/full-reset.jpg)
   - Minimal: Gives you one neat wrapper. I kind of like this option.
     ![Minimal](/assets/images/posts/field-template/minimal.jpg)
   - Expert: For people who know exactly what they want. Has all the options from Drupal defaults for you to tweak.
     ![Expert options](/assets/images/posts/field-template/expert.jpg)

   So many options available! If you require your field to be of a certain HTML class, or if you want full control over additional HTML wrappers, this is your option. Prefix and suffix options included.
   ![Expert options](/assets/images/posts/field-template/expert-2.jpg)

As someone who builds a lot of custom Drupal 7 themes, the Display Suite field template customisation options have proven extremely valuable to my styling efforts. Much better than filling up your _templates_ folder with field.tpl.php files (please don't do that, just...don't.)
