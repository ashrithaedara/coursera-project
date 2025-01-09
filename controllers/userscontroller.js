const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the username already exists
    const existingUser  = await User.findOne({ username });
    if (existingUser ) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Create a new user
    const newUser = new User({ username, password });
    await newUser.save();

    res.status(201).json({ message: 'User  registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};

exports.login = async (req, res) => {

  try {

    const { username, password } = req.body;



    // Check if the user exists

    const user = await User.findOne({ username });

    if (!user) {

      return res.status(400).json({ message: 'Invalid username or password' });

    }



    // Check if the password is correct

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {

      return res.status(400).json({ message: 'Invalid username or password' });

    }



    // Generate a JWT token

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });



    res.status(200).json({ message: 'Login successful', token });

  } catch (error) {

    res.status(500).json({ message: 'Error logging in', error });

  }

};