const { expect } = require('chai');

//인자1: 이름 인자2: 실항할 로직 함수
it('should add numbers correctly', function () {
  const num1 = 2;
  const num2 = 3;
  // chai를 사용해서 기대하는 값 설정하기
  expect(num1 + num2).not.to.equal(5);
});
