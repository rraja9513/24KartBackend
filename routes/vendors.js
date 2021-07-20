const router=require('express').Router();
const passport=require('passport');
let Vendor=require('../models/vendor.model');
router.route('/').get((req, res) => {
    Vendor.find()
      .then(vendors => res.json(vendors))
      .catch(err => res.status(400).json('Error: ' + err));
  });
router.route('/signup').post((req,res)=>{
  const vendors=new Vendor({fullname:req.body.fullname,username:req.body.username,phonenumber:req.body.phonenumber});   
        Vendor.register(vendors,req.body.password,function(err,vendor){
            if(err)
            {
              var redir = { returnCode: "Failure",
                            returnMsg:"Vendor Already Registered"};
                            return res.json(redir);
                          }
            else{
                passport.authenticate("vendorLocal")(req,res,function(){
                    if (req.user) {
                        var redir = { returnCode: "Success",
                                      returnMsg:"Vendor registered Successfully"};
                        return res.json(redir);
                  } else {
                    res.status(400).json({ message: 'SignupFailed' });
                  }
                });
            }
        })
    });
router.route('/login').post((req,res)=>{
   if(!req.body.username){
    res.json({success: false, message: "username was not given"})
  } else {
    if(!req.body.password){
      res.json({success: false, message: "Password was not given"})
    }else{
      passport.authenticate('vendorLocal', function (err, user, info) { 
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
    Vendor.findOne({ username: req.body.username })
    .then((vendor) => {
        vendor.setPassword(req.body.password,(err, vendor) => {
            if (err) return next("User Not Found");
            vendor.save();
            res.status(200).json({ message: 'Successful Password Reset' });
        });
    })
    .catch((err)=>{
      res.json("Vendor  Not  Found")
    })
});
 router.route('/changepassword').post((req,res)=>{
  if(req.isAuthenticated()){
  Vendor.findOne({ username: req.body.username })
  .then((vendor) => {
      vendor.changePassword(req.body.oldpassword, req.body.newpassword,(err, vendor) => {
          if (err) return next(err);
          vendor.save();
          res.status(200).json({ message: 'Password Change Successful' });
      });
  })
  .catch((err)=>{
    res.json("Vendor  Not  Found")
  })
}
else{
  res.redirect('/login');
}
});
 module.exports=router;