import express from 'express';
import Ticket from '../models/Ticket.js';
import User from '../models/User.js';

const router = express.Router();

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

// GET all tickets
router.get('/', async (req, res) => {
  try {
    // No admin check - allow anyone to access all tickets

    const tickets = await Ticket.find()
      .populate('user', 'username email')
      .sort({ 
        priority: 1, // Sort by priority (urgent first)
        created_at: -1 // Then by creation date (newest first)
      });
    
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch tickets',
      error: error.message 
    });
  }
});

// GET user's tickets by user ID
router.get('/:id?', async (req, res) => {
  try {
    const userId = req.params.id;
    // If no userId provided, return all tickets
    const tickets = userId ?
      await Ticket.find({ _id: userId }).sort({ created_at: -1 }) :
      await Ticket.find().sort({ created_at: -1 });
    
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

// POST create ticket
router.post('/', validateTicket, async (req, res) => {
  try {
    const { title, description, priority = 'medium', userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

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

    res.status(201).json(savedTicket);
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to create ticket',
      error: error.message 
    });
  }
});

// PATCH update ticket
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Ticket ID:', id); // Debugging line
    console.log('Request body:', req.body); // Debugging line
    const { status, priority, response } = req.body;
    
    // No admin check - allow anyone to update tickets
    
    // Check if ticket exists
    const ticket = await Ticket.find({ _id: id });
    
    if (!ticket) {
      return res.status(404).json({ 
        success: false,
        message: 'Ticket not found' 
      });
    }
    console.log('Ticket found:', ticket); // Debugging line
    // Build update object based on provided fields
    const updateData = req.body;
    
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
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // First check if ticket exists
    const ticket = await Ticket.findById(id);
    
    if (!ticket) {
      return res.status(404).json({ 
        success: false,
        message: 'Ticket not found' 
      });
    }
    
    // No ownership check - allow anyone to delete

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