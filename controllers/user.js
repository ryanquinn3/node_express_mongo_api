/**
 * GET /
 * User Listing page.
 */
exports.users = function(req, res, next) {
  // if (req.user) {
  //   return res.redirect('/');
  // }
  res.status(200).send({ title: 'Users' });
};