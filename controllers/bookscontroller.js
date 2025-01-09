const asynchandler= require("express-async-handler");
const Book = require('../models/Book');

// Create a new book
exports.createBook = async (req, res) => {
  try {
    const { title, author, isbn } = req.body;

    // Check if the book already exists
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res.status(400).json({ message: 'Book already exists' });
    }

    // Create a new book
    const newBook = new Book({ title, author, isbn });
    await newBook.save();

    res.status(201).json({ message: 'Book created successfully', book: newBook });
  } catch (error) {
    res.status(500).json({ message: 'Error creating book', error });
  }
};

// Get all books
exports.getBooks = asynchandler(async(req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error });
  }
});

// Get book by ISBN
exports.getBookByISBN = async (req, res) => {
  try {
    const { isbn } = req.params;
    const book = await Book.findOne({ isbn });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching book by ISBN', error });
  }
};
// Get all books by a specific author
exports.getBooksByAuthor = async (req, res) => {
  try {
    const { author } = req.params;
    const books = await Book.find({ author });
    if (books.length === 0) return res.status(404).json({ message: 'No books found for this author' });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books by author', error });
  }
};
// Get all books by a specific title
exports.getBooksByTitle = async (req, res) => {
  try {
    const { title } = req.params;
    const books = await Book.find({ title });
    if (books.length === 0) return res.status(404).json({ message: 'No books found with this title' });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books by title', error });
  }
};
// Get all books containing a specific review
exports.getBooksByReview = async (req, res) => {
  try {
    const { review } = req.params;
    const books = await Book.find({ reviews: { $elemMatch: { review: { $regex: review, $options: 'i' } } } });
    if (books.length === 0) return res.status(404).json({ message: 'No books found with this review' });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books by review', error });
  }
};


// Add or modify a book review
exports.addModifyReview = async (req, res) => {
  try {
    const { isbn } = req.params;
    const { review } = req.body;

    // Find the book by ISBN
    const book = await Book.findOne({ isbn });
    if (!book) return res.status(404).json({ message: 'Book not found' });

    // Check if the review already exists
    const existingReview = book.reviews.find((review) => review.user.toString() === req.user.id);
    if (existingReview) {
      // Update the existing review
      existingReview.review = review;
      await book.save();
      return res.status(200).json({ message: 'Review updated successfully' });
    }

    // Add a new review
    book.reviews.push({ review, user: req.user.id });
    await book.save();
    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding/modifying review', error });
  }
};