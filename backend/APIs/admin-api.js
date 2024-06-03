//create admin api app
const exp=require('express');
adminApp=exp.Router();


adminApp.get('/test-admin',(req,res)=>{
    res.send({message:"This from admin api"})
})


//export userApp
module.exports=adminApp;