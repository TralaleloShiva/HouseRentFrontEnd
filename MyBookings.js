import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Spinner } from "react-bootstrap";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    const fetchBookings = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/bookings/my-bookings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBookings(response.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2>My Bookings</h2>
      {bookings.length === 0 ? (
        <p>You have no bookings yet.</p>
      ) : (
        bookings.map((booking) => (
          <Card key={booking._id} className="mb-3">
            <Card.Body>
              <Card.Title>Booking ID: {booking._id}</Card.Title>
              <Card.Text><strong>Status:</strong> {booking.status}</Card.Text>
              <Card.Text><strong>Property Address:</strong> {booking.propertyId?.prop?.Address}</Card.Text>
              <Card.Text><strong>Amount:</strong> ₹{booking.propertyId?.prop?.Amt}</Card.Text>
              <Card.Text><strong>Owner:</strong> {booking.ownerId?.name}</Card.Text>
              <Card.Text><strong>Booked by:</strong> {booking.username}</Card.Text>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
};

export default MyBookings;
