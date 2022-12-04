var express = require('express');
var router = express.Router();
const adminHelper= require('../helpers/admin-helper')

const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn) {
    next()
  } else
    res.render('admin/admin-login')

}


/* GET users listing. */


router.post('/login', (req, res) => {
  adminHelper.doLogin(req.body).then((response) => {
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
  
  adminHelper.getAllComplaints().then((complaints)=>{
    adminHelper.getEngineers().then((engineers)=>{
      let joint=[];
      complaints.forEach((subject)=>joint.push({
        complaints:subject,
        engineers:engineers
      }))
      let countComp=complaints.length;
      let countEng=engineers.length;
    
      //console.log(joint)
      res.render('admin/admin-dashboard',{joint,countComp,countEng,admin:true});
      //console.log(engineers)
    })
    
  })
  
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('home')
  } else
    res.render('admin/admin-login', { loginErr: req.session.loginErr })
  req.session.loginErr = false
})

router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

router.post('/create',(req,res)=>{
  adminHelper.create(req.body).then((engineers)=>{             //submit complaint
    
    res.redirect('home')
  })
})

router.post('/send',(req,res)=>{
  adminHelper.sendEngineer(req.query.id,req.body).then(()=>{
    res.redirect('home')
  })
})

router.get('/delete-eng/',(req,res)=>{               //delete product
  let engId = req.query.id
  adminHelper.deleteEng(engId).then((response)=>{
    res.redirect('home')
  })
})

module.exports = router;
