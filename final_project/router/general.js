const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(401).json({
            message: "You must provide username and password.",
        })
    }

    const valid = isValid(username)

    if (valid) {
        users.push({username, password})
        return res.status(200).json({
            message: "User successfully registered.",
            users
        })
    } else {
        return res.status(401).json({
            message: "This username is already taken."
        })
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    const getAllBooks = () => {
        return res.status(200).json(books)
    }
  
    return getAllBooks()
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    function getBookByISBN(ISBN) {
        return new Promise((resolve, reject) => {
          if (books[ISBN]) {
            resolve(books[ISBN]);
          } else {
            reject({ message: "Not founded." });
          }
        });
    }

    const ISBN = req.params.isbn;
    getBookByISBN(ISBN)
        .then(book => res.status(200).json(book))
        .catch(error => res.status(400).json(error))
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const authorRes = Object.values(books).filter(book => {
        return Object.entries(book).some(([key, value]) => {
            return key === 'author' && value === req.params.author;
        })
    })

    if (authorRes.length === 0) {
        return res.status(404).json({ message: "Author not found" });
    }

    res.send(authorRes)
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const titleRes = Object.values(books).filter(book => {
        return Object.entries(book).some(([key, value]) => {
            return key === 'title' && value === req.params.title;
        })
    })

    if (titleRes.length === 0) {
        return res.status(404).json({ message: "Book not found" });
    }

    res.send(titleRes)
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const ISBN = req.params.isbn;
    return books[ISBN].reviews && books[ISBN].reviews !== {} ? res.status(200).json(books[ISBN].reviews) : res.status(404).json({ message: "Not founded." })
});

module.exports.general = public_users;
