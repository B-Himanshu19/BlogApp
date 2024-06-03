//create author api app
const exp=require('express');
const authorApp=exp.Router();
const expressAsyncHandler=require('express-async-handler')
const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken')
const verifyToken=require('../Middlewares/verifyToken')


let authorscollection;
let articlescollection;
//get usercollection app
authorApp.use((req,res,next)=>{
    authorscollection=req.app.get('authorscollection')
    articlescollection=req.app.get('articlescollection')
    next()
})


//author registration route
authorApp.post('/author',expressAsyncHandler(async(req,res)=>{
    //get user resource from client
    const newUser=req.body;
    //check for duplicate user based on username
    const dbuser=await authorscollection.findOne({username:newUser.username})
    //if user found in db
    if(dbuser!==null){
        res.send({message:"User existed"})
    }else{
        //hash the password
        const hashedPassword=await bcryptjs.hash(newUser.password,6)
        //replace plain pw with hashed pw
        newUser.password=hashedPassword;
        //create user
        await authorscollection.insertOne(newUser)
        //send res 
        res.send({message:"Author created"})
    }

}))


//author login
authorApp.post('/login',expressAsyncHandler(async(req,res)=>{
    //get cred obj from client
    const userCred=req.body;
    //check for username
    const dbuser=await authorscollection.findOne({username:userCred.username})
    if(dbuser===null){
        res.send({message:"Invalid username"})
    }else{
        //check for password
       const status=await bcryptjs.compare(userCred.password,dbuser.password)
       if(status===false){
        res.send({message:"Invalid password"})
       }else{
    //create jwt token and encode it
        const signedToken=jwt.sign({username:dbuser.username},process.env.SECRET_KEY,{expiresIn:'1d'})
    //send res
        res.send({message:"login success",token:signedToken,user:dbuser})
       }
    }
}))

//adding new article by author
authorApp.post('/article',verifyToken,expressAsyncHandler(async(req,res)=>{
    //get new article from client
    const newArticle=req.body;
    console.log(newArticle)
    //post to artciles collection
    await articlescollection.insertOne(newArticle)
    //send res
    res.send({message:"New article created"})
}))


//modify artcile by author
authorApp.put('/article',verifyToken,expressAsyncHandler(async(req,res)=>{
    //get modified article from client
    const modifiedArticle=req.body;
   
    //update by article id
   let result= await articlescollection.updateOne({articleId:modifiedArticle.articleId},{$set:{...modifiedArticle}})
    let latestArticle=await articlescollection.findOne({articleId:modifiedArticle.articleId})
    res.send({message:"Article modified",article:latestArticle})
}))





//delete an article by article ID
authorApp.put('/article/:articleId',verifyToken,expressAsyncHandler(async(req,res)=>{
    //get articleId from url
    const artileIdFromUrl=(+req.params.articleId);
    //get article 
    const articleToDelete=req.body;

    if(articleToDelete.status===true){
       let modifiedArt= await articlescollection.findOneAndUpdate({articleId:artileIdFromUrl},{$set:{...articleToDelete,status:false}},{returnDocument:"after"})
       res.send({message:"article deleted",payload:modifiedArt.status})
    }
    if(articleToDelete.status===false){
        let modifiedArt= await articlescollection.findOneAndUpdate({articleId:artileIdFromUrl},{$set:{...articleToDelete,status:true}},{returnDocument:"after"})
        res.send({message:"article restored",payload:modifiedArt.status})
    }
   
   
}))








//read articles of author
authorApp.get('/articles/:username',verifyToken,expressAsyncHandler(async(req,res)=>{
    //get author's username from url
    const authorName=req.params.username;
    //get atricles whose status is true
    const artclesList=await articlescollection.find({username:authorName}).toArray()
    res.send({message:"List of atricles",payload:artclesList})

}))

//export userApp
module.exports=authorApp;



  