const express = require("express");
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//



//Route to home PAGE
app.get("/", (req, res) => {
  res.send("Hello!");
});

//Login POST Operation
app.post("/login",(req,res) => {

  res.cookie("userName", req.body.userName);
  res.redirect("/urls");
});

//Login POST Operation
app.post("/urls/logout",(req,res) => {
  res.clearCookie('userName');
  res.redirect("/urls");
});


//Show all urls GET
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase,username: req.cookies["userName"]};
  
  res.render("urls_index", templateVars);
});


//ADD new url GET
app.get("/urls/new", (req, res) => {
  const templateVars = { username: req.cookies["userName"]};
  res.render("urls_new", templateVars);
});
    

//Add new url POST
app.post('/urls', (req, res) => {
  const shortUrl = generateRandomString().trim();
  urlDatabase[shortUrl] = req.body.longURL;
  res.redirect(`/u/${shortUrl}`);

});


//ADD new url GET operation to redirect Corresponding longURL
app.get("/u/:shortURL", (req, res) => {
  if(urlDatabase[req.params.shortURL] != undefined){
    res.redirect(`${urlDatabase[req.params.shortURL]}`);
  } else {
    res.send("404 Page Not Found");
  }
  
});

//Delete url POST operation
app.post("/urls/:shortURL/delete", (req, res) => {

  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
  
});


//Edit POST to load specific url
app.post("/urls/:shortURL",(req,res) => {
  const templateVars = {shortURL : req.params.shortURL, longURL : urlDatabase[req.params.shortURL],username: req.cookies["userName"]};
  res.render("urls_show",templateVars);
});

//Edit GET operation to edit specific url
app.post("/urls/:shortURL/edit",(req,res) => {
  const shorturl = req.params.shortURL;
  const longurl = req.body.longURL;
  urlDatabase[shorturl] = longurl
  res.redirect("/urls");
});


//Genrates random shortURL  
const generateRandomString = function () {
  let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < 6; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

