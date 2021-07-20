const mongoose=require('mongoose');
const passportLocalMongoose=require('passport-local-mongoose');
const Schema=mongoose.Schema;
const vendorSchema=new Schema(
    {
        fullname:{
            type:String,
            required:true,
            unique:true
        },
        username:{
            type: String,
            required: true,
            unique:true,
        },
        phonenumber:{
            type:String,
            required:true
        }
    },
    {
        timestamps:true,
    }
);
vendorSchema.plugin(passportLocalMongoose,{usernameField: 'username'});
const Vendor=mongoose.model('Vendor',vendorSchema);
module.exports=Vendor;