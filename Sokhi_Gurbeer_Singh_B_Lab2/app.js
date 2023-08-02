const express = require("express");
const app = express();
const configRoutes = require("./routes");
const static = express.static(__dirname + "/public");
const session = require("express-session");
const redis = require('redis');
const client = redis.createClient();
const flat = require('flat');
const unflatten = flat.unflatten;

let myset = {}

app.use(async(req, res, next) => {
    if(req.url in myset){
      myset[req.url] +=1;
    }
    else{
      myset[req.url] =1;
    }
    console.log(req.url + " " + myset[req.url]);
    next();
});


app.use(
  session({
    name: "AuthCookie",
    secret: "some secret string!",
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/public", static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/recipes', async (req, res, next) => {
if(req.method=='GET'){
  if(req.originalUrl === `/recipes?page=${req.query.page}`){
    let cachedrecipepage = await client.exists(`Page${req.query.page}`);
    if(cachedrecipepage){
      let stringyrecipepage = await client.get(`Page${req.query.page}`)
      res.send(JSON.parse(stringyrecipepage));
    }
    else{
      next();
    }
  }
  else if(req.originalUrl === '/recipes'){
    let cacheForrecipePageExists = await client.get(`Page1`);
    if (cacheForrecipePageExists) {
      console.log('Data was in cache');
      res.send(JSON.parse(cacheForrecipePageExists));
    } else {
      next();
    }} else{
      next();
      }} else{
        next();
      }
});

app.get('/recipes/:id', async (req, res, next) => {
  let cacheForrecipeid = await client.get(req.params.id);
  if (cacheForrecipeid) {
    console.log('Data was in cache');
    await client.zIncrBy('recipelist', 1, JSON.parse(cacheForrecipeid)._id);
    res.send(unflatten(cacheForrecipeid));
  } else {
    next();
  }
});


configRoutes(app);

app.listen(3000, async () => {
    await client.connect();
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
  });

