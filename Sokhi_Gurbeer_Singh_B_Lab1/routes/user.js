const { createUser, checkUser } = require("../data/user");
const express = require("express");
const router = express.Router();
const help = require('../helper');
const data = require('../data/index');


router
  .route('/signup')
  .post(async (req, res) => {
    try {
      console.log("POST",  req.url);
      console.log(req.body);
      let name = req.body.name;
      let username = req.body.username;
      let password = req.body.password;
      if (name === null) throw "name should be entered";
      if (username === null) throw "username should be entered";
      if (password === null) throw "password should be entered";
      if (typeof name !== "string") throw "name should be a string";
      if (typeof username !== "string") throw "username should be a string";
      if (typeof password !== "string") throw "password should be a string";
      if (name.trim().length === 0) throw "name cannot be empty spaces";
      if (username.trim().length === 0) throw "username cannot be empty spaces";
      if (username.trim().length === 0) throw "Password cannot be empty";
      let regu = /^[a-zA-Z0-9]*$/gm;
      let regus = /^[a-zA-Z0-9_]+( [a-zA-Z0-9_]+)*$/gm;
      if(!regus.test(req.body.name)) throw `name contains invalid characters`;
      if (!regu.test(username))  throw "username contains invalid characters";
      if (username.trim().length < 3) throw "username should contain atleat 3 characters";
      if (password.trim().length < 6) throw "password must contains atleast 6 characters";
      count =0;
        for(let i=0;i<password.trim().length;i++){
            if(password.charAt(i).toUpperCase === password.charAt(i) || help.isValid(password)===false || password.charAt(i).toUpperCase() === password.charAt(i).toLowerCase()) count +=1;

            }
      if(count<3) throw`password must contain atleast an uppercase a number and a special character`;
      let n = req.body.name;
      let u = req.body.username;
      let p = req.body.password;
      let uc = await createUser(n,u, p);
      if (uc.insertedUser == true) {
        req.session.user = { u };
        res.json(uc.createduser);
      } 
      else {
        res.status(500).json({ e: "Internal Server Error" });
      }
    } catch (e) {
      res.status(400).json({ e: e });
    }
  })
 
router
  .route('/login')
  .post(async (req, res) => {
    try {
      console.log("POST", req.url);
      console.log(req.body);
      let username = req.body.username;
      let password = req.body.password;
      if (username === null) throw "username should be entered";
      if (password === null) throw "password should be entered";
      if (typeof username !== "string") throw "username should be a string";
      if (typeof password !== "string") throw "password should be a string";
      if (username.trim().length === 0) throw "username cannot be empty spaces";
      if (username.trim().length === 0) throw "Password cannot be empty";
      regu = /^[a-zA-Z0-9]*$/gm;
      if (!regu.test(username))  throw "username contains invalid characters";
      if (username.trim().length < 4) throw "username should contain atleat 4 characters";
      if (password.trim().length < 6) throw "password must contains atleast 6 characters";
      
      let u = req.body.username;
      let p = req.body.password;
      let checku = await checkUser(u, p);
      if (checku.authenticatedUser == true) {
        req.session.user = checku.u;
      }
      console.log(req.session.id);
      return res.status(200).json(checku.u);
    } catch (e) {
      res.status(401).json({ e: e });
    }
  })



router
  .route('/logout')
  .get(async (req, res) => {
    console.log("GET", req.url);
    req.session.destroy();
    return res.status(200).json("You have been logged out");
  })

  module.exports=router;