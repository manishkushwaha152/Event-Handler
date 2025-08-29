import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "@/utils/api";
import "react-toastify/dist/ReactToastify.css";
import "@/styles/CreateEvent.css";

export default function CreateEvent() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      if (file) {
        const url = URL.createObjectURL(file);
        setImageURL(url);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAutoFillLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setFormData((prev) => ({
          ...prev,
          location: `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`,
        }));
        toast.success("Location auto-filled");
      },
      () => toast.error("Failed to get location")
    );
  };

  const handlePreview = () => {
    setPreview(formData);
  };


const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("🌟 handleSubmit fired");    
  setLoading(true);
  try {
    const res = await api.post("/event", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("🎉 CreateEvent response:", res.data);
    navigate("/owner/dashboard");
  } catch (err) {
    console.error("❌ CreateEvent error:", err.response?.data || err);
  } finally {
    setLoading(false);
  }
};



  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="create-event-container">
      <h2>Create Event</h2>
      <form onSubmit={handleSubmit} className="event-form">
        <input type="text" name="title" placeholder="Event Title" value={formData.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
        <input type="date" name="date" value={formData.date} min={today} onChange={handleChange} required />

        <div className="location-group">
          <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
          <button type="button" onClick={handleAutoFillLocation}>Auto-Fill Location</button>
        </div>

        <input type="file" name="image" accept="image/*" onChange={handleChange} />

        {imageURL && (
          <div className="image-preview">
            <img src={imageURL} alt="Preview" />
          </div>
        )}

        <div className="actions">
          <button type="button" onClick={handlePreview}>Preview</button>
          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Event"}
          </button>
        </div>
      </form>

      {preview && (
        <div className="event-preview">
          <h3>Event Preview</h3>
          <p><strong>Title:</strong> {preview.title}</p>
          <p><strong>Description:</strong> {preview.description}</p>
          <p><strong>Date:</strong> {preview.date}</p>
          <p><strong>Location:</strong> {preview.location}</p>
          {imageURL && <img src={imageURL} alt="Preview" style={{ width: "200px", marginTop: "10px" }} />}
        </div>
      )}
    </div>
  );
}
