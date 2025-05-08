const MockEvents = require("../models/Mock_Event");
const googleOAuthManager = require("../controllers/googleOAuthManager");
const { google } = require("googleapis");

function cleanEventDescription(description) {
  if (!description) return "";

  // Convert <li> to bullets with newlines, remove other tags
  return description
    .replace(/<\/li>/gi, "\n")
    .replace(/<li>/gi, "• ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?ul>/gi, "")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .split(/-{5,}/)[0] // Take first part if there are "-----"
    .trim();
}

// --- Utility: Extract plain text after a label like "Price:" ---
function extractAfterLabel(text, label) {
  const regex = new RegExp(`${label}\\s*([^<]*)<br>?`, "i");
  const match = text.match(regex);
  return match ? match[1].trim() : null;
}

// --- Utility: Extract a URL after a label with <a href="..." ---
function extractURLAfterLabel(text, label) {
  const regex = new RegExp(`${label}\\s*<a[^>]+href="([^"]+)"`, "i");
  const match = text.match(regex);
  return match ? match[1].trim() : null;
}

exports.fetchAndSaveEvents = async (req, res) => {
  try {
    await googleOAuthManager.initializeAuth();
    const oauth2Client = googleOAuthManager.getClient();
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const tokens = googleOAuthManager.loadTokens();
    if (!tokens) {
      return res.status(401).json({
        message: "Authentication required",
        authUrl: googleOAuthManager.generateAuthUrl(),
      });
    }

    const response = await calendar.events.list({
      calendarId: "c_6sj7il06t2m6k7q5fde358funk@group.calendar.google.com",
      timeMin: new Date().toISOString(),
      maxResults: 50,
      singleEvents: true,
      orderBy: "startTime",
      timeMax: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    });

    const events = response.data.items;
    const savedEvents = [];

    for (const event of events) {
      if (!event.summary) continue;

      const desc = event.description || "";
      const eventData = {
        title: event.summary,
        description: cleanEventDescription(desc),
        location: event.location || "",
        imageUrl: extractURLAfterLabel(desc, "Image:") || "",
        price: extractAfterLabel(desc, "Price:") || "",
        organizers:
          extractAfterLabel(desc, "Organizers:") || "City of Knowledge",
        registrationLink: extractURLAfterLabel(desc, "Register:") || "",
        contact: extractAfterLabel(desc, "Contact:") || "",
        requireRSVP: desc.toLowerCase().includes("please rsvp on the app"),
        audience: extractAfterLabel(desc, "Audience:") || "",
        googleId: event.id,
        startDateTime: event.start.dateTime,
        endDateTime: event.end.dateTime,
        cancelled: event.summary.toLowerCase().includes("cancelled"),
      };

      // Check if an event with same title and startDateTime exists
      const existingEvent = await MockEvents.findOne({
        title: eventData.title,
        startDateTime: eventData.startDateTime,
      });

      if (existingEvent) {
        // Update existing event
        const updated = await MockEvents.findByIdAndUpdate(
          existingEvent._id,
          eventData,
          { new: true }
        );
        savedEvents.push(updated);
      } else {
        // Create new event
        const created = await new MockEvents(eventData).save();
        savedEvents.push(created);
      }
    }

    res.status(200).json({
      message: "Events fetched and saved successfully",
      eventCount: savedEvents.length,
      events: savedEvents,
    });
  } catch (error) {
    console.error("Error fetching or saving events:", error);
    res.status(500).json({
      message: "Error fetching or saving events",
      error: error.message,
    });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await MockEvents.find().sort({ start: 1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving events",
      error: error.message,
    });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await MockEvents.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving event",
      error: error.message,
    });
  }
};
