# agora-token-server-in-Express
To generate agora token, we need a simple express application.
```sh
$ npm init -y
```
This will initialize a basic `package.json` file. Now, install the dependecies.
```
$ npm install express agora-token-generator dot-env
```
Now, create a basic express application. In `server.js` file put the following code.
```javascript
const express = require("express");
const app = express();

require("dotenv").config();

app.get("/", (req, res) => {
    res.sendStatus(200);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});
```
Now, we will test the server in localhost. Run,
```
$ node server.js
```
Our server is running on PORT 5000. If we ping `localhost:5000`, we will get a 200 OK status.
Now, import agora-token-generator on our server.
```javascript
const {
    RtmTokenBuilder,
    RtmRole,
    RtcTokenBuilder,
    RtcRole,
} = require("agora-access-token");
```
Finally add some route for different tokens. Here I create some route for tokens.
```javascript
const generateRtmToken = (account) => {
    const appID = process.env.appID;
    const appCertificate = process.env.appCertificate;

    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);

    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    return RtmTokenBuilder.buildToken(
        appID,
        appCertificate,
        account,
        RtmRole,
        privilegeExpiredTs
    );
};

const generateRtcToken = (account, channelName = "testChannel") => {
    const appID = process.env.appID;
    const appCertificate = process.env.appCertificate;

    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);

    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    return RtcTokenBuilder.buildTokenWithAccount(
        appID,
        appCertificate,
        channelName,
        account,
        RtcRole,
        privilegeExpiredTs
    );
};

const generateRtcUidToken = (uid, channelName = "testChannel") => {
    const appID = process.env.appID;
    const appCertificate = process.env.appCertificate;

    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);

    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    const rtcUidToken = RtcTokenBuilder.buildTokenWithUid(
        appID,
        appCertificate,
        channelName,
        uid,
        RtcRole,
        privilegeExpiredTs
    );

    return rtcUidToken;
};

app.get("/rtc-uid-token", (req, res) => {
    const uid = req.query.uid;
    const channelName = req.query.channelName;
    const rtcUidToken = generateRtcUidToken(uid, channelName);
    res.status(200).json({ token: rtcUidToken });
});
app.get("/rtm-token", (req, res) => {
    const account = req.query.username;
    const rtmToken = generateRtmToken(account);
    res.status(200).json({ token: rtmToken });
});
app.get("/rtc-token", (req, res) => {
    const account = req.query.username;
    const channelName = req.query.channelName;
    const rtcToken = generateRtcToken(account, channelName);
    res.status(200).json({ token: rtcToken });
});
```
For ping different route to get tokens.
