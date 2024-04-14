const mongoose=require("mongoose");
const userSchema=new mongoose.Schema({
    userName:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        minLength:3,
        maxLength:30,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        minLength:6
    },
    firstName:{
        type:String,
        required:true,
        maxLength:50,
        trim:true
    },
    lastName:{
        type:String,
        required:true,
        maxLength:50,
        trim:true
    }
})

const accountSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'userModel'
    },
    balance:{
        type:Number,
        required:true
    }
})

const userModel=mongoose.model('userModel',userSchema);
const accountModel=mongoose.model('accountModel',accountSchema);

module.exports= {userModel,accountModel}
