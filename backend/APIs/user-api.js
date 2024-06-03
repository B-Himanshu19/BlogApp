//create user api app
const exp = require("express");
const userApp = exp.Router();
const bcryptjs = require("bcryptjs");
const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const verifyToken=require('../Middlewares/verifyToken')
require("dotenv").config();

let usercollection;
let articlescollection;
//get usercollection app
userApp.use((req, res, next) => {
  usercollection = req.app.get("userscollection");
  articlescollection = req.app.get("articlescollection");
  next();
});

//user registration route
userApp.post(
  "/user",
  expressAsyncHandler(async (req, res) => {
    //get user resource from client
    const newUser = req.body;
    //check for duplicate user based on username
    const dbuser = await usercollection.findOne({ username: newUser.username });
    //if user found in db
    if (dbuser !== null) {
      res.send({ message: "User existed" });
    } else {
      //hash the password
      const hashedPassword = await bcryptjs.hash(newUser.password, 6);
      //replace plain pw with hashed pw
      newUser.password = hashedPassword;
      //create user
      await usercollection.insertOne(newUser);
      //send res
      res.send({ message: "User created" });
    }
  })
);

//user login
userApp.post(
  "/login",
  expressAsyncHandler(async (req, res) => {
    //get cred obj from client
    const userCred = req.body;
    //check for username
    const dbuser = await usercollection.findOne({
      username: userCred.username,
    });
    if (dbuser === null) {
      res.send({ message: "Invalid username" });
    } else {
      //check for password
      const status = await bcryptjs.compare(userCred.password, dbuser.password);
      if (status === false) {
        res.send({ message: "Invalid password" });
      } else {
        //create jwt token and encode it
        const signedToken = jwt.sign(
          { username: dbuser.username },
          process.env.SECRET_KEY,
          { expiresIn: '1d' }
        );
        //send res
        res.send({
          message: "login success",
          token: signedToken,
          user: dbuser,
        });
      }
    }
  })
);

//get articles of all authors
userApp.get(
  "/articles",verifyToken,
  expressAsyncHandler(async (req, res) => {
    //get articlescollection from express app
    const articlescollection = req.app.get("articlescollection");
    //get all articles
    let articlesList = await articlescollection
      .find({ status: true })
      .toArray();
    //send res
    res.send({ message: "articles", payload: articlesList });
  })
);

//post comments for an arcicle by atricle id
userApp.post(
  "/comment/:articleId",verifyToken,
  expressAsyncHandler(async (req, res) => {
    //get user comment obj
    const userComment = req.body;
    const articleIdFromUrl=(+req.params.articleId);
    //insert userComment object to comments array of article by id
    let result = await articlescollection.updateOne(
      { articleId: articleIdFromUrl},
      { $addToSet: { comments: userComment } }
    );
    console.log(result);
    res.send({ message: "Comment posted" });
  })
);

//export userApp
module.exports = userApp;
