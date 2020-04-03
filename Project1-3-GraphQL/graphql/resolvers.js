const bcrypt = require('bcryptjs');
const vlidator = require('validator');

const User = require('../models/user');

module.exports = {
  createUser: async function({ userInput }, req) {
    const errors = [];
    if (!vlidator.isEmail(userInput.email)) {
      errors.push({ message: '이메일이 유호하지 않습니다.' });
    }
    if (
      !vlidator.isEmpty(userInput.password) ||
      validator.isLength(userInput.password, { min: 5 })
    ) {
      errors.push({ meesage: '비밀번호를 최소 5글자 이상 넣어주세요.' });
    }
    if (errors.length > 0) {
      const error = new Error('Invalid input.');
      throw error;
    }
    const existingUser = await User.findOne({ eamil: userInput.email });
    if (existingUser) {
      const error = new Error('User exists already!');
      throw error;
    }
    const hashedPw = await bcrypt.hash(userInput.password, 12);
    const user = new User({
      email: userInput.email,
      name: userInput.name,
      password: hashedPw
    });
    const createdUser = await user.save();
    return { ...createdUser._doc, _id: createdUser._id.toString() };
  }
};
