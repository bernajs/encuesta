import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyCVnF1OOb0sxSYn0VyVHqSSeu0E8zXtW4U",
    authDomain: "test-e339a.firebaseapp.com",
    databaseURL: "https://test-e339a.firebaseio.com",
    projectId: "test-e339a",
    storageBucket: "test-e339a.appspot.com",
    messagingSenderId: "408235569660"
};
var db = firebase.initializeApp(config);

export default db;