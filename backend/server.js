//create express app
const exp=require('express');
const app=exp()
require('dotenv').config() //process.env.PORT
const mongoClient=require('mongodb').MongoClient;
const path=require('path')
const cors=require('cors')

//deploy react build in this server
app.use(exp.static(path.join(__dirname,'../client/build')))
//to parse the body of req
app.use(exp.json())
app.use(cors())

//connect to DB
mongoClient.connect(process.env.DB_URL)
.then(client=>{
    //get db obj
    const blogdb=client.db('dbblog')
    //get collection obj
    const userscollection=blogdb.collection('user')
    const articlescollection=blogdb.collection('articles')
    const authorscollection=blogdb.collection('author')
    //share colelction obj with express app
    app.set('userscollection',userscollection)
    app.set('articlescollection',articlescollection)
    app.set('authorscollection',authorscollection)
    //confirm db connection status
    console.log("DB connection success")
})
.catch(err=>console.log("Err in DB connection",err))


//import API routes
const userApp=require('./APIs/user-api')
const authorApp=require('./APIs/author-api')
const adminApp=require('./APIs/admin-api')

//if path starts with user-api, send req to userApp
app.use('/user-api',userApp)
//if path starts with author-api, send req to authorApp
app.use('/author-api',authorApp)
//if path starts with admin-api, send req adminApp
app.use('/admin-api',adminApp)

//deals with page refresh
app.use((req,res,next)=>{
    res.sendFile(path.join(__dirname,'../client/build/index.html'))
})

//express error handler
app.use((err,req,res,next)=>{
    res.send({message:"error",payload:err.message})
})
//assign port number
const port=process.env.PORT || 5000;
app.listen(port,()=>console.log(`Web server on port ${port}`))