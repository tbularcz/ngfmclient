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
    //this.addItem =this.addItem.bind(this)
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
    console.log("user add new Fridge: ",newPostKey );

    var updates = {};
        updates['/fridges/' + newPostKey + "/Name"] = "test";
        updates['/fridges/' + newPostKey + "/Beschreibung"] = "test";
        updates['/fridges/' + newPostKey + "/Owner"] = this.auth.currentUser.uid;
        updates['/users/' + this.auth.currentUser.uid + "/myfridges/" + newPostKey] = true;
    this.updateDB(updates);

  }
  removeItem = (reference) => {
    
    this.db.ref().child('/items/' + reference).remove();
    this.db.ref().child('/users/' + this.auth.currentUser.uid + "/myitems/"+reference).remove();
  }

  addnewItem = (Beschreibung, Name) => {
    var newPostKey = this.db.ref().child('items').push().key;
    const smydfridge = '';
    this.db.ref().child('users/'+this.auth.currentUser.uid+'/mydfridge').on('value', snapshot => {
      const usersObject = snapshot.val();
      const smydfridge = usersObject;
      console.log("smydfridge:", smydfridge)
      var updates = {};
          updates['/items/' + newPostKey + "/Name"] = Name;
          //anzahl
          //datum
          //gelöscht true false für recover / vorschläge
          //in welcher fridge
          updates['/items/' + newPostKey + "/Beschreibung"] = Beschreibung;
          updates['/items/' + newPostKey + "/Owner"] = this.auth.currentUser.uid;
          updates['/items/' + newPostKey + "/Fridge"] = smydfridge;
          updates['/users/' + this.auth.currentUser.uid + "/myitems/" + newPostKey] = true;
          this.updateDB(updates);
    });
    return newPostKey;
  }

  //addFridge
  // *** User API ***

  user = uid => this.db.ref(`users/${uid}`);
  users = () => this.db.ref('users');
  cuser = () => this.auth.currentUser.uid
  myfridges = () => this.db.ref('users/'+this.auth.currentUser.uid+'/myfridges');
  myitems = () => this.db.ref('users/'+this.auth.currentUser.uid+'/myitems');
  mydfridge = () => this.db.ref('users/'+this.auth.currentUser.uid+'/mydfridge');
  username = () => this.db.ref('users/'+this.auth.currentUser.uid+'/username');
  email = () => this.db.ref('users/'+this.auth.currentUser.uid+'/email');
  detitem = id => this.db.ref('users/'+this.auth.currentUser.uid+`/myitems/${id}`);
  citem = id => this.db.ref(`items/${id}`);
  allitems = () => this.db.ref(`items`);

  //fridges = uid => this.db.ref(`users/${uid}/myfridges`);
}

export default Firebase;
