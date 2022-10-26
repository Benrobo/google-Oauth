const admin = require("firebase-admin")
const serviceAccount = require("./service_acct.json")

const actionCodeSettings = {
    url: `proact-1a438.firebaseapp.com`,
    handleCodeInApp: true,
    android: {
        packageName: 'proact-1a438'
    }
};


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

module.exports = {
    admin,
    actionCodeSettings
}