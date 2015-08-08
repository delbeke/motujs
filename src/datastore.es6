class Datastore {
  constructor () {
    this._data = {}
  }

  merge (newData, source) {
    for (var key in newData) {
      if (newData.hasOwnProperty(key)) {
        this._data[key] = newData[key]
      }
    }
  }

  get (key) {
    return this._data[key]
  }

  set (key, value) {
    this._data[key] = value
  }
}

export default Datastore
