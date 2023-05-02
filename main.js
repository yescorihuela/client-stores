function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function createStoresWithDevices(qtyOfStores = 2) {
  const stores = [];
  const statuses = ["error", "ok"];

  for(let i = 1; i <= qtyOfStores; i++) {
    stores.push({
      id: i,
      store_id: `store_${i}`,
      time: null,
      devices: {
        printer: statuses[getRandomIntInclusive(0, 1)],
        webserver: statuses[getRandomIntInclusive(0, 1)],
        dbserver: statuses[getRandomIntInclusive(0, 1)],
      }
    })
  }
  return stores;
}

function createSocket() {
  const socketUrl = "ws://localhost:3000/cable";
  const socket = new WebSocket(socketUrl);
  const stores = createStoresWithDevices();

  for(let i = 0; i < stores.length; i++) {
    socket.onopen = function(event) {
      console.log("Connected to server...");
      let msg = {};
      for(let i = 0; i < stores.length; i++) {
        msg = {
          command: 'subscribe',
          identifier: JSON.stringify({
            id: 1,
            channel: 'StoresChannel',
            store: stores[i],
          })
        }
        socket.send(JSON.stringify(msg));
      }
    }
  }

  socket.onmessage = function(event) {
    console.log("on event...");
  }

  socket.onclose = function(event) {
    console.log("on close...")
  }

  socket.onerror = function(event) {

    console.log("on error: ", event);
  }

}

setInterval(createSocket, 30 * 1000);