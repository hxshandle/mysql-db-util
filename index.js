"use strict";
var connect = require('./lib/connect').connect,
  db = require('./lib/db_util'),
  debug = require('debug')('mysql-db-util');

module.exports.connect = function(options) {
  var conn = connect(options);
  debug('create a new db connection pool ',conn);
  var dbUtil = db.getDB(conn);
  return dbUtil;
}