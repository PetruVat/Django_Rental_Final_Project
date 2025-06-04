import { Routes, Route } from "react-router-dom";
import ListingList from "./pages/ListingList";
import ListingDetail from "./pages/ListingDetail";
import BookingList from "./pages/BookingList";
import BookingForm from "./pages/BookingForm";
import CreateListingPage from "./pages/CreateListingPage";
import EditListingPage from "./pages/EditListingPage";
import CreateBookingPage from "./pages/CreateBookingPage";
import BookingEditPage from "./pages/BookingEditPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Toaster } from "sonner";
import { useAuth } from "./context/AuthContext";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import MyListingsPage from "./pages/MyListingsPage";
import AllBookingsPage from "./pages/AllBookingsPage";
import NotFound from "./pages/NotFound";


function App() {
  const { user } = useAuth();

  return (
    <>
      <Toaster richColors position="top-right" />
      <Header />
      <Routes>
        <Route path="/" element={<ListingList />} />
        <Route path="/listings/:id" element={<ListingDetail />} />
        <Route
          path="/bookings"
          element={
            <PrivateRoute>
              <BookingList />
            </PrivateRoute>
          }
        />
        <Route
          path="/all-bookings"
          element={
            <PrivateRoute>
              <AllBookingsPage />
            </PrivateRoute>
        }
        />
        <Route
          path="/my-listings"
          element={
            <PrivateRoute>
              <MyListingsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/listings/:id/book"
          element={
            <PrivateRoute>
              <BookingForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/bookings/create/:id"
          element={
            <PrivateRoute>
              <CreateBookingPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/bookings/edit/:id"
          element={
            <PrivateRoute>
              <BookingEditPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/listings/create"
          element={
            <PrivateRoute>
              <CreateListingPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/listings/:id/edit"
          element={
            <PrivateRoute>
              <EditListingPage />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
