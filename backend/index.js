const express=require("express");
const cors=require("cors");
const rootRouter=require("./routes/index");
const app=express();

app.use("api/v1",rootRouter);
app.use(cors());
app.use(express.json());


app.listen(3000,()=>{
    console.log("Server is listening at 3000");
})