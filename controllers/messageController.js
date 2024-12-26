const Message = require("../models/Messages");

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find();
    if (!messages) {
      return res.status(404).json({ error: "No messages found." });
    }
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.postMessages = async (req, res) => {
  const { text, url, mediaType } = req.body;
  console.log("Received message:", text);
  console.log("Received file URL:", url);
  if (!text && !url) {
    return res
      .status(400)
      .json({ error: "Message and file URL are required." });
  }

  // Store the data in your database
  const newMessage = new Message({ text, url, mediaType });
  await newMessage.save();

  res.status(200).json({ success: true, message: "Data stored successfully!" });
};
