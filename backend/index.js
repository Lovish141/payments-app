const express=require("express");
const cors=require("cors");
const rootRouter=require("./routes/index");
const { default: mongoose } = require("mongoose");

require('dotenv').config();

const app=express();

app.use(cors());
app.use(express.json());

app.use("/api/v1",rootRouter);

app.listen(3000,async()=>{
    try{
        await mongoose.connect(`${process.env.MONGO_URI}`);
        console.log("Server is running");
    }catch{
        console.log("Cant connect to mongoDb")
    }
})