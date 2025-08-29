import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import EventCard from "@/components/EventCard";

export default function CategoryPage() {
  const { name } = useParams();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchCategoryEvents = async () => {
      try {
        const res = await api.get(`/event/public?category=${name}`);
        setEvents(res.data);
      } catch (err) {
        console.error("Category fetch failed");
      }
    };
    fetchCategoryEvents();
  }, [name]);

  return (
    <div className="category-page">
      <h2>Events in {name} Category</h2>
      <div className="event-list">
        {events.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
    </div>
  );
}
