exports.get404 = (req, res, next) => {
  res.status(404).render('404', { pageTitle: 'NOT FOUND!!!!!', path: '/404' });
};
