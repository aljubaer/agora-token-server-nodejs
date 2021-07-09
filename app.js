const express = require("express");
const app = express();

const { RtmTokenBuilder, RtmRole } = require("agora-access-token");
if (process.env.NODE_ENV === "development") {
    require("dotenv").config();
}

const generateToken = (account) => {
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

app.get("/", (req, res) => {
    res.sendStatus(200);
});

app.get("/token", (req, res) => {
    const account = req.query.username;
    const token = generateToken(account);
    res.status(200).json({ token });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});
