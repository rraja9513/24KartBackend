const router=require('express').Router();
const passport=require('passport');
let Customer=require('../models/customer.model');
router.route('/').get((req, res) => {
    Customer.find()
      .then(customers => res.json(customers))
      .catch(err => res.status(400).json('Error: ' + err));
  });
router.route('/signup').post((req,res)=>{
  const Customers=new Customer({fullname:req.body.fullname,emailnphone:req.body.emailnphone,phonenumber:req.body.phonenumber,deliveryaddress:{addressline1:req.body.addressline1,adressline2:req.body.addressline2,landmark:req.body.landmark,pin:req.body.pin,cityrdistrict:req.body.cityrdistrict,whatyoucallit:{Home:req.body.Home,Office:req.body.Office,Others:req.body.Others}}});   
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
   if(!req.body.emailnphone){
    res.json({success: false, message: "email and phone was not given"})
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
 router.route('/forgotpassword').post((req,res)=>{
    Customer.findOne({ emailnphone: req.body.emailnphone })
    .then((customer) => {
        customer.setPassword(req.body.password,(err, customer) => {
            if (err) return next("User Not Found");
            customer.save();
            res.status(200).json({ message: 'Successful Password Reset' });
        });
    })
    .catch((err)=>{
      res.json("Customer  Not  Found")
    })
});
 router.route('/changepassword').post((req,res)=>{
  if(req.isAuthenticated()){
  Customer.findOne({ emailnphone: req.body.emailnphone })
  .then((customer) => {
      customer.changePassword(req.body.oldpassword, req.body.newpassword,(err, customer) => {
          if (err) return next(err);
          customer.save();
          res.status(200).json({ message: 'Password Change Successful' });
      });
  })
  .catch((err)=>{
    res.json("Customer  Not  Found")
  })
}
else{
  res.redirect('/login');
}
});
 module.exports=router;