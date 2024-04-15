const express=require('express');
const { authMiddleWare } = require('../middlewares/authMiddleware');
const { Account } = require('../db');
const { default: mongoose } = require('mongoose');


const router=express.Router();

// Route to get the account balance
router.get("/getBalance",authMiddleWare,async (req,res)=>{
    const userAccount=await Account.findOne({
        userId:req.userId
    })
    return res.json({
        accountBalance:userAccount.balance
    })
})


// Bad implementation for transferring money
// router.post("/transferMoney",authMiddleWare,async (req,res)=>{
//     const {to,amount}=req.body;

//     const fromAccount=await Account.findOne({
//         userId:req.userId
//     })

//     if(fromAccount.balance< amount){
//         return res.json({
//             message:"Insufficient balance"
//         })
//     }

//     const toAccount=Account.findOne({
//         userId:to
//     });

//     if(!toAccount){
//         return res.json({
//             message:"Invalid receiver account"
//         })
//     }

//     await Account.updateOne({
//         userId:req.userId
//     },{
//         $inc:{
//             balance:-amount
//         }
//     })

//     await Account.updateOne({
//         userId:to
//     },{
//         $inc:{
//             balance:+amount
//         }
//     })

//     return res.json({
//         message:"Transfer Successful"
//     })
// })

// Good implementation

router.post("\transferMoney",authMiddleWare,async(req,res)=>{
    const session=await mongoose.startSession();

    session.startTransaction();
    const {to,amount}=req.body;

    const fromAccount=await Account.findOne({
        userId:req.userId
    })
    if(!fromAccount || fromAccount.balance<amount){
        session.abortTransaction();
        return res.status(400).json({
            message:"Insufficient Balance"
        })
    }

    const toAccount=await Account.findOne({
        userId:to
    })

    if(!toAccount){
        session.abortTransaction();
        return res.status(400).json({
            message:"Invalid Receiver Account"
        })
    }

    await Account.updateOne({
        userId:req.userId
    },{
        $inc:{
            balance:-amount
        }
    })

    await Account.updateOne({
        userId:to
    },{
        $inc:{
            balance:+amount
        }
    })

    session.commitTransaction();

    return res.json("Transfer Successful")
})
module.exports= router;