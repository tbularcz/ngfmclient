import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.db = app.database();
  }

  // *** Auth API ***

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);

  updateDB = updates => {
    console.log("user in updateDB:", updates)
    return this.db.ref().update(updates);
  }

  addfirstFridge = (uid) => {
    var newPostKey = this.db.ref().child('fridges').push().key;
    var updates = {};
        updates['/users/' + uid + "/mydfridge"] = newPostKey;
        updates['/users/' + uid + "/myfridges/" + newPostKey] = true;

        updates['/fridges/' + newPostKey + "/Name"] = "Inital Fridge";
        updates['/fridges/' + newPostKey + "/Beschreibung"] = "test";
        updates['/fridges/' + newPostKey + "/Owner"] = uid;


    this.updateDB(updates);
  }

  addnewFridge = () => {
    var newPostKey = this.db.ref().child('fridges').push().key;
    console.log("user add new Fridge: ",newPostKey )

    var updates = {};
        updates['/fridges/' + newPostKey + "/Name"] = "test";
        updates['/fridges/' + newPostKey + "/Beschreibung"] = "test";
        updates['/fridges/' + newPostKey + "/Owner"] = this.auth.currentUser.uid;
        updates['/users/' + this.auth.currentUser.uid + "/myfridges/" + newPostKey] = true;
    this.updateDB(updates);

  }

  //addFridge
  // *** User API ***

  user = uid => this.db.ref(`users/${uid}`);
  users = () => this.db.ref('users');
  cuser = () => this.auth.currentUser.uid
  myfridges = () => this.db.ref('users/'+this.auth.currentUser.uid+'/myfridges');
  mydfridge = () => this.db.ref('users/'+this.auth.currentUser.uid+'/mydfridge');
  username = () => this.db.ref('users/'+this.auth.currentUser.uid+'/username');
  email = () => this.db.ref('users/'+this.auth.currentUser.uid+'/email');



  //fridges = uid => this.db.ref(`users/${uid}/myfridges`);
}

export default Firebase;
