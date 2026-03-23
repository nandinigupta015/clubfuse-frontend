import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Calendar, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Events = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const studentId = user ? localStorage.getItem("student_id") : null;
  const roleId = user ? localStorage.getItem("role_id") : null;
  const isCoordinator = user && roleId === "2";

  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH EVENTS ================= */

  const fetchEvents = () => {
    const url = isCoordinator
      ? `http://127.0.0.1:5000/api/events/coordinator/${studentId}`
      : `http://127.0.0.1:5000/api/events/student/guest`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();
  }, [user, roleId]);

  /* ================= REGISTER EVENT ================= */

  const handleRegister = async (eventId: number) => {
    // 🚨 HARD BLOCK — guest cannot register
    if (!user || !studentId) {
      alert("Please login to register for events");
      navigate("/login");
      return;
    }

    const confirmRegister = window.confirm(
      "Do you want to register for this event?"
    );
    if (!confirmRegister) return;

    try {
      const res = await fetch("http://127.0.0.1:5000/api/event-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: studentId,
          event_id: eventId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Registration failed");
        return;
      }

      alert("Successfully registered!");
    } catch {
      alert("Server error. Please try again.");
    }
  };

  /* ================= DELETE EVENT ================= */

  const handleDelete = async (eventId: number) => {
    if (!user || !isCoordinator || !studentId) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `http://127.0.0.1:5000/api/events/${eventId}?student_id=${studentId}`,
        { method: "DELETE" }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Delete failed");
        return;
      }

      alert("Event deleted successfully");
      fetchEvents();
    } catch {
      alert("Server error. Please try again.");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="max-w-6xl mx-auto p-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-2">
        {isCoordinator ? "My Events" : "Browse Events"}
      </h1>

      <p className="text-gray-500 mb-8">
        {isCoordinator
          ? "Events managed by your club"
          : "Explore upcoming campus events"}
      </p>

      {loading && <p className="text-gray-500">Loading events...</p>}

      {!loading && events.length === 0 && (
        <p className="text-gray-500">No events available.</p>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {events.map((e: any) => (
          <div
            key={e.event_id}
            className="bg-white rounded-lg shadow p-6"
          >
            <h3 className="text-xl font-semibold mb-1">{e.title}</h3>

            <p className="text-sm text-purple-600 mb-2">
              {e.club_name}
            </p>

            <div className="flex items-center text-sm text-gray-500 mb-1">
              <Calendar className="h-4 w-4 mr-2" />
              {e.date}
            </div>

            <div className="flex items-center text-sm text-gray-500 mb-3">
              <MapPin className="h-4 w-4 mr-2" />
              {e.venue}
            </div>

            <p className="text-sm text-gray-700 mb-4">
              {e.description}
            </p>

            {/* ACTIONS */}
            {isCoordinator ? (
              <button
                onClick={() => handleDelete(e.event_id)}
                className="border px-3 py-1 rounded text-sm text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            ) : (
              <button
                onClick={() => handleRegister(e.event_id)}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Register
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
