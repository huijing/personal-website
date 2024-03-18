---
date: 2024-03-18T10:48:51+08:00
images:
  - /assets/images/posts/astro-calendar.jpg
tags:
  - astro
title: "Generating a weekly calendar from JSON data"
---

The original purpose of this blog was for me to document solutions that I spent hours figuring out at work, which means it's not my code therefore I cannot take it wholesale with me. I just extract the key parts, remove any references (or try to) to the original project and hopefully the next time I run into the problem, I have a solution.

Over the years, it has expanded to include code which had to be thrown away due to deprecated features, but the code is still good. Especially if I had called in favours with a smart friend to pair program the solution. You know who you are, [Yishu](https://yishus.dev/).

## Context

I needed a page that would display event data from a JSON file. The events should be displayed by month, but further broken down into columns for each week of the month.

![Mockup of how the Calendar layout looks](/assets/images/posts/astro-calendar/mock.svg)

And maybe display current month and the next month. Why not?

I wanted to keep the data file as simple as possible because it would potentially be updated by non-developers. (Some people might already be thinking, good luck with that one, but hey, sometimes I get a flash of random optimism in my life. <span class="kaomoji">乁 ⁠(⁠ ⁠•⁠_⁠•⁠ ⁠)⁠ ㄏ</span>)

So the data file looks like this:

```json
[
  {
    "title": "ABC",
    "date": "2024-03-03",
    "description": "1-line description"
  },
  {
    "title": "DEF",
    "date": "2024-03-04",
    "description": "1-line description"
  },
  {
    "title": "GHI",
    "date": "2024-04-15",
    "description": "1-line description"
  }
]
```

## Implementation time

What is a frontend developer other than someone who takes some raw data, massages it all around and makes sure the generated markup is semantic and fulfils layout goals? (A lot more than that but this is a big part of the job, no?)

The nice thing about Astro is that I can write the logic in plain Javascript (actually Typescript) on the component file itself. Then the plain CSS is also in the same file, wrapped in `<style>` tags.

The slightly more complicated part is putting the computed values from Javascript into the markup correctly. Life's not perfect, we deal with it.

I did make an effort to make my function names descriptive, so we'll see if I can still understand what everything does when I refer back to this code in a couple months (because the feature magically came back or something).

```javascript
import eventsData from "../data/calendar.json";

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();
const nextMonth = currentMonth + 1;
const months = Array.from({ length: 12 }, (e, i) => {
  return new Date(1970, i, 1).toLocaleDateString("en", { month: "long" });
});

const getISOWeekNumber = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  return Math.ceil(
    ((+d - +new Date(d.getFullYear(), 0, 1)) / 86400000 + 1) / 7
  );
};

const allEventsGroupedByWeek = eventsData.reduce((acc, obj) => {
  const week = getISOWeekNumber(obj.date);
  if (!acc[week]) {
    acc[week] = [];
  }
  acc[week].push(obj);
  return acc;
}, {});

const eventsByMonth = (eventsData, monthIndex) => {
  const filteredEvents = {};
  for (const week in eventsData) {
    const eventsForWeek = eventsData[week].filter((event) => {
      const eventMonth = parseInt(event.date.split("-")[1], 10);
      return eventMonth === monthIndex + 1;
    });
    if (eventsForWeek.length > 0) {
      filteredEvents[week] = eventsForWeek;
    }
  }
  return filteredEvents;
};

const getWeeksOfYear = (year) => {
  const weeksArray: Array<{ start: Date, end: Date }> = [];
  const startDate = new Date(year, 0, 1); // January 1st of the given year

  // Calculate the offset to the next Monday
  const dayOffset = (8 - startDate.getDay()) % 7;
  startDate.setDate(startDate.getDate() + dayOffset);

  while (startDate.getFullYear() === year) {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6); // End date is 6 days after the start date (a week)
    weeksArray.push({
      start: new Date(startDate),
      end: new Date(endDate),
    });
    startDate.setDate(startDate.getDate() + 7); // Move to the next week
  }
  return weeksArray;
};

const generateWeekLabel = (year, weekNumber) => {
  const weeksArray = getWeeksOfYear(year);
  const targetWeek = weeksArray[weekNumber - 1];
  const weekLabel = `Week ${weekNumber}: ${targetWeek.start
    .toDateString()
    .slice(4, 10)}–${targetWeek.end.toDateString().slice(4, 10)}`;
  return weekLabel;
};

const replaceWeekNumber = (eventsData) => {
  for (const [key, value] of Object.entries(eventsData)) {
    eventsData[generateWeekLabel(currentYear, key)] = value;
    delete eventsData[key];
  }
  return eventsData;
};

const renderCurrentMonthEvents: {
  [key: string]: Array<{ title: string, date: string, description: string }>,
} = replaceWeekNumber(eventsByMonth(allEventsGroupedByWeek, currentMonth));
const renderNextMonthEvents: {
  [key: string]: Array<{ title: string, date: string, description: string }>,
} = replaceWeekNumber(eventsByMonth(allEventsGroupedByWeek, nextMonth));
```

Even though the markup looks reasonably straightforward, figuring out the correct syntax was not. Do you know how many `console.log()`s were needed to figure out `{key.split(":")[1]}`??

```jsx
<section>
  <h2>
    {months[currentMonth]}&nbsp;{currentYear}
  </h2>
  <ul>
    {Object.entries(renderCurrentMonthEvents).map(([key, value], i) => (
      <li>
        <p class="week-dates" data-week-label={key.split(":")[0]}>
          {key.split(":")[1]}
        </p>
        {value.map((event) => (
          <div class="event-info">
            <p>{event.title}</p>
            <p>{event.date}</p>
            <p>{event.description}</p>
          </div>
        ))}
      </li>
    ))}
  </ul>
</section>
```

Might as well throw in the styling as well. It's super uncomplicated. Grid makes life easy.

```css
ul {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  list-style: none;
  padding: 0;
  gap: 2em;
}
```

Which gives you something that ends up looking like this, if you have more entries in the data file.

{{<img2x filename="posts/astro-calendar/result" filetype="png" alt="Events laid out in weekly columns grouped by month">}}

## Wrapping up

So now we wait and see if this feature will ever come back. I mean, if we're still using the same tech stack and repository, I could probably just find the old file from git. But if not, future me better understand all the code in this post. We'll see.
