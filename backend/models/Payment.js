import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  payment_method: {
    type: String,
    required: true
  },
  card_name: {
    type: String,
    required: true
  },
  card_number: {
    type: String,
    required: true
  },
  cvv: {
    type: String,
    required: true
  },
  expire_date: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;