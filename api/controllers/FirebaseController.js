const admin = require("firebase-admin");
const serviceAccount = require("../../firebase/push-x-6c832-firebase-adminsdk-e3u4e-4a171d87d9.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const FirebaseController = () => {
    const sendNotification = async (req, res) => {
        console.log(req)
        // var registrationTokens = req.body.tokens;
        // var notification = req.body.notification;
        var message = {
            token: req.body.token,
            notification: req.body.notification
        }
        // admin.messaging().sendToDevice(registrationTokens, payload)
        admin.messaging().send(message)
            .then((response) => {
                console.log('Sent successfully.\n');
                console.log(response);
                res.status(200).json({
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