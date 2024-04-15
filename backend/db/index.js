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
        ref:'User'
    },
    balance:{
        type:Number,
        required:true
    }
})

const User=mongoose.model('User',userSchema);
const Account=mongoose.model('Account',accountSchema);

module.exports= {User,Account}
