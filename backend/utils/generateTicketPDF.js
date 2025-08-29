// utils/generateTicketPDF.js
const PDFDocument = require("pdfkit");

const generateTicketPDF = ({ event, user, seats, qrImage, quantity, totalAmount, ticketType }) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // --- HEADER
      doc.fontSize(20).text("🎟 Booking Confirmation", { align: "center" });
      doc.moveDown();

      // --- EVENT DETAILS
      doc.fontSize(12).text(`Event: ${event.title}`);
      doc.text(`Location: ${event.location}`);
      doc.text(`Date: ${new Date(event.date).toLocaleString()}`);
      doc.text(`Ticket Type: ${ticketType}`);
      doc.text(`Quantity: ${quantity}`);
      doc.text(`Total: ₹${totalAmount}`);
      doc.moveDown();

      // --- USER DETAILS
      doc.text(`Booked by: ${user.name} (${user.email})`);
      doc.moveDown();

      // --- SEATS
      doc.font("Helvetica-Bold").text("Seats:");
      doc.font("Helvetica").text(seats.map((s) => s.label).join(", "));
      doc.moveDown();

      // --- QR CODE
      doc.image(qrImage, {
        fit: [150, 150],
        align: "center",
        valign: "center",
      });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = generateTicketPDF;
