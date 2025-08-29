import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";
import { ToastContainer } from "react-toastify";
function App() {
  return (
    <>
      <Navbar />
      <AppRoutes />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
export default App;
