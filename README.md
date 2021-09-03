# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

Registration Page: Allows user to create an account in application.

!["Registration Page"](https://github.com/kathakkar/tinyapp/blob/master/docs/register_page.png?raw=true)

Login Page: Allows user to login with email and password.

!["Login Page"](https://github.com/kathakkar/tinyapp/blob/master/docs/login_page.png?raw=true)

URLs Page: Display all shorturls created by user that is logged in with corresponding longurls each with Edit and Delete button

!["URLs Page"](https://github.com/kathakkar/tinyapp/blob/master/docs/urls_page.png?raw=true)

create_new_url_page: Allow user to create new shorturl by entering longurl.

!["create_new_url_page"](https://github.com/kathakkar/tinyapp/blob/master/docs/create_new_url_page.png?raw=true)

update_url_page: Allow user to update longurl that already have shorturl created.

!["update_url_page"](https://github.com/kathakkar/tinyapp/blob/master/docs/update_url_page.png?raw=true)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session
- mocha - chai
- nodemon (optional)

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.
- Open chrome browser and type http://localhost:8080
- In title bar click on register link and create a new account
- After successful registration redirect on urls page.
- There will not any urls created yet so create one by clicking on 'create new url"
- It will redirect to Edit page where you can update longurl of already created shorturl
- Go to 'urls_page" where you can see your newly created url.
- As we are storing data in object database, once you exit from server, all the data will be erased.

## Uses

- A custom URL shortener lets you brand your links
- Short URLs allow you to get the most out of character limits on social media
- Shorter links are more memorable