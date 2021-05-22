const router=require('express').Router();
const passport=require('passport');
let Customer=require('../models/customer.model');
router.route('/').get((req, res) => {
    Customer.find()
      .then(customers => res.json(customers))
      .catch(err => res.status(400).json('Error: ' + err));
  });
router.route('/signup').post((req,res)=>{
  const Customers=new Customer({ name : req.body.name,email:req.body.email});   
        Customer.register(Customers,req.body.password,function(err,customer){
            if(err)
            {
              var redir = { returnCode: "Failure",
                            returnMsg:"Customer Already Registered"};
                            return res.json(redir);
                          }
            else{
                passport.authenticate("customerLocal")(req,res,function(){
                    if (req.user) {
                        var redir = { returnCode: "Success",
                                      returnMsg:"Customer registered Successfully"};
                        return res.json(redir);
                  } else {
                    res.status(400).json({ message: 'SignupFailed' });
                  }
                });
            }
        })
    });
router.route('/login').post((req,res)=>{
   if(!req.body.email){
    res.json({success: false, message: "email was not given"})
  } else {
    if(!req.body.password){
      res.json({success: false, message: "Password was not given"})
    }else{
      passport.authenticate('customerLocal', function (err, user, info) { 
         if(err){
           res.json({success: false, message: err})
         } else{
          if (! user) {
            var redir={
                Code:"Fa",
                Msg:"Login Failed"
            }
            return res.json(redir)
          } else{
            req.login(user, function(err){
              if(err){
                res.json({success: false, message: err})
              }
              else{
                  var redir={
                      Code:"Su",
                      Msg:"Login Success",
                      id:user._id
                  }
                  return res.json(redir)
              }
            })
          }
         }
      })(req, res);
    }
  }
 });
 module.exports=router;