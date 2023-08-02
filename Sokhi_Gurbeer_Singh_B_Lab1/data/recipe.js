const mongoCollections = require('../config/mongoCollections');
const recipes = mongoCollections.recipes;
const {ObjectId} = require('mongodb');
const help = require('../helper');
const { getuserbyid } = require('./user');
// const { client } = require('../app')

const getallrecipe = async()=>{
    const allrecipes = await recipes();
    const recipeList = await allrecipes.find({}).toArray();
    recipeList.forEach(element => {
        element._id=element._id.toString();
    });
    return recipeList;
}

const getrecipebyid = async(id)=>{
    if(!id)throw  `id should be provided`;
    if(!new ObjectId(id))throw`id is not a valid ObjectId`;
    if(typeof id!='string')throw`id must be a string`;
    if(id.trim().length==0) throw` id cannot be empty`;
    let myObjid =  new ObjectId(id);
    let recipecollection = await recipes();
    let recipe = await recipecollection.findOne({_id:myObjid});
    if(recipe){
        return {foundrecipe:recipe,f:true};
    }
        throw  `recipe could not be found with this id `;
    
}

const createrecipe = async(title,ingredients,cookingSkillRequired,steps,userThatPosted)=>{
    if(!title && !ingredients && !cookingSkillRequired && !steps && !userThatPosted) throw `all details should be provided`;
    if(!title || !ingredients || !cookingSkillRequired || !steps || !userThatPosted) throw `all details should be provided`;
    if(typeof title!='string')throw `title must be a string`;
    
    help.valtitle(title);
    help.valcsr(cookingSkillRequired);
    help.valsteps(steps)
    help.valing(ingredients)
    let newrecipe={
        title:title,
        ingredients:ingredients,
        cookingSkillRequired:cookingSkillRequired,
        steps:steps,
        userThatPosted:{_id: new ObjectId(), username: userThatPosted.username},
        comments:[],
        likes:[]
    }

    let recipecollection = await recipes();
    let insertedrecipe = await recipecollection.insertOne(newrecipe);
    let newid = await insertedrecipe.insertedId;
    let recipe = await getrecipebyid(newid.toString());

    return recipe;
}

const addcomment = async(recipeid,userThatPosted,comment)=>{
    if (!recipeid) throw `You must provide a recipe Id`;
    if (recipeid.trim().length ===0) throw `recipeid is an empty string`;
    if(typeof recipeid !='string') throw`recipeid must be a string`;
    if(typeof comment !='string')  throw `comment must be a string`;
    if(! new ObjectId(recipeid))throw`recipeid is not a valid ObjectId`;
    if(typeof userThatPosted!='object')throw `userThatPosted must be an object`;
    if(comment.trim().length==0) throw `comment cannot be an empty string`;
    let myObjid = new ObjectId(recipeid);
    let newcomment={
        _id: new ObjectId(),
        userThatPosted:{_id: userThatPosted._id, username: userThatPosted.username},
        comment:comment
    }
    let recipecollection = await recipes();
    
    
    let updatedcomment = await recipecollection.updateOne({_id:myObjid},{$push:{comments:newcomment}});
    let commentedrecipe = await (await getrecipebyid(recipeid)).foundrecipe;
    // let updatedrecipe = await recipelist.findOne({_id:myObjid});

    return {upcomment:updatedcomment,comrecipe:commentedrecipe}
}

const deletecomment = async(recipeid,commentid,username)=>{
    if(!new ObjectId(recipeid))throw`recipeid must be a valid objectid`;
    if(!new ObjectId(commentid))throw` commentid must be a valid objectid`;
    if(typeof recipeid !='string') throw`recipeid must be a string`;
    if(typeof commentid !='string') throw`recipeid must be a string`;
    let myObjid =  new ObjectId(recipeid);
    let commentObjid = new ObjectId(commentid);
    let recipelist = await recipes();
    let recipeObj = await getrecipebyid(recipeid);
    if(recipeObj.foundrecipe.userThatPosted.username != username.username) throw `unauthorized to delete the comment`;
    let deletedcomment = await recipelist.updateOne({_id:myObjid},{$pull:{comments: {_id:commentObjid}}});
    if(deletedcomment.matchedCount==0) throw `could not find recipe or comment`;
    if(deletedcomment.modifiedCount==0) throw` could not delete comment`;
    // let deletecomment = await recipelist.deleteOne({'recipe.comments._id':commentObjid});
    let updatedrecipe = await getrecipebyid(recipeid);
    return {delcomment:deletedcomment,updatedrecipe:updatedrecipe};
}

const addlikestorecipe = async(recipeid,username) => {
    if(!new ObjectId(recipeid))throw`recipeid must be a valid objectid`;
    let myObjid = new ObjectId(recipeid);
    let recipecollection = await recipes();
    let recipe = await getrecipebyid(recipeid);
    let recipeLikes = new Set(recipe.foundrecipe.likes);
    let user = await getuserbyid(username);
    if (recipeLikes.has(user._id.toString())) {
        recipeLikes.delete(user._id.toString());
    } else {
        recipeLikes.add(user._id.toString());
    }
    recipeLikes = Array.from(recipeLikes);
    
    await recipecollection.updateOne({_id:myObjid},{$set:{likes:recipeLikes}});
    let resultrecipe = await getrecipebyid(recipeid);
    return resultrecipe;
}

const patchNewRecipe = async(username, recipeid, updateObject) => {
    if(!ObjectId(recipeid))throw`recipeid must be a valid objectid`;
    help.valing(updateObject.ingredients);
    help.valcsr(updateObject.cookingSkillRequired);
    help.valsteps(updateObject.steps);
    let recipecollection = await recipes();
    let recipeObj = await (await getrecipebyid(recipeid)).foundrecipe;
    if (recipeObj && (recipeObj.userThatPosted.username === username)) {
        // Error Handling
        if (updateObject.likes || updateObject.comments || updateObject.userThatPosted) {
            throw 'Cannot Modify Likes, Comments or UserThatPosted';
        } 
        let equal = true;
        if (Object.keys(updateObject).length === 0) {
            throw 'Empty object is not accepted. At least one filed must be supplied';
        }
        for (let key in updateObject) {
            if(!recipeObj[key]) {
                throw 'Field does not match Recipe Schema';
            }
            if (Array.isArray(recipeObj[key])) {
                if (JSON.stringify(recipeObj[key]) !== JSON.stringify(updateObject[key])) {
                    equal = false;
                } 
            } else if (recipeObj[key] !== updateObject[key]) {
                equal = false;
            }
        }

        if (equal) {
            throw "No new data supplied";
        }

        if (!equal) {
            await recipecollection.updateOne({_id:recipeObj._id},{$set:updateObject});
            return await (await getrecipebyid(recipeObj._id)).foundrecipe;
        }
    } else {
        throw "Recipe Posted by Different User";
    }
}

module.exports={
    getallrecipe,
    createrecipe,
    deletecomment,
    addcomment,
    getrecipebyid,
    addlikestorecipe,
    patchNewRecipe
}