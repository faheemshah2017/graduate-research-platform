const ChatMessage = require('../models/chat');

// Send a chat message
exports.sendMessage = async (req, res) => {
  try {
    const { recipient, message } = req.body;
    const sender = req.user ? req.user._id : req.body.sender;
    if (!sender || !recipient || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const chatMsg = new ChatMessage({ sender, recipient, message });
    await chatMsg.save();
    res.status(201).json({ message: 'Message sent', chat: chatMsg });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get chat history between two users
exports.getChatHistory = async (req, res) => {
  try {
    // Try to get user1 from req.user, then from query, then from body
    let user1 = req.user ? req.user._id : (req.query.user1 || req.body.user1);
    const user2 = req.query.user2 || req.body.user2;
    // Fallback: try to get from custom header (for frontend fetch)
    if (!user1 && req.headers['x-user-id']) user1 = req.headers['x-user-id'];
    if (!user1 || !user2) {
      return res.status(400).json({ error: 'Missing user ids' });
    }
    const messages = await ChatMessage.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 }
      ]
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
