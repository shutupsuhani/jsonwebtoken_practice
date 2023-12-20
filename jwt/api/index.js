const express = require("express");
const app = express();
const jwt=require("jsonwebtoken");  //import jsonwebtoken😌🐧
app.use(express.json());
const users=[

  {
   id:"1",
    username:"john",
    password:"johndoe123",
    isAdmin:"true"
  },

  {
    id:"2",
    username:"jane",
    password:"janedoe123",
    isAdmin:"false"
  },

]



app.post("/api/refresh",(req,res)=>{
    //take the refresh token from user
     const refreshToken = req.body.token;

    //send error if there is no token or there is invalid token
     if(!refreshToken)  return res.status(401).json("you are not authenticated!")

    //if everything is ok,create new access token
})

const generateAccessToken=(user)=>{
    return jwt.sign({id:user.id,isAdmin:user.isAdmin,username:user.username},"mySecretKey",{expiresIn:"15m"});
}

const generateRefreshAccessToken=(user)=>{
    return jwt.sign({id:user.id,isAdmin:user.isAdmin,username:user.username},"myRefreshSecretKey",{expiresIn:"15m"});
}



app.post("/api/login",(req,res)=>{
    const{username,password}=req.body;
    const user=users.find(u=>{
        return u.username===username && u.password===password;
    });
    if(user){
       generateAccessToken(user);
       generateRefreshAccessToken(user);
       
       res.json({                //response we are getting
        username:user.username,
        isAdmin:user.isAdmin,
        accessToken,
       })
    }else{
        res.status(400).json("username or password is incorrect");
    }

});


const verify = (req,res,next) =>{
    const authHeader = req.headers.authorization;
    if(authHeader){
       const token= authHeader.split(" ")[1];
        console.log("token is in verification ^-^");
        jwt.verify(token,"mySecretKey",(err,user)=>{
         
         // console.log("is there any error");
          
          if(err){
              return res.status(403).json("Token is not Valid");
          }

          req.user=user;
          next();
       });
    }else{
        res.status(401).json("You are not authenticated");
    }

}

app.delete("/api/users/:userId",verify,(req,res)=>{
    if(req.user.id === req.params.userId || req.user.isAdmin){
        res.status(200).json("User has been deleted ^-^");
        console.log("user has been deleted")
    }else{
        res.status(404).json("You are not allowed to delete this user -_-");
    }
})

app.listen(5000, () => console.log("Backend Server is Running on 5000!"));

