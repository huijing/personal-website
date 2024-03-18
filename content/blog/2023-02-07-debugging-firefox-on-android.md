---
date: 2023-02-07T22:54:24+08:00
images:
  - /assets/images/posts/firefox-android/debugging-1280.jpg
tags:
  - css
  - devtools
title: "Debugging Firefox on Android"
---

I just figured out how to get my Android phone recognised by [Android Debug Bridge (`adb`)](https://developer.android.com/studio/command-line/adb.html) on my MacBook, which finally allowed me to remote debug websites on Firefox Android. Just so I don't forget what I did, this is a short documentation of the steps needed to get everything to work. Hopefully it will stay relevant for a good while.

Firefox official documentation is actually very clear: [about:debugging](https://firefox-source-docs.mozilla.org/devtools-user/about_colon_debugging/index.html), however, the first time I tried it, I could not for the life of myself get it to work. <span class="kaomoji">¯\\\_(ツ)\_/¯</span>

<ol>
  <li class="no-margin">Enable Developer menu on your Android device.</li>
  <li class="no-margin">Enable USB Debugging in the Android Developer Menu.</li>
  <li class="no-margin">Enable USB Debugging in Firefox on the Android device.</li>
  <li>Connect the Android device to your computer.</li>
</ol>

> First make sure you have installed Android Debug Bridge from Android Tools on your computer in order for it to be able to connect to your device. You do not need to install the full Android Studio SDK. Only adb is needed.

To install `adb`, download the SDK Platform Tools from <a href="https://developer.android.com/studio/releases/platform-tools.html" style="word-break: break-all">https://developer.android.com/studio/releases/platform-tools.html</a>, there are versions for every OS but I'm using Mac specifically.

After that, unzip the files into an easily accessible folder on your computer. From the command line, navigate to folder and run `./adb devices` to see list of devices connected.

If no devices show up, then the issue might be on the Android device side of things. Following the advice from [this Stack Overflow post](https://stackoverflow.com/questions/21170392/my-android-device-does-not-appear-in-the-list-of-adb-devices), what worked for both my Android 11 and Android 12 devices was to switch the USB configuration to `PTP (Picture Transfer Protocol)`.

After that running `./adb devices` actually did list something.

![adb list showing device connected](/assets/images/posts/firefox-android/adb-list.png)

Go back to `about:debugging` and refresh the page. If the devices are listed on the command line, they will show up in the left sidebar (at least they did for me).

{{<img4w filename="posts/firefox-android/setup" filetype="png" alt="Setup for remote debugging">}}

Happy debugging!

{{<img4w filename="posts/firefox-android/debugging" filetype="jpg" alt="Inspecting remotely with devtools">}}
