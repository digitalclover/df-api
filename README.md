# df-api

An HTTPS REST API for video content created and distributed by [Digital Foundry](https://www.digitalfoundry.net/ "Digital Foundry").

NOTE: This API is an open-source project that is not officially endorsed by Digital Foundry.

## Application Overview

The application can be separated into two main actions. 
1. Gathering updated content as it is posted to digitalfoundry.net via a web scraper.
2. Serve aggregated JSON content via HTTPS requests.

## Request Endpoints

`GET https://df-scraper-api.azurewebsites.net/api/getVideos`
Returns the 20 latest videos published by Digital Foundry.

`POST https://df-scraper-api.azurewebsites.net/api/searchVideos`
Returns all videos that match filter criteria.

**Search Filter Criteria**

The search endpoint will return an array of videos that match *all* filters. Each filter property is optional. Sending an empty filter body will result in the entire video catalogue to be returned.

    {
      title: string;
      tags: Array<string>;
      date: {
        from: string;
        to: string;
      }
    }

**Example Filter Criteria JSON**

    {
        "title": "DF Retro",
        "tags": ["shenmue"],
        "date": {
            "to": "2018-01-01"
        }
    }

The following filter criteria will return all videos that have:
- The string "DF Retro" in the title
- Contains the tag "shenmue"
- Pubslihed until January 1, 2018

## Response Interface

Both endpoints will return an array of JSON objects that contain information for each video.

**Example Response**

    [{
        "id": "2984fda1-7558-4812-b761-d356d338e6e5",
        "title": "DF Retro: Quake on Sega Saturn",
        "duration": "5:18",
        "dfLink": "/2016-11-01-df-retro-quake-on-sega-saturn",
        "ytLink": "https://youtu.be/LUZ436FXB4U?rel=0&showinfo=0",
        "description": "John analyses Lobotomy Software's port of Quake. It shouldn't run on Sega Saturn, but somehow... it does.",
        "tags": [
          "1080p",
          "df retro"
        ],
        "downloadOptions": [
          {
            "format": "h.264",
            "fileSize": "257MB",
            "videoEncoding": "1920x1080, 60.00fps, 6.7mbps",
            "audioEncoding": "AAC 2.0, 192kbps, 48000Hz",
            "videoId": "31"
          }
        ],
        "created": 1477958400000
      }]

## Azure Functions

This application is hosted in Microsoft Azure using their serverless environment Azure Functions. There are currently three main functions.

1. `scrapeForNewVideos()` is a timer based function (similar to a cron job) that checks the digitalfoundry.net homepage every hour for a new video to be published. If a new video is found, it then queries the page details and logs them into a dynamic JSON database.

2. `getVideos()` is a basic GET request that returns the latest videos (limit 20). It is meant to purpose services that only want to acquire the latest content, rather than the entire video history.

3. `searchVideos()` is a POST request function that returns the entire list of Digital Foundry videos based on the search filters found in the request body.

## Performance & Caching

As this is a new project, hosting performance has been limited. App instance is located in Japan which may result in higher ping in the western hemisphere. Additionally, the app instance will go to sleep after 5 minutes of inactivity. Requesting an endpoint in this state will add seconds to the response time. Subsequent requests within 5 minutes will be substantially faster. 

Additionally, there is a caching mechanism for database queries. After the first request from an endpoint is complete, the database query will be cached for one hour. If the app instance goes back to sleep before the cache refresh, it will query the database on the next request. This is to optimize moments where an endpoint may receive a burst of requests.

Lastly, the app instance **does not autoscale**. If too many requests are received, the app may encounter issues as it reaches capacity.
