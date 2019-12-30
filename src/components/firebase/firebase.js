import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage'

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};



var ret = "";


class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.db = app.database();
    this.sto = app.storage();

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
    console.log("write to updateDB:", updates)
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

  addnewFridge = (Beschreibung, Name) => {
    var newPostKey = this.db.ref().child('fridges').push().key;
    var updates = {};
        updates['/fridges/' + newPostKey + "/Name"] = Name;
        updates['/fridges/' + newPostKey + "/Beschreibung"] = Beschreibung;
        updates['/fridges/' + newPostKey + "/Owner"] = this.auth.currentUser.uid;
        updates['/users/' + this.auth.currentUser.uid + "/myfridges/" + newPostKey] = true;
    this.updateDB(updates);
    return newPostKey;
  }

  moveFbRecord(oldRef, newRef) {

          oldRef.once('value').then(snap => {
               return newRef.set(snap.val());
          }).then(() => {
               return oldRef.set(null);
          }).then(() => {
               console.log('Done!');
          }).catch(err => {
               console.log(err.message);
          });

   }

  removeItem = (reference) => {
    var desertRef = this.imageref(reference)
    desertRef.delete().then(function() {
        // File deleted successfully
    }).catch(function(error) {
        // Uh-oh, an error occurred!
    });
    this.moveFbRecord(this.db.ref().child('/items/' + reference), this.db.ref().child('/r_items/' + reference));
    this.db.ref().child('/items/' + reference).remove();
    this.db.ref().child('/users/' + this.auth.currentUser.uid + "/myitems/"+reference).remove();
  }

  removeFridge = (reference) => {
    this.moveFbRecord(this.db.ref().child('/fridges/' + reference), this.db.ref().child('/r_fridges/' + reference));
    this.db.ref().child('/fridges/' + reference).remove();
    this.db.ref().child('/users/' + this.auth.currentUser.uid + "/myfridges/"+reference).remove();
  }

  addnewItem = (Beschreibung, Name) => {
    var newPostKey = this.db.ref().child('items').push().key;
    const smydfridge = '';
    this.db.ref().child('users/'+this.auth.currentUser.uid+'/mydfridge').on('value', snapshot => {
      const usersObject = snapshot.val();
      const smydfridge = usersObject;
      console.log("date: ", new Date())
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
          updates['/items/' + newPostKey + "/Date"] = new Date();
          this.updateDB(updates);
    });
    return newPostKey;
  }

  addPicture = (dataUri, id) => {
    var updates = {};
    var message = dataUri;
    var ref = this.sto.ref().child('images/'+id+'.uri')
    ref.putString(message, 'data_url', {contentType:'image/png'}).then(function(snapshot) {
      console.log('Uploaded a data_url string!');
    })
        updates['/items/' + id + "/Image"] = true;
        this.updateDB(updates);
  }

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
  cfridge = id => this.db.ref(`fridges/${id}`);
  itemOwner = id => this.db.ref(`items/${id}/Owner`);
  allitems = () => this.db.ref(`items`);
  allfridges = () => this.db.ref(`fridges`);
  fridgeowner = id => this.db.ref(`fridges/${id}/Name`);
  imageref = link => this.sto.refFromURL(process.env.REACT_APP_STORAGE_GD+`${link}.uri`)


}

export default Firebase;
