var DBUtil = require('../index'),
  should = require('should'),
  co = require('co');
describe('test mysql connection tool', function() {
  var options = {
    host: 'localhost',
    database: 'test',
    user: 'root',
    password: '!qaz2wsx'
  };

  it('can connect to mysql db', function(done) {
    var conn = DBUtil.connect(options);
    should(conn).be.ok();
    conn.should.have.ownProperty('query');
    conn.should.have.ownProperty('insertTable');
    conn.should.have.ownProperty('updateTable');
    should(conn.query).Function();
    should(conn.insertTable).Function();
    should(conn.updateTable).Function();

    done();
  });

  it('can query db', function(done) {
    co(function * () {
      should(0).be.ok();
    }).then(done, done);
  });

});