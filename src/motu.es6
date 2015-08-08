import '/node_modules/whatwg-fetch/fetch.js'
import Datastore from 'datastore.js'

class Motu {
  constructor () {
    this._eTag = -1
    this._datastore = new Datastore()
  }

  connect (address) {
    this._address = address
    this._getNewData()
  }

  disconnect () {
    this._address = null
  }

  get datastore () {
    return this._datastore
  }

  _getNewData () {
    if (!this._address) {
      return
    }

    const url = 'http://' + this._address + '/datastore'
    let headers = {}
    if (this._eTag > 0) {
      headers['If-None-Match'] = this._eTag
    }

    window.fetch(url, {headers: headers})
      .then(response => {
        if (response.status >= 200 && response.status < 300) {
          this._eTag = response.headers.get('ETag')
          return response
        } else if (response.status === 304) {
          // no data was changed on the device, ask again
          setTimeout(() => { this._getNewData() }, 0)
        } else {
          console.log('Invalid http status ' + response.status)
        }
      }).then(response => {
        return response.json()
      }).then(json => {
        this._parseRawDatastore(json)
        setTimeout(() => { this._getNewData() }, 0)
      }).catch(ex => {
        console.log('Failed to get data', ex)
      })
  }

  _parseRawDatastore (json) {
    this._datastore.merge(json, 'device')
  }
}

export default Motu
