---
date: 2020-10-05T11:59:11+08:00
tags:
- javascript
title: "Migrating mLab to MongoDB Atlas"
---
Well, well, well. It's that time again when I revisit some random thing I built years ago and brace myself for the extent of potential [code rot](https://en.wikipedia.org/wiki/Software_rot).

Confession time. I'm the kind of person who runs `brew update; and brew upgrade` every day. Update first, fix if breaks, is my general way of doing things. In my defense, I only do this for projects I'm wholly responsible for. More restraint is exercised for projects that will impact others.

Anyway, the project in question was this CRUD app I wrote back in 2017 for tracking library books I wanted to check out. I did write [a blog post](/blog/the-one-about-an-app) about that as well. It was so long ago that I actually chuckled when I read it, which is great because if nobody else appreciates my brand of humour, at least I know I still do <span class="emoji" role="img" tabindex="0" aria-label="crazy eyes face">&#x1F92A;</span>.

## Why migrate? Why now?

Excellent question. I didn't plan it. A little while ago, I got a notification email from mLab that they had been acquired by MongoDB and were asking their users to migrate over to MongoDB Atlas.

Apparently this was announced on **October 9, 2018**. Clearly I was not paying attention. I only had one database with mLab anyway and it was for an app with an audience of one, myself. Anyhoo, this is a short documentation of the migration process (which was fairly straightforward except for some tiny issues I ran into) if anyone else also plans to migrate.

Because my little app is so little, the free tier offering was more than enough. I also never had reason to actually log into mLab to look at my database because, like, why?

So if you too forgot what the interface looked like, here it is. Now with a reminder banner to MOVE YOUR SHIT NOW! (not in those words, but still). Targeted at folks like yours truly who disregarded the announcement for the past 2 years.

<img srcset="/assets/images/posts/mlab/mlab-480.png 480w, /assets/images/posts/mlab/mlab-640.png 640w, /assets/images/posts/mlab/mlab-960.png 960w, /assets/images/posts/mlab/mlab-1280.png 1280w" sizes="(max-width: 400px) 100vw, (max-width: 960px) 75vw, 640px" src="/assets/images/posts/mlab/mlab-640.png" alt="mLab dashboard when you log in">

## Does it still run on local?

This is a legitimate concern since I never bothered to isolate my development work in separate environments. Also, I thought it was a great idea to just update everything in `package.json` because why not?

The only major impediment to getting the app to run was this message:

```bash
3:06:32 PM dev.1 |  const authMiddleware = auth.connect(basic)
3:06:32 PM dev.1 |                              ^
3:06:32 PM dev.1 |  TypeError: auth.connect is not a function
```

3 years in, I honestly cannot remember why I went with that implementation but I know I was too lazy to do any proper user management and just wanted the most rudimentary HTTP authentication. The `http-auth` package offers this, but I was clearly not using it in the way their documentation specified.

Maybe things changed over 3 years. No matter, just follow the examples provided in the documentation and we're good to go. Turns out there were no breaking changes after bringing all the dependencies up to current. Looking back at my commit log, I apparently fixed a breaking change with MongoDB back in 2018. I just can't remember anymore.

After that was settled, it was migration time.

## Life is slightly easier with clear documentation

First thing I did was click the link on the banner, which directed me to the documentation on how to migrate. I appreciate the clear and granular instructions and once you sign up for an account on MongoDB Atlas, you can see the workflow integration they built in for migration which you can take advantage of once you connect your mLab account.

<img srcset="/assets/images/posts/mlab/integration-480.png 480w, /assets/images/posts/mlab/integration-640.png 640w, /assets/images/posts/mlab/integration-960.png 960w, /assets/images/posts/mlab/integration-1280.png 1280w" sizes="(max-width: 400px) 100vw, (max-width: 960px) 75vw, 640px" src="/assets/images/posts/mlab/integration-640.png" alt="mLab integration on the MongoDB Atlas dashboard">

The wizard ran for me without too much trouble, so hopefully it works out as smoothly for you as well. Where I ran into trouble was getting my app to connect to the new database. Disclaimer, I don't think this is an mLab/MongoDB Atlas problem. More of a the-issue-is-between-the-monitor-and-the-chair kind of problem.

<img src="/assets/images/posts/mlab/wizard.png" srcset="/assets/images/posts/mlab/wizard@2x.png 2x" alt="Migration checklist wizard on MongoDB Atlas">

On the app side, the only change was for the command to connect to the database. The format provided by mLab is something like this:

```
mongodb://<dbuser>:<dbpassword>@<mlabhost>:<portnumber>/<dbname>
```

It was a copy-paste and it works situation when I set it up back in the day. The format used by MongoDB Atlas is slightly different and the trick was figuring out what it was to connect successfully.

Atlas provides this URI to copy-paste into your application code.

```
mongodb+srv://admin:<password>@<atlashost>/<dbname>?retryWrites=true&w=majority
```

I assumed the credentials from my mLab database would be ported over with no issues but I kept running into authentication issues.

```
4:31:54 PM dev.1 |  MongoNetworkError: failed to connect to server [library-shard-00-01.eljl3.mongodb.net:27017] on first connect [MongoError: bad auth Authentication failed.
```

<img src="/assets/images/posts/mlab/admin.png" srcset="/assets/images/posts/mlab/admin@2x.png 2x" alt="Reset your database user password from the dashboard">

In the end, I gave up and reset the admin password from the Atlas dashboard. If you run into similar authentication issues, you could try this as a last resort? Anyway, if you put this off like I did for 2 years, now is a good time to move your stuff because the deadline for migration is December 8, 2020. Just saying.
