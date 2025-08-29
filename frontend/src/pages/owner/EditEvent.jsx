import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/utils/api";
import { toast } from "react-toastify";
import "@/styles/EditEvent.css";

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    image: null, 
    existingImage: "", 
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/event/${id}`);
        setFormData({
          title: data.title,
          description: data.description,
          date: data.date.slice(0, 10),
          location: data.location,
          image: null,
          existingImage: data.image,
        });
      } catch (err) {
        if (err.response?.status === 404) {
          toast.error("Event not found. It may have been deleted.");
          navigate("/owner/manage-event");
        } else {
          toast.error("Failed to load event");
        }
      }
    };
    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("date", formData.date);
    form.append("location", formData.location);

    if (formData.image) {
      form.append("image", formData.image); // Only append if new image selected
    }

    try {
      setLoading(true);
      await api.put(`/event/${id}`, form);
      toast.success("Event updated");
      navigate("/owner/manage-event");
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-event">
      <h2>Edit Event</h2>
      <form onSubmit={handleSubmit} className="edit-form">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Event Title"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Event Description"
          required
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          min={new Date().toISOString().split("T")[0]}
          required
        />
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
          required
        />

        {/* Preview existing image */}
        {formData.existingImage && !formData.image && (
          <img
            src={`http://localhost:5000/uploads/${formData.existingImage.replace("uploads/", "")}`}
            alt="Current Event"
            className="event-preview-image"
          />
        )}

        {/* Show selected new file */}
        {formData.image && (
          <p>New image selected: {formData.image.name}</p>
        )}

        <input
          type="file"
          name="image"
          onChange={handleChange}
          accept="image/*"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
}
