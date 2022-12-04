var express = require('express');
var router = express.Router();
const engineerHelper= require('../helpers/engineer-helper')

/* GET users listing. */
/*router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});*/

const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn) {
    next()
  } else
    res.render('engineer/eng-login')

}

router.post('/login', (req, res) => {
  engineerHelper.doLogin(req.body).then((response) => {
    if (response.status) {                            //session 
      req.session.loggedIn = true
      req.session.user = response.user
      res.redirect('home')
    }
    else {
      req.session.loginErr = "Invalid Username or Password"
      res.redirect('login')
    }
  })
})

router.get('/home', verifyLogin, function(req, res, next) {
  let engineer=req.session.user
  console.log(engineer)
  engineerHelper.getAllComplaints(engineer).then((complaints)=>{
   
      res.render('engineer/eng-dashboard',{complaints,admin:true});
      //console.log(engineers)
        
  })
  
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('home')
  } else
    res.render('engineer/eng-login', { loginErr: req.session.loginErr })
  req.session.loginErr = false
})

router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

router.post('/send',(req,res)=>{
  engineerHelper.sendResponse(req.query.id,req.body).then(()=>{
    res.redirect('home')
  })
})

module.exports = router;