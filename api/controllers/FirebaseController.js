const admin = require("firebase-admin");
const serviceAccount = require("../../firebase/push-x-6c832-firebase-adminsdk-e3u4e-4a171d87d9.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const FirebaseController = () => {
    const sendNotification = async (req, res) => {
        var registrationTokens = req.tokens;
        var payload = req.payload;

        admin.messaging().sendToDevice(registrationTokens, payload)
            .then((response) => {
                console.log('Sent successfully.\n');
                console.log(response);
                res.status(statusCodes.Ok).json({
                    success: true,
                    msg: response
                });
            })
            .catch((error) => {
                console.log('Sent failed.\n');
                console.log(error);
                res.status(statusCodes.InternalServerError).json({
                    success: true,
                    msg: error
                });
            });
    }
    return {
        sendNotification
    }
}

module.exports = FirebaseController 