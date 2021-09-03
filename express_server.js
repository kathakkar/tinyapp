const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');
const app = express();
const PORT = 8080; // default port 8080



//Helper Functions
const { getUserByEmail, getUserById, getUrlsByUserId, generateRandomString } = require('./helpers');

app.use(express.static(__dirname + '/css'));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
}));

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




//Route to home PAGE
app.get("/", (req, res) => {

  if(typeof req.session.user_id != "undefined"){
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  } 
});

//Login POST Operation
app.post("/login",(req,res) => {
  if (req.body.email !== "" && req.body.password !== "") {
    const foundUser = getUserByEmail(req.body.email,users);
    if (foundUser) {
      const passwordMatchCheck = bcrypt.compareSync(req.body.password, foundUser.password);
      if (passwordMatchCheck) {
        req.session.user_id = foundUser['id'];
        console.log("session",req.session.user_id);
        res.redirect("/urls");
      } else {
        res.send("<h2>Password dont match, click here <a href='/login'>login</a> to go back.</h2>");
      }
    } else {
        res.send("<h2>Invalid Email or Password , click here <a href='/login'>login</a> to go back Or <a href='/register'>Register</a></h2>")
    }
  } else {
      res.send("<h2>Email or Password is blank, Click here <a href='/login'>Login</a> to go back to login page</h2>")
  }  
});

//Login GET operation
app.get("/login",(req,res) => {
  if (typeof req.session.user_id !== "undefined") {
    res.redirect('/urls');
  } else {
    let foundUser = {};
    const templateVars = { urls: urlDatabase,foundUser};
    res.render("login", templateVars);
  }  
});

//Logout POST Operation
app.post("/urls/logout",(req,res) => {
  req.session = null;
  res.redirect("/urls");
});

//Register Get Operation
app.get("/register",(req,res) => {
  if (typeof req.session.user_id !== "undefined") {
    res.redirect('/urls');
  } else {
    let foundUser = {};
    const templateVars = { urls: urlDatabase,foundUser};
    res.render("register", templateVars);
  }    
});

//Register Post Operation
app.post("/register",(req,res) => {
  const id = generateRandomString();
  const email = req.body.email;
  let password = req.body.password;
  if(email !== "" && password !== "") {
    const foundUser = getUserByEmail(email,users);
    if (foundUser) {
      res.send("<h2>Email address already exist, Click to <a href='/register'>Register</a> to go back on registration page </h2>");
    } else {
      password = bcrypt.hashSync(password, 10);
      users[id] = {id, email, password};
      console.log(users);
      req.session.user_id = id;
      res.redirect("/urls");
    }
  } else {
    res.send("Email or Password is blank, Click to <a href='/register'>Register</a> to go back on registration page")
  }
});


//Show all urls GET
app.get("/urls", (req, res) => {
  let foundUser = {};
  if(typeof req.session.user_id != "undefined"){
     foundUser = getUserById(req.session.user_id,users);
     const urls = getUrlsByUserId(req.session.user_id,urlDatabase);
     const templateVars = { urls, foundUser};
     res.render("urls_index", templateVars);
  } 
  else{
    res.send("<h2>Please <a href='/login'>Login</a> OR <a href='/register'>Register</a></h2>");
  }
});


//ADD new url GET
app.get("/urls/new", (req, res) => {
  let foundUser = {};
  if (typeof req.session.user_id !== "undefined") {
     foundUser = getUserById(req.session.user_id,users);
     const templateVars = { foundUser };
    res.render("urls_new", templateVars);
  } else {
    res.redirect('/login');
  }  
});
    

//Add new url POST
app.post('/urls', (req, res) => {
  if (typeof req.session.user_id !== "undefined") {
    const shortUrl = generateRandomString();
    urlDatabase[shortUrl] = {longURL: req.body.longURL,userID: req.session.user_id} ;
    res.redirect(`/urls/${shortUrl}`);
  } else {
    res.send("<h2>Please <a href='/login'>Login</a> OR <a href='/register'>Register</a></h2>");
  }
});


//ADD new url GET operation to redirect Corresponding longURL
app.get("/u/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL] !== undefined) {
    res.redirect(`${urlDatabase[req.params.shortURL]["longURL"]}`);
  } else {
    res.send("<h2>404 Page Not Found</h2>");
  }
  
});

//Delete url POST operation
app.post("/urls/:shortURL/delete", (req, res) => {

  if (typeof req.session.user_id !== "undefined") {
    if (typeof urlDatabase[req.params.shortURL] !== "undefined") {
      if (urlDatabase[req.params.shortURL]['userID'] === req.session.user_id) {
        delete urlDatabase[req.params.shortURL];
        res.redirect("/urls");
      } else {
        res.send('<h2>Permission Denied!!!</h2>')
      }
     } else {
      res.send("<h2>longURL not found for given shortURL. <a href='/urls'>Home</a></h2>")
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
  if (typeof req.session.user_id !== "undefined") {

    if (typeof urlDatabase[req.params.shortURL] !== "undefined") {
      if (urlDatabase[req.params.shortURL]['userID'] === req.session.user_id) { 
        foundUser = getUserById(req.session.user_id, users);
        const templateVars = {shortURL : req.params.shortURL, longURL : urlDatabase[req.params.shortURL]["longURL"], foundUser};
        res.render("urls_show",templateVars);
      } else {
        res.send("<h2>Permission Denied</h2>");
      }
      
    } else { 
      res.send("<h2>longURL not found for given shortURL. <a href='/urls'>Home</a></h2>")
    }

  } else {
    res.send("<h2>Please <a href='/login'>Login</a> OR <a href='/register'>Register</a></h2>");
  }
  
});

//Edit GET to load specific url
app.get("/urls/:shortURL",(req,res) => {
  let foundUser = {};
  if (typeof req.session.user_id !== "undefined") {
    foundUser = getUserById(req.session.user_id,users);
    if (typeof urlDatabase[req.params.shortURL] !== "undefined") {
        
      if (urlDatabase[req.params.shortURL]['userID'] === req.session.user_id) {
          const templateVars = {shortURL : req.params.shortURL, longURL : urlDatabase[req.params.shortURL]["longURL"], foundUser};
          res.render("urls_show",templateVars);
      } else {
        res.send("<h2>Permission Denied</h2>");
      } 
    } else { 
      res.send("<h2>longURL not found for given shortURL. <a href='/urls'>Home</a></h2>")
   }

  } else {
    res.send("<h2>Please <a href='/login'>Login</a> OR <a href='/register'>Register</a></h2>");
  }  
});

//Edit POST operation to edit specific url
app.post("/urls/:shortURL/edit",(req,res) => {
  if(typeof req.session.user_id != "undefined"){
    const shorturl = req.params.shortURL;
    const longurl = req.body.longURL;
    if (typeof urlDatabase[req.params.shortURL] !== "undefined") {
      if(urlDatabase[req.params.shortURL]['userID'] === req.session.user_id){
        urlDatabase[shorturl] = {longURL: longurl,userID: req.session.user_id};
        res.redirect("/urls");
      } else {
        res.send("<h2>Permission Denied!!!</h2>");
      }

    } else { 
      res.send("<h2>longURL not found for given shortURL. <a href='/urls'>Home</a></h2>")
    }
    
  
  } else {
    res.send("<h2>Please <a href='/login'>Login</a> OR <a href='/register'>Register</a></h2>");
  }
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

