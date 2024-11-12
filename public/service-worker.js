self.addEventListener('install', event => {
    self.skipWaiting();
  });

self.addEventListener("push", event=>{
    if (!event.data) {
        return;
    }
    console.log("Hi there", event.data.json())
    const data = event.data.json();
    self.registration.showNotification(data.title, {
        body: data.body,
    })
})