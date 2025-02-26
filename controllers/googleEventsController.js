const Event = require("../models/Event");
const googleOAuthManager = require("../controllers/googleOAuthManager");
const { google } = require("googleapis");

// Function to get image URL based on event summary
function getImageUrlByEventName(summary) {
  if (summary.includes("Duʿā Kumayl")) {
    return "https://mcusercontent.com/185fa65767eb01e2186a1ff88/images/2fff4a16-6cd5-19f3-ee8f-c5d111c3ecb8.jpeg";
  }
  if (summary.includes("Salāt-e-Jumuʿāh")) {
    return "https://mcusercontent.com/185fa65767eb01e2186a1ff88/images/786b2746-6408-1be9-0ef6-43c6ae3cce62.jpeg";
  }
  // Add more conditions for other names and their corresponding image URLs if needed
  return ""; // Return an empty string if no match is found
}

function cleanEventDescription(description) {
  // Remove HTML tags
  let cleanDesc = description.replace(/<[^>]*>/g, "");

  // Split and take first part if it includes a series of dashes
  const parts = cleanDesc.split(/-{5,}/); // Split on five or more dashes

  // Return first part, trimmed
  return parts[0].trim();
}

function formatTime(timeString) {
  const date = new Date(timeString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

exports.fetchAndSaveEvents = async (req, res) => {
  try {
    // Initialize OAuth client
    await googleOAuthManager.initializeAuth();
    const oauth2Client = googleOAuthManager.getClient();

    // Create Google Calendar API client
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const tokens = googleOAuthManager.loadTokens();
    if (!tokens) {
      return res.status(401).json({
        message: "Authentication required",
        authUrl: googleOAuthManager.generateAuthUrl(),
      });
    }

    // Fetch events from primary calendar
    const response = await calendar.events.list({
      calendarId: "c_6sj7il06t2m6k7q5fde358funk@group.calendar.google.com",
      timeMin: new Date().toISOString(),
      maxResults: 50,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = response.data.items;
    const savedEvents = await Promise.all(
      events.map(async (event) => {
        const existingEvent = await Event.findOne({ googleId: event.id });
        if (!existingEvent) {
          const newEvent = new Event({
            title: event.summary,
            description: cleanEventDescription(event.description || "") || "",
            date: new Date(event.start.dateTime || event.start.date),
            startTime:
              formatTime(event.start.dateTime) || formatTime(event.start.date),
            endTime:
              formatTime(event.end.dateTime) || formatTime(event.end.date),
            location: event.location || "",
            imageUrl: getImageUrlByEventName(event.summary),
            price: "",
            organizers: "City of Knowledge",
            registrationLink: "",
            contact: "",
            requireRSVP: false,
            audience: "",
            googleId: event.id,
            startDateTime: event.start.dateTime,
            endDateTime: event.end.dateTime,
          });

          await newEvent.save();

          return newEvent;
        }
      })
    );

    // Save events to MongoDB
    // const savedEvents = await Promise.all(
    //   events.map(async (event) => {
    //     // Check if event already exists to avoid duplicates
    //     const existingEvent = await Event.findOne({ googleId: event.id });

    //     if (existingEvent) {
    //       // Update existing event
    //       return await Event.findOneAndUpdate(
    //         { googleId: event.id },
    //         {
    //           summary: event.summary,
    //           description: event.description,
    //           start: event.start.dateTime || event.start.date,
    //           end: event.end.dateTime || event.end.date,
    //           location: event.location,
    //           status: event.status,
    //         },
    //         { new: true }
    //       );
    //     } else {
    //       // Create new event
    //       return await Event.create({
    //         googleId: event.id,
    //         summary: event.summary,
    //         description: event.description,
    //         start: event.start.dateTime || event.start.date,
    //         end: event.end.dateTime || event.end.date,
    //         location: event.location,
    //         status: event.status,
    //       });
    //     }
    //   })
    // );
    console.log(savedEvents);

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
    const events = await Event.find().sort({ start: 1 });
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
    const event = await Event.findById(req.params.id);
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
