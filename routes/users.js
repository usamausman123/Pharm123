const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//bring in User model
let User = require('../models/user');

//Register Form
router.get('/register' ,AdminAuthenticated ,function(req,res){
     res.render('register'); 
});

//Register Process
router.post('/register',function(req,res){
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;
    const role = req.body.role;
    
    req.checkBody('name','Name is required!').notEmpty();
    req.checkBody('email','Email is required!').notEmpty();
    req.checkBody('email','Email is not valid!').isEmail();
    req.checkBody('username','Username is required!').notEmpty();
    req.checkBody('password','Password is required!').notEmpty();
    req.checkBody('password2','Passwords do not match!').equals(req.body.password);
    req.checkBody('role','Role is required!').notEmpty();
    
    let errors = req.validationErrors();
     if(errors){
         res.render('register',{
             errors : errors
         });
     }
     else{
         
        let newUser =new User({
        name: name,
        email: email,
        username: username,
        password: password,
        role: role
     });
        bcrypt.genSalt(10,function(err,salt){
        bcrypt.hash(newUser.password,salt,function(err,hash){
            if(err){
                console.log(err);
            }
            newUser.password = hash;
            newUser.save(function(err){
               if(err){
                   console.log(err);
                   return;
               } 
               else{
                   req.flash('success','You are now registered and can log in');
                   res.redirect('/users/login');
               }
            });
        }); 
    });
   }
});


router.get('/logout',function(req,res){
     req.logout();
     req.flash('success','You are Logged Out!!');
     res.redirect('/users/login');
});

router.get('/login',function(req,res){
     res.render('login'); 
});


//login process
router.post('/login',function(req,res,next){
    passport.authenticate('local',{
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req,res,next);
});

//admin access control
function AdminAuthenticated(req,res,next){
    if(req.isAuthenticated() && req.user.role === 'admin'){
       return next();
    }
    else{
       req.flash('danger','Please Login As Admin!!');
       res.redirect('/users/login');
    }
}
    
module.exports = router;