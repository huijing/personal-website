---
date: "2020-04-28T00:00:00Z"
external_site: nexmo
external_url: https://www.nexmo.com/blog/2020/04/28/stream-a-video-chat-with-vonage-video-api-dr
noindex: true
tags:
- nodejs
- javascript
- nexmo
title: Stream a Video Chat With the Vonage Video API
---
This series of tutorials will explore the [Vonage Video API (formerly TokBox OpenTok)](https://tokbox.com/developer/) and what you can build with it. The Video API is very robust and highly customizable, and in each post we’ll show how to implement a specific feature using the API. This time we will look at how to stream your video chat to an audience who is not in the chat.

As this application will require some server-side code, we will use [Glitch](https://glitch.com/) for ease of setup. You can also download the code from this Glitch project and deploy it on your server or hosting platform of choice (may probably require some configuration tweaking based on the requirements of your platform).

We will not be using any front-end frameworks for this series, just vanilla Javascript to keep the focus on the Video API itself. At the end of this tutorial, your video chat application should also provide an option to simply watch the video chat stream.

![Screenshot of viewer page](https://cdn.glitch.com/19f09a76-139f-49d3-9031-bb23315fae17%2Fviewer.jpg?v=1586797944330)

The **final code** for this application can be found in this [GitHub repository](https://github.com/nexmo-community/stream-video-chat) or [remixed on Glitch](https://glitch.com/edit/#!/remix/stream-video-chat).

## Prerequisites

Before we get started, you will need a Vonage Video API account, which you can create for free [here](https://tokbox.com/account/user/signup). You will also need [Node.js](https://nodejs.org/en/) installed (if you are not using Glitch).

This tutorial builds on the first introductory post in the series: [Building a Basic Video Chat](https://glitch.com/edit/#!/basic-video-chat?path=README.md). If this is your first time using the Video API, we highly suggest you go through that because it covers the following basic setup:

- Create a Vonage Video API project
- Setting up on Glitch
- Basic project structure
- Initializing a session
- Connecting to the session, subscribing and publishing
- Basic layout styles for a video chat

## Token Creation and Roles

Every user that connects to a session needs to be authenticated with a token. Each token is assigned a role, which determines what the client can do when they are connected. There are three available roles, *Subscriber*, *Publisher* and *Moderator*. We will only be using the first two for this tutorial.

A publisher can connect to sessions, publish audio-video streams to the session and subscribe to other clients' sessions. A subscriber can connect to sessions and subscribe to other clients' sessions but **cannot publish** to the session. 

![Crude illustration of subscribers and publishers](https://cdn.glitch.com/19f09a76-139f-49d3-9031-bb23315fae17%2Fsketch.png?v=1586578569895)

For this tutorial, we will provide participants with publisher tokens, while viewers get subscriber tokens.

More information about tokens can be found [in the documentation](https://tokbox.com/developer/guides/create-token/).

## Initial Setup

As we are building onto a basic video chat, start off by remixing the project for the basic video chat built in the previous tutorial. Click the big Remix button below to do that. 👇

<a href="https://glitch.com/edit/?utm_content=project_basic-video-chat&utm_source=remix_this&utm_medium=button&utm_campaign=glitchButton#!/remix/basic-video-chat">
  <img src="https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fremix%402x.png?1513093958726" alt="remix this" height="33">
</a>

Your folder structure should resemble something like this:

![Folder structure of the project](https://cdn.glitch.com/0d17c722-4359-4e32-b770-32fcae5a3653%2Fglitch-02.png?v=1585276027254)

As mentioned at the start, TokBox OpenTok is now Vonage Video API. We haven’t made any changes to our package names, so you will still reference OpenTok in your code.

If you had remixed the Glitch project, your `server.js` file should already look like this:

```javascript
const express = require("express");
const app = express();
const OpenTok = require("opentok");
const OT = new OpenTok(process.env.API_KEY, process.env.API_SECRET);

let sessions = {};

app.use(express.static("public"));

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/landing.html");
});

app.get("/session/:room", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.post("/session/:room", (request, response) => {
  const roomName = request.params.room;
  // Check if the session already exists
  if (sessions[roomName]) {
    // Generate the token
    generateToken(roomName, response);
  } else {
    // If the session does not exist, create one
    OT.createSession((error, session) => {
      if (error) {
        console.log("Error creating session:", error);
      } else {
        // Store the session in the sessions object
        sessions[roomName] = session.sessionId;
        // Generate the token
        generateToken(roomName, response);
      }
    });
  }
});

function generateToken(roomName, response) {
  // Configure token options
  const tokenOptions = {
    role: "publisher",
    data: `roomname=${roomName}`
  };
  // Generate token with the Video API Client SDK
  let token = OT.generateToken(
    sessions[roomName],
    tokenOptions
  );
  // Send the required credentials back to to the client
  // as a response from the fetch request
  response.status(200);
  response.send({
    sessionId: sessions[roomName],
    token: token,
    apiKey: process.env.API_KEY
  });
}

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
```

To get the video chat up and running, go to the `.env` file and fill in your API key and secret for your project, which you can find from the dashboard. Once that's done, we will make some additions to the project to provide an interface for viewers.

## Add the Required Markup

Our application will be made up of three pages: a landing page for users to create or join a session as well as to select if they want to be a viewer or a participant, and the two video chat pages for each role respectively.

We will need to create an additional page for the viewer. Let's add a `viewer.html` file to the `views` folder by clicking the *New File* button in the left sidebar. Name the file `views/viewer.html` and paste the following markup into the page. This page is almost exactly the same as the `index.html` file, except it does not have a `div` for publisher.

![Add a viewer.html to the views folder](https://cdn.glitch.com/19f09a76-139f-49d3-9031-bb23315fae17%2Fglitch.png?v=1586584779947)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Stream your video chat</title>
    <meta
      name="description"
      content="Stream a basic audio-video chat with Vonage Video API in Node.js"
    />
    <link
      id="favicon"
      rel="icon"
      href="https://tokbox.com/developer/favicon.ico"
      type="image/x-icon"
    />
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <link rel="stylesheet" href="/style.css" />
  </head>

  <body>
    <header>
      <h1>Viewer</h1>
    </header>

    <main>
      <div id="subscriber" class="subscriber"></div>
    </main>

    <footer>
      <p>
        <small
          >Built on <a href="https://glitch.com">Glitch</a> with the
          <a href="https://tokbox.com/developer/">Vonage Video API</a>.</small
        >
      </p>
    </footer>

    <script src="https://static.opentok.com/v2/js/opentok.min.js"></script>
    <script src="/viewer.js"></script>
  </body>
</html>
```

The `viewer.html` and the `index.html` file will be using different script files as their implementation is slightly different due to their respective token roles as explained in the section above.

Next, we will make some modifications to the form on the `landing.html` page to include an option for users to select their roles via radio buttons. If they select *Viewer*, they will be sent to the page which shows them a stream of the video chat. If they select *Participant*, another text input will show up for the user name, which will be used to identify their stream.

```html
<form id="registration" class="registration">
  <label>
    <span>Room</span>
    <input
      type="text"
      name="room-name"
      placeholder="Enter room name"
      required
    />
  </label>
  
  <!-- Add the user type radio buttons -->
  <p>Select your role:</p>
  <fieldset id="userRoles">
    <label>
      <input type="radio" name="user-type" value="viewer" checked />
      <span>Viewer</span>
    </label>

    <label>
      <input type="radio" name="user-type" value="participant" />
      <span>Participant</span>
    </label>
  </fieldset>
  
  <!-- Add the user name input field and label -->
  <label id="userName" class="hidden">
    <span>User name</span>
    <input type="text" name="user-name" placeholder="Enter your name" />
  </label>

  <button>Enter</button>
</form>
```

## Style the Landing Page Form

Let's add to the existing styles to cater for the new fieldset and radio buttons.

```css
fieldset {
  border: 0;
  display: flex;
  justify-content: space-between;
  margin-bottom: 1em;
}

fieldset label {
  padding: 0.25em 0em;
  cursor: pointer;
}

.hidden {
  display: none;
}
```

![Basic styles for fieldset and radio buttons](https://cdn.glitch.com/19f09a76-139f-49d3-9031-bb23315fae17%2Fform.jpg?v=1586769635766)

## Refactor the Client-Side Javascript

Let's work on the `landing.html` page first. For the conditional show/hide of the user name field, we can add an event listener that checks for the value of the radio button being selected and toggle the styles accordingly.

```javascript
const userRoles = document.getElementById("userRoles");
const userName = document.getElementById("userName");
const userNameField = document.querySelector('[name="user-name"]');
userRoles.addEventListener(
  "click",
  event => {
    if (event.target.value === "participant") {
      userName.classList.remove("hidden");
      userNameField.required = true;
    } else {
      userName.classList.add("hidden");
      userNameField.required = false;
    }
  },
  false
);
```

We also need to modify the logic for sending our users to the correct pages based on whether they chose *viewer* or *participant*. Viewers will be sent to `/session/viewer/ROOM_NAME` while participants will be sent to `/session/participant/ROOM_NAME?username=USER_NAME`. We are making use of the query string in the URL to pass the user name to the server.

```javascript
const form = document.getElementById("registration");
form.addEventListener("submit", event => {
  event.preventDefault();
  
  // Check the selected option and redirect accordingly
  const isViewer = form.elements["user-type"].value === "viewer";

  if (isViewer) {
    location.href = `/session/viewer/${form.elements["room-name"].value}`;
  } else {
    location.href = `/session/participant/${form.elements["room-name"].value}?username=${form.elements["user-name"].value}`;
  }
});
```

Next, we'll create the `viewer.js` file for the `viewer.html` page. Similar to what we did for the `viewer.html`, click on *New File* again, but this time, add the Javascript files to the `public` folder instead.

Your project folder should now look like this:

![Project structure after all files are added](https://cdn.glitch.com/19f09a76-139f-49d3-9031-bb23315fae17%2Fproject.png?v=1586747884843)

The `viewer.js` file is slightly shorter than the `client.js` file because it does not include the creation of a publisher. We are making a `POST` request to `/session/viewer/ROOM_NAME` and receiving the necessary response data to connect to a session.

```javascript
fetch(location.pathname, { method: "POST" })
  .then(res => {
    return res.json();
  })
  .then(res => {
    const apiKey = res.apiKey;
    const sessionId = res.sessionId;
    const token = res.token;
    initializeSession(apiKey, sessionId, token);
  })
  .catch(handleCallback);

function initializeSession(apiKey, sessionId, token) {
  // Create a session object with the sessionId
  const session = OT.initSession(apiKey, sessionId);

  // Connect to the session
  session.connect(token, error => handleCallback(error));

  // Subscribe to a newly created stream
  session.on("streamCreated", event => {
    session.subscribe(
      event.stream,
      "subscriber",
      {
        insertMode: "append",
        width: "100%",
        height: "100%",
        name: event.stream.name
      },
      handleCallback
    );
  });
}

// Callback handler
function handleCallback(error) {
  if (error) {
    console.log("error: " + error.message);
  } else {
    console.log("callback success");
  }
}
```

We need to make some minor tweaks to the `client.js` file as well because we want to label the stream for each participant with the user name they entered on the landing page.

```javascript
fetch(location.pathname, { method: "POST" })
  .then(res => {
    return res.json();
  })
  .then(res => {
    const apiKey = res.apiKey;
    const sessionId = res.sessionId;
    const token = res.token;
    // Declare the stream name and pass it to the initializeSession() function
    const streamName = res.streamName;
    initializeSession(apiKey, sessionId, token, streamName);
  })
  .catch(handleCallback);
```

The `initializeSession()` function will now take one more parameter for `streamName` and used in the `initPublisher()` method and the `subscribe()` method. Both methods accept an optional properties argument, which allows us to pass in customisation options for the streams.

```javascript
// Create a publisher
const publisher = OT.initPublisher(
  "publisher",
  {
    insertMode: "append",
    width: "100%",
    height: "100%",
    name: streamName
  },
  handleCallback
);

// Subscribe to a newly created stream
session.on("streamCreated", event => {
  session.subscribe(
    event.stream,
    "subscriber",
    {
      insertMode: "append",
      width: "100%",
      height: "100%",
      name: event.stream.name
    },
    handleCallback
  );
});
```

Your final `client.js` files will look like this:

```javascript
fetch(location.pathname, { method: "POST" })
  .then(res => {
    return res.json();
  })
  .then(res => {
    const apiKey = res.apiKey;
    const sessionId = res.sessionId;
    const token = res.token;
    const streamName = res.streamName;
    initializeSession(apiKey, sessionId, token, streamName);
  })
  .catch(handleCallback);

function initializeSession(apiKey, sessionId, token, streamName) {
  // Create a session object with the sessionId
  const session = OT.initSession(apiKey, sessionId);

  // Create a publisher
  const publisher = OT.initPublisher(
    "publisher",
    {
      insertMode: "append",
      width: "100%",
      height: "100%",
      name: streamName
    },
    handleCallback
  );

  // Connect to the session
  session.connect(token, error => {
    // If the connection is successful, initialize the publisher and publish to the session
    if (error) {
      handleCallback(error);
    } else {
      session.publish(publisher, handleCallback);
    }
  });

  // Subscribe to a newly created stream
  session.on("streamCreated", event => {
    session.subscribe(
      event.stream,
      "subscriber",
      {
        insertMode: "append",
        width: "100%",
        height: "100%",
        name: event.stream.name
      },
      handleCallback
    );
  });
}

// Callback handler
function handleCallback(error) {
  if (error) {
    console.log("error: " + error.message);
  } else {
    console.log("callback success");
  }
}
```

## Handle Routes on the Server-Side

The last portion before everything comes together is the `server.js` file, where the routes are defined. We will need to handle the routes to serve the **Viewer** page (`viewer.html`) as well as the **Participant** page (`index.html`) respectively. 

```javascript
app.get("/session/participant/:room", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/session/viewer/:room", (request, response) => {
  response.sendFile(__dirname + "/views/viewer.html");
});
```

Instead of the remixed `generateToken()` function, we will use two different functions for the two roles.

```javascript
function generatePublisherToken(roomName, streamName, response) {
  // Configure token options
  const tokenOptions = {
    role: "publisher",
    data: `roomname=${roomName}?streamname=${streamName}`
  };
  // Generate token with the OpenTok SDK
  let token = OT.generateToken(
    sessions[roomName],
    tokenOptions
  );
  // Send the required credentials back to to the client
  // as a response from the fetch request
  response.status(200);
  response.send({
    sessionId: sessions[roomName],
    token: token,
    apiKey: process.env.API_KEY,
    streamName: streamName
  });
}

function generateSubscriberToken(roomName, response) {
  // Configure token options
  const tokenOptions = {
    role: "subscriber",
    data: `roomname=${roomName}`
  };
  // Generate token with the OpenTok SDK
  let token = OT.generateToken(
    sessions[roomName],
    tokenOptions
  );
  // Send the required credentials back to to the client
  // as a response from the fetch request
  response.status(200);
  response.send({
    sessionId: sessions[roomName],
    token: token,
    apiKey: process.env.API_KEY
  });
}
```

For viewers, once the Viewer page loads, the room name will be sent to the server via a `POST` request. This will be handled by the following route:

```javascript
app.post("/session/viewer/:room", (request, response) => {
  const roomName = request.params.room;
  // Check if the session already exists
  if (sessions[roomName]) {
    // Generate the token
    generateSubscriberToken(roomName, response);
  } else {
    // If the session does not exist, create one
    OT.createSession((error, session) => {
      if (error) {
        console.log("Error creating session:", error);
      } else {
        // Store the session in the sessions object
        sessions[roomName] = session.sessionId;
        // Generate the token
        generateSubscriberToken(roomName, response);
      }
    });
  }
});
```

Similarly, for participants, once the Participant page loads, the room name and user name will be sent to the server via a `POST` request, and its corresponding route is handled as follows:

```javascript
// Middleware to read the body of the request
app.use(express.json());

app.post("/session/participant/:room", (request, response) => {
  const roomName = request.params.room;
  const streamName = request.body.username;
  // Check if the session already exists
  if (sessions[roomName]) {
    // Generate the token
    generatePublisherToken(roomName, streamName, response);
  } else {
    // If the session does not exist, create one
    OT.createSession((error, session) => {
      if (error) {
        console.log("Error creating session:", error);
      } else {
        // Store the session in the sessions object
        sessions[roomName] = session.sessionId;
        // Generate the token
        generatePublisherToken(roomName, streamName, response);
      }
    });
  }
});
```

And with that viewers will be able to see the participant's streams on a single page, while participants will be having a video chat with each other.

![Screenshot of viewer page](https://cdn.glitch.com/19f09a76-139f-49d3-9031-bb23315fae17%2Fviewer.jpg?v=1586797944330)

![Screenshot of participant page](https://cdn.glitch.com/19f09a76-139f-49d3-9031-bb23315fae17%2Fparticipant.jpg?v=1586797950153)

Do check out the final code on [Glitch](https://glitch.com/edit/#!/remix/stream-video-chat) or [GitHub](https://github.com/nexmo-community/stream-video-chat) and feel free to remix or clone the code and play around with it yourself.

## What’s Next?

There are additional functionalities we can build with the Vonage Video API which will be covered in future tutorials, but in the meantime, you can find out more at our [comprehensive documentation site](https://tokbox.com/developer/guides/). If you run into any issues or have questions, reach out to us on our [Community Slack](https://developer.nexmo.com/community/slack). Thanks for reading!