const { json } = require('express');
const express = require('express');
const { recipes } = require('../config/mongoCollections');
const router = express.Router();
const data = require('../data/index');
const help = require('../helper');
const { createUser, checkUser } = require("../data/user");
const {ObjectId} = require('mongodb');
const redis = require('redis');
const client = redis.createClient();
const flat = require('flat');
const unflatten = flat.unflatten;
client.connect().then(()=>{});

router
    .route('/recipes')
    .get(async (req,res)=>{
        try{
        console.log("GET", req.url);
        let recipelist = await data.recipedata.getallrecipe();
        let pageNo = req.query.page;
        let arr=[];
        if(!pageNo)
        {
            for(let i=0;i<recipelist.length && i<50;i++){
                arr.push(recipelist[i]);
                pageNo = 1;
            }
        }
        else{
            let n= pageNo;
            let start=(n-1)*50;
            let end=start+50;
            for(let i=start;i<recipelist.length && i<end;i++){
                arr.push(recipelist[i]);
            }
        }
        if(arr.length ==0){
            return res.status(404).json({Message:`no recipes on this page`});
        }
        await client.set(`Page${pageNo}`,JSON.stringify(arr));
        return res.status(200).json(arr);
    }catch(e){
        return res.status(404).json({e:e});
    }
    })
    .post(async(req,res)=>{
        try{
        console.log("POST",  req.url);
        let b= req.body;
        if(!b.title && !b.ingredients && !b.cookingSkillRequired && !b.steps && !req.session.user) throw `all details should be provided`;
        if(!b.title || !b.ingredients || !b.cookingSkillRequired || !b.steps || !req.session.user) throw `all details should be provided`;
        if(typeof b.title!='string')throw `title must be a string`;
    
        help.valtitle(b.title);
        help.valcsr(b.cookingSkillRequired);
        help.valsteps(b.steps)
        help.valing(b.ingredients)
        if(req.session.user){
            let createdrecipe = await data.recipedata.createrecipe(req.body.title,req.body.ingredients,req.body.cookingSkillRequired,req.body.steps,req.session.user);
            if(createdrecipe.f==true){
                console.log(createdrecipe.foundrecipe);
            await client.set(createdrecipe.foundrecipe._id.toString(),JSON.stringify(flat(createdrecipe.foundrecipe)));
            await client.zAdd('recipelist', {
                score: 1,
                value: createdrecipe.foundrecipe._id.toString(),
              });
            return res.status(200).json(createdrecipe.foundrecipe);
            }
            else{
                return res.status(404).json({Error:"could not find recipe"});
            }
        }
        
        }catch(e){
            return res.status(404).json({Error:e});
        }
        })

    router
    .route('/recipes/:id')
    .get(async(req,res)=>{
        try {
            console.log("GET",  req.url);
            if(!ObjectId.isValid(req.params.id)) throw `recipeid is not a valid Objectid`;
            let id = req.params.id;
            
            let recipe = await data.recipedata.getrecipebyid(req.params.id);
            if(recipe.f == true) {
                
                await client.zAdd('recipelist',1,recipe.foundrecipe._id);
                // let recipelist = await client.rPush('recipelist',recipeinfo)
                let result = await client.set(id, JSON.stringify(flat(recipe.foundrecipe)));
                if (result == 'OK') {
                        return res.status(200).json(recipe.foundrecipe);
                    }
                } else { 
                    return res.status(404).json({Error:e});
                }                
            
        } catch(e) {
            return res.status(404).json({e:e})
        } 
    })
    .patch(async(req,res)=>{
        try {
            console.log("PATCH", req.url);
            console.log(req.body);
            let b = req.body;
            if (b.title) help.valtitle(b.title);
            if (b.ingredients) help.valing(b.ingredients);
            if (b.cookingSkillRequired) help.valcsr(b.cookingSkillRequired);
            if (b.steps) help.valsteps(b.steps);
            if (req.session.user) {
                let updatedRecipe = await data.recipedata.patchNewRecipe(req.session.user.username, req.params.id, req.body)
                return res.status(200).json(updatedRecipe);
            }            
        } catch (e) {
            return res.status(404).json({e:e});
        }
    })

    router
    .route('/recipes/:id/comments')
    .post(async(req,res)=>{
        try{
            console.log("POST",  req.url);
            console.log(req.body);
            if(!ObjectId.isValid(req.params.id)) throw`id is not a valid Objectid`;
            if(req.session.user){
                let cacheForrecipeid = await client.get(req.params.id);
                let recipebyid = await (await data.recipedata.getrecipebyid(req.params.id)).foundrecipe;
                let updaterecipe = await data.recipedata.addcomment(recipebyid._id.toString(),req.session.user,req.body.comment);
                if (cacheForrecipeid) {
                    console.log('Data was in cache');
                    await client.zIncrBy('recipelist', 1, updaterecipe.comrecipe._id.toString());
                    await client.set(req.params.id.toString(),JSON.stringify(updaterecipe.comrecipe));
                    return res.status(200).json(updaterecipe.comrecipe);
                }
                else if(updaterecipe.upcomment.modifiedCount==true){
                    await client.zIncrBy('recipelist', 1, updaterecipe.comrecipe._id.toString());
                    await client.set(req.params.id.toString(),JSON.stringify(updaterecipe.comrecipe));
                    return res.status(200).json(updaterecipe.comrecipe);
                }else{
                    return res.status(404).json({Error:"recipe not found with this recipe"});
                }
            }else{
                return res.status(401).json({Error:"user must be logged in to add a recipe"});
            }
        }catch(e){
            return res.status(400).json({Error:e})
        }
    })

    router
    .route('/recipes/:recipeid/:commentid')
    .delete(async(req,res)=>{
        try{
            console.log("DELETE",  req.url);
            if(!ObjectId.isValid(req.params.recipeid)) throw`recipeid is not a valid Objectid`;
            if(!ObjectId.isValid(req.params.commentid)) throw`commentid is not a valid Objectid`;
            if(req.session.user){
            let p= req.params;
            if(!new ObjectId(p.recipeid)) throw` recipeid should be valid objectid`;
            if(!new ObjectId(p.commentid)) throw` commentid should be valid objectid`;
            let deletedcomment = await data.recipedata.deletecomment(req.params.recipeid,req.params.commentid,req.session.user);
            let cacheForrecipeid = await client.get(req.params.recipeid);
            if(cacheForrecipeid){
                await client.set(req.params.recipeid,JSON.stringify(deletedcomment.updatedrecipe.foundrecipe));
            }
            if(deletedcomment.delcomment.modifiedCount==1){
                await client.set(req.params.recipeid,JSON.stringify(deletedcomment.updatedrecipe.foundrecipe));
                await client.zIncrBy('recipelist', 1, deletedcomment.updatedrecipe.foundrecipe._id.toString());
                return res.status(200).json(deletedcomment.updatedrecipe.foundrecipe);
            }else{
                return res.status(404).json({Error:"could not delete comment"});
            }
            }else{
                return res.status(401).json({Error:"user must be logged in to delete a recipe"});
            }
        }catch(e){
            return res.status(404).json({Error:e});
        }
        })

    router
    .route('/recipes/:id/likes')
    .post(async(req,res)=>{
        console.log("POST", req.url);
        console.log(req.body);
        try{
        if(!ObjectId.isValid(req.params.id)) throw `recipeid is not valid`;
        if (req.session.user) {
            let cachedrecipepage = await client.get(req.params.id);
            const updatedRecipeData = await data.recipedata.addlikestorecipe(req.params.id, req.session.user.username);
            if(!updatedRecipeData) return res.status(404).json({Error:"recipe not found"});
            if(cachedrecipepage){
                await client.set(req.params.id.toString(),JSON.stringify(updatedRecipeData.foundrecipe));
            }
            await client.zIncrBy('recipelist', 1, updatedRecipeData.foundrecipe._id.toString());
            return res.status(200).json(updatedRecipeData.foundrecipe);
        } else{
            return res.status(401).json({Error:"user must be logged in"});
        }}catch(e){
            return res.status(400).json({Error:e});
        }
        
    })

    router
    .route('/mostaccessed')
    .get(async(req,res) =>{
        const scores =  await client.sendCommand(['ZREVRANGE', 'recipelist', '0', '9']);
        return res.send(scores);
    })

    module.exports=router;