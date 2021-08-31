const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


//Route to home PAGE
app.get("/", (req, res) => {
  res.send("Hello!");
});


app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.post('/urls', (req, res) => {
  const shortUrl = generateRandomString().trim();
  urlDatabase[shortUrl] = req.body.longURL;
  res.redirect(`/u/${shortUrl}`);

});

//Route to add new url
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});
    

app.get("/u/:shortURL", (req, res) => {
  // console.log(req.params.shortURL);
  // const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  // res.render("urls_show", templateVars);
//  console.log(urlDatabase[req.params.shortURL]);
  if(urlDatabase[req.params.shortURL] != undefined){
    res.redirect(`${urlDatabase[req.params.shortURL]}`);
  } else {
    res.send("404 Page Not Found");
  }
  
});


app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

const generateRandomString = function () {

  let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < 6; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;

}