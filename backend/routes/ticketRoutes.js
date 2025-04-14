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

// Validation middleware for ticket
const validateTicket = (req, res, next) => {
  if (!req.body.subject || !req.body.description) {
    return res.status(400).json({ 
      success: false,
      message: 'Missing required fields: subject, description' 
    });
  }
  next();
};

// GET all tickets (admin only)
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
      'SELECT t.id, t.subject, t.description, t.status, t.priority, t.response, ' +
      't.responded_at, t.created_at, t.updated_at, u.name as user_name, u.email as user_email ' +
      'FROM ticket t JOIN user u ON t.user_id = u.id ' +
      'ORDER BY CASE ' +
      '  WHEN t.status = "urgent" THEN 1 ' +
      '  WHEN t.status = "open" THEN 2 ' +
      '  WHEN t.status = "in progress" THEN 3 ' +
      '  WHEN t.status = "closed" THEN 4 ' +
      '  ELSE 5 END, t.created_at DESC'
    );
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch tickets',
      error: error.message 
    });
  }
});

// GET user's tickets
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [rows] = await req.db.query(
      'SELECT id, subject, description, status, priority, response, ' +
      'responded_at, created_at, updated_at FROM ticket WHERE user_id = ? ' +
      'ORDER BY created_at DESC',
      [userId]
    );
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch tickets',
      error: error.message 
    });
  }
});

// GET a single ticket by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // First fetch the ticket
    const [tickets] = await req.db.query(
      'SELECT * FROM ticket WHERE id = ?',
      [id]
    );
    
    if (tickets.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Ticket not found' 
      });
    }
    
    const ticket = tickets[0];
    
    // Check ownership or admin privilege
    if (ticket.user_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. You do not have permission to view this ticket.' 
      });
    }
    
    res.json({
      success: true,
      data: ticket
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch ticket',
      error: error.message 
    });
  }
});

// POST create ticket
router.post('/', authenticateToken, validateTicket, async (req, res) => {
  try {
    const { subject, description, priority = 'Medium' } = req.body;
    const userId = req.user.id;
    
    // Get user information for the ticket
    const [users] = await req.db.query(
      'SELECT name, email FROM user WHERE id = ?',
      [userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    const user = users[0];

    const [result] = await req.db.query(
      'INSERT INTO ticket (user_id, name, email, subject, description, status, priority) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, user.name, user.email, subject, description, 'Open', priority]
    );

    res.status(201).json({ 
      success: true,
      message: 'Ticket created successfully',
      data: { 
        id: result.insertId,
        subject,
        description,
        status: 'Open',
        priority,
        user_id: userId,
        created_at: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to create ticket',
      error: error.message 
    });
  }
});

// PATCH update ticket (admin only)
router.patch('/:id/admin', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, response } = req.body;
    
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. Admin permission required.' 
      });
    }
    
    // Check if ticket exists
    const [tickets] = await req.db.query(
      'SELECT id FROM ticket WHERE id = ?',
      [id]
    );
    
    if (tickets.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Ticket not found' 
      });
    }
    
    // Build update query dynamically based on provided fields
    const updates = [];
    const values = [];
    
    if (status !== undefined) {
      updates.push('status = ?');
      values.push(status);
    }
    
    if (priority !== undefined) {
      updates.push('priority = ?');
      values.push(priority);
    }
    
    if (response !== undefined) {
      updates.push('response = ?');
      updates.push('responded_at = NOW()');
      values.push(response);
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
      `UPDATE ticket SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    res.json({ 
      success: true,
      message: 'Ticket updated successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to update ticket',
      error: error.message 
    });
  }
});

// DELETE ticket
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // First check if ticket exists and belongs to the user
    const [tickets] = await req.db.query(
      'SELECT user_id FROM ticket WHERE id = ?',
      [id]
    );
    
    if (tickets.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Ticket not found' 
      });
    }
    
    // Check ownership or admin privilege
    if (tickets[0].user_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. You do not have permission to delete this ticket.' 
      });
    }

    const [result] = await req.db.query(
      'DELETE FROM ticket WHERE id = ?',
      [id]
    );

    res.json({ 
      success: true,
      message: 'Ticket deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete ticket',
      error: error.message 
    });
  }
});

export default router;