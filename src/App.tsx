import React from 'react';
import logo from './logo.svg';
import './App.css';
import webpush from "web-push"
import axios from 'axios';

function App() {
  const handleClick = async () => {
    const client = axios.create({
      baseURL: "https://pwa-tesing.onrender.com"
    });
    let subscription = {}
    if ((!localStorage.getItem("subscription")) || (localStorage.getItem("subscription") === "{}")) {
      console.log('notification in window', 'Notification' in window, "serviceWorker in navigator", 'serviceWorker' in navigator)
      if ('Notification' in window && 'serviceWorker' in navigator) {
        Notification.requestPermission().then(function (permission) {
          if (permission === 'granted') {

            navigator.serviceWorker.ready.then(async function (registration) {
              // Đăng ký sự kiện push với service worker
                   await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: "BPnBnQ3-OJ3fwA51Ispz7srlLRefQdKQipkjA4fnzYJnIim4Wc0LHF3-Z-KafgK_XxrO-8eI6rvpbvQ7h12qreo" })
                   .then(async subscription=>{
                  if (!subscription) {
                    window.alert("no subscription")
                  } else {
                    console.log(subscription)
                    const dataToSend = { subscription: subscription }
                    localStorage.setItem("subscription", JSON.stringify(dataToSend))
                    await client.post('/api/v1/push', {
                      subscription: subscription
                  }).catch(e=>console.log(e))
                }
              }).catch(e=>console.error('Lỗi khi đăng ký push:', e)) 
                }
            ).catch((error) => console.log(error));
          }
        });
      }
    } else {
      console.log(localStorage.getItem("subscription"))
      subscription = JSON.parse(localStorage.getItem("subscription") || "{}")
      console.log("subcription", subscription)
      await client.post('/api/v1/push', {
        subscription: subscription
    })

    }
    
  }

  return (
    <div className="App" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <button onClick={handleClick}>check Notification</button>
    </div>
  );
}

export default App;
