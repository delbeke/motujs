/* global FormData */
let XMLHttpRequest = null
if (typeof window !== 'undefined') {
  XMLHttpRequest = window.XMLHttpRequest
} else {
  XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest
}

export default function (hostname, path, data) {
  const form = new FormData()
  form.append('json', JSON.stringify(data))
  const xhr = new XMLHttpRequest()
  xhr.open('POST', 'http://' + hostname + path, true)
  xhr.onload = function () {
  }
  xhr.send(form)
}
