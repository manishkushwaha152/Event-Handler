import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/utils/api";
import Slider from "react-slick";
import "@/styles/Home.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [heroIndex, setHeroIndex] = useState(0);
  const [fade, setFade] = useState(false);
  const navigate = useNavigate();

  // Fetch public events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/event/public");
        setEvents(res.data);
      } catch (err) {
        console.error("Error fetching events", err);
      }
    };
    fetchEvents();
  }, []);

  // Auto-rotate hero every 5 sec
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(true);
      setTimeout(() => setFade(false), 800);
      setHeroIndex((prev) =>
        events.length ? (prev + 1) % events.length : 0
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [events]);

  // Arrows
  const handleNext = () => {
    setFade(true);
    setTimeout(() => setFade(false), 800);
    setHeroIndex((prev) => (prev + 1) % events.length);
  };

  const handlePrev = () => {
    setFade(true);
    setTimeout(() => setFade(false), 800);
    setHeroIndex((prev) => (prev - 1 + events.length) % events.length);
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
  };

  return (
    <div>
      {/* 🎯 Categories - FIXED TOP */}
      <section className="categories-fixed">
        <div className="categories-container">
          {[
            "Music",
            "Seminar",
            "Party",
            "Theatre",
            "Gaming",
            "Business",
            "Festival",
            "Exhibition",
          ].map((cat, idx) => (
            <button
              key={idx}
              className="category-btn"
              onClick={() => navigate(`/events?category=${cat}`)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 🌟 Hero Section */}
      {events.length > 0 && (
        <section
          className={`hero-section ${fade ? "fade-in" : ""}`}
          style={{
            backgroundImage: `url("http://localhost:5000/uploads/${events[heroIndex].image.replace(
              "uploads/",
              ""
            )}")`,
          }}
        >
          {/* Badges */}
          <div className="hero-badges">
            <span className="badge category">
              {events[heroIndex].category || "Event"}
            </span>
            <span className="badge price">
              ₹{events[heroIndex].price || "Free"}
            </span>
          </div>

          {/* Arrows */}
          <button className="arrow left" onClick={handlePrev}>
            ◀
          </button>
          <button className="arrow right" onClick={handleNext}>
            ▶
          </button>

          {/* Content */}
          <div className="hero-content">
            <h1 className="hero-title">{events[heroIndex].title}</h1>
            <p className="hero-subtitle">
              📍 {events[heroIndex].city || "Unknown Location"}
            </p>
            <p className="hero-subtitle">
              🗓 {new Date(events[heroIndex].date).toDateString()}
            </p>
            <div className="hero-buttons">
              <button
                className="explore-btn"
                onClick={() => navigate("/events")}
              >
                Explore Events
              </button>
              <button
                className="book-btn"
                onClick={() => {
                  const token = localStorage.getItem("userToken");
                  const redirectUrl = `/book/${events[heroIndex]._id}`;
                  if (!token) {
                    alert("Please login to book an event!");
                    navigate(
                      `/login?redirect=${encodeURIComponent(redirectUrl)}`
                    );
                  } else {
                    navigate(redirectUrl);
                  }
                }}
              >
                Book Now
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 🌟 Featured Events */}
      <section className="slider-section">
        <h2 className="categories-title">🌟 Featured Events</h2>
        <Slider {...sliderSettings}>
          {events.map((event) => (
            <div key={event._id} className="event-slide">
              <img
                src={`http://localhost:5000/uploads/${event.image.replace(
                  "uploads/",
                  ""
                )}`}
                alt={event.title}
              />
              <div className="event-overlay">
                <h3>{event.title}</h3>
                <p>📍 {event.city || "Unknown Location"}</p>
                <p>🗓 {new Date(event.date).toDateString()}</p>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      {/* 💡 Why Choose Us */}
      <section className="why-section">
        <h2 className="categories-title">💡 Why Choose EventHandler?</h2>
        <div className="why-grid">
          <div className="why-card">
            <h3>Easy Booking</h3>
            <p>
              Book tickets effortlessly in a few clicks with secure payment
              options.
            </p>
          </div>
          <div className="why-card">
            <h3>Verified Events</h3>
            <p>
              Only trusted and approved events are listed for the best
              experience.
            </p>
          </div>
          <div className="why-card">
            <h3>Dashboard for Organizers</h3>
            <p>Manage and track your event’s performance with ease.</p>
          </div>
        </div>
      </section>

      {/* 🚀 CTA */}
      <section className="cta-section">
        <h2>Want to Host Your Own Event?</h2>
        <p>Join as an Event Owner and reach thousands of attendees today!</p>
        <button className="cta-btn">Get Started</button>
      </section>

      {/* ⚡ Footer */}
      <footer className="footer">
        <p>
          &copy; {new Date().getFullYear()} EventHandler. All rights reserved.
        </p>
        <div className="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </div>
      </footer>
    </div>
  );
}
