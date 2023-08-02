const bcrypt = require("bcryptjs");
const saltRounds = 16;
const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const help = require('../helper');


const createUser = async (
  name, username, password
) => {
  if (name === null) throw "name should be entered";
  if (username === null) throw "username should be entered";
  if (password === null) throw "password should be entered";
  if (typeof name !== "string") throw "username should be a string";
  if (typeof username !== "string") throw "username should be a string";
  if (typeof password !== "string") throw "password should be a string";
  if (name.trim().length === 0) throw "name cannot be empty spaces";
  if (username.trim().length === 0) throw "Username cannot be empty spaces";
  if (username.trim().length === 0) throw "Password cannot be empty";
  regu = /^[a-zA-Z0-9]*$/gm;
  regus = /^[a-zA-Z0-9_]+( [a-zA-Z0-9_]+)*$/gm;
  if (!regus.test(name))  throw "name contains invalid characters";
  if (!regu.test(username))  throw "Username contains invalid characters";
  if (username.trim().length < 4) throw "Username should contain atleat 4 characters";
  if (password.trim().length < 6) throw "password should contain atleast 6 characters";
  count =0;
  for(let i=0;i<password.trim().length;i++){
  if(password.charAt(i).toUpperCase === password.charAt(i) || help.isValid(password)===false || password.charAt(i).toUpperCase() === password.charAt(i).toLowerCase()) count +=1;

  }
  if(count<3) throw`password must contain atleast an uppercase a number and a special character`;
  username = username.toLowerCase();
  const au = await help.getAllUsers();
  let ucheck = 0;
  au.forEach((user) => {
    if (user.username === username) {
      ucheck = 1;
    }
  });
  if (ucheck === 1) throw "Username already exists";
  const hash = await bcrypt.hash(password, saltRounds);

  const usersCollection = await users();

  let newUser = {
    name: name,
    username: username,
    password: hash,
  };

  const insertInfo = await usersCollection.insertOne(newUser);
  if (insertInfo.insertedCount === 0) throw "unable to add user";
  let createduser= await usersCollection.findOne({username:username});
  return { insertedUser : true, createduser: createduser };
 };

const checkUser = async (username, password) => {
  if (username === null) throw "username should be entered";
  if (password === null) throw "password should be entered";
  if (typeof username !== "string") throw "username should be a string";
  if (typeof password !== "string") throw "password should be a string";
  if (username.trim().length === 0) throw "Username should not be empty spaces";
  if (username.trim().length === 0) throw "Password should not be empty";
  regu = /^[a-zA-Z0-9]*$/gm;
  if (!regu.test(username))  throw "Username contains invalid characters";
  if (username.trim().length < 4) throw "Username should contain atleat 4 characters";
  if (password.trim().length < 6) throw "password should contain atleast 6 characters";

  username = username.toLowerCase();
  const allUsers = await help.getAllUsers();
  let userucheck = null;
  allUsers.forEach((element) => {
    if (element.username === username) {
      userucheck = element;
    }
  });
  if(userucheck==null) throw `user does not exist`;
  let passucheck = await bcrypt.compare(password, userucheck.password);
  if (passucheck) {
    return { authenticatedUser: true, u:userucheck };
  } else {
    throw "Username or password is invalid";
  }
 };

 const getuserbyid = async (username)=>{
    let userCollection = await users();
    let user = await userCollection.findOne({username:username});
    return user;
 }

module.exports = {
  checkUser,createUser,getuserbyid
};