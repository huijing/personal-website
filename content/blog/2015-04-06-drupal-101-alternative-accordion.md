---
drupalfeed: true
date: "2015-04-06T00:00:00Z"
slug: drupal-101-alternative-accordion
tags:
  - drupal7
  - site-building
title: "Drupal 101: An alternative method for accordions"
---

Accordions are commonly used graphical control element. The [Yahoo Design Pattern Library](https://web.archive.org/web/20160529103142/https://developer.yahoo.com/ypatterns/navigation/accordion.html) has a good explanation on the purpose of accordions, as well as recommendations on their usage.

Accordions are usually used when you have limited space and a long list of related items. Seriously, the [Yahoo Design Pattern Library](https://web.archive.org/web/20160404131912/https://developer.yahoo.com/ypatterns/) is a valuable reference for all designers. I recommend you bookmark it.

There are a number of Drupal modules that help implement accordions (just google drupal accordion), but they didn't really fit my particular use-case, so I did my accordions differently. This method was a little complicated and required some jQuery, but fit my use-case well.

## Create the Accordion content type

<p class="no-margin"><strong>Required modules</strong></p>
<ul>
    <li class="no-margin"><a href="https://www.drupal.org/project/field_collection">Field collection</a></li>
    <li class="no-margin"><a href="https://www.drupal.org/project/entity">Entity API</a><em> (dependency for Field collection)</em></li>
    <li><a href="https://www.drupal.org/project/ds">Display Suite</a><em> (Optional: to manage the content display)</em></li>
</ul>

1. Install the required modules.
<pre><code class="language-bash">drush dl field_collection entity -y</code></pre>
2. Enable the required modules.
<pre><code class="language-bash">drush en field_collection entity -y</code></pre>
3. Go to <code>admin/structure/types/add</code> and create a new content type, called Accordion.
4. Add a new field of type _Field collection_ and set _Widget_ to _Embedded_.You should also remove the default _Body_ field as it won't be used.
   ![Create content type](/assets/images/posts/accordion/content-type.jpg)
5. Set _Number of values_ to _Unlimited_, because you want to be able to create as many accordion sections as you need.
   ![Accordion field settings](/assets/images/posts/accordion/accordion-settings.jpg)
6. Go to <code>admin/structure/field-collections</code> and you should see your newly created field.
   ![Create field collection field](/assets/images/posts/accordion/field-collection.jpg)
7. Click on _manage fields_ and add the fields you require. I only needed a title and body field.
   ![Create accordion fields](/assets/images/posts/accordion/accordion-fields.jpg)
8. Click on _manage fields_ and add the fie
9. Click on _Manage display_ and hide the labels for both fields. You probably should do the same for the _Accordion_ content type.
   ![Hide labels](/assets/images/posts/accordion/accordion-display.jpg)
10. _Optional steps: To setup display for the new content type_
    You can choose to use the default Drupal markup to write your accordion. But I find it neater to tweak the markup via Display Suite first. You don't have to do this if you don't want to. Instructions [here](/blog/drupal-101-display-suite-field-settings).

## Writing the accordion functionality

_Note: I have tweaked my markup as per step 9 above, you may have to adjust your selectors accordingly._

There are a couple of recommendations from the Yahoo Design Pattern Library on accordion presentation, like highlighting the current panel and having the most important panel open by default. I just chose to open the first panel by default.

1. The accordion functionality requires use of basic jQuery. There are a number of ways to add Javascript to your site. I suggest reading [this article](https://web.archive.org/web/20150810090412/http://wearepropeople.com:80/blog/7-ways-to-add-custom-js-and-css-to-a-page-in-drupal) by [Kirill Cebotari](https://www.drupal.org/u/oresh) to familiarise yourself with all of them. I'm using the second method, including it in the .info file of my theme.
2. If you don't have one already, create a _js_ folder in your theme folder, and create a file called _script.js_ in this new folder.
<pre><code class="language-markup">YOUR_THEME/
|-- _css/                    
|-- img/                
|-- js/             
|   |-- script.js  <-- This is where you'll write your code
|-- layouts/                           
|-- logo.png
|-- YOUR_THEME.info
|-- screenshot.png
|-- template.php
`-- templates/</code></pre>
3. There are some best practices when using Javascript in Drupal, and I strongly recommend everyone to read the [documentation](https://www.drupal.org/node/171213). As a general tip, wrap your code in a closure.
<pre><code class="language-javascript"> (function ($) {
  $(document).ready(function() {
    // Place jQuery code here
  });
})(jQuery);</code></pre>
4. Display only the first accordion item on load.
<pre><code class="language-javascript"> $('.field-collection-item-field-accordion-content').first().addClass('active');
$('.field-collection-item-field-accordion-content:not(.active)').find('.field-name-field-accordion-body').hide();</code></pre>
5. Toggle the accordion item body when clicking on the accordion item title.
<pre><code class="language-javascript"> $('.field-name-field-accordion-title').click(function(e) {
  e.preventDefault(); // prevent the default action
  e.stopPropagation(); // stop the click from bubbling
  if(!$(this).parent().hasClass('active')) {
    $('.field-collection-item-field-accordion-content').removeClass('active');
    $(this).parent().addClass('active');
    $('.field-collection-item-field-accordion-content').find('.field-name-field-accordion-body').slideUp();
    $(this).next().slideDown();
  }
});</code></pre>

## Styling the accordion

The field collection module comes with some default styles that you may wish to override. The module's CSS file, <code>field_collection.theme.css</code> is in the root of the _field_collection_ folder.

My preferred method requires a module called [Magic](https://www.drupal.org/project/magic). It's one of my favourite modules. You'll see why once you visit the project page. Magic provides a simple way to remove exclude stylesheets from core and contrib modules. You can also use the `hook_css_alter()` function to exclude stylesheets, but unless you need to exclude stylesheets from libraries, Magic works brilliantly.

Even when making changes to only one or two selectors, I still prefer to exclude the original stylesheet, then copy the required styles into my theme. I have a thing against repeating selectors to override them. Anyway, style your accordion any way you like. I chose to add an <code>active</code> class to the active accordion item for easier styling.

![Styling accordion](/assets/images/posts/accordion/styles.jpg)

## Using the accordion with panels

_I'm assuming a level of familiarity with using Panels to display content._

1. Navigate to the _Content_ section of your panel, and click the gear icon on the top left corner to add content.
   ![Add panel content](/assets/images/posts/accordion/panel-content.jpg)
2. Click on _Existing node_ and enter the NID of the required accordion. Set _Build mode_ to _Full content_, unless you have a specific view mode for how the accordion should be displayed.
   ![Configure node](/assets/images/posts/accordion/configure-node.jpg)
3. You should see the title of your node in the layout. Remember to click _Update and save_.
   ![Panel layout](/assets/images/posts/accordion/panel-layout.jpg)

## Wrapping things up

This is just one opinionated method of creating an accordion in Drupal. There are lots of other ways to do it, as with everything else in Drupal. I tend to use Panels quite a bit, so I felt this was a pretty Panels-friendly implementation. Another plus is that accordion content can be easily edited by content editors. Hopefully this can provide some inspiration for alternative ways of presenting content in Drupal.
