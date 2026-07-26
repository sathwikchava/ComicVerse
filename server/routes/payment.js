const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const { clerkClient } = require('@clerk/clerk-sdk-node');
const router = express.Router();

// Initialize Razorpay SDK
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret'
});

// Helper to optionally parse user ID from token using Clerk
const getUserIdFromHeader = async (authHeader) => {
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.replace('Bearer ', '');
      const decoded = await clerkClient.verifyToken(token);
      return decoded.sub; // Clerk User ID is subject
    } catch (e) {
      console.log('No valid Clerk token found, checking out as guest:', e.message);
    }
  }
  return null;
};

// Create Order Route
router.post('/create-order', async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart items are required.' });
    }

    // Calculate total amount from items (stored in dollars, e.g. 10.99)
    // We convert to paise (multiply by 100)
    let totalAmount = 0;
    items.forEach(item => {
      totalAmount += (item.price * (item.quantity || item.item || 1));
    });

    // Razorpay amount must be an integer in the smallest currency unit (paise/cents)
    const amountInPaise = Math.round(totalAmount * 100);

    const currency = process.env.RAZORPAY_CURRENCY || 'INR';

    const options = {
      amount: amountInPaise,
      currency: currency,
      receipt: `receipt_${Date.now()}`
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Get optional user ID from authorization header
    const userId = await getUserIdFromHeader(req.headers.authorization);

    // Create pending order in database
    const order = new Order({
      userId,
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity || item.item || 1,
        img: item.img
      })),
      totalAmount: totalAmount,
      paymentStatus: 'pending',
      razorpayOrderId: razorpayOrder.id
    });

    await order.save();

    res.json({
      keyId: process.env.RAZORPAY_KEY_ID || 'dummy_key_id',
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency
    });
  } catch (error) {
    console.error('Create Razorpay order error:', error);
    res.status(500).json({ message: 'Error initiating payment. Please try again.' });
  }
});

// Verify Payment Route
router.post('/verify', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Payment details are incomplete.' });
    }

    // Hash computation for Razorpay verification signature
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret');
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== razorpay_signature) {
      // Mark database order status as failed
      await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { paymentStatus: 'failed' }
      );
      return res.status(400).json({ message: 'Payment verification failed. Signature mismatch.' });
    }

    // Update order status to paid in database
    const order = await Order.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        paymentStatus: 'paid',
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found in database.' });
    }

    res.json({
      message: 'Payment verified successfully!',
      orderId: order._id
    });
  } catch (error) {
    console.error('Verify Razorpay payment error:', error);
    res.status(500).json({ message: 'Server verification error. Please contact support.' });
  }
});

module.exports = router;
