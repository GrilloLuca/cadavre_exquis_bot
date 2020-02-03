var db = null
var channel = 'channel'

module.exports = {

    init: () => {

        const admin = require('firebase-admin');
        let serviceAccount = require('./serviceAccountKey.json');

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://cadavre-exquis-215311.firebaseio.com"
        });
        
        db = admin.firestore()
        
    },
    setChannel: (channelName, callback) => {
        channel = channelName

        db.collection(channel).get().then(snapshot => {
            callback(snapshot.empty);
        });
    
    },
    getChannel: () => {
        return channel
    },
    read: (callback) => {
       
        db.collection(channel).orderBy('date').get()
            .then(callback)
            .catch((err) => {
                console.log('Error getting documents', err);
            });

    }, 
    write: (user, text) => {
        let docRef = db.collection(channel).doc();

        let message = docRef.set({
            created_by: user,
            text: text,
            date: Date.now()
        });

    }

}