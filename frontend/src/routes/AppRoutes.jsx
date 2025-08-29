import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

//  Pages
import Home from "../pages/Home";
import CategoryPage from "../pages/CategoryPage";
import Unauthorized from "../pages/Unauthorized";
import PublicEvents from "../pages/PublicEvents";

//  User Pages
import Login from "../pages/user/UserLogin";
import Register from "../pages/user/UserRegister";
import UserDashboard from "../pages/user/UserDashboard";
import ViewBooking from "../pages/user/ViewBooking";
import BookEventTicket from "../pages/user/BookEventTicket";
import SearchEvents from "../pages/user/SearchEvents";

//  Owner Pages
import OwnerLogin from "../pages/owner/OwnerLogin";
import OwnerRegister from "../pages/owner/OwnerRegister";
import OwnerDashboard from "../pages/owner/OwnerDashboard";
import CreateEvent from "../pages/owner/CreateEvent";
import OwnerEvents from "../pages/owner/OwnerEvents";
import ManageEvent from "../pages/owner/ManageEvent";
import EditEvent from "../pages/owner/EditEvent";
import CreateTicket from "../pages/owner/CreateTicket";

export default function AppRoutes() {
  return (
    <Routes>
      {/*  Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/owner/login" element={<OwnerLogin />} />
      <Route path="/owner/register" element={<OwnerRegister />} />
      <Route path="/events" element={<PublicEvents />} />
      <Route path="/category/:name" element={<CategoryPage />} />

      {/*  Public access to BookEventTicket via ID */}
      <Route path="/book/:id" element={<BookEventTicket />} />

      {/*  Protected User Routes */}
      <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/bookings" element={<ViewBooking />} />
        <Route path="/user/book/event-ticket" element={<BookEventTicket />} />
        <Route path="/user/search" element={<SearchEvents />} />
      </Route>

      {/* Protected Owner Routes */}
      <Route element={<ProtectedRoute allowedRoles={["owner"]} />}>
        <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/owner/create-ticket" element={<CreateTicket />} />
        <Route path="/owner/event" element={<OwnerEvents />} />
        <Route path="/owner/manage-event" element={<ManageEvent />} />
        <Route path="/owner/event/:id/edit" element={<EditEvent />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}