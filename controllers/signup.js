var path = require('path');
exports.signUpCont = (req, res) => {

  req.on('error', (error) => {
    console.log(error)
    res.sendStatus(400)
  }
  )


  res.render('signup');

}