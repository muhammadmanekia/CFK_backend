const admin = require("firebase-admin");

exports.sendNotification = async (req, res) => {
  const { topic, title, body } = req.body;

  const message = {
    notification: {
      title,
      body,
    },
    topic,
  };

  try {
    const response = await admin.messaging().send(message);
    res.status(200).send({ success: true, response });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: error.message });
  }
};
