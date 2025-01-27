# Getting Started

-   `npm run install:all` - Install dependencies for back-end and front-end

-   create `.env` file in `backend/` directory (check .env.example for the list of vars)

-   `npm run start` - Starts both apps


---

The task: "make all the necessary changes to put the application and repository into a production-quality state"

## My thought process during the work on this task:

_First, I tried to run the code. I got my free token from Tatum and sent the request -- it worked. But let's face elephant in the room -- using API key in front-end app is not even close to production approach._

_So first thing I decided to implement in this task -- proxy server for the request._

_Another part of security considerations -- whitelist for API users. I used `cors` library for this._

_I spend some time with configs and package.json configuration -- I used `npm-run-all` for one-command-run for both front and backend._

_I added logs for backend with the help of `pino` and proper error formatting. Also, I tried to stick with response format from the API in my proxy._

_On front-end side, I realized that button for sending the request is not being blocked and no spinner is implemented. I decided to change the text of the button and make it inactive while we are waiting for the response. This will prevent accidental request spamming._

_I decided not to change or update UI elements since it not the part of the task._

_Also, I didn't add prettier or tests since this decisions should be discussed in team and affects team practices, not the production directly._

_Same with the project structure -- it have basic separation of components and pages, my proxy is in one file (since it have one endpoint) I don't see any benefits in changing of the structure for this kind of app. Also, the same for inline styling._

# Changelist

- Added small proxy server for requests to Tatum API

- Added request validation and error handling

- Added validation on front-end for wallet address using `web3-validator`

- Brought back the header for front-end app

- Changed Click Me button UX to prevent spamming (and indicate processing)

- Added build scripts

- Small fixes

- Changed link and alt to Tatum for the logo :)

