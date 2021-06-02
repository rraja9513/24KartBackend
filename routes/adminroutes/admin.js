const router=require('express').Router();
const passport=require('passport');
let Admin=require('/Users/rraja/24HCartBackend/models/adminmodels/admin.model');
router.route('/').get((req, res) => {
    Admin.find()
      .then(admin => res.json(admin))
      .catch(err => res.status(400).json('Error: ' + err));
  });
router.route('/signup').post((req,res)=>{
  const Admins=new Admin({ name : req.body.name,email:req.body.email});   
        Admin.register(Admins,req.body.password,function(err,admin){
            if(err)
            {
              var redir = { returnCode: "Failure",
                            returnMsg:"Admin Already Registered"};
                            return res.json(redir);
                          }
            else{
                passport.authenticate("adminLocal")(req,res,function(){
                    if (req.user) {
                        var redir = { returnCode: "Success",
                                      returnMsg:"Admin registered Successfully"};
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
      passport.authenticate('adminLocal', function (err, user, info) { 
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
 router.route('/changepassword').post((req,res)=>{
  if(req.isAuthenticated()){
  Admin.findOne({ email: req.body.email })
  .then((admin) => {
      admin.changePassword(req.body.oldpassword, req.body.newpassword,(err, admin) => {
          if (err) return next(err);
          admin.save();
          res.status(200).json({ message: 'Password Change Successful' });
      });
  })
  .catch((err)=>{
    res.json("Admin  Not  Found")
  })
}
else{
  res.redirect('/login');
}
});
 module.exports=router;