const express=require("express");
const {z}=require("zod");
const  jwt  = require("jsonwebtoken");
const {JWT_SECRET}=require("../config");
const { authMiddleWare } = require("../middlewares/authMiddleware");
const { User,Account } = require("../db");

const signUpBody= z.object({
    userName:z.string().email(),
    password:z.string(),
    firstName:z.string(),
    lastName:z.string()
})

const signInBody=z.object({
    userName:z.string().email(),
    password:z.string()
})

const updateBody=z.object({
    password:z.string().optional(),
    firstName:z.string().optional(),
    lastName:z.string().optional()
})
const userRouter=express.Router();


// signUP Route
userRouter.post("/signUp",async (req,res)=>{
    const {success}=signUpBody.safeParse(req.body);
    // console.log(req.body);
    if(!success){
        return res.status(411).json(
            {
                message:"Incorrect Inputs"
            }
        )
    }
    const existingUser = await User.findOne({
        userName: req.body.userName
    })


    if(existingUser){
        return res.status(411).json({
            message:"Email already Exists.Please try with other one"
        })
    }

    const user= await User.create({
        userName:req.body.userName,
        password:req.body.password,
        firstName:req.body.firstName,
        lastName:req.body.lastName
    })

    const userID=user._id;

    // Adding demo balance in the start when the new user signs up
    await Account.create({
        userId:userID,
        balance:1+ Math.random()*10000
    })
    const token=jwt.sign({ 
        userID
    },JWT_SECRET);

    return res.status(200).json({
        message:"User Created Successfully",
        token:token
    })
})

// signIn Route

userRouter.post("/signIn",async(req,res)=>{
    const {success}=signInBody.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message:"Invalid Inputs"
        })
    }

    const user=await User.findOne({
        userName:req.body.userName
    })

    if(user){
        const token= jwt.sign({
            userId:user._id
        },JWT_SECRET);
        
        return res.status(200).json({
            message:"Successfully login",
            token:token
        })
    }

    return res.status(411).json({
        message:"Error while logging in"
    })
})

// update route
//using auth middleware to verify if the user is already logged in
userRouter.put("/",authMiddleWare,async (req,res)=>{
    const {success}=updateBody.safeParse(req.body);

    if(!success){
        return res.status(411).json({
            message:"Error while updating Information"
        })
    }

    await User.updateOne({_id:req.userId},req.body)

    return res.json({
        message:"Updated Information Successfully"
    })
})


// get users from backend,filterable by firstNAme,lastName
userRouter.get("/bulk",async (req,res)=>{
    const filter=req.query.filter || "";

    const users=await User.find({
        $or:[{
            firstName:{
                "$regex":filter
            }
        },{
            lastName:{
                "$regex":filter
            }
        }]
    });

    
        return res.json({
            user:users.map(user=>({
                userName:user.userName,
                firstName:user.firstName,
                lastName:user.lastName,
                _id:user._id
            }))
        })
    
})

module.exports= userRouter;
