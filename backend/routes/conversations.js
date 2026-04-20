const express = require('express');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

const router = express.Router();

// Get all conversations for a user
router.get('/', auth, async (req, res) => {
    try {
        const conversations = await Conversation.find({ userId: req.user._id })
            .sort({ updatedAt: -1 });
        
        res.json(conversations);
    } catch (error) {
        console.error('Get conversations error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create a new conversation
router.post('/', auth, async (req, res) => {
    try {
        const { title = 'New Chat' } = req.body;
        
        const conversation = new Conversation({
            userId: req.user._id,
            title
        });
        
        await conversation.save();
        res.status(201).json(conversation);
    } catch (error) {
        console.error('Create conversation error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update conversation title
router.put('/:id', auth, async (req, res) => {
    try {
        const { title } = req.body;
        
        const conversation = await Conversation.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { title, updatedAt: new Date() },
            { new: true }
        );
        
        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }
        
        res.json(conversation);
    } catch (error) {
        console.error('Update conversation error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete a conversation
router.delete('/:id', auth, async (req, res) => {
    try {
        // Delete all messages in the conversation
        await Message.deleteMany({ conversationId: req.params.id });
        
        // Delete the conversation
        const conversation = await Conversation.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });
        
        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }
        
        res.json({ message: 'Conversation deleted successfully' });
    } catch (error) {
        console.error('Delete conversation error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get messages for a conversation
router.get('/:id/messages', auth, async (req, res) => {
    try {
        // Validate conversation id
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid conversation id' });
        }
        // First verify the conversation belongs to the user
        const conversation = await Conversation.findOne({
            _id: req.params.id,
            userId: req.user._id
        });
        
        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }
        
        const messages = await Message.find({ conversationId: req.params.id })
            .sort({ timestamp: 1 });
        
        res.json(messages);
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add a message to a conversation
router.post('/:id/messages', auth, async (req, res) => {
    try {
        // Validate conversation id
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid conversation id' });
        }
        const { role, content } = req.body;
        
        // Verify the conversation belongs to the user
        const conversation = await Conversation.findOne({
            _id: req.params.id,
            userId: req.user._id
        });
        
        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }
        
        const message = new Message({
            conversationId: req.params.id,
            role,
            content
        });
        
        await message.save();
        
        // Update conversation timestamp
        conversation.updatedAt = new Date();
        await conversation.save();
        
        res.status(201).json(message);
    } catch (error) {
        console.error('Add message error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;