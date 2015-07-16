"use strict";
var debug = require('debug')('mysql-db-util:db_util'),
  format = require('util').format,
  _ = require('lodash');

var exports = module.exports.getDB = dbutils;



function dbutils(conn) {
  var db = conn;
  var DB_STRUCTURE = {};

  function * getDBStructure(tableName) {
    if (DB_STRUCTURE[tableName] == undefined) {
      var sql = format("DESCRIBE `%s`", tableName);
      var tableStructure = yield db.query(sql);
      DB_STRUCTURE[tableName] = tableStructure;
    }
    return DB_STRUCTURE[tableName];
  }


  return {
    /**
     * [*query description]
     * @param {[type]} tableName     [description]
     * @param {[type]} data          [description]
     * @yield {[type]} [description]
     */
    query: function * (tableName, data) {
      debug('query sql - > ', sql);
      var sel = yield db.query(sql);
      return sel;
    },
    /**
     * [insertTable description]
     * @param  {[type]} tableName [description]
     * @param  {[type]} data      [description]
     * @return {[type]}           [description]
     */
    insertTable: function * (tableName, data) {
      var tableStructure = yield getDBStructure(tableName);

      var insertSql = "insert into `%s` (%s) values (%s)";
      var keyStr = [],
        valueStr = [];
      tableStructure.forEach(function(row, index, arr) {
        var fieldName = row.Field;
        if (fieldName.toLowerCase() == "id") {
          return;
        }
        var fieldType = row.Type.split("(")[0];
        if (_.has(data, fieldName)) {
          keyStr.push(fieldName);
          switch (fieldType) {
            case "varchar":
            case "longtext":
            case "datetime":
              if (fieldName == "password") {
                valueStr.push(data[fieldName]);
              } else {
                valueStr.push('\"' + data[fieldName] + '\"');
              }
              break;
            case "int":
              valueStr.push(data[fieldName]);
              break;
            default:
              valueStr.push('\"' + data[fieldName] + '\"');
              break;
          }
        }

        if (fieldName == "insert_date" && !_.has(data, fieldName)) {
          keyStr.push(fieldName);
          valueStr.push("NOW()");
        }
      });
      var finalSql = format(insertSql, tableName, '`' + keyStr.join("`,`") + '`', valueStr.join(','));
      //console.log("final sql = %s",finalSql);
      debug('insert table sql -> ', finalSql);
      var ins = yield db.query(finalSql);
      return ins;
    },
    /**
     * [*updateTable description]
     * @param {[type]} tableName     [description]
     * @param {[type]} data          [description]
     * @yield {[type]} [description]
     */
    updateTable: function * (tableName, data) {
      var tableStructure = yield getDBStructure(tableName);
      var _setArray = [];
      tableStructure.forEach(function(row, index, arr) {
        var fieldName = row.Field;
        var fieldType = row.Type.split("(")[0];
        if (fieldName.toLowerCase() == "id") {
          return;
        }
        if (_.has(data, fieldName)) {
          switch (fieldType) {
            case "varchar":
            case "longtext":
            case "datetime":
              if (fieldName == "password") {
                _setArray.push("`" + fieldName + "`=" + data[fieldName]);
              } else {
                _setArray.push("`" + fieldName + "`=\"" + data[fieldName] + "\"");
              }

              break;
            case "int":
              _setArray.push("`" + fieldName + "`=" + data[fieldName]);
              break;
            default:
              _setArray.push("`" + fieldName + "`=\"" + data[fieldName] + "\"");
              break;
          }
        }

      });
      var updateSql = format("update `%s` set %s where id = %d", tableName, _setArray.join(','), data.id);
      //console.log("update sql = > ", updateSql);
      var ups = yield db.query(updateSql);
      return ups;
    }
  }
}