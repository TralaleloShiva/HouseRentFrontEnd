import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Container,
  Row,
  Col,
  Navbar,
  Badge,
  Form,
  FormControl,
  Modal,
} from "react-bootstrap";
import axios from "axios";
import './RenterDashboard.css';

const RenterDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/bookings/properties", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("🔥 Properties from backend:", res.data);
        setProperties(res.data);
      } catch (err) {
        console.error("Failed to fetch properties", err);
      }
    };

    fetchProperties();
  }, []);

  const filtered = properties.filter((prop) =>
    prop.prop?.Address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar bg="dark" variant="dark" className="justify-content-between px-4">
        <Navbar.Brand>🏠 RentEasy</Navbar.Brand>
        <Form inline="true">
          <FormControl
            type="text"
            placeholder="Search Properties"
            className="mr-sm-2"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form>
        <div className="text-white">
          🔔 <Badge bg="danger">2</Badge>
        </div>
      </Navbar>

      <Container className="mt-4">
        <Row>
          {filtered.map((prop) => (
            <Col key={prop._id} md={4} className="mb-4">
              <Card>
                <Card.Img
  variant="top"
  src={prop.prop.images?.[0] || "https://source.unsplash.com/400x300/?house"}
  style={{ height: "200px", objectFit: "cover" }}
/>



                <Card.Body>
                  <Card.Title>{prop.prop?.Type}</Card.Title>
                  <Card.Text><strong>₹{prop.prop?.Amt}</strong> per month</Card.Text>
                  <Card.Text><small>📍 {prop.prop?.Address}</small></Card.Text>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setSelectedProperty(prop);
                      setShowModal(true);
                    }}
                  >
                    View More Info
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Modal for More Info */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        {selectedProperty && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{selectedProperty.prop?.Type}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
             <img
  src={
    selectedProperty.prop.images && selectedProperty.prop.images.length > 0
      ? selectedProperty.prop.images[0]
      : "https://source.unsplash.com/400x300/?house"
  }
  alt="property"
  className="img-fluid mb-3"
/>

              <p><strong>Address:</strong> {selectedProperty.prop?.Address}</p>
              <p><strong>Price:</strong> ₹{selectedProperty.prop?.Amt}</p>
              <p><strong>Owner Contact:</strong> {selectedProperty.ownerContact}</p>
              <p><strong>More Info:</strong> {selectedProperty.addInfo || "No additional info."}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
              <Button
                variant="success"
                onClick={async () => {
                  try {
                    const token = localStorage.getItem("token");
                    await axios.post(
                      "http://localhost:5000/api/bookings/book",
                      {
                        propertyId: selectedProperty._id,
                        ownerId: selectedProperty.userId,
                        username: localStorage.getItem("username") || "Renter",
                      },
                      { headers: { Authorization: `Bearer ${token}` } }
                    );
                    alert("🏠 Booking request sent!");
                    setShowModal(false);
                  } catch (err) {
                    console.error("Booking failed:", err);
                    alert("❌ Failed to book property.");
                  }
                }}
              >
                Book Now
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </>
  );
};

export default RenterDashboard;
