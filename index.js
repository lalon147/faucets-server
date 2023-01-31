const { MongoClient, ServerApiVersion } = require('mongodb');
const  express= require('express');
const cors=require("cors");
require("dotenv").config()
const app=express();

const port =process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORDS}@cluster0.gw8hef2.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log(uri);
const database=client.db("faucets")





app.get("/",(req,res)=>{
    res.send("HELLO FROM AMAZON SERVER")
})
const run=async()=>{
    try{ 
          app.post("/users",async(req,res)=>{
            const user=req.body;
            const result=await database.collection("users").insertOne(user)
            res.send(result);
            console.log(result);
          })
          app.get("/users",async(req,res)=>{
            const email=req.query.email;
            const password=req.query.password;
            const user=await database.collection("users").findOne({email:email})
            const role=user.role;
            const id=user._id
            if(password===user.password){
                res.send({message:"TRUE",email,role,id})
            }
            else{
                res.send({message:"FALSE"})
            }

          })
          app.get("/all-users",async(req,res)=>{
            const result=await database.collection("users").find({}).toArray()

            res.send(result);

          })


    }
    finally{

    }

}
run().catch(error=>console.log(error))



app.listen(port,()=>{
    console.log(`server in running on ${port}`);
})