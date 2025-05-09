import express from 'express';
import Payment from '../models/Payment.js';
import User from '../models/User.js';

const router = express.Router();

// Validation middleware for payment
const validatePayment = (req, res, next) => {
  const { user, name, payment_method, card_name, card_number, cvv, expire_date, amount } = req.body;
  
  if (!user || !name || !payment_method || !card_name || !card_number || !cvv || !expire_date || !amount) {
    return res.status(400).json({ 
      success: false,
      message: 'Missing required fields for payment' 
    });
  }
  next();
};

// GET all payments
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find().populate('user', 'username email');
    res.json(payments);
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

// GET payments by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.params.userId })
      .sort({ created_at: -1 });
    
    res.json({
      success: true,
      data: payments
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch user payments',
      error: error.message 
    });
  }
});

// POST create payment
router.post('/', validatePayment, async (req, res) => {
  try {
    const { user, name, payment_method, card_name, card_number, cvv, expire_date, amount } = req.body;
    
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
      name,
      payment_method,
      card_name,
      card_number,
      cvv,
      expire_date,
      amount,
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
    const { name, payment_method, card_name, card_number, cvv, expire_date, amount, status } = req.body;
    
    // Build update object
    const updateData = {};
    if (name) updateData.name = name;
    if (payment_method) updateData.payment_method = payment_method;
    if (card_name) updateData.card_name = card_name;
    if (card_number) updateData.card_number = card_number;
    if (cvv) updateData.cvv = cvv;
    if (expire_date) updateData.expire_date = expire_date;
    if (amount) updateData.amount = amount;
    if (status) updateData.status = status;
    
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