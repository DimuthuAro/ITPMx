import express from 'express';
import Note from '../models/Note.js';
import multer from 'multer';
import Tesseract from 'tesseract.js';
import fs from 'fs';

const router = express.Router();

// Multer setup for image upload
const upload = multer({ dest: 'uploads/' });

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

// GET all notes
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find().populate('user', 'username -_id');
    
    res.json(notes);
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch notes',
      error: error.message 
    });
  }
});

// GET user's notes by user ID
router.get('/:_id?', async (req, res) => {
  try {
    const userId = req.params._id; // If no userId provided, return all notes
    const notes = userId ?
      await Note.find({ _id: userId }) :
      await Note.find();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch notes',
      error: error.message 
    });
  }
});

// GET a single note by ID
router.get('/:id', async (req, res) => {
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
router.post('/', async (req, res) => {
  try {
    const { title, content, category = '', user } = req.body;

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    } const newNote = new Note({
      title,
      content,
      category,
      user
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
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category } = req.body;
    
    // First check if note exists
    const note = await Note.findById(id);
    
    if (!note) {
      return res.status(404).json({ 
        success: false,
        message: 'Note not found' 
      });
    }
    
    // No authentication check - allow anyone to update
    
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
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // First check if note exists
    const note = await Note.findById(id);
    
    if (!note) {
      return res.status(404).json({ 
        success: false,
        message: 'Note not found' 
      });
    }
    // No permission check - allow anyone to delete

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

// OCR scan endpoint
router.post('/scan', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image uploaded' });
  }
  try {
    const imagePath = req.file.path;
    const { data: { text } } = await Tesseract.recognize(imagePath, 'eng');
    // Optionally, delete the file after processing
    fs.unlink(imagePath, () => { });
    res.json({ success: true, text });
  } catch (error) {
    res.status(500).json({ success: false, message: 'OCR failed', error: error.message });
  }
});

export default router;