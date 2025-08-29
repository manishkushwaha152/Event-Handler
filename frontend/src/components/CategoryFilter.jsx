// src/components/CategoryFilter.jsx
import { FaMusic, FaChalkboardTeacher, FaGlassCheers, FaTheaterMasks, FaGamepad, FaBriefcase, FaCalendarAlt, FaImage } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "@/styles/CategoryFilter.css";

const categories = [
  { label: "Music", icon: <FaMusic /> },
  { label: "Seminar", icon: <FaChalkboardTeacher /> },
  { label: "Party", icon: <FaGlassCheers /> },
  { label: "Theatre", icon: <FaTheaterMasks /> },
  { label: "Gaming", icon: <FaGamepad /> },
  { label: "Business", icon: <FaBriefcase /> },
  { label: "Festival", icon: <FaCalendarAlt /> },
  { label: "Exhibition", icon: <FaImage /> },
];

export default function CategoryFilter() {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/category/${category.toLowerCase()}`);
  };

  return (
    <div className="category-filter">
      <h2>🎯 Explore Categories</h2>
      <div className="category-grid">
        {categories.map((cat) => (
          <div key={cat.label} className="category-box" onClick={() => handleCategoryClick(cat.label)}>
            <span className="icon">{cat.icon}</span>
            <span className="label">{cat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
