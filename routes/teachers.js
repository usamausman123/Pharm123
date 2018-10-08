const express = require('express');
const router = express.Router();

/*const passport = require('passport');

const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport  = require('passport');
const config = require('./config/database');


//Route users.js File
let users = require('./routes/users');
app.use('/users',users);
*/


//bring in Product model
let Product = require('../models/teacher');

//Passport Config
/*require('./config/passport')(passport);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());
*/

//update teacher details 
router.get('/edit/:id',function(req,res){
     Product.findById(req.params.id,function(err,product){
         res.render('edit_teacher',{
            product : product
        });
     });
});

//sales route
router.get('/sales', userAuthenticated,  function(req,res){
    
    Product.find({},function(err,products){
        if(err){
            console.log(err);
        }
        else{
                res.render('sales',{
                title :'Products Billing System',
                art:products
            });    
        }    
    });
    
});


//add route
router.get('/add', adminAuthenticated, function(req,res){
    res.render('add_articles',{
        title : 'Add Products'
    });
});


//Bill route
/*router.post('/bill',function(req,res){ 
    Product.find({},function(err,products){
        if(err){
            console.log(err);
        }
        else{
    
            var table=document.getElementById("b");
            var subtotal=0.0;
            var tax=0.0;
            var total=0.0;
            for(var i = 2; i < table.rows.length; i++)
            {
                subtotal  = subtotal + (parseFloat(table.rows[i].cells[1].innerHTML) * parseFloat(table.rows[i].cells[2].innerHTML));
                tax= subtotal*0.1;
                total=tax+subtotal;
                document.getElementById("t1").value= subtotal;
                document.getElementById("t2").value= tax;
                document.getElementById("t3").value= total;

            }
        }    
    });
    
});*/



//add submit POST Route
router.post('/add',function(req,res){
     
     req.checkBody('name','Name is required!').notEmpty();
     req.checkBody('quantity','Quantity is required!').notEmpty();
     req.checkBody('price','Price is required!').notEmpty();
     req.checkBody('description','Description is required!').notEmpty();
     req.checkBody('company','Company is required!').notEmpty();
     req.checkBody('manDate','Man. Date is required!').notEmpty();
     req.checkBody('expDate','Exp. Date is required!').notEmpty();
     //Get Errors
     let errors = req.validationErrors();
     if(errors){
         res.render('add_articles',{
             title : 'Add Products',
             errors : errors
             
         });
     }
     else{
         
        let product =new Product();
        product.name=req.body.name;
        product.quantity=req.body.quantity;
        product.price=req.body.price;
        product.description=req.body.description;
        product.company=req.body.company;
        product.manDate=req.body.manDate;
        product.expDate=req.body.expDate;
        product.save(function(err){
            if(err){
                console.log(err);
                return;
            }
            else{
                req.flash('success','Product Added!!');
                res.redirect('/');
            }
        });
    /*console.log(req.body.f_name);
     return;*/    
     }
     
});

//update submit POST Route
router.post('/edit/:id',function(req,res){
     
     
     let product ={};
     product.name=req.body.name;
     product.quantity=req.body.quantity;
     product.price=req.body.price;
     product.description=req.body.description;
     product.company=req.body.company;
     product.manDate=req.body.manDate;
     product.expDate=req.body.expDate;
     let query = {_id:req.params.id};
     Product.update(query,product,function(err){
         if(err){
             console.log(err);
             return;
         }
         else{
             req.flash('success','Product Updated!!');
             res.redirect('/');
         }
     });
    
});

//enter stock
router.post('/enter/:id',function(req,res){
     
     
     let product ={};
     Product.findById(req.params.id,function(err,product){
        console.log(product.quantity);
         console.log(req.body.quantity);
         product.quantity =parseFloat(product.quantity) + parseFloat(req.body.quantity);
        let query = {_id:req.params.id};
        Product.updateOne(query,product,function(err){
            if(err){
                console.log(err);
                return;
            }
            else{
                req.flash('success','Stock Updated!!');
                res.redirect('/');
            }
        });
    });
}); 

//admin access control
function adminAuthenticated(req,res,next){
    if(req.isAuthenticated() && req.user.role === 'admin'){
       return next();
    }
    else{
       req.flash('danger','Please Login As Admin!!');
       res.redirect('/users/login');
    }
}

//user access control
function userAuthenticated(req,res,next){
    if(req.isAuthenticated()){
       return next();
    }
    else{
       req.flash('danger','Please Login!!');
       res.redirect('/users/login');
    }
}



/*function role(req,res){
    if(req.user.role === 'admin'){
        return true;
    }
    else{
        return false;
    }
}
*/

//delete from stock
router.post('/return/:id',function(req,res){
     
     
     let product ={};
     Product.findById(req.params.id,function(err,product){
         console.log(product.quantity);
         console.log(req.body.quantity);
        product.quantity =parseFloat(product.quantity) - parseFloat(req.body.quantity);
        let query = {_id:req.params.id};
        Product.updateOne(query,product,function(err){
            if(err){
                console.log(err);
                return;
            }
            else{
                req.flash('success','Stock Updated!!');
                res.redirect('/');
            }
        });
    });
});


//delete product
router.delete('/:id',function(req,res){
    let query = {_id:req.params.id};
    Product.remove(query,function(err){
        if(err){ 
            console.log(err);
        }
        req.flash('success','Product Deleted!!');
        res.send('Success');
    });
    
});

//get product details
router.get('/:id',function(req,res){
     Product.findById(req.params.id,function(err,product){
         
         res.render('teacher_details',{
            product : product
        });
     });
});



module.exports = router;