const expect = require('chai').expect;
const sinon = require('sinon');

const User = require('../models/user');
const AuthControllers = require('../controllers/auth');

describe('Auth Controller - Login', function () {
  it('should throw an error with code 500 if accessing the database fails', function (done) {
    sinon.stub(User, 'findOne');
    User.findOne.throws();

    const req = {
      body: {
        email: 'test@test.com',
        password: 'test1234'
      }
    };

    AuthControllers.login(req, {}, () => {}).then((result) => {
      expect(result).to.be.an('error');
      expect(result).to.have.property('statusCode', 500);
      done();
    });

    expect(AuthControllers.login);

    User.findOne.restore();
  });
});
