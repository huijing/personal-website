---
drupalfeed: true
date: "2015-03-23T00:00:00Z"
images:
  - /assets/images/posts/handcode.jpg
tags:
  - drupal7
  - site-building
title: "Drupal 101: Creating custom content with Panels"
---

If you ever find yourself needing to create a static page in Drupal, perhaps for a temporary landing page or an under-construction page, while the site is being fleshed out behind the scenes, an option to consider is via [Panels](https://www.drupal.org/project/panels).

I was in the process of building the [DrupalCamp Singapore 2014](/blog/the-one-where-people-get-a-say/) website and needed to put up a temporary home page. Using Panels gave me the option of hand-coding the HTML for the page. To do this, you will also need to install the [Chaos tools suite (ctools)](https://www.drupal.org/project/ctools).

1. <p class="no-margin">Enable the Panels, Chaos tools and Page manager (comes with ctools) modules.</p>
   <pre><code class="language-bash">drush en panels ctools page_manager -y</code></pre>
2. Once all the required modules are enabled, you can navigate to `admin/structure/pages/add` to create a custom page.
3. Fill in the administrative descriptions (because it's good practice) and fill in `<front>` for _Path_ and check the _Make this your site home page_ option. The rest of the optional settings can be left alone for now.
   ![Setting up a custom page](/assets/images/posts/custom-content/ccpanels-2.jpg)
4. Choose a layout appropriate to your intended design. I went for the single column option.
   ![Layout options](/assets/images/posts/custom-content/ccpanels-3.jpg)
5. You can adjust the CSS settings of your custom page under _Panel settings_ if you want to, but I just went with the defaults.
6. Hover over the gear icon on the top left corner of your layout and click on _Add content_.
   ![Add content](/assets/images/posts/custom-content/ccpanels-4.jpg)
7. Click on _New custom content_ as this allows you to write your own HTML content.
   ![Create custom content](/assets/images/posts/custom-content/ccpanels-5.jpg)
8. The content creation interface should be pretty familiar. Enter a descriptive administrative title for easier identification and write your HTML in the _Body_ field.
   ![Write your HTML](/assets/images/posts/custom-content/ccpanels-6.jpg)
   My advice? Write all your HTML in your code editor of choice (mine is Sublime Text), then copy and paste it into the field. Keep a copy of the HTML saved somewhere, just in case you need to make edits. Drupal has a tendency of removing white spaces if you switch text formats, which makes editing a pain when you need to.
   ![Collapsed whitespaces](/assets/images/posts/custom-content/ccpanels-7.jpg)
9. The content is only saved after you click on _Finish_, which is another good reason to have your HTML saved up somewhere, just in case.
   ![Always click on Finish](/assets/images/posts/custom-content/ccpanels-8.jpg)

Navigate back to your homepage and you should see your new custom content displayed. An advantage of this is you get full control over the markup, which could make it easier when it comes to writing the styles for your page.

However, it is important to keep in mind that Drupal is a content management system after all, and if you find yourself writing a lot of custom content by hand, you may have to rethink the architecture of your site. Drupal may not even be the right solution in the first place. Just something to keep in mind.
