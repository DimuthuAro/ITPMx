import express from 'express';
import Ticket from '../models/Ticket.js';
import User from '../models/User.js';

const router = express.Router();

// Validation middleware for ticket
const validateTicket = (req, res, next) => {
  const { user, name, email, phone, title, description, inquiry_type, priority } = req.body;
  
  if (!user || !name || !email || !phone || !title || !description || !inquiry_type) {
    return res.status(400).json({ 
      success: false,
      message: 'Missing required fields for ticket' 
    });
  }
  next();
};

// GET all tickets
router.get('/', async (req, res) => {
  try {
    const tickets = await Ticket.find().populate('user', 'username email');
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch tickets',
      error: error.message 
    });
  }
});

// GET ticket by ID
router.get('/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate('user', 'username email');
    
    if (!ticket) {
      return res.status(404).json({ 
        success: false,
        message: 'Ticket not found' 
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

// GET tickets by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.params.userId })
      .sort({ priority: 1, created_at: -1 });
    
    res.json({
      success: true,
      data: tickets
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch user tickets',
      error: error.message 
    });
  }
});

// POST create ticket
router.post('/', validateTicket, async (req, res) => {
  try {
    const { user, name, email, phone, title, description, inquiry_type, priority = 'medium' } = req.body;
    
    // Verify user exists
    const userExists = await User.findById(user);
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const newTicket = new Ticket({
      user,
      name,
      email,
      phone,
      title,
      description,
      inquiry_type,
      priority,
      status: 'open'
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

// PUT update ticket
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, title, description, status, inquiry_type, priority } = req.body;
    
    // Build update object
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (status) updateData.status = status;
    if (inquiry_type) updateData.inquiry_type = inquiry_type;
    if (priority) updateData.priority = priority;
    
    // Update updated_at timestamp
    updateData.updated_at = Date.now();
    
    // If status is 'resolved', set resolved_at timestamp
    if (status === 'resolved') {
      updateData.resolved_at = Date.now();
    }
    
    const updatedTicket = await Ticket.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedTicket) {
      return res.status(404).json({ 
        success: false,
        message: 'Ticket not found' 
      });
    }

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
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTicket = await Ticket.findByIdAndDelete(id);
    
    if (!deletedTicket) {
      return res.status(404).json({ 
        success: false,
        message: 'Ticket not found' 
      });
    }

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