var mysql = require('mysql'),
  debug = require('debug')('mysql-db-util'),
  wrapper = require('co-mysql');

module.exports.connect = function(options){
  var pool = mysql.createPool(options);
  debug('create new connect success!');
  return wrapper(pool);
  
}