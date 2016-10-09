import {request} from 'http'
import Datastore from './datastore'
import patch from './http/patch'

class Motu {
  constructor () {
    this._eTagData = -1
    this._eTagMeters = -1
    this._clientId = Math.round(Math.random() * 10000000)
    this._datastore = new Datastore()
    this._metersWatched = ['mix', 'level']

    // wire events
    this._datastore.on('changed', (changes, source) => {
      this._onDatastoreChanged(changes, source)
    })
  }

  connect (address) {
    this._address = address
    this._getNewData()
    // this._getMeters()
  }

  disconnect () {
    this._address = null
  }

  get datastore () {
    return this._datastore
  }

  _onDatastoreChanged (changes, source) {
    if ((source === 'user') && changes && changes.length) {
      const data = {}
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

  _refreshMeters () {
    setTimeout(() => {
      console.log('refreshing meters')
      this._getMeters()
    }, 0)
  }

  _setNewData (data) {
    if (!this._address) {
      return
    }

    patch(this._address, '/datastore?client=' + this._clientId, data)
  }

  _getNewData () {
    if (!this._address) {
      return
    }

    const path = '/datastore?client=' + this._clientId
    let headers = {}
    if (this._eTagData > 0) {
      // MOTU supports long polling:
      // It waits to send response until something has changed, and increases the ETag number.
      headers['If-None-Match'] = this._eTagData
    }

    request({host: this._address, path: path, headers: headers}, (response) => {
      if (response.statusCode >= 200 && response.statusCode < 300) {
        this._eTagData = response.headers['ETag']
        let body = ''
        response.on('data', (partialData) => {
          body += partialData
        })
        response.on('end', () => {
          this._parseRawDatastore(JSON.parse(body))
          this._refreshData()
        })
      } else if (response.statusCode === 304) {
        // 304 means no data has changed on the device, ask again
        this._refreshData()
      } else {
        console.log('Unexpected http status ' + response.status)
      }
    }).end()
  }

  _parseRawDatastore (json) {
    this._datastore.merge(json, 'device')
  }

  _getMeters () {
    if (!this._address) {
      return
    }

    let headers = {}
    if (this._eTagMeters > 0) {
      // MOTU supports long polling:
      // It waits to send response until something has changed, and increases the ETag number.
      headers['If-None-Match'] = this._eTagMeters
    }

    const path = '/meters?meters=' + this._metersWatched.join('/')
    request({host: this._address, path: path, headers: headers}, (response) => {
      if (response.statusCode >= 200 && response.statusCode < 300) {
        this._eTagMeters = response.headers['ETag']
        this._refreshMeters()
      } else if (response.statusCode === 304) {
        // 304 means no data has changed on the device, ask again
        this._refreshMeters()
      } else {
        console.log('Unexpected http status ' + response.status)
      }
    }).end()
  }
}

export default Motu
