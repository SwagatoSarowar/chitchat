import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import { initializeApp } from "firebase/app";
import { Provider } from "react-redux";
import store from "./store.jsx";

const firebaseConfig = {
  apiKey: "AIzaSyBfnfqLbwlzxWJ5ybMMpkH_wW3ivy0ghtk",
  authDomain: "chitchat-5c6f7.firebaseapp.com",
  projectId: "chitchat-5c6f7",
  storageBucket: "chitchat-5c6f7.appspot.com",
  messagingSenderId: "996239897895",
  appId: "1:996239897895:web:c1681adc8d1bb8e1c22502",
};

initializeApp(firebaseConfig);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
