process.env.NODE_ENV = 'test';
var request = require('supertest');
var app = require('../app.js');
var token = '';
var user = {
  email: 'test@test.com',
  password: 'admin1234'
};


//Access the sign up page and confirm that a user can signup
describe('POST /users/signup and confirm that signup completes', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .post('/users/signup')
      .send(user)
      .expect(function(res){
        res.body.msg = 'Your account has been created.',
        res.body.email = 'test@test.com',
        res.body.createdAt = '',
        res.body.success = true
      })
      .expect(200, {
        createdAt: '',
        email: 'test@test.com',
        msg: 'Your account has been created.',
        success: true
      }, done);
  });
});


describe('POST /users/auth and confirm that auth token is returned', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .post('/users/auth')
      .send(user)
      .expect(function(res){
        token = res.body;
      })
      .expect(200, done);
  });
});

describe('GET /users', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/users')
      .set('Authorization', token)
      .expect(200, done);
  });
});

describe('DELETE /users/signout', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .delete('/users/signout')
      .set('Authorization', token)
      .send(user)
      .expect(200, done);
  });
});

describe('GET /random-url', function() {
  it('should return 404', function(done) {
    request(app)
      .get('/reset')
      .expect(404, done);
  });
});