const getUserByEmail = function(email,usersDB) {
  for(let key in usersDB){
    
     if (usersDB[key]["email"] === email){
      return usersDB[key];
     }
  }
 return null;
}




const getUserById = function(id,usersDB){
  for(let key in usersDB){
    console.log("user key out",usersDB[key]);
    if (key === id){
      console.log("user key in",usersDB[key]);
     return usersDB[key];
    }
 }
return null;
}

const getUrlsByUserId = function (userid, db) {
  const objUrls = {};
  for(let key in db){
    if(db[key]["userID"] == userid) {
      let shortURL = key;
    //  obj += {[shortURL]: urlDatabase[key]["longURL"]};
      objUrls[shortURL] = db[key]["longURL"];
    }
  }
  if(JSON.stringify(objUrls) != "{}"){
    return objUrls;
  }
  
  return null;
}

//Genrates random shortURL  
const generateRandomString = function () {
  const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < 6; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result.trim();
}

//module.exports = getUserByEmail1;
module.exports = {
   getUserByEmail, 
   getUserById,
   getUrlsByUserId,
   generateRandomString
  };