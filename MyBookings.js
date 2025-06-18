import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Spinner } from "react-bootstrap";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token"); // Token from login

  useEffect(() => {
    if (!token) return; // If token not found, don't make request

    const fetchBookings = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/bookings/my-bookings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBookings(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]); // ✅ include token as a dependency

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
              <Card.Text><strong>Property ID:</strong> {booking.propertyId}</Card.Text>
              <Card.Text><strong>Owner ID:</strong> {booking.ownerId}</Card.Text>
              <Card.Text><strong>Booked by:</strong> {booking.username}</Card.Text>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
};

export default MyBookings;
