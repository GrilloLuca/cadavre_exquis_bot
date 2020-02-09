module.exports = {

    db: null,
    init: () => {

        this.story_id = 'JlbfkgZztevHbzu5oOGk'

        const admin = require('firebase-admin');
        let serviceAccount = require('./serviceAccountKey.json');

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://cadavre-exquis-215311.firebaseio.com"
        });
        
        db = admin.firestore()
        
    },
    setStory: (storyName, callback) => {

        let story_ref = db.collection('stories').doc();

        db.collection(storyName).get().then(snapshot => {
            if(snapshot.empty) {
                story_ref.set({
                    name: storyName,
                });
            }
            this.story_id = story_ref.id
            callback(snapshot.empty);
        });
    
    },
    last: (user, callback) => {
        let user_ref = db.collection('users').doc(`${user.id}`);
        let story_ref = db.collection('stories').doc(`${this.story_id}`);

        db.collection(`chapters`)
            .where('created_by', '==', user_ref)
            .where('story', '==', story_ref)
            .orderBy('timestamp', 'desc')
            .limit(1)
            .get()
            .then(callback)
    },
    read: (user, callback) => {
        let user_ref = db.collection('users').doc(`${user.id}`);
        let story_ref = db.collection('stories').doc(`${this.story_id}`);

        db.collection(`chapters`)
            .where('created_by', '==', user_ref)
            .where('story', '==', story_ref)
            .orderBy('timestamp')
            .get()
            .then(callback)

        return story_ref
    },
    write: (user, text) => {

        let user_ref = db.collection('users').doc(`${user.id}`);
        user_ref.set(user);

        let story_ref = db.collection('stories').doc(`${this.story_id}`);
        let docRef = db.collection('chapters').doc(`${Date.now()}`)

        docRef.set({
            created_by: user_ref,
            story: story_ref,
            text: text,
            timestamp: Date.now()
        })

    }

}