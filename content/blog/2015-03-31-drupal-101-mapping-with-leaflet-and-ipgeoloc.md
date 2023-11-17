---
drupalfeed: true
date: "2015-03-31T00:00:00Z"
images:
  - /assets/images/posts/mapping.jpg
slug: drupal-101-mapping-with-leaflet-and-ipgeoloc
tags:
  - drupal7
  - site-building
title: "Drupal 101: Mapping with Leaflet and IP Geolocation"
---

Store locators are a useful functionality for businesses who have multiple outlets. Drupal has a number of map rendering modules that allow us to provide store locator functionality. This article will cover the basics of setting up a simple store locator with proximity search functionality.

## Create and setup location content type

### Required modules

<ul>
    <li class="no-margin"><a href="https://www.drupal.org/project/addressfield">Address Field</a></li>
    <li class="no-margin"><a href="https://www.drupal.org/project/geocoder">Geocoder</a></li>
    <li class="no-margin"><a href="https://www.drupal.org/project/geofield">Geofield</a></li>
    <li class="no-margin"><a href="https://www.drupal.org/project/geophp">geoPHP</a><em> (dependency for Geocoder and Geofield)</em></li>
    <li class="no-margin"><a href="https://www.drupal.org/project/ctools">Chaos tools suite (ctools)</a><em> (dependency for Address Field)</em></li>
    <li><a href="https://www.drupal.org/project/ds">Display Suite</a><em> (Optional: to manage the content display)</em></li>
</ul>

1. Install the required modules.
<pre><code class="language-bash">drush dl addressfield geocoder geofield geophp ctools -y</code></pre>
2. Enable the required modules.
<pre><code class="language-bash">drush en addressfield geocoder geofield geofield_map geophp ctools -y</code></pre>
3. Go to <code>admin/structure/types/add</code> and create your location content type.
4. Add a new field for Address.
   ![Create address field](/assets/images/posts/maps/address-field.jpg)
   Click Save, then click Save field settings. You can adjust the defaults settings to suit your locale, if you wish, then click the Save settings button.
5. Add new field for Position.
   ![Create position field](/assets/images/posts/maps/position-field.jpg)
   Click Save, then click Save field settings.
   ![Position field settings](/assets/images/posts/maps/position-field-settings.jpg)
   Select _Address_ from the drop-down for the _Geocode from field_ option, and select _Google Geocoder_ for the _Geocoder_ option. You can tweak the other default settings, if you wish.
6. _Optional steps: To setup display for the new content type_
<ul>
    <li class="no-margin">Install Display suite.</li>
    <pre><code class="language-bash">drush dl ds -y</code></pre>
    <li class="no-margin">Enable Display Suite and Display Suite UI</li>
    <pre><code class="language-bash">drush en ds ds_ui -y</code></pre>
    <li class="no-margin">Go to <code>admin/structure/types/manage/location/display</code> and activate display suite settings for your new content type by choosing a layout and click Save. I'm using <em>One column</em> for this example.
    <img alt="Turn on display suite" src="/assets/images/posts/maps/display-suite.jpg">
    <li class="no-margin">Select the fields you want displayed and click Save.
    <img alt="Adjust display" src="/assets/images/posts/maps/display-suite-2.jpg">
    <li class="no-margin">Do the same for any other view modes you will be using.</li>
</ul>
7. If you chose not to use Display suite, you still need to make sure the _Format_ for the _Position_ field is set to _Geofield Map_. If you do not see the _Geofield Map_ option in the drop-down, check that the Geofield Map module is enabled. This module is part of the Geofield module.

## Importing Location data using feeds

If you have a lot of data, it doesn't make sense to enter each location manually. I suggest using [Feeds](https://www.drupal.org/project/feeds) to import the data instead.

This particular example uses data from a spreadsheet, which is easily converted to CSV via Excel.For setting up feeds in other formats, refer to my [previous post on Feeds](/blog/drupal-101-what-i-learnt-from-hours-of-troubleshooting-feeds/).

1. Install the [Feeds](https://www.drupal.org/project/feeds) module.
<pre><code class="language-bash">drush dl feeds -y</code></pre>
2. Enable Feeds, Feeds Importer and Feeds UI.
<pre><code class="language-bash">drush en feeds feeds_importer feeds_ui -y</code></pre>
3. Go to `admin/structure/feeds` and click on &#10133; Add importer.
4. Under _Basic settings_, select _Off_ for the _Periodic import_ option.
5. Change the _Fetcher_ to _File upload_. You can retain the default settings for this.
6. Change the _Parser_ to _CSV parser_. You can keep the default settings for this as well.
7. Keep the _Processor_ as _Node processor_ and under _Bundle_, select the new content type you created earlier. You can keep the default settings, if you wish.
8. For _Mapping_, ensure all the fields in your data set are mapped out accordingly, with the headers of your CSV file matching the _SOURCE_ exactly. My dataset has the following field mapping:
![Mapping location importer](/assets/images/posts/maps/field-mapping.jpg)

<p class="no-margin">With reference to the <a href="https://www.drupal.org/node/1988472">official documentation</a>, take note of the following:</p>
<ul>
<li class="no-margin">Always supply a country value in their two character <a href="http://en.wikipedia.org/wiki/ISO_3166-1">ISO 3166-1 country codes</a>.</li>
<li class="no-margin">Address components are as follows:</li>
    <ul>
    <li class="no-margin">Address: Country => Country</li>
    <li class="no-margin">Address: Administrative area => State</li>
    <li class="no-margin">Address: Locality => City</li>
    <li class="no-margin">Address: Postal code => Postal Code</li>
    <li class="no-margin">Address: Thoroughfare => Address 1</li>
    <li class="no-margin">Address: Premise => Address 2</li>
    </ul>
</ul>

9. Go to `import` and select the importer you just created.
10. Import your CSV file. Cross your fingers and hope everything imports successfully.

## Create and setup location views

<p class="no-margin"><strong>Required modules</strong></p>
<ul>
    <li class="no-margin"><a href="https://www.drupal.org/project/views">Views</a></li>
    <li class="no-margin"><a href="https://www.drupal.org/project/ip_geoloc">IP Geolocation Views & Maps</a></li>
    <li class="no-margin"><a href="https://www.drupal.org/project/libraries">Libraries API</a><em> (dependency for IP Geoloc)</em></li>
    <li class="no-margin"><a href="https://www.drupal.org/project/entity">Entity API</a><em> (dependency for IP Geoloc)</em></li>
    <li><a href="https://www.drupal.org/project/leaflet">Leaflet</a></li>
</ul>

### Part 1: Location listing

1. Install required modules.
<pre><code class="language-bash">drush dl views leaflet libraries entity ip_geoloc -y</code></pre>
2. Enable the required modules.
<pre><code class="language-bash">drush en views views_ui leaflet leaflet_views ip_geoloc libraries entity -y</code></pre>
3. Create a libraries folder in the <code>sites/all</code> folder. Download the [Leaflet JavaScript Library](http://leafletjs.com/download.html) and extract the files to the libraries folder. Ensure the folder name is <code>leaflet</code>.
   ![Libraries folder structure](/assets/images/posts/maps/libraries-folder.jpg)
4. Go to <code>admin/structure/views/add</code> and create a new view for the Location content type. Check _Create a page_ and fill in the fields as you see fit, then click Continue & edit. These options can be changed on the next screen.
   ![Setup location views](/assets/images/posts/maps/views.jpg)
5. Under _Format_, change the _Show_ options to _Fields_.
   ![Change listing display format](/assets/images/posts/maps/listing-format.jpg)
6. Add a _Rendered Node_ field. Click on _Add_ and type _Rendered Node_ in the search filter. Check _Content: Rendered Node_ and click Apply.
7. Select _Show complete entity_ under _Display_ and choose the view mode you used for displaying your fields when you set up the Location content type.
   ![Add rendered node field](/assets/images/posts/maps/rendered-node.jpg)
8. Add a _Proximity_ field. Click on _Add_ and type _Proximity_ in the search filter. Check _Content: Position (field_position) - proximity_ and click Apply. Adjust the field settings as you see fit. I recommend checking the _Round_ option and specifying _Precision_ to _2_, as the default option gives a long string of decimal points.
   ![Proximity field settings](/assets/images/posts/maps/proximity-field.jpg)
   Set the _Source of Origin Point_ to _Exposed Geofield Proximity Filter_.
9. Add a _Proximity_ filter. Under _Filter_, click on _Add_ and type _Proximity_ in the search filter. Check _Content: Position (field_position) - proximity_ and click Apply.
10. Check _Expose this filter to visitors_. Change the _Label_ if you need to, this field can be left blank. Set the _Operator_ to _is less than or equal to_ and enter the starting value in the _Proximity Search_ field.
    ![Proximity filter settings](/assets/images/posts/maps/proximity-filter.jpg)
11. Remove all existing _Sort Criteria_. Click on _Add_ and type _Proximity_ in the search filter. Check _Content: Position (field_position) - proximity_ and click Apply. Select _Sort ascending_, and under _Source of Origin Point_, select _Exposed Geofield Proximity Filter_.
    ![Proximity sort settings](/assets/images/posts/maps/proximity-sort.jpg)
12. Go to the path of your views page to check that the listing is rendering correctly. Test the proximity search by typing a location into the exposed filter.
    ![Location listing](/assets/images/posts/maps/location-listing.jpg)

### Part 2: Map display

1. Add a new Attachment view display to the Location view.
   ![Map view display](/assets/images/posts/maps/map-view.jpg)
2. Add a _Position_ field. Click on _Add_ and type _Position_ in the search filter. Check _Content: Position_ and click Apply.
3. Check _Exclude from display_. This field is used for plotting the locations on the map. Pick _Latitude/Longitude_ as the formatter and click Apply.
4. Under _Format_, choose _This attachment (override)_, select _Map (Leaflet API, via IPGV&M)_ and click Apply.
5. Adjust the height of the map as you see fit. Under _Name of latitude field in Views query_, select _Content: Position_, the field you just added.
6. The location marker styles can be customised and the help text provides detailed information on how to do that. For this example, I chose _green_ as the default marker and left the _Visitor marker_ as default, so they are differentiated.
7. Under _Map centering options_, select _Center the map on visitor's current location_.
8. Under _No locations behaviour_, enter _visitor_ so the map will centre on the user's location when no results are found.
9. Click on _More map options_ to reveal the map zoom settings. For this example, the default _Initial zoom level_ was too low, and I set it to _15_ instead.
10. There are many customisation options that IP Geolocation provides, and you can tweak them to suit your needs. Click Apply when done.
11. Under _Attachment settings_, attach the display to the listing view created in Part 1. Ensure that _Inherit exposed filters_ is set to _Yes_.
    ![Map attachment](/assets/images/posts/maps/map-attachment.jpg)
12. Go to the views page URL and check that your map is rendering correctly.
    ![Map information](/assets/images/posts/maps/map-pop-up.jpg)

## Next steps

Once everything is rendering correctly, it's just a matter of theming the views to look like your design.

![Theming before and after](/assets/images/posts/maps/theming-ba.jpg)

This was pretty much the summary of how I implemented IP Geolocation and Leaflet for [Battlehack](/blog/the-one-without-sleep/). I was quite satisfied with the end result as the map was smooth and responsive. If your project requires map rendering, why not give this combination a try?
