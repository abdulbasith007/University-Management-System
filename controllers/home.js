exports.getIndex = (req, res, next) => {
    res.redirect('/admin/dashboard');
  };
  
  exports.getLanding = (req, res, next) => {
    res.redirect('/admin/dashboard');
  }
  
  exports.getError404 = (req, res, next) => {
    res.render('error404');
  }
  