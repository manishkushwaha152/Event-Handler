// const Stripe = require("stripe");
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// const express = require("express");
// const router = express.Router();
// const bodyParser = require("body-parser");
// const Booking = require("../models/bookingModel");
// const Ticket = require("../models/ticketModel");
// const Event = require("../models/eventModel");
// const QRCode = require("qrcode");
// const sendMail = require("../utils/sendMail");

// router.post(
//   "/stripe",
//   bodyParser.raw({ type: "application/json" }),
//   async (req, res) => {
//     const sig = req.headers["stripe-signature"];

//     let event;
//     try {
//       event = stripe.webhooks.constructEvent(
//         req.body,
//         sig,
//         process.env.STRIPE_WEBHOOK_SECRET
//       );
//     } catch (err) {
//       console.error("Webhook Error:", err.message);
//       return res.status(400).send(`Webhook Error: ${err.message}`);
//     }

//     // Handle successful payment
//     if (event.type === "checkout.session.completed") {
//       const session = event.data.object;
//       const { eventId, ticketType, quantity, userId, userEmail } =
//         session.metadata;

//       const eventDetails = await Event.findById(eventId);
//       const ticket = await Ticket.findOne({ eventId, type: ticketType });

//       if (!eventDetails || !ticket) return res.status(400).end();

//       if (ticket.availableQuantity < quantity) return res.status(400).end();

//       // Generate QR
//       const qrText = `Booking: ${eventDetails.title} - ${ticketType} x${quantity}`;
//       const qrCode = await QRCode.toDataURL(qrText);

//       const booking = await Booking.create({
//         userId,
//         eventId,
//         ticketType,
//         quantity,
//         totalAmount: ticket.price * quantity,
//         qrCode,
//       });

//       ticket.availableQuantity -= quantity;
//       await ticket.save();

//       // 📧 Send email
//       await sendMail({
//         to: userEmail,
//         subject: "Your Event Ticket is Confirmed 🎉",
//         html: `
//           <h3>Thank you for booking!</h3>
//           <p>Event: <strong>${eventDetails.title}</strong></p>
//           <p>City: ${eventDetails.city}</p>
//           <p>Ticket: ${ticketType}</p>
//           <img src="${qrCode}" alt="QR Code" />
//           <p>Show this QR at entry </p>
//         `,
//       });
//     }

//     res.json({ received: true });
//   }
// );

// module.exports = router;
