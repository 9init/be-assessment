# Backend Assessment

Uptime monitoring RESTful API server that allows authenticated users to monitor URLs, and get detailed uptime reports about their availability, average response time, and total uptime/downtime.

## Supports

- Register with email verification.
- CRUD operations for URL checks (`GET`, `PUT` and `DELETE` can be called only by the user user who created the check).
- Authenticated users can receive a notification whenever one of their URLs goes down or up again:
  - Email.
  - Webhook.
- Authenticated users can get detailed uptime reports about their URLs availability, average response time, and total uptime/downtime.
- Authenticated users can group their checks by tags and get reports by tag.
- APIs are consuming and producing `application/json`.
- Authentication are stateless.

## Json Acceptance Criteria

### Check

Each URL check may have the following options:
- `_id`: The server generates a unique one. 
- `name`: The name of the check.
- `url`: The URL to be monitored.
- `protocol`: The resource protocol name `HTTP`, `HTTPS`.
- `path`: A specific path to be monitored *(optional)*.
- `port`: The server port number *(optional)*.
- `webhook`: A webhook URL to receive a notification on *(optional)*.
- `timeout` *(defaults to 5 seconds)*: The timeout of the polling request *(optional)*.
- `interval` *(defaults to 10 minutes)*: The time interval for polling requests *(optional)*.
- `threshold` *(defaults to 1 failure)*: The threshold of failed requests that will create an alert *(optional)*.
- `authentication`: An HTTP authentication header, with the Basic scheme, to be sent with the polling request *(optional)*.
  - `authentication.username`
  - `authentication.password`
- `httpHeaders`: A list of key/value pairs custom HTTP headers to be sent with the polling request (optional).
- `tags`: A list of the check tags (optional) E.g [{tag: "tag"}, {tag2: "tag"}, ...].
- `ignoreSSL`: A flag to ignore broken/expired SSL certificates in case of using the HTTPS protocol.

### Report

Each produced report have the following information:
- `owner_id`: The user identification.
- `check_id`: The check identification.
- `status`: The current status of the URL.
- `availability`: A percentage of the URL availability.
- `outages`: The total number of URL downtimes.
- `downtime`: The total time, in millisecond, of the URL downtime.
- `uptime`: The total time, in millisecond, of the URL uptime.
- `reaches`: The total tries has successfully reached the URL.
- `responseTime`: The average response time for the URL in millisecond.
- `responseTimes`: A list contains response time for each interval E.g. [300, 500, 421, ...].
- `history`: A list contains timestamped logs of the polling requests E.g. ["bla1", "bla2", ...].

## Setup

We use npm package manager
- Install node dependencies  `$ npm install`
- Edit **.env** file to fit your workplace.
- Run **Unit test** to make sure every thing is fine  `$ npm test`.
- Voila.

## Documentation

### Authentication
The system is smart enough to make sure that the user is authenticated as it do:
- receiving the request.
- validate the session token:
  - the validator excludes specific *paths* like "login, register and verify" which are located in the `./auth/route.js`.
  - cancel any unauthorized request.
- response with acceptance token.

### Register
The server expects a POST request at `/register` path contains JSON or x-www-form-urlencoded body contains the following:
- `name`: The user real name separated with "-" E.g. `Ahmed-Hesham`.
- `email`: The user valid email.
- `password`: The user password, it's better to hash it before sending it but bot necessary as we hash it for you 😄.

User will receive a response with **200** status code as a successful registration process, otherwise we will send you a error message.

### Login
The server expects a POST request at `/login` path with JSON or x-www-form-urlencoded body contains the following:
- `email`: The user valid email.
- `password`: The user password.

User will receive:
- A response with **200** status code as a successful login process, otherwise we will send you a error message.
- A token that User will use it to communicate with me later.

### Put Check
The server expects a authenticated PUT request at `/check` path with JSON or x-www-form-urlencoded body contains:
- The pervious **Check** schema.
- The system ignores any empty field and put the default values

User will receive:
- A response with **200** status code as a successful PUT process, otherwise we will send you a error message.


### Edit Check

It's very similar to the PUT method put with POST.

The server expects a authenticated POST request at `/update/check/:checkId` path with JSON or x-www-form-urlencoded body contains:
- The pervious **Check** schema.
- The system ignores any empty field and put the default values

User will receive:
- A response with **200** status code as a successful PUT process, otherwise we will send you a error message.

### Pause/Start Check

A Feature makes the use pause or start his checks anytime.

The server expects a authenticated POST request at `/start/check/:checkId` or `/start/check/:checkId` path.

User will receive:
- A response with **200** status code as a successful PUT process, otherwise we will send you a error message.

### Get a specific check

The server expects a authenticated POST request at `/check/:checkId` path.

User will receive:
- A response with **200** status code as a successful PUT process, otherwise we will send you a error message.
- A Check Schema contains the check information.

### Get all checks

The server expects a authenticated POST request at `/checks` path.

User will receive:
- A response with **200** status code as a successful process, otherwise we will send you a error message.
- A List of Check Schema contains the checks information E.g {checks: [Check]}.

### Delete Check

The server expects a authenticated DELETE request at `/delete/check/:checkId` path.

User will receive:
- A response with **200** status code as a successful DELETE process, otherwise we will send you a error message.

### Get a specific report

The server expects a authenticated POST request at `/report/:reportId` path.

User will receive:
- A response with **200** status code as a successful PUT process, otherwise we will send you a error message.
- A Report Schema contains the report information.

### Get all reports

The server expects a authenticated POST request at `/reports` path.

User will receive:
- A response with **200** status code as a successful process, otherwise we will send you a error message.
- A List of Report Schema contains the reports information E.g {reports: [Report]}.

### Get report by tag
The server expects a authenticated POST request at `/reports` path with JSON or x-www-form-urlencoded body contains:
- `tags`: A list that contains:
  - `tag`: The tag word is key.
  - `value`: That value could be anything.
  - Example. `[{"tag": "facebook"}, {"tag", "google"}]`

User will receive:
- A response with **200** status code as a successful process, otherwise we will send you a error message.
- A List of Report Schema contains the reports information E.g {reports: [Report]}.


## Docker
Unfortunately, I don't have the time to implement it