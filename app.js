const express = require("express");
const app = express();

const {
    RtmTokenBuilder,
    RtmRole,
    RtcTokenBuilder,
    RtcRole,
} = require("agora-access-token");
if (process.env.NODE_ENV === "development") {
    require("dotenv").config();
}

const generateToken = (account, channelName = "testChannel") => {
    const appID = process.env.appID;
    const appCertificate = process.env.appCertificate;

    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);

    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    const rtmToken = RtmTokenBuilder.buildToken(
        appID,
        appCertificate,
        account,
        RtmRole,
        privilegeExpiredTs
    );

    const rtcToken = RtcTokenBuilder.buildTokenWithAccount(
        appID,
        appCertificate,
        channelName,
        account,
        RtcRole,
        privilegeExpiredTs
    );

    return { rtmToken, rtcToken };
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

app.get("/", (req, res) => {
    res.sendStatus(200);
});

app.get("/token", (req, res) => {
    const account = req.query.username;
    const channelName = req.query.channelName;
    const { rtmToken, rtcToken } = generateToken(account, channelName);
    res.status(200).json({ rtmToken, rtcToken });
});

app.get("/rtc-uid-token", (req, res) => {
    const uid = req.query.uid;
    const channelName = req.query.channelName;
    const rtcUidToken = generateRtcUidToken(uid, channelName);
    res.status(200).json({ token: rtcUidToken });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});
