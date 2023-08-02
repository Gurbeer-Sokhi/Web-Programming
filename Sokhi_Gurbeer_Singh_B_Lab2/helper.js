const mongoCollections = require("./config/mongoCollections");
const users = mongoCollections.users;
const {ObjectId} = require('mongodb');

const getAllUsers = async () => {
    const usersCollection = await users();
  
    const usersList = await usersCollection.find({}).toArray();
    return usersList;
  }

  function checkPassword(str)
{
    var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[A-Z])$/;
    return re.test(str);
}

function isValid(str){
    return !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(str);
   }

   let valtitle = (title) =>
{
    if (typeof title !== 'string') throw `title is not a string`;
    if (title.trim().length === 0){
        throw `title cannot be an empty string or string with just spaces`;
    } 
    if (!title) throw `You must provide a title for your movie`;
    
    
}
let valing = (title) =>
{
    if (!title) throw `You must provide a ingredients for your recipe`;
    if (!Array.isArray(title)) throw `ingredients is not an array`;
    let count = 0;
    title.forEach((element) => {
        if(typeof element ==='string') {
            count += 1;
        } else {
            throw "Ingredients should be string"
        }
        if(element.trim().length==0) throw `ingredient cannot be empty spaces`;
        if(element.trim().length<3 || element.trim().length>50) throw`ingredient should have atleast 3 characters and less than 50 characters`;
    });
    if(count<3) throw `ingredients should have atleast 3 string elements`;
}

let valcsr = (rating)=>
{
    if (typeof rating!="string") throw `cooking skills Required is not of the type string`;

    if (!rating) throw `You must provide a cooking skills Required`;
    if (rating.trim().length ===0) throw `cooking skills Required is an empty string`;
    let rat=["Novice","Intermediate","Advanced","novice","intermediate","advanced"];
    if (!rat.includes(rating.trim())) throw`cooking skills Required does not contain a valid value`;
}

let valsteps = (steps) => {
    if (!Array.isArray(steps)) throw 'Steps should be an array';
    let count = 0;
    steps.forEach((element) => {
        if(typeof element ==='string') {
            count += 1;
        } else {
            throw "Steps element should be a string"
        }
        if(element.replace(" ","").trim().length<20) throw ` steps should be atleast 20 characters long`
        if(element.trim().length==0) throw `steps cannot be empty spaces`;
    });
    if(count<5) throw `steps should have atleast 5 string elements`;
}

const checkId=(id, varName)=> {
    if (typeof id !== 'string') throw `Error:${varName} must be a string`;

    if (!id) throw `Error: You must provide a ${varName}`;
    id = id.trim();
    if (id.length === 0)
      throw `Error: ${varName} cannot be an empty string or just spaces`;
    if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
    return id;
  }

module.exports={ getAllUsers,checkPassword,isValid,valtitle,valcsr,valing,valsteps,checkId}