import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const router = express.Router();

// Validation middleware for user
const validateUser = (req, res, next) => {
  if (!req.body.username || !req.body.email || !req.body.password) {
    return res.status(400).json({ 
      success: false,
      message: 'Missing required fields: username, email, password' 
    });
  }
  next();
};

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch users',
      error: error.message 
    });
  }
});

// POST create user
router.post('/', validateUser, async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    // Check if email exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(409).json({ 
        success: false,
        message: 'Email already exists' 
      });
    }
    
    // Check if username exists
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(409).json({ 
        success: false,
        message: 'Username already exists' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || 'user'
    });
    
    const savedUser = await newUser.save();
    
    // Remove password from response
    const userResponse = savedUser.toObject();
    delete userResponse.password;

    res.status(201).json({ 
      success: true,
      message: 'User created successfully',
      data: userResponse
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to create user',
      error: error.message 
    });
  }
});

// PUT update user
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password, role } = req.body;
    
    // Create update object
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    
    if (password) {
      updateData.password = await bcrypt.hash(password, 12);
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      id, 
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    res.json({ 
      success: true,
      message: 'User updated successfully',
      data: { 
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to update user',
      error: error.message 
    });
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedUser = await User.findByIdAndDelete(id);
    
    if (!deletedUser) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    res.json({ 
      success: true,
      message: 'User deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete user',
      error: error.message 
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id, '-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    res.json({ 
      success: true,
      data: user 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch user',
      error: error.message 
    });
  }
}
);

export default router;