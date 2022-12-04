var express = require('express');
var router = express.Router();
const userHelper= require('../helpers/user-helper')

/* GET home page. */

const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn) {
    next()
  } else
    res.render('user/feedback')

}

router.get('/', function(req, res, next) {
  
  res.render('user/home', { title: 'free.desk',});
});

router.get('/admin',(req,res)=>{ 
  res.render('admin/admin-login')
})

router.get('/engineer',(req,res)=>{
  res.render('engineer/eng-login')
})

router.post('/login', (req, res) => {
  userHelper.doLogin(req.body).then((response) => {
    if (response.status) {                            //session 
      req.session.loggedIn = true
      req.session.user = response.user
      res.redirect('login')
    }
    else {
      req.session.loginErr = "Invalid Username or Password"
      res.redirect('login')
    }
  })
})

router.get('/feedback', verifyLogin, function(req, res, next) {
  console.log(req.session.user)
    res.render('user/feedback');
  
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('feedback')
  } else
    res.render('user/user-login', { loginErr: req.session.loginErr })
  req.session.loginErr = false
})

router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

router.post('/submit',(req,res)=> {
  userHelper.doSubmit(req.body,req.session.user._id).then((refId)=>{             //submit complaint
    console.log(refId)
    
    res.render('user/thanks',{refId})
  })
})

router.get('/signup', (req, res) => {
  res.render('user/signup')
})

router.post('/signup',(req, res) => {
  userHelper.doSignup(req.body).then((data)=>{
    res.redirect('/login')
  })
  
})


module.exports = router;
