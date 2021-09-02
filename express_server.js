const express = require("express");
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
const { response } = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

// const urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };

const urlDatabase = {
  "b2xVn2": {
      longURL: "https://www.tsn.ca",
      userID: "userRandomID"
  },
  "9sm5xK": {
      longURL: "https://www.google.ca",
      userID: "RandomId"
  },
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  },
  "RandomId":{
    id:"RandomId",
    email:"xyz@gmail.com",
    password:"1234"
  }
}

const getUserByEmail = function(email) {
  for(let key in users){
    
     if (users[key]["email"] === email){
      return users[key];
     }
  }
 return null;
}


const getUserById = function(id){
  for(let key in users){
    
    if (key === id){
     return users[key];
    }
 }
return null;
}

const getUrlsByUserId = function (userid) {
  const objUrls = {};
  for(let key in urlDatabase){
    if(urlDatabase[key]["userID"] == userid) {
      let shortURL = key;
    //  obj += {[shortURL]: urlDatabase[key]["longURL"]};
      objUrls[shortURL] = urlDatabase[key]["longURL"];
    }
  }
  if(JSON.stringify(objUrls) != "{}"){
    return objUrls;
  }
  
  return null;
}

//Route to home PAGE
app.get("/", (req, res) => {
  res.send("Hello!");
});

//Login POST Operation
app.post("/login",(req,res) => {
  if(req.body.email!="" && req.body.password!=""){
    const foundUser = getUserByEmail(req.body.email);
  
    if (foundUser) {
      if (foundUser.password === req.body.password){
          res.cookie("user_id", foundUser['id']);
          res.redirect("/urls");
      } else {
          res.send("Password no match, click here <a href='/login'>login</a> to go back.");
      }

    } else {
          res.send("403 - no user found , click here <a href='/login'>login</a> to go back Or <a href='/register'>Register</a>")
    }
  } else {
      res.send("Email or Password is blank, Click here <a href='/login'>Login</a> to go back to login page")
  }
  
});

//Login GET operation
app.get("/login",(req,res) => {
  let foundUser = {};
  const templateVars = { urls: urlDatabase,foundUser};
  res.render("login", templateVars);
});

//Logout POST Operation
app.post("/urls/logout",(req,res) => {
  res.clearCookie('user_id');
  res.redirect("/urls");
});

//Register Get Operation
app.get("/register",(req,res) => {
  let foundUser = {};
  const templateVars = { urls: urlDatabase,foundUser};
  res.render("register", templateVars);
});

//Register Post Operation
app.post("/register",(req,res) => {
  const id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  if(email != "" && password!=""){
    const foundUser = getUserByEmail(email);
    if(foundUser){
      res.send("404 - User with same email address already exist, Click here <a href='/register'>Register</a> to go back to registration page");
    }
    else {
      users[id] = {id, email, password};
      res.cookie("user_id", id);
      res.redirect("/urls");
    }
  } else {
    res.send("404 - Email or Password is blank, Click here <a href='/register'>Register</a> to go back to registration page")
  }
  
});


//Show all urls GET
app.get("/urls", (req, res) => {
  let foundUser = {};
  if(typeof req.cookies.user_id != "undefined"){
     foundUser = getUserById(req.cookies.user_id);
     const urls = getUrlsByUserId(req.cookies.user_id);
     console.log(urls);
     const templateVars = { urls, foundUser};
     res.render("urls_index", templateVars);
  } 
  else{
    //const templateVars = { urls: urlDatabase,foundUser};
    //res.render("register", templateVars);
    res.send("<h2>Please <a href='/login'>Login</a> OR <a href='/register'>Register</a></h2>");
  }
});


//ADD new url GET
app.get("/urls/new", (req, res) => {
  let foundUser = {};
  if(typeof req.cookies.user_id != "undefined"){
     foundUser = getUserById(req.cookies.user_id);
     const templateVars = { foundUser };
      res.render("urls_new", templateVars);
  } 
  else {
    res.redirect('/login');
  }
  
});
    

//Add new url POST
app.post('/urls', (req, res) => {
  if(typeof req.cookies.user_id != "undefined"){
    const shortUrl = generateRandomString();
    urlDatabase[shortUrl] ={longURL: req.body.longURL,userID: req.cookies.user_id} ;
    //res.send(urlDatabase);
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }
  
  //res.redirect(`/u/${shortUrl}`);

});


//ADD new url GET operation to redirect Corresponding longURL
app.get("/u/:shortURL", (req, res) => {
  if(urlDatabase[req.params.shortURL] != undefined){
    res.redirect(`${urlDatabase[req.params.shortURL]["longURL"]}`);
  } else {
    res.send("404 Page Not Found");
  }
  
});

//Delete url POST operation
app.post("/urls/:shortURL/delete", (req, res) => {

  if(typeof req.cookies.user_id != "undefined"){

    if(urlDatabase[req.params.shortURL]['userID'] === req.cookies.user_id){
      delete urlDatabase[req.params.shortURL];
      res.redirect("/urls");
    } else {
      res.send('<h2>Permission Denied!!!</h2>')
    }
  }
  else {
    res.send("<h2>Please <a href='/login'>Login</a> OR <a href='/register'>Register</a></h2>");
  }

  
  
});
//Delete url GET operation
app.get("/urls/:shortURL/delete", (req, res) => {

  res.redirect("/urls");
  
});


//Edit POST to load specific url
app.post("/urls/:shortURL",(req,res) => {
  let foundUser = {};
  if(typeof req.cookies.user_id != "undefined"){
     foundUser = getUserById(req.cookies.user_id);
     const templateVars = {shortURL : req.params.shortURL, longURL : urlDatabase[req.params.shortURL]["longURL"], foundUser};
    res.render("urls_show",templateVars);
  } else {
    res.redirect('/login');
  }
  
});

//Edit GET to load specific url
app.get("/urls/:shortURL",(req,res) => {
  let foundUser = {};
  if(typeof req.cookies.user_id != "undefined"){
     foundUser = getUserById(req.cookies.user_id);
     const urlObj = getUrlsByUserId(req.cookies.user_id);
     for(let shortURL in urlObj){
       if(shortURL == req.params.shortURL){
        const templateVars = {shortURL : req.params.shortURL, longURL : urlDatabase[req.params.shortURL]["longURL"], foundUser};
        res.render("urls_show",templateVars);
       } else {
         res.send("<h2>Permission Denied!!!</h2>")
       }
     }   
  } else {
    res.send("<h2>Please <a href='/login'>Login</a> OR <a href='/register'>Register</a></h2>");
  }
  
});

//Edit POST operation to edit specific url
app.post("/urls/:shortURL/edit",(req,res) => {
  if(typeof req.cookies.user_id != "undefined"){
    const shorturl = req.params.shortURL;
    const longurl = req.body.longURL;
    if(urlDatabase[req.params.shortURL]['userID'] === req.cookies.user_id){
      urlDatabase[shorturl] = {longURL: longurl,userID: req.cookies.user_id};
      res.redirect("/urls");
    } else {
      res.send("<h2>Permission Denied!!!</h2>");
    }
  
  } else {
    res.send("<h2>Please <a href='/login'>Login</a> OR <a href='/register'>Register</a></h2>");
  }
});


//Edit get operation to edit specific url
app.get("/urls/:shortURL/edit",(req,res) => {
  res.redirect('/urls');
});


//Genrates random shortURL  
const generateRandomString = function () {
  let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < 6; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result.trim();
}

// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

