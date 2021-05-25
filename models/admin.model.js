const mongoose=require('mongoose');
const passportLocalMongoose=require('passport-local-mongoose');
const Schema=mongoose.Schema;
const adminSchema=new Schema(
    {
        name:{
            type:String,
            required:true,
            unique:true
        },
        email:{
            type: String,
            required: true,
            match: /.+\@.+\..+/,
            unique: true
        }
    },
    {
        timestamps:true,
    }
);
adminSchema.plugin(passportLocalMongoose,{usernameField: 'email'});
const Admin=mongoose.model('Admin',adminSchema);
module.exports=Admin;