---
date: 2024-07-05T09:10:21+08:00
images:
  - /assets/images/posts/experimental-css.jpg
tags:
  - css
title: "How to try experimental CSS features"
---

I love that browsers are now shipping new CSS features that may not necessarily have been fully baked yet behind feature flags. I can't actually pinpoint the exact date or event that started this, but my personal observation (because I was there) tags it at the development of CSS grid.

If you were not around for it, all the major browsers supported the stable version of CSS grid within 8 months of each other. Trust me, I took the time to check the dates in order to make this image for my talks.

{{<img4w filename="posts/experimental-css/grid-release" filetype="png" alt="Dates when CSS grid where released in 2017">}}

Browser vendors and CSS specification authors want real-world developer feedback during the feature development process to work out the kinks in the proposals and implementations.

They had tried using vendor prefixes as an earlier approach, and we ended up with a decade's worth of baggage, where browsers had to support property names that were deprecated in the specification because there will be people who inevitably [choose to eat the marshmallow quickly instead of waiting it out](https://en.wikipedia.org/wiki/Stanford_marshmallow_experiment) and use features that are not ready in production.

When CSS grid rolled around, they tried a different approach. CSS grid was available to developers who wanted to try it out but behind feature flags in the respective browsers. This meant that the developer who decided to use the not-yet-ready feature had to bank on their audience turning on the flag themselves, and we all know that's not likely to happen.

Which is why when browsers rolled out CSS grid in their stable versions, they did not have to worry about having to support earlier iterations of the syntax running around in the wild, because those were really quite minimal. The approach worked. And I think that's why it has become a standard approach to how new CSS features are being released these days.

## The UI of feature flags

Every browser handles their feature flags differently, and after seeing Safari's approach for the first time today, I thought I'd summarise how the major browsers we develop on do this. I asked ChatGPT when each of the big 3 introduced feature flags and here are the answers.

<span class="emoji" role="img" tabindex="0" aria-label="woman raising hand">&#x1F64B;&#x1F3FB;&#x200D;&#x2640;&#xFE0F;</span>: when did chrome introduce feature flags?  
<span class="emoji" role="img" tabindex="0" aria-label="robot">&#x1F916;</span>: Google Chrome introduced feature flags (also known as experimental features) with the launch of Chrome 8 in **December 2010**. Feature flags allow users to enable or disable various experimental features and options before they are officially released, by visiting chrome://flags in the browser.

<span class="emoji" role="img" tabindex="0" aria-label="woman raising hand">&#x1F64B;&#x1F3FB;&#x200D;&#x2640;&#xFE0F;</span>: when did firefox introduce feature flags?  
<span class="emoji" role="img" tabindex="0" aria-label="robot">&#x1F916;</span>: Mozilla Firefox introduced feature flags, accessible via about:config, much earlier than Chrome. The about:config interface has been available since at least Firefox 2, which was released in **October 2006**. This interface allows users to modify advanced settings and enable or disable experimental features.

<span class="emoji" role="img" tabindex="0" aria-label="woman raising hand">&#x1F64B;&#x1F3FB;&#x200D;&#x2640;&#xFE0F;</span>: and when did safari roll out it's new feature flag tab in developer settings?  
<s><span class="emoji" role="img" tabindex="0" aria-label="robot">&#x1F916;</span>: Safari rolled out its new feature flag tab in the Developer settings with the release of Safari 13, which was introduced in **September 2019**. This feature, accessible through the "Develop" menu, allows developers to enable or disable experimental features and technologies in the browser.</s>

I think these should be largely accurate, someone tell me if they're not.

_Update! ChatGPT is wrong!! Someone did tell me! Specifically [Curtis Wilcox](https://scholar.harvard.edu/ccwilcox/people/curtis-wilcox) and [Jen Simmons](https://jensimmons.com/)_ <span class="emoji" role="img" tabindex="0" aria-label="person bowing">&#x1F647;&#x1F3FB;</span>

<iframe src="https://c.im/@cwilcox808/112734737122814176/embed" width="400" height="330" allowfullscreen="allowfullscreen" sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"></iframe>

<iframe src="https://front-end.social/@jensimmons/112735884858878928/embed" width="400" height="480" allowfullscreen="allowfullscreen" sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"></iframe>

### Safari

Admittedly, Safari is not a browser I use on the regular, only when testing, and it is generally a cursory load page, scroll page, move on to next page, kind of thing. So sadly, it was only recently (~~5 years~~ 10 months after release) that I noticed “Feature Flags” had a dedicated tab in Developer settings.

{{<img2x filename="posts/experimental-css/safari" filetype="png" alt="Feature flag tab in Safari's developer settings">}}

To me, this is a significant improvement in developer experience because it makes testing new features (not just CSS but all the other web APIs) easily discoverable and toggleable (this is not a word, I know).

<p class="no-margin">The steps for Safari are:</p>

<ol>
  <li class="no-margin">From the menu bar choose Develop &gt; Feature Flags…</li>
  <li class="no-margin">Scroll through the list and pick what you want to try</li>
  <li class="no-margin">Toggle the respective checkbox</li>
  <li>Relaunch the browser</li>
</ol>

That's it. Feature flags have been elevated to a first-class developer feature in Safari, given it gets dedicated menu shortcut space in the Develop dropdown. So I'm pretty impressed by this experience. You can read [Safari's documentation](https://developer.apple.com/documentation/safari-developer-tools/feature-flag-settings) for more details.

### Chrome

Chrome doesn't do feature flags that granularly (at least that's my observation). But they have had this feature for as long as since I started really deep diving into CSS. Chrome does flags in a broader manner and it can be summarised as major features, which have feature-specific flags, smaller features which take around 1-2 quarters of work under `#enable-experimental-web-platform-features` and very rarely, features that only ship in Canary.

{{<img2x filename="posts/experimental-css/chrome" filetype="png" alt="Feature flags interface on Chrome">}}

<p class="no-margin">The steps for Chrome are:</p>

<ol>
  <li class="no-margin">Type <code>chrome://flags</code> in your address bar</li>
  <li class="no-margin">Search for the feature</li>
  <li class="no-margin">Set value to <strong>Enabled</strong></li>
  <li>Relaunch the browser</li>
</ol>

{{<img2x filename="posts/experimental-css/chrome2" filetype="png" alt="Using the search bar on the feature flags interface in Chrome">}}

Might be less intuitive than the Safari interface, and I'm not too sure where to find the list of features covered in under the `#enable-experimental-web-platform-features` flag, but still, good enough for me. You can read [Chrome's documentation](https://developer.chrome.com/docs/web-platform/chrome-flags) for more details.

### Firefox

Firefox takes the granular approach as well, but in a more “raw” manner. Basically, after you get past the Here be dragons message (I think they changed the copy but it was fun back then), you get a blank results screen that again warns you of messing up the browser. But once you click “Show all”, you will notice that the flags follow a naming convention.

{{<img2x filename="posts/experimental-css/firefox" filetype="png" alt="Initial screen in Firefox's configuration interface">}}

I think these flag names are exposed from their usage in the source code (see <a href="https://searchfox.org/mozilla-central/source/modules/libpref/init/StaticPrefList.yaml">StaticPrefList.yaml</a>), because if you do it like Safari or Chrome, there's probably an extra mapping to link the actual source code to the presentation of the feature in plain English. Just my speculation.

<p class="no-margin">The steps for Firefox are:</p>

<ol>
  <li class="no-margin">Type <code>about://config</code> in your address bar</li>
  <li class="no-margin">Accept the risk and continue knowing that you might screw up your browser messing with flags</li>
  <li class="no-margin">Search for the feature you want</li>
  <li class="no-margin">Double-click on the feature to toggle it. You can also change string values if that is relevant.</li>
  <li>Relaunch the browser</li>
</ol>

{{<img2x filename="posts/experimental-css/firefox2" filetype="png" alt="Using the search bar on the feature flags interface in Firefox">}}

The search function is pretty crucial here, but overall, you know which features you're toggling, and because it covers all browser features, it's not simply boolean, there are string and number values you can manipulate as well. I guess that's why there's an extra layer of here be dragons before letting you play around. You can read [Firefox's documentation](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Experimental_features) for more details.

## Wrapping up

Well, that's it. Nice and short. Keep exploring, but don't blow up your browser!

<em><small>Credits: OG:image from <a href="https://www.deviantart.com/egor412112/art/Cat-scientist-752200669">Egor412112</a></small></em>
