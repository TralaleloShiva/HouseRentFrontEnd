import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/auth");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data.user);
      } catch (err) {
        console.error(err);
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/auth");
      }
    };

    fetchUser();
  }, [navigate]);

  if (!user) return <h3>Loading...</h3>;

  return (
    <div style={{ padding: "30px" }}>
      <h2>Welcome, {user.name} 👋</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.type}</p>
    </div>
  );
};

export default Dashboard;
