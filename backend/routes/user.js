const express=require("express");
const {z}=require("zod");
const userModel = require("../db");
const  jwt  = require("jsonwebtoken");
const {JWT_SECRET}=require("../config");
const { authMiddleWare } = require("../middlewares/middleware");

const signUpBody= z.object({
    userName:z.string().email(),
    firstName:z.string(),
    lastName:z.string(),
    password:z.string()
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
const router=express.Router();


// signUP Route
router.post("/signUp",async (req,res)=>{
    const {success}=signUpBody.safeParse(req.body);
    if(!success){
        return res.status(411).json(
            {
                message:"Incorrect Inputs"
            }
        )
    }

    const existingUser=await userModel.findOne({
        userName:req.body.userName
    })

    if(existingUser){
        return res.status(411).json({
            message:"Email already Exists.Please try with other one"
        })
    }

    const user= await userModel.create({
        userName:req.body.userName,
        password:req.body.password,
        firstName:req.body.firstName,
        lastName:req.body.lastName
    })

    const userID=user._id;

    const token=jwt.sign({
        userID
    },JWT_SECRET);

    return res.status(200).json({
        message:"User Created Successfully",
        token:token
    })
})

// signIn Route

router.post("/signIn",async(req,res)=>{
    const {success}=signInBody.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message:"Invalid Inputs"
        })
    }

    const user=await userModel.findOne({
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
router.put("/",authMiddleWare,async (req,res)=>{
    const {success}=updateBody.safeParse(req.body);

    if(!success){
        return res.status(411).json({
            message:"Error while updating Information"
        })
    }

    await userModel.updateOne({_id:req.userId},req.body)

    return res.json({
        message:"Updated Information Successfully"
    })
})


// get users from backend,filterable by firstNAme,lastName
router.get("/bulk",async (req,res)=>{
    const filter=req.query.filter || "";

    const users=await userModel.find({
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

module.exports= router;
