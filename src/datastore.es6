import eventEmitter from 'eventemitter3'

class Datastore extends eventEmitter {
  constructor () {
    super()
    this._data = {}
  }

  merge (newData, source = 'user') {
    let changes = []
    for (var key in newData) {
      if (newData.hasOwnProperty(key) && (this._data[key] !== newData[key])) {
        this._data[key] = newData[key]
        changes.push({key: key, value: newData[key]})
      }
    }
    this._emitChanges(changes, source)
  }

  get (key) {
    return this._data[key]
  }

  set (key, value, source = 'user') {
    this._data[key] = value
    this._emitChanges([{key, value}], source)
  }

  _emitChanges (changes, source) {
    if (changes && changes.length) {
      this.emit('changed', changes, source)
    }
  }
}

export default Datastore
