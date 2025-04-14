import express from 'express';
import jwt from 'jsonwebtoken';

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

    const [rows] = await req.db.query(
      'SELECT n.id, n.title, n.content, n.category, n.created_at, n.updated_at, u.name as user_name ' +
      'FROM note n JOIN user u ON n.user_id = u.id'
    );
    
    res.json({
      success: true,
      data: rows
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
    const userId = req.user.id;
    
    const [rows] = await req.db.query(
      'SELECT id, title, content, category, created_at, updated_at FROM note WHERE user_id = ?',
      [userId]
    );
    
    res.json({
      success: true,
      data: rows
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
    const userId = req.user.id;
    
    // First fetch the note
    const [notes] = await req.db.query(
      'SELECT * FROM note WHERE id = ?',
      [id]
    );
    
    if (notes.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Note not found' 
      });
    }
    
    const note = notes[0];
    
    // Check ownership or admin privilege
    if (note.user_id !== userId && req.user.role !== 'admin') {
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
    const userId = req.user.id;

    const [result] = await req.db.query(
      'INSERT INTO note (title, content, category, user_id) VALUES (?, ?, ?, ?)',
      [title, content, category, userId]
    );

    res.status(201).json({ 
      success: true,
      message: 'Note created successfully',
      data: { 
        id: result.insertId,
        title,
        content,
        category,
        user_id: userId,
        created_at: new Date()
      }
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
    const userId = req.user.id;
    const { title, content, category } = req.body;
    
    // First check if note exists and belongs to the user
    const [notes] = await req.db.query(
      'SELECT user_id FROM note WHERE id = ?',
      [id]
    );
    
    if (notes.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Note not found' 
      });
    }
    
    // Check ownership or admin privilege
    if (notes[0].user_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. You do not have permission to update this note.' 
      });
    }
    
    // Build update query dynamically based on provided fields
    const updates = [];
    const values = [];
    
    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title);
    }
    
    if (content !== undefined) {
      updates.push('content = ?');
      values.push(content);
    }
    
    if (category !== undefined) {
      updates.push('category = ?');
      values.push(category);
    }
    
    updates.push('updated_at = NOW()');
    
    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields provided for update'
      });
    }
    
    values.push(id);
    
    const [result] = await req.db.query(
      `UPDATE note SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Note not found' 
      });
    }

    res.json({ 
      success: true,
      message: 'Note updated successfully' 
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
    const userId = req.user.id;
    
    // First check if note exists and belongs to the user
    const [notes] = await req.db.query(
      'SELECT user_id FROM note WHERE id = ?',
      [id]
    );
    
    if (notes.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Note not found' 
      });
    }
    
    // Check ownership or admin privilege
    if (notes[0].user_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. You do not have permission to delete this note.' 
      });
    }

    const [result] = await req.db.query(
      'DELETE FROM note WHERE id = ?',
      [id]
    );

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