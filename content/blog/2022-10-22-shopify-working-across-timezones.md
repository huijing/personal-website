---
date: "2022-10-22T03:00:00Z"
external_site: shopify
external_url: https://shopify.engineering/a-software-engineers-guide-to-working-across-time-zones
noindex: true
tags:
- devlife
- shopify
title: A Software Engineer's Guide to Working Across Time Zones
---
As a developer based in Singapore, I spend most of my time working with team members who are in time zones roughly nine to 12 hours away. This means the window of opportunity for in-person calls is very slim, unless one party is willing to forgo sleep.

With digital by design being a key aspect of working at Shopify, the words I've often heard associated with cross-time zone teams include (but are not limited to) “challenging”, “tricky”, and “difficulties”. Admittedly, these words accurately describe aspects of cross-time zone work. 

However, things do not have to be as arduous as they seem. Think of it like the difference between real-time data processing and batch data processing. At the end of the day, you want to be on the same page as the rest of your team members. And that can still be possible by thinking ahead and [being deliberate with documentation](https://shopify.engineering/asynchronous-communication-shopify-engineering).

Here are a few things I’ve learned to help make cross-time zone collaboration result in positive experiences.  

## Take Turns Behind the Wheel

Working across time zones is like having a morning person and a night owl together on a long road trip. If both of you take turns behind the wheel, you'll get to your destination much faster (not to mention much safer).

Earlier this year, I participated in Hack Days, a multi-day hackathon inside Shopify, to build a prototype of [Linkpop](https://linkpop.com/), a link in bio tool designed for commerce. Most of the developers on our team were based in North America—12 hours behind Singapore.

I would hack on the frontend during my working hours, plug an update in Slack explaining the work I’d done, as well as any blockers I’d run into (plus whatever direction I tried to resolve the issues), then go to bed. When I woke up, it was almost magical to see how the application progressed while I was asleep.

In that time, the backend functionality expanded, giving me more APIs with which to hook up my frontend. The team also chimed in on the blockers I had described, and provided useful suggestions that helped me move forward. And, according to my teammates, it felt similar on their side.

An example of this workflow is our Plus website Japan phase 2 launch. Senior Front End Developer Robyn Larsen, who is on the west coast of North America, and I worked together to resolve critical pre-launch issues: we each woke up to significant progress in the bugs we had to squash.

## Annotate your PRs

Every PR has a *Files Changed* section that lists every file that you touched, and you can annotate specific lines to explain why you made a certain change, or added a certain block of code.

Personally, I do not do it for every single line change, but when I go through the list of files, I try to pre-empt questions that my teammates might have for parts that are not straightforward. I try my best to frame the annotations so that someone who isn't familiar with our codebase can understand the intent behind my change.

This saves quite a lot of back-and-forth time when the reviewer is [asking clarifying questions](https://shopify.engineering/code-reviews-communication). The back-and-forth is especially unproductive if both parties are on opposite sides of the planet. In a worst case scenario, four rounds of question and answer could take up to a week to play out.

Going through the files changed also serves as a first line of Q&A—you’ll be able to catch the accidental debug statements that were not completely cleaned up, or random typos that were not caught by the linter.

## Post an End-of-Day Summary in Your Team Chat

I'm sure every team at Shopify has their own rituals. But one thing that works well for keeping my teammates updated is a quick end-of-day summary just before I log off.

Again, how you write the update is completely up to you. It can be as structured or casual as you want it to be. I like to write a short one-liner explaining what I worked on, and link to PRs or further documentation for folks who'd like more details.

Let me explain what I mean by further documentation. Sometimes, there will be days where you're in investigation mode, especially early on in the task, and there literally isn't any code to link to. I like to jot down anything and everything I discover about the issue in a comment.

This is helpful to folks you want to hand over the issue to, particularly if the project is a collaborative effort, or even if you just want someone to give you suggestions so you can get unstuck when you wake up the next morning. This way, the other party knows your thought process, how you got there, and where you got stuck.

Your teammate can either spot how you went wrong along the way, or know that you've already tried a certain thing and they need to look elsewhere to tackle the problem. In general, I tend to write as if the reader has zero context, because it forces me to double check if I'm making assumptions.

Maybe this doesn't really happen to you, but more often than not I find the future reader ends up being the future me. So I'm actually trying to help myself. <span class="kaomoji">¯\\\_(ツ)_/¯</span>

## Record Meetings When Some Folks are Not Present

This advice could apply to more folks than those with out-of-time zone colleagues. Sometimes people might be on vacation, or they couldn't make a meeting for some reason or another. The most basic thing is to remember to hit that record button.

At the very least, the people who missed the meeting can catch-up. A step up from recording meetings is taking meeting notes that capture key points/decisions, and all action items.

Note taking might not be something everyone can do well. One way to make the meeting note-taking process easier is to have a clear agenda before the meeting starts, preferably with links to relevant documentation or even Github issues or pull requests. That way, the key decision points can go under each agenda item in an easy-to-follow manner. Unless a topic was purely informational, there should be action items for every item discussed. Of course there might be things that crop up that weren’t on the agenda, but ideally you'd table those for another discussion if they aren't urgent.

## It’s All Timeless Work

If you’ve never had to do this type of documentation before, it can seem like a lot of extra work. But these behaviors also benefit the folks who are in or close to your own time zone. You’ll also be a big help to future you, when you need to refer back to something that happened during a project, a PR or a meeting.

I'll bet most of you cannot remember learning to tie your shoelaces or brushing your teeth. And for a majority of us, these actions have become unremarkable parts of our daily routines. But it felt like a lot of effort when we first started. I'm sure most of us kept at it (or at least, your parents made you keep at it) until it developed into something we could do without thinking twice.

That's what all these suggestions can become: Habits. Actions that become a natural part of how you do things, resulting in a smoother and pleasant collaborative experience for your teammates who are up working while you are sleeping. 

And if you’re the one working while most of your team is sleeping, odds are you get longer bouts of uninterrupted focus time to get your stuff done.
