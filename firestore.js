var db = null

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
        this.channel = channelName

        db.collection(channelName).get().then(snapshot => {
            callback(snapshot.empty);
        });
    
    },
    read: (callback) => {
        let channel = !!this.channel ? this.channel : 'channel'
        db.collection(channel).orderBy('date').get()
            .then(callback)
            .catch((err) => {
                console.log('Error getting documents', err);
            });
        return channel
    }, 
    stories: (id, callback) => {
        console.log(id)
        // db.collection().where('created_by', '==', id).get()
        //     .then(callback)
        //     .catch((err) => {
        //         console.log('Error getting documents', err);
        //     });
    },
    write: (user, text) => {
        let docRef = db.collection(this.channel).doc();

        let message = docRef.set({
            created_by: user,
            text: text,
            date: Date.now()
        });

    }

}