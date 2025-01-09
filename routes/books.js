const express = require('express');
const { createBook,getBooks, getBookByISBN, getBooksByAuthor, getBooksByTitle, getBooksByReview, addModifyReview } = require('../controllers/bookscontroller');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/',createBook);
router.get('/', getBooks);
router.get('/:isbn', getBookByISBN);
//router.post('/:isbn/review', auth, addreview);
router.get('/author/:author', getBooksByAuthor);
router.get('/title/:title', getBooksByTitle);
router.get('/review/:review', getBooksByReview);
router.put('/:isbn/review', auth, addModifyReview);

module.exports = router;

