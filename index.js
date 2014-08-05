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

function Parse () {
  Transform.call(this, {objectMode: true})
}

util.inherits(Parse, Transform)

Parse.prototype._transform = function (data, enc, next) {
  var line = data.toString('utf8').split(' ')
  if (line.length !== 11) {
    return next()
  }

  this.push({
    timestamp: line[3].substring(1),
    resource: line[6],
    code: line[8],
    body_bytes_sent: parseInt(line[9], 10),
    request_time: parseInt(line[10], 10)
  })
  next()
}

fs.createReadStream(process.argv[2])
  .pipe(es.split())
  .pipe(new Parse)
  .pipe(new TimeEmitter)
  .pipe(es.stringify())
  .pipe(process.stdout)
