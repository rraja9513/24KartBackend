const mongoose=require('mongoose');
const passportLocalMongoose=require('passport-local-mongoose');
const Schema=mongoose.Schema;
const customerSchema=new Schema(
    {
        fullname:{
            type:String,
            required:true,
            unique:true
        },
        emailnphone:{
            type: String,
            required: true,
            unique:true,
        },
        phonenumber:{
            type:String,
            required:true
        },
        deliveryaddress:{
           addressline1:{type:String},
           adressline2:{type:String},
           landmark:{type:String},
           pin:{type:String},
           cityrdistrict:{type:String},
           state:{type:String},
           whatyoucallit:
               {
                Home:{
                    type:String
                },
                Office:{
                    type:String
                },
                Others:{
                    type:String
                } 
               }
        },
    },
    {
        timestamps:true,
    }
);
customerSchema.plugin(passportLocalMongoose,{usernameField: 'emailnphone'});
const Customer=mongoose.model('Customer',customerSchema);
module.exports=Customer;