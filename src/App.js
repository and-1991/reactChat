import React, {useState} from 'react';
import './App.css';

import firebase from "firebase";
import 'firebase/firestore';
import 'firebase/auth'

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyDENicqx0ZNTGI3i2eY8iD4EgkvLlPo4L0",
  authDomain: "superchat-ee0a3.firebaseapp.com",
  databaseURL: "https://superchat-ee0a3.firebaseio.com",
  projectId: "superchat-ee0a3",
  storageBucket: "superchat-ee0a3.appspot.com",
  messagingSenderId: "727547863336",
  appId: "1:727547863336:web:2c64a4c4737b1873a7b01d",
  measurementId: "G-F407T4V7BB"
})

const ChatMessage = (props) => {
  const { text, uid, photoURL } = props.message
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received'
  return (
          <div className={`message ${messageClass}`}>
            <img src={photoURL} alt=''/>
            <p>{text}</p>
          </div>

  )
}


const ChatRoom = () => {
  const messagesRef = firestore.collection('messages')
  const query = messagesRef.orderBy('createdAt').limit(25)

  const [messages] = useCollectionData(query, {idField: 'id'})

  const [formValue, setFormValue] = useState('')

  const sendMessage = async(e) => {
    e.preventDefault()
    const { uid, photoURL } = auth.currentUser

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('')
  }

  return (
          <>
            <div>
              {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}
            </div>
            <form onSubmit={sendMessage}>
              <input value={formValue} onChange={(e) =>setFormValue(e.target.value)}/>
              <button type='submit'>send</button>
            </form>
            </>
  )

}
const SignIn = () => {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
  }

  return (
          <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}


const SignOut = () => {
    return auth.currentUser && (
            <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
    )
}

const auth = firebase.auth()
const firestore = firebase.firestore()

function App() {

  const [user] = useAuthState(auth)
  return (
    <div className="App">
      <header>
          <h1>React chat</h1>
          <SignOut />
      </header>
      <section>
        { user ? <ChatRoom/> : <SignIn/> }
      </section>
    </div>
  );
}

export default App;
