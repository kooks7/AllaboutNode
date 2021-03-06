const path = require('path');
const fs = require('fs');

const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Post = require('../models/post');

module.exports = {
  createUser: async function ({ userInput }, req) {
    const errors = [];
    if (!validator.isEmail(userInput.email)) {
      errors.push({ message: '이메일이 유효하지 않습니다.' });
    }
    if (
      validator.isEmpty(userInput.password) ||
      !validator.isLength(userInput.password, { min: 5 })
    ) {
      errors.push({ meesage: '비밀번호를 최소 5글자 이상 넣어주세요.' });
    }
    if (errors.length > 0) {
      const error = new Error('Invalid input.');
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const existingUser = await User.findOne({ email: userInput.email });
    if (existingUser) {
      const error = new Error('User exists already!');
      throw error;
    }
    const hashedPw = await bcrypt.hash(userInput.password, 12);
    const user = new User({
      email: userInput.email,
      name: userInput.name,
      password: hashedPw,
    });
    const createdUser = await user.save();
    return { ...createdUser._doc, _id: createdUser._id.toString() };
  },
  login: async function ({ email, password }) {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error('User not found');
      error.code = 401;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error('Password is incorrect.');
      error.code = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      'somesupersupersecretfromminjae',
      { expiresIn: '1h' }
    );
    return { token: token, userId: user._id.toString() };
  },

  createPost: async function ({ postInput }, req) {
    // 1. 토큰 검사하기
    if (!req.isAuth) {
      const error = new Error('토큰이 검증되지 않았습니다.');
      error.code = 401;
      throw error;
    }
    // 2. userInput 검사하기
    const errors = [];
    if (
      validator.isEmpty(postInput.title) ||
      !validator.isLength(postInput.title, { min: 3 })
    ) {
      errors.push({ message: 'Title is invalid.' });
    }
    if (
      validator.isEmpty(postInput.content) ||
      !validator.isLength(postInput.content, { min: 3 })
    ) {
      errors.push({ message: 'content is invalid.' });
    }
    if (errors.length > 0) {
      const error = new Error('Invalid Input');
      error.data = errors;
      error.code = 422;
      throw error;
    }
    // 3. 토큰에서 저장한 user가져오기
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error('Invalid user');
      error.code = 401;
      throw error;
    }
    // 4. mongoDB에 저장하기
    const post = new Post({
      title: postInput.title,
      imageUrl: postInput.imageUrl,
      content: postInput.content,
      creator: user,
    });

    const createdPost = await post.save();

    // 5. user에 새로만든 post 넣어주기
    user.posts.push(createdPost);
    await user.save();
    return {
      ...createdPost._doc,
      _id: createdPost._id.toString(),
      createdAt: createdPost.createdAt.toISOString(),
      updatedAt: createdPost.updatedAt.toISOString(),
    };
  },
  posts: async function ({ page }, req) {
    if (!req.isAuth) {
      const error = new Error('권한이 없습니다.');
      error.code = 401;
      throw error;
    }
    // 1. page 설정이 없으면 1페이지 보여주기
    if (!page) {
      page = 1;
    }
    // 2. page 설정
    const perPage = 2;
    const totalPosts = await Post.find().countDocuments();
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate('creator');

    //mongodb 객체 형태로 보내주면 graphql이 읽을 수 없으므로 변환해서 보내주기
    return {
      posts: posts.map((p) => {
        return {
          ...p._doc,
          _id: p._id.toString(),
          createdAt: p.createdAt.toISOString(),
          updatedAt: p.updatedAt.toISOString(),
        };
      }),
      totalPosts: totalPosts,
    };
  },
  getPost: async function ({ id }, req) {
    if (!req.isAuth) {
      const error = new Error('권한이 없습니다.');
      error.code = 401;
      throw error;
    }
    const post = await Post.findById(id).populate('creator');
    if (!post) {
      const error = new Error('No post found!');
      error.code = 404;
      throw error;
    }

    console.log(post);
    return {
      ...post._doc,
      _id: post._id.toString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
  },
  updatePost: async function ({ id, postInput }, req) {
    // 1. 권한 체크
    if (!req.isAuth) {
      const error = new Error('권한이 없습니다.');
      error.code = 401;
      throw error;
    }
    // 2. mongoDB에서 수정할 post 객체 가져오기
    const post = await Post.findById(id).populate('creator');
    if (!post) {
      const error = new Error('No post found!');
      error.code = 404;
      throw error;
    }
    console.log(postInput.imageUrl);
    // 3. 자기가 작성한 post만 수정가능하게 권한 설정
    if (post.creator._id.toString() !== req.userId.toString()) {
      const error = new Error('다른 사람의 post를 수정할 권한이 없습니다.');
      error.code = 403;
      throw error;
    }
    // 4. 사용자 Input 체크
    const errors = [];
    if (
      validator.isEmpty(postInput.title) ||
      !validator.isLength(postInput.title, { min: 3 })
    ) {
      errors.push({ message: 'Title is invalid.' });
    }
    if (
      validator.isEmpty(postInput.content) ||
      !validator.isLength(postInput.content, { min: 3 })
    ) {
      errors.push({ message: 'content is invalid.' });
    }
    if (errors.length > 0) {
      const error = new Error('Invalid Input');
      error.data = errors;
      error.code = 422;
      throw error;
    }

    // 5. post 객체 update하기
    post.title = postInput.title;
    post.content = postInput.content;
    // 사용자가 새로운 사진을 업데이트했다면
    if (postInput.imageUrl !== 'undefined') {
      post.imageUrl = postInput.imageUrl;
    }
    // 6. mongoDB에 저장
    const updatedPost = await post.save();

    return {
      ...updatedPost._doc,
      _id: updatedPost._id.toString(),
      createdAt: updatedPost.createdAt.toISOString(),
      updatedAt: updatedPost.updatedAt.toISOString(),
    };
  },
  deletePost: async function ({ id }, req) {
    // 1. 권한 확인
    if (!req.isAuth) {
      const error = new Error('권한이 없습니다.');
      error.code = 401;
      throw error;
    }
    // 2. 삭제하고자 하는 post 객체 가져오기
    const post = await Post.findById(id);

    // 없으면 오류!
    console.log(post);
    if (!post) {
      const error = new Error('포스트가 없습니다.');
      error.state = 404;
      throw error;
    }
    // 3. post의 userId와 요청하는 유저의 id가 일치하는지 확인하기
    if (req.userId.toString() !== post.creator.toString()) {
      const error = new Error('다른 사람의 post를 삭제할 권한이 없습니다.');
      error.code = 403;
      throw error;
    }

    // 4. post DB와 이미지 삭제하기
    clearImage(post.imageUrl);
    await Post.findByIdAndRemove(id);

    // 5. user객체 가져와서 posts에 해당 post지우기
    const user = await User.findById(req.userId);
    user.posts.pull(id);
    await user.save();
    return true;
  },
  // 첫번째 인자는 graphql에서 정의한 인자, 두번째 인자는  request이다.
  status: async function (args, req) {
    if (!req.isAuth) {
      const error = new Error('권한이 없습니다.');
      error.code = 401;
      throw error;
    }
    // console.log(req.);
    // 2. status db에서 찾기
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error();
      error.status = 404;
      throw error;
    }
    return { ...user._doc, _id: user._id.toString() };
  },
  updateStatus: async function ({ status }, req) {
    if (!req.isAuth) {
      const error = new Error('권한 없디?');
      error.code = 401;
      throw error;
    }

    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error();
      error.status = 404;
      throw error;
    }
    user.status = status;
    await user.save();

    return { ...user._doc };
  },
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
