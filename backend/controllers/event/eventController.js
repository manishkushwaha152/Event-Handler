const Event = require("../../models/eventModel");
const fs = require("fs");
const path = require("path");

// --------------------- EVENT CONTROLLERS ------------------------

const createEvent = async (req, res) => {
  try {
    const { title, description, date, location } = req.body;
    const image = req.file ? `uploads/${req.file.filename}` : "";

    if (!title || !description || !date || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const event = await Event.create({
      title,
      description,
      date,
      location,
      image,
      ownerId: req.user._id,
      status: "approved", // auto-approved
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: "Error creating event" });
  }
};

const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ ownerId: req.user._id });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Fetch error" });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: "Error fetching event" });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { title, description, date, location } = req.body;
    const eventId = req.params.id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (req.file && event.image) {
      const oldImagePath = path.join(__dirname, "../../", event.image);
      fs.unlink(oldImagePath, (err) => {
        if (err) console.warn("Could not delete old image:", err.message);
      });
    }

    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.location = location || event.location;

    if (req.file) {
      event.image = `uploads/${req.file.filename}`;
    }

    await event.save();

    res.status(200).json({ message: "Event updated successfully", event });
  } catch (err) {
    res.status(500).json({ message: "Server error during event update" });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Not found" });
    }

    if (event.image) {
      const imagePath = path.join(__dirname, "../../", event.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Event.deleteOne({ _id: req.params.id });

    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};

const getPublicEvents = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { status: "approved" };
    if (category) {
      filter.category = new RegExp(category, "i");
    }

    const events = await Event.find(filter).sort({ date: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Public events fetch failed" });
  }
};



module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getPublicEvents,
  
};
