import express from 'express';
import jwt from 'jsonwebtoken';
import Ticket from '../models/Ticket.js';
import User from '../models/User.js';

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
  if (!req.body.title || !req.body.description) {
    return res.status(400).json({ 
      success: false,
      message: 'Missing required fields: title, description' 
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

    const tickets = await Ticket.find()
      .populate('user', 'username email')
      .sort({ 
        priority: 1, // Sort by priority (urgent first)
        created_at: -1 // Then by creation date (newest first)
      });
    
    res.json({
      success: true,
      data: tickets
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
    const userId = req.user._id;
    
    const tickets = await Ticket.find({ user: userId })
      .sort({ created_at: -1 });
    
    res.json({
      success: true,
      data: tickets
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
    const userId = req.user._id;
    
    // First fetch the ticket
    const ticket = await Ticket.findById(id).populate('user', 'username email');
    
    if (!ticket) {
      return res.status(404).json({ 
        success: false,
        message: 'Ticket not found' 
      });
    }
    
    // Check ownership or admin privilege
    if (ticket.user._id.toString() !== userId.toString() && req.user.role !== 'admin') {
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
    const { title, description, priority = 'medium' } = req.body;
    const userId = req.user._id;
    
    // Get user information for the ticket
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    const newTicket = new Ticket({
      title,
      description,
      user: userId,
      status: 'open',
      priority
    });
    
    const savedTicket = await newTicket.save();

    res.status(201).json({ 
      success: true,
      message: 'Ticket created successfully',
      data: savedTicket
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
    const ticket = await Ticket.findById(id);
    
    if (!ticket) {
      return res.status(404).json({ 
        success: false,
        message: 'Ticket not found' 
      });
    }
    
    // Build update object based on provided fields
    const updateData = {};
    
    if (status !== undefined) {
      updateData.status = status;
      
      // If status is 'resolved', set resolved_at timestamp
      if (status === 'resolved') {
        updateData.resolved_at = Date.now();
      }
    }
    
    if (priority !== undefined) {
      updateData.priority = priority;
    }
    
    if (response !== undefined) {
      updateData.response = response;
      updateData.responded_at = Date.now();
    }
    
    // Update the updated_at timestamp
    updateData.updated_at = Date.now();
    
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields provided for update'
      });
    }
    
    const updatedTicket = await Ticket.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    res.json({ 
      success: true,
      message: 'Ticket updated successfully',
      data: updatedTicket
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
    const userId = req.user._id;
    
    // First check if ticket exists
    const ticket = await Ticket.findById(id);
    
    if (!ticket) {
      return res.status(404).json({ 
        success: false,
        message: 'Ticket not found' 
      });
    }
    
    // Check ownership or admin privilege
    if (ticket.user.toString() !== userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. You do not have permission to delete this ticket.' 
      });
    }

    await Ticket.findByIdAndDelete(id);

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