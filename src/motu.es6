import fetch from 'whatwg-fetch'
import Datastore from './datastore'

class Motu {
  constructor () {
    this._eTag = -1
    this._clientId = Math.round(Math.random() * 10000000)
    this._datastore = new Datastore()

    // wire events (and fix context)
    var me = this
    this._datastore.on('changed', function (changes, source) {
      me._onDatastoreChanged.bind(me, changes, source)()
    })
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

  _onDatastoreChanged (changes, source) {
    if ((source === 'user') && changes && changes.length) {
      var data = {}
      for (let change of changes) {
        data[change.key] = change.value
      }
      this._setNewData(data)
    }
  }

  _refreshData () {
    setTimeout(() => {
      this._getNewData()
    }, 0)
  }

  _setNewData (data) {
    if (!this._address) {
      return
    }

    const url = 'http://' + this._address + '/datastore?client=' + this._clientId
    const json = JSON.stringify(data)

    let formData = new window.FormData()
    formData.append('json', json)
    window.fetch(url, {method: 'PATCH', body: formData})
  }

  _getNewData () {
    if (!this._address) {
      return
    }

    const url = 'http://' + this._address + '/datastore?client=' + this._clientId
    let headers = {}
    if (this._eTag > 0) {
      // MOTU supports long polling:
      // It waits to send response until something has changed, and increases the ETag number.
      headers['If-None-Match'] = this._eTag
    }

    window.fetch(url, {headers: headers})
      .then(response => {
        if (response.status >= 200 && response.status < 300) {
          this._eTag = response.headers.get('ETag')
          return response.json().then(json => {
            this._parseRawDatastore(json)
            this._refreshData()
          }).catch(ex => {
            console.log('Failed to get data', ex)
          })

        } else if (response.status === 304) {
          // 304 means no data has changed on the device, ask again
          this._refreshData()
        } else {
          console.log('Unexpected http status ' + response.status)
        }
      })
  }

  _parseRawDatastore (json) {
    this._datastore.merge(json, 'device')
  }
}

window.Motu = Motu
export default Motu
