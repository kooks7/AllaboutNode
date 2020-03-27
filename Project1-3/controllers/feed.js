exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [{ title: 'First Posts', content: 'This is the first post!' }]
  });
};

exports.createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  console.log(title);
  // Create post in db
  // status : 201 새로운 리소스 생성을 성공했다.
  res.status(201).json({
    message: 'Post created successfully!',
    post: { id: new Date().toISOString(), title: title, content: content }
  });
};
