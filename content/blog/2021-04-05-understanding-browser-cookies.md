---
date: 2021-04-05T20:31:04+08:00
images: 
- /assets/images/posts/cookie.jpg
tags:
- browser-things
title: "Understanding browser cookies 🍪"
---
Even though I've been doing web things for a while now, I confess I had never dealt with browser cookies other than clicking those cookie notifications on every other website you visit these days.

I mean, I knew that it was a form of storage on the browser, but I'd always used `localStorage` for that. Recently I was working on something that used browser cookies and I figured it was a good time to figure them out.

## Why cookie and not some other tasty snack?

I love the name cookie, but I can't help but wonder if there was a reason for it. Turns out I'm not the only person who had that question. And the inventor of browser cookies, [Lou Montulli](http://montulli.blogspot.com/2013/05/the-reasoning-behind-web-cookies.html) explained that he had heard the term ‘magic cookie‘ from an operating systems course in college that had a similar meaning to the way his proposed solution for a session identifier worked.

The original problem he was trying to solve was the implementation of an online shopping cart, which eventually led to the [original specification](https://curl.se/rfc/cookie_spec.html) for persistent client state, and has since evolved into the current [RFC 6265](https://tools.ietf.org/html/rfc6265). The first cookies were used to verify repeat visitors to the Netscape website.

## So how does this non-edible cookie work?

A cookie is a small plain text file stored in the browser. There isn't anything executable in there. It simply contains a small amount of data. Every browser stores them in a slightly different location (e.g. [Where cookies are located in Windows 10, for all web browsers](https://www.digitalcitizen.life/cookies-location-windows-10/)).

The data in the cookie is sent over by the server, stored on the user's browsers, then used in subsequent requests as an identifier of sorts. Cookies are mainly used to remember state (if you are logged in, shopping cart items, user preferences etc.) as well as tracking.

Cookies are created when the server sends over one or more `Set-Cookie` headers with its response, something along these lines:

```
Set-Cookie: NAME=VALUE
```

It could be any name-value pair, but each cookie can contain only 1 name-value pair. If you need more than 1 cookie, then multiple `Set-Cookie` headers are needed. An example of a server sending over cookie headers to the browser looks something like this:

```
HTTP/2.0 200 OK
Content-Type: text/html
Set-Cookie: viola=red_panda
Set-Cookie: mathia=polar_bear
```

As a frontend developer, I must admit I don't debug server-sent headers very often so this is not something I see on a regular basis. Once the cookie is set, all subsequent requests to the server from the browser will also have the cookies in its request header.

```
GET /demos/cookie/ HTTP/2
Host: huijing.github.io
Cookie: viola=red_panda; mathia=polar_bear
```

Even though cookies are usually created on the server, you can also create them on the client-side with Javascript, using `document.cookie`. Browser cookies also have a number of attributes in addition to the name-value pair mentioned earlier.

## Cookie attributes

The cookie name can be any US-ASCII characters except control characters, spaces, tabs or separator characters. The cookie value can be optionally wrapped in double quotes and be any US-ASCII characters except control characters, double quotes, commas, semicolons, backslash and whitespace.

Adding special prefixes to the cookie name also forces certain requirements. If your cookie name starts with `__Secure-`, it must be set with the `secure` flag from a page served with `HTTPS`. If your cookie name starts with `__Host-`, it must be set with the `secure` flag from a page served with `HTTPS`, it must not have a domain specified and its path must be `/`.

The rest of the attributes are optional but can impact cookie behaviour significantly depending on what values are set.

<div class="table">
  <div class="tr">
    <div class="th td">Expires=&lt;date&gt;</div>
    <div class="td">When a cookie passes its expiry date, it will no longer be sent with browser requests, and instead will be deleted. The date value is a HTTP timestamp.</div>
  </div>
  <div class="tr">
    <div class="th td">Max-Age=&lt;number&gt;</div>
    <div class="td">Also related to a cookie’s expiry, but in seconds. After the specified amount of time, the cookie will expire, so setting it to 0 or a negative number means instant expiry. <code>Max-Age</code> takes precedence over <code>Expires</code> if both are set.</div>
  </div>
  <div class="tr">
    <div class="th td">Domain=&lt;domain-value&gt;</div>
    <div class="td">Specifies the host where the browser cookie gets sent to. Only a single domain is allowed. If not present, this defaults to the current document URL’s host. When specified, all sub-domains are included as well.</div>
  </div>
  <div class="tr">
    <div class="th td">Path=&lt;path-value&gt;</div>
    <div class="td">Cookie will only be sent if the path exists in the current URL</div>
  </div>
  <div class="tr">
    <div class="th td">Secure</div>
    <div class="td">Cookie will only be sent when the request is made with HTTPS</div>
  </div>
  <div class="tr">
    <div class="th td">HttpOnly</div>
    <div class="td">Javascript cannot access the cookie through <code>document.cookie</code> (to mitigate XSS attacks)</div>
  </div>
  <div class="tr">
    <div class="th td">SameSite=&lt;samesite-value&gt;</div>
    <div class="td">Specifies if a cookie is sent with cross-origin requests.
      <ul>
        <li class="no-margin"><code>Strict</code> means the cookie is only sent for requests originating from the same URL as the current one.</li>
        <li class="no-margin"><code>Lax</code> means the cookie is not sent on cross-site requests, but will be sent if the user navigates to the origin site from an external site.</li>
        <li><code>None</code> means the cookie will be sent on both same-site and cross-site requests, but can only be used if the <code>Secure</code> attribute is also set.</li>
      </ul>
    </div>
  </div>
</div>

If you use Firefox, you may notice a console log message like this on some websites.

<img srcset="/assets/images/posts/cookie/samesite-480.png 480w, /assets/images/posts/cookie/samesite-640.png 640w, /assets/images/posts/cookie/samesite-960.png 960w, /assets/images/posts/cookie/samesite-1280.png 1280w" sizes="(max-width: 400px) 100vw, (max-width: 960px) 75vw, 640px" src="/assets/images/posts/cookie/samesite-640.png" alt="Console message in Firefox stating Some cookies are misusing the SameSite attribute, so it won't work as expected">

Back in August 2020, Mozilla [made the decision](https://hacks.mozilla.org/2020/08/changes-to-samesite-cookie-behavior/) to treat cookies as `SameSite=Lax` by default, and require cookies with `SameSite=None` to also set the `Secure` attribute. The original behaviour for cookies was `SameSite=None` but this leaves users susceptible to [Cross-Site Request Forgery](https://developer.mozilla.org/en-US/docs/Glossary/CSRF) attacks.

Both Chrome and Firefox has rolled this out, but it seems like only Firefox displays the console log warning? If you can verify the console logging situation, please let me know.

## Using cookies to do stuff

Cookies without an `Expires` or `Max-Age` attribute are treated as session cookies, which means they are removed once the browser is closed. Setting a value on either `Expires` or `Max-Age` makes them permanent cookies, since they will exist until they hit their expiry date.

Again, I usually don't do server-side stuff so I'll only talk about messing around with cookies on the client-side. The `Document` has a `cookie` property that lets us read and write browser cookies via Javascript.

To see all cookies associated with the document, use `document.cookie`. You can type this in the browser's console and see something like this:

<img src="/assets/images/posts/cookie/allcookies.png" srcset="/assets/images/posts/cookie/allcookies@2x.png 2x" alt="Running document.cookie in the browser console">

To create a new cookie, you can do something like this:

```
document.cookie = "xiaohua=tortoise"
```

If you need more than one cookie, you'll have to do this for every cookie you want to create.

<img src="/assets/images/posts/cookie/create.png" srcset="/assets/images/posts/cookie/create@2x.png 2x" alt="Create a new cookie in the browser console">

Even if you refresh the page, the cookie should still be there. To get rid of the cookie, or reset it, you can set the `Expires` value to the beginning of time itself, `Thu, 01 Jan 1970 00:00:00 GMT`. I'm semi-kidding. Just in case you never heard of this interesting (and fairly important) piece of trivia, I shall quote MDN:

> A JavaScript date is fundamentally specified as the number of milliseconds that have elapsed since midnight on January 1, 1970, UTC. This date and time are not the same as the UNIX epoch (the number of seconds that have elapsed since midnight on January 1, 1970, UTC), which is the predominant base value for computer-recorded date and time values.

For example, if I wanted to get rid of the `taria` cookie, I would do this:

```
document.cookie = "taria= ;expires=Thu, 01 Jan 1970 00:00:00 GMT"
```

<img src="/assets/images/posts/cookie/reset.png" srcset="/assets/images/posts/cookie/reset@2x.png 2x" alt="Reset a cookie in the browser console">

Because cookies are strings, doing things based on cookie data involves mostly string manipulation. So I won't go into that in detail, but here's [a ridiculous demo](https://huijing.github.io/demos/cookie/) you can play around with, ideally with DevTools open. It just randomly assigns a group cookie, then shows you something different based on that.

<a href="https://huijing.github.io/demos/cookie/"><img srcset="/assets/images/posts/cookie/demo-480.png 480w, /assets/images/posts/cookie/demo-640.png 640w, /assets/images/posts/cookie/demo-960.png 960w, /assets/images/posts/cookie/demo-1280.png 1280w" sizes="(max-width: 400px) 100vw, (max-width: 960px) 75vw, 640px" src="/assets/images/posts/cookie/demo-640.png" alt="Screenshot of cookie demo site"></a>

## Wrapping up

It's been a while since I last published anything. I suppose this is the longest hiatus I've had since I started this blog, but somehow being stuck in the same place doesn't seem to motivate me to write words. But we'll see.

Meanwhile, go eat some of your favourite cookies.

## Resource links

<ul>
  <li class="no-margin"><a href="https://blogs.gartner.com/martin-kihn/cookies-chaos-and-the-browser-meet-lou-montulli/">Cookies, Chaos and the Browser: Meet Lou Montulli</a></li>
  <li class="no-margin"><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies">Using HTTP cookies</a></li>
  <li class="no-margin"><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie">Set-Cookie</a> on MDN</li>
  <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie">Document.cookie</a> on MDN</li>
</ul>

<em><small>Credits: OG:image from <a href="https://youtu.be/9pfL8-MP39Y"> Red Panda Loves Cookies</a> video on Oregon Zoo Youtube channel</small></em>

