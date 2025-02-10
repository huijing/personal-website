---
date: 2025-02-10T12:14:50+08:00
images:
  - /assets/images/posts/learning-web-extensions.jpg
tags:
  - html
  - css
  - javascript
title: "Learning web extensions"
---

I blinked and the first month of 2025 went by. NGL, 2024 was…challenging. So forgive me for choosing to just shut down during the end of last year. But I did do some things that I thought were worth sharing and I have deferred that until now.

It's the first day of the Lunar New Year and I'm sitting in my childhood bedroom at mom's house typing this up on top of her sewing machine. <span class="kaomoji">¯\\\_(ツ)\_/¯</span> _Update: I did not finish this until 2 weeks later, don't judge._

## Why web extensions?

There was a point in time where I did a lot of conference speaking, and that died down quite a bit during the pandemic, but occasionally I will still talk to people about building stuff on the web. So I gave a talk titled "[Expanding the browser experience with web extensions](https://javascript-conference.com/javascript-practices-tools/browser-extensions-html-css-javascript/)" at InternationalJS Singapore.

My interest in web extensions stemmed from the fact that our team at the [Interledger Foundation](https://interledger.org/) has been working toward getting the [Web Monetization](https://webmonetization.org/) [standard](https://webmonetization.org/specification/) implemented in browsers.

But most of us familiar with web standards know that realistically, getting a new feature into browsers is comparable to watching your toddler finally pack up and leave for college.

No I'm just joking.

Kinda.

The next best thing we could do was to build a web extension that would implement all the behaviours specified in the standard so we could get feedback on what we were proposing, allowing us to make adjustments to how we envisioned how the APIs would work and hopefully enhance the overall experience of web monetization.

## What is a web extension?

This post will NOT be talking about what the boys did to build the web monetization because that has now become a beast of a piece of software at this point. You can read [Sid Vishnoi](https://sidvishnoi.com/)'s blog post on [End-to-end testing the Web Monetization browser extension](https://interledger.org/developers/blog/e2e-testing-wm-browser-extension/) on our engineering blog to get an idea of the scope of the extension.

No, we are going to the basics of basics of web extensions. Because we have to learn to flip over and sit up before we can even stand.

The [Web Extensions community group](https://www.w3.org/community/webextensions/) on W3C was launched in 2021, initiated by Apple, Google, Microsoft and Mozilla with the aim of aligning on a common vision for browser extensions and to work towards future standardisation.

The heart of an extension is the _manifest.json_ file, which is the only mandatory file that must exist in any web extension. The manifest file contains metadata about the extension, as well as pointers to other files that make up the extension.

These other files include background scripts, sidebars, popups and options pages, extension pages, content scripts and web accessible resources.

This _manifest.json_ file has a specific syntax, and as of time of writing, the latest syntax is supposed to be v3. If you've never followed the development of web extensions over time, you might not be aware that there has been quite some controversy around v3.

I won't go into all the detail but to summarise the key criticisms: v3 has reduced web extensions from being treated like a first-class application with their own persistent execution environment to being treated like accessories with limited privileges and reactive execution capabilities. This is largely a consequence of making service workers mandatory and removing the “blocking webRequest” mechanism.

Feel free to ask the Googles for more information if you're interested.

### The _manifest.json_

Here's an example of an extension that does nothing but showcases the bare requirements for the browser to recognise an extension exists:

```json
{
  "manifest_version": 3,
  "name": "AE1",
  "version": "1.0",

  "description": "This extension doesn't actually do anything",
  "icons": {
    "32": "icons/icon32.png",
    "48": "icons/icon48.png"
  },

  "action": {
    "default_popup": "nothing.html"
  }
}
```

Full code here: [https://github.com/huijing/slides/tree/gh-pages/109-ijs-2024/extensions/AE1](https://github.com/huijing/slides/tree/gh-pages/109-ijs-2024/extensions/AE1)

The _manifest.json_ will have the 3 mandatory keys, of `manifest_version`, `name` and `version`. Included in the example is also the `description`, `icons` and `action` keys.

Although `description` and `icons` are optional, they are required if you want to publish your extension to the Chrome Web Store. They also do enhance the user experience, because they give your extension a pretty icon and a proper description.

`action` determines how the extension looks like in the browser toolbar, and what clicking on it does. `popup` can contain any HTML content and the window will be automatically sized to fit the content.

```html
<html>
  <body>
    <h1>Nothing</h1>
  </body>
</html>
```

To add some style and interactivity to the extension, CSS and Javascript can be included by link or style and script elements.

```html
<html>
  <body>
    <h1>Nothing</h1>
    <button>Something</button>
  </body>
  <style>
    body {
      text-align: center;
    }
  </style>
  <script src="nothing.js"></script>
</html>
```

```javascript
document.querySelector("button").addEventListener("click", () => {
  document.querySelector("h1").style.color = "tomato";
});
```

The environment in which the popup operates is isolated from the web page content loaded by the browser. In this example, `nothing.js` targets the extremely generic tag elements of `button` and `h1`, but the above code only affects the elements in the pop-up and not anything on the web page.

If you're a frontend developer like me, you might prefer to have some visual feedback that your code has done something.

To load the extension in Firefox, you'll have to load it up as a temporary add-on. The option to reload the extension after you made changes to the source is also available.

For Chrome, you'll have to enable Developer Mode before you can load the unpacked extension. The same source works in both browsers.

### Content scripts

When we want the extension to actually do something to the content on a web page, we will have use content scripts, which run in the context of the browser's loaded web page. This is the only way we can access content on the page from the extension.

There are 3 ways to load an extension's content script into the web page, namely via static declaration, dynamic declaration or programmatically. These different methods allow for the widest range of use cases, whether you want the extension to modify the default experience out-the-box or based on specific triggers.

Content scripts are isolated, in the sense that it can make changes to its own JavaScript environment without conflicting with the page or other extensions' content scripts. Even though content scripts can access and change the DOM, they only see the "clean" version of the DOM that has not been modified by any JavaScript.

Firefox and Chrome handle this isolation behaviour differently. In Firefox, the concept is called [Xray vision](https://firefox-source-docs.mozilla.org/dom/scriptSecurity/xray_vision.html), where content scripts may encounter JavaScript objects from its own global scope or Xray-wrapped versions from the web page.

While for Chrome, there exists the concept of 3 kinds of worlds, a main world, an [isolated world](https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts#isolated_world) and a worker world. Each world has its own context, its own global variable scope and prototype chains.

Content scripts have access to a specific and limited set of extension APIs directly, but for other APIs, a form of message exchange is required, which we will briefly touch upon in the next example.

This extension consists of a button that will take over the entire web page and cover it with some pixel art sourced from the interwebs. Full code here: [https://github.com/huijing/slides/tree/gh-pages/109-ijs-2024/extensions/AE2](https://github.com/huijing/slides/tree/gh-pages/109-ijs-2024/extensions/AE2)

```json
{
  "manifest_version": 3,
  "name": "AE2",
  "version": "1.0",
  "description": "Activate pixel art",
  "icons": {
    "32": "icons/icon32.png",
    "48": "icons/icon48.png"
  },
  "permissions": ["activeTab", "scripting"],
  "action": {
    "default_popup": "pixel.html"
  },
  "web_accessible_resources": [
    {
      "resources": [
        "images/pixel-adventure-time.png",
        "images/pixel-cat.jpg",
        "images/pixel-city.png",
        "images/pixel-zen-garden.png"
      ],
      "extension_ids": ["*"],
      "matches": ["*://*/*"]
    }
  ]
}
```

For the extension to recognise and load images, they need to be declared in the _manifest.json_ file with the `web_accessible_resources` key. The extension also needs the `activeTab` permission, which grants the extension extra privileges for the active tab only when an user interaction occurs and the scripting permission, which is required to use methods from the scripting API called in the content script.

```javascript
let id;
browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  id = tabs[0].id;
  browser.scripting.executeScript({
    target: { tabId: tabs[0].id },
    files: ["content.js"],
  });
  browser.scripting.insertCSS({
    target: { tabId: tabs[0].id },
    files: ["content.css"],
  });
});

document.getElementById("pixelate").addEventListener("click", () => {
  browser.tabs.sendMessage(id, { message: "pixelate" });
});

document.getElementById("reset").addEventListener("click", () => {
  browser.tabs.sendMessage(id, { message: "reset" });
});
```

`browser.tabs.query()` is used to obtain information about the tab we want to target, specifically, the tab ID, because the scripting method requires a tab ID to be passed into it, which makes sense since we have to specify the target we want to inject our script into, right?

Same goes for injecting CSS. Was it possible to style the stuff being injected via JavaScript? Of course, it is. Should we do it that way? It's really up to you. I personally like my styles in CSS files, that's all.

So what's this `sendMessage()` method then? Well, because content scripts run in the context of the web page and not the extension itself, this is the way for the content script to communicate with the extension. The extension and the content scripts will listen for each other's messages and respond on the same channel.

To access images supplied with the extension, the `runtime.getURL()` method is used, which converts the relative path of the image into a fully-qualified URL that the browser can render properly. And finally, the `runtime.onMessage()` event is used to listen for messages.

### Background scripts

Another type of script that is seen in web extensions are background scripts. They are meant to monitor events in the browser and react to them accordingly. For example, if we wanted to implement keyboard shortcuts for our extension, we could make use of a background script to listen for specific commands and trigger some action accordingly.

The next example will add some keyboard shortcuts to the extension by making use of a background script. Full code here: [https://github.com/huijing/slides/tree/gh-pages/109-ijs-2024/extensions/AE3](https://github.com/huijing/slides/tree/gh-pages/109-ijs-2024/extensions/AE3).

There are some additions that need to be made to the _manifest.json_ file to get things to work.

```json
{
  "background": {
    "service_worker": "background.js", // v3 syntax
    "scripts": ["background.js"] // v2 syntax
  },
  "commands": {
    "_execute_action": {
      "suggested_key": {
        "default": "Ctrl+Shift+Y"
      }
    },
    "pixelate": {
      "suggested_key": {
        "default": "Alt+A"
      },
      "description": "Send a 'pixelate' event to the extension"
    },
    "reset": {
      "suggested_key": {
        "default": "Ctrl+Shift+E"
      },
      "description": "Send a 'reset' event to the extension"
    }
  }
}
```

The Commands API lets us define commands and bind them to specific key combinations. These commands must first be declared as properties in the _manifest.json_ file. We then listen for an onCommand event to be fired using the background script and run whatever we want to run when the correct key combination is pressed.

There are 4 special shortcuts with default actions for which the `onCommand` event doesn't fire, and `_execute_action` is one of them. This shortcut acts as if the user clicked on the extension icon in the toolbar.

In the _background.js_ file, we make use of the `onCommand.addListener` to bind a handler to each of the commands listed in the manifest. As mentioned previously, the `_execute_action` command doesn't trigger an event, so we don't need a handler for that.

## Wrapping up

This covers all the basic information required to get started with web extension development. The extension can be as simple as changing the colour of text on the page or as complicated as a full-fledged application (yes, you can use React to build your extension if you so choose).

I suppose if you're wary of dodgy extension store downloads, you could always build your own extension to do exactly what you want it to do, so why not?
