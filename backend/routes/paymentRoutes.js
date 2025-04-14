import express from 'express';
import Payment from '../models/Payment.js';
import User from '../models/User.js';

const router = express.Router();

// Validation middleware for payment
const validatePayment = (req, res, next) => {
  const { user, amount, payment_method, description } = req.body;
  if (!user || !amount || !payment_method) {
    return res.status(400).json({ 
      success: false,
      message: 'Missing required fields: user, amount, payment_method' 
    });
  }
  next();
};

// GET all payments
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find().populate('user', 'username email -_id');
    res.json({
      success: true,
      data: payments
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch payments',
      error: error.message 
    });
  }
});

// GET payment by ID
router.get('/:id', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('user', 'username email');
    
    if (!payment) {
      return res.status(404).json({ 
        success: false,
        message: 'Payment not found' 
      });
    }
    
    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch payment',
      error: error.message 
    });
  }
});

// POST create payment
router.post('/', validatePayment, async (req, res) => {
  try {
    const { user, amount, payment_method, description } = req.body;
    
    // Verify user exists
    const userExists = await User.findById(user);
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const newPayment = new Payment({
      user,
      amount,
      payment_method,
      description,
      status: 'pending'
    });
    
    const savedPayment = await newPayment.save();
    
    res.status(201).json({ 
      success: true,
      message: 'Payment created successfully',
      data: savedPayment
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to create payment',
      error: error.message 
    });
  }
});

// PUT update payment
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, payment_method, status, description } = req.body;
    
    // Build update object
    const updateData = {};
    if (amount) updateData.amount = amount;
    if (payment_method) updateData.payment_method = payment_method;
    if (status) updateData.status = status;
    if (description !== undefined) updateData.description = description;
    
    // Update updated_at timestamp
    updateData.updated_at = Date.now();
    
    const updatedPayment = await Payment.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedPayment) {
      return res.status(404).json({ 
        success: false,
        message: 'Payment not found' 
      });
    }

    res.json({ 
      success: true,
      message: 'Payment updated successfully',
      data: updatedPayment
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to update payment',
      error: error.message 
    });
  }
});

// DELETE payment
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPayment = await Payment.findByIdAndDelete(id);
    
    if (!deletedPayment) {
      return res.status(404).json({ 
        success: false,
        message: 'Payment not found' 
      });
    }

    res.json({ 
      success: true,
      message: 'Payment deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete payment',
      error: error.message 
    });
  }
});

export default router;