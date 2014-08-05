var moment = require('moment')
  , now = moment()
  , fs = require('fs')
  , es = require('event-stream')
  , Transform = require('stream').Transform
  , util = require('util')
  , format = 'DD/MMM/YYYY:HH:mm:ss'

function TimeEmitter () {
  this.last = null
  Transform.call(this, {objectMode: true})
}

util.inherits(TimeEmitter, Transform)

TimeEmitter.prototype._transform = function (data, enc, next) {
  if (!this.last) {
    this.last = moment(data.timestamp, format)
  }
  setTimeout((function () {
    this.push(data)
    this.last = moment(data.timestamp, format)
    next()
  }).bind(this), moment(data.timestamp, format).diff(this.last))
}

process.stdin
       .pipe(es.split())
       .pipe(es.parse())
       .pipe(new TimeEmitter)
       .pipe(es.stringify())
       .pipe(process.stdout)
