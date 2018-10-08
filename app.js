const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport  = require('passport');
const config = require('./config/database');
 
//connection to mongodb
mongoose.connect('mongodb://admin:admin123@ds233581.mlab.com:33581/pharmacy');
const db = mongoose.connection;

//check connection
db.once('open',function(){
    console.log('connected to mongodb');
    
});
//check for db errors
db.on('error',function(err){
    console.log(err);
});

//init app
const app = express();


//load view engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');

//bring in  teacher model
let Product = require('./models/teacher');
let User = require('./models/user');


//body-parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//set public folder
app.use(express.static(path.join(__dirname,'public')));

//Express session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}));

//Express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Express validator middleware
app.use(expressValidator({
    errorFormatter: function(param,msg,value){
        var namespace = param.split('.'),
        root = namespace.shift() ,
        formParam = root;
        while(namespace.lenght){
            formParam += '[' + namespace.shift() + ']';
        }
        return {
          param : formParam,
          msg : msg,
          value : value
        };
    }
}));

//Passport Config
require('./config/passport')(passport);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());


app.get('*',function(req,res,next){
    res.locals.user= req.user || null;
    next();
});


//Home Route
app.get('/',userAuthenticated ,function(req,res){
    
    User.find(req.params.id,function(err,user){
        if(err){
            console.log(err);
        }
        else{
            Product.find({},function(err,products){
                if(err){
                    console.log(err);
                }
                else{
                    res.render('index',{
                        title :'Welcome to Clinix',
                        art:products,
                        Role:user.role
                    });    
                }    
            });
        }
  });
        
    
});

//Route teachers.js File
let products = require('./routes/teachers');
app.use('/teachers',products);

//Route users.js File
let users = require('./routes/users');
app.use('/users',users);


//access control
function userAuthenticated(req,res,next){
    if(req.isAuthenticated()){
       return next();
    }
    else{
       req.flash('danger','Please Login!!');
       res.redirect('/users/login');
    }
}


//server start
app.listen(5000,function(){
    console.log('server started on port 5000...');
});