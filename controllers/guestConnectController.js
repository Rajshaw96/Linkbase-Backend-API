const GuestConnect = require("../models/GuestDetails");

// POST: Add guest
const addGuest = async (req, res) => {
  try {
    const guestData = req.body;
    guestData.id = guestData.id || Date.now().toString();
    guestData.createdAt = new Date();

    const newGuest = new GuestConnect(guestData);
    await newGuest.save();

    return res.status(200).json({
      message: "Guest successfully added to the CRM.!!!",
      id: newGuest.id
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server Error",
      error: err.message
    });
  }
};

// GET: Fetch guest by ID, propertyLocationId, or all with pagination
const getGuests = async (req, res) => {
  try {
    const { id, propertyLocationId, limit = 10, lastKey } = req.query;

    // Fetch single guest by ID
    if (id) {
      const guest = await GuestConnect.findOne({ id });
      return res.status(200).json(guest || {});
    }

    // Filter guests by propertyLocationId
    if (propertyLocationId) {
      const guests = await GuestConnect.find({ propertyLocationId });
      return res.status(200).json(guests);
    }

    // Paginated fetch
    const paginationOptions = {
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      ...(lastKey ? { _id: { $lt: lastKey } } : {})
    };

    const guests = await GuestConnect.find({}, null, paginationOptions);
    const totalCount = await GuestConnect.countDocuments();
    const newLastKey = guests.length ? guests[guests.length - 1]._id : null;

    return res.status(200).json({
      items: guests,
      lastKey: newLastKey,
      totalCount
    });

  } catch (err) {
    return res.status(500).json({
      message: "Server Error",
      error: err.message
    });
  }
};

module.exports = {
  addGuest,
  getGuests
};
