import express from 'express';
import jwt from 'jsonwebtoken';
import Note from '../models/Note.js';

const router = express.Router();

// JWT secret key - In production, store this in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Authentication middleware
const authenticateToken = (req, res, next) => {
  // Get token from authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'Authentication token is required' 
    });
  }

  try {
    // Verify the token and extract user data
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ 
      success: false,
      message: 'Invalid or expired token' 
    });
  }
};

// Validation middleware for note
const validateNote = (req, res, next) => {
  if (!req.body.title || !req.body.content) {
    return res.status(400).json({ 
      success: false,
      message: 'Missing required fields: title, content' 
    });
  }
  next();
};

// GET all notes (admin only)
router.get('/all', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. Admin permission required.' 
      });
    }

    const notes = await Note.find().populate('user', 'username -_id');
    
    res.json({
      success: true,
      data: notes
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch notes',
      error: error.message 
    });
  }
});

// GET user's notes
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    
    const notes = await Note.find({ user: userId });
    
    res.json({
      success: true,
      data: notes
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch notes',
      error: error.message 
    });
  }
});

// GET a single note by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    // First fetch the note
    const note = await Note.findById(id);
    
    if (!note) {
      return res.status(404).json({ 
        success: false,
        message: 'Note not found' 
      });
    }
    
    // Check ownership or admin privilege
    if (note.user.toString() !== userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. You do not have permission to view this note.' 
      });
    }
    
    res.json({
      success: true,
      data: note
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch note',
      error: error.message 
    });
  }
});

// POST create note
router.post('/', authenticateToken, validateNote, async (req, res) => {
  try {
    const { title, content, category = '' } = req.body;
    const userId = req.user._id;

    const newNote = new Note({
      title,
      content,
      category,
      user: userId
    });
    
    const savedNote = await newNote.save();

    res.status(201).json({ 
      success: true,
      message: 'Note created successfully',
      data: savedNote
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to create note',
      error: error.message 
    });
  }
});

// PATCH update note
router.patch('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { title, content, category } = req.body;
    
    // First check if note exists
    const note = await Note.findById(id);
    
    if (!note) {
      return res.status(404).json({ 
        success: false,
        message: 'Note not found' 
      });
    }
    
    // Check ownership or admin privilege
    if (note.user.toString() !== userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. You do not have permission to update this note.' 
      });
    }
    
    // Build update object based on provided fields
    const updateData = {};
    
    if (title !== undefined) {
      updateData.title = title;
    }
    
    if (content !== undefined) {
      updateData.content = content;
    }
    
    if (category !== undefined) {
      updateData.category = category;
    }
    
    // Update the updated_at timestamp
    updateData.updated_at = Date.now();
    
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields provided for update'
      });
    }
    
    const updatedNote = await Note.findByIdAndUpdate(id, updateData, { new: true });

    res.json({ 
      success: true,
      message: 'Note updated successfully',
      data: updatedNote
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to update note',
      error: error.message 
    });
  }
});

// DELETE note
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    // First check if note exists
    const note = await Note.findById(id);
    
    if (!note) {
      return res.status(404).json({ 
        success: false,
        message: 'Note not found' 
      });
    }
    
    // Check ownership or admin privilege
    if (note.user.toString() !== userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. You do not have permission to delete this note.' 
      });
    }

    await Note.findByIdAndDelete(id);

    res.json({ 
      success: true,
      message: 'Note deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete note',
      error: error.message 
    });
  }
});

export default router;