# motujs

[![JavaScript Standard Style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/feross/standard)

JavaScript library to control MOTU AVB audio interfaces

Implementation is based on MOTU's documentation:  
http://cdn-data.motu.com/downloads/audio/AVB/avb_osc_api.pdf

## Installation

```bash
npm install
gulp
```

## Usage
### Connecting
```js
var motu = new Motu()
motu.connect('192.168.0.143')
motu.disconnect()
```

### Get value
```js
var motu = new Motu()
motu.connect('192.168.0.143')
motu.datastore.once('changed', function(a, b) {
  // datastore is synced after first change
  var value = motu.datastore.get('mix/chan/1/matrix/fader')
  console.log('Value of first fader is ', value)
  motu.disconnect()
});
```

### Listening for changes
```js
var motu = new Motu()
motu.datastore.on('changed', function(a, b) {
  console.log(a.length + ' items changed by ' + b)
});
motu.connect('192.168.0.143')
```

### Making changes
```js
var motu = new Motu()
motu.connect('192.168.0.143')
setInterval(function () {
  motu.datastore.set('mix/chan/1/matrix/fader', Math.random())
}, 500)
```
