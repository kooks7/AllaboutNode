const { expect } = require('chai');
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

const authMiddleware = require('../middleware/is-auth');

describe('Auth Middleware', function () {
  it('should throw an error if no authorization header is present', function () {
    // 가상의 request
    const req = {
      get: function (headerName) {
        return null;
      }
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
      'Not authenticated.'
    );
  });

  it('should throw an error if the authorization header is only one string', function () {
    const req = {
      get: function (headerName) {
        return 'xyz';
      }
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw;
  });

  it('should yield a userId after decoding the token', function () {
    const req = {
      get: function (headerName) {
        return 'Bearer alswocjswo';
      }
    };
    // 1. 우리가 사용하고자 하는 함수 sinon에 인자로 넣어주기
    // 인자1: 유지하고자 하는 함수 인자2: 함수 설명
    sinon.stub(jwt, 'verify');
    // 2. 리턴하고 싶은 값을 설정하기
    jwt.verify.returns({ userId: 'abc' });
    authMiddleware(req, {}, () => {});
    expect(req).to.have.property('userId');
    expect(req).to.have.property('userId', 'abc');
    console.log(jwt.verify.called);
    expect(jwt.verify.called).to.be.true;
    // 3. 원래 함수로 돌리기
    jwt.verify.restore();
  });

  it('should throw an error if the token cannot be verified', function () {
    const req = {
      get: function (headerName) {
        return 'Bearer xyz';
      }
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });
});
