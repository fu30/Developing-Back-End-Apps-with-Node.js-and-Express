const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    {username: "can", password: "pw123"},
    {username: "user2", password: "222"}
];

const isValid = (username)=>{
    return users.find(user => user.username === username) ? false : true
}

const authenticatedUser = (username,password)=>{
    return users.find(user => user.username === username && user.password === password) ? true : false
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const {username, password} = req.body

    const isAuth = authenticatedUser(username, password)

    if (isAuth) {
        return res.status(200).json({
            message: "User successfully logged in.",
            username
        })
    } else {
        return res.status(403).json({
            message: "User not found or password doesn't match."
        })
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { username, review } = req.body;

    const book = books[isbn]
    const reviews = book.reviews

    const isReviewExist = reviews.some(review => review.username === username) ? true : false

    if (!book) {
        return res.status(404).json({
            message: "Book is not founded."
        })
    }

    if (isReviewExist === true) {
        return res.status(403).json({
            message: "You have rated this book before."
        })
    }

    if (book && isReviewExist !== true){
        reviews.push({ username, review })

        return res.status(200).json({
            message: "Review added successfully.",
            reviews
        })
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { username } = req.body;

    const book = books[isbn]
    const reviews = book.reviews

    const isReviewExist = reviews.some(review => review.username === username) ? true : false

    if (!book) {
        return res.status(404).json({
            message: "Book is not founded."
        })
    }

    if (isReviewExist !== true) {
        return res.status(403).json({
            message: "You don't have rated this book before."
        })
    }

    if (book && isReviewExist === true){

        // Delete review
        const indexToDelete = reviews.findIndex(review => review.username === username);
        reviews.splice(indexToDelete, 1);


        return res.status(200).json({
            message: "Review deleted successfully.",
            reviews
        })
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
