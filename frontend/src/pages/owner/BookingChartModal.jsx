import { Bar } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement } from "chart.js";
Chart.register(CategoryScale, LinearScale, BarElement);

export default function BookingChartModal({ event, onClose }) {
  if (!event) return null;

  const data = {
    labels: ['Bookings'],
    datasets: [{
      label: event.title,
      data: [event.bookings?.length || 0],
      backgroundColor: "#3f51b5",
    }]
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>{event.title} – Booking Chart</h3>
        <Bar data={data} />
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
