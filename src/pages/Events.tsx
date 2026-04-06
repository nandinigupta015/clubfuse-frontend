import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Calendar, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/ui/navigation";

const Events = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const studentId = user ? localStorage.getItem("student_id") : null;
  const roleId = user ? localStorage.getItem("role_id") : null;
  const isCoordinator = user && roleId === "2";

  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [registeredEventIds, setRegisteredEventIds] = useState<number[]>([]);

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

    if (studentId && !isCoordinator) {
      fetch(`http://127.0.0.1:5000/api/registrations/${studentId}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setRegisteredEventIds(data);
          }
        })
        .catch(err => console.error("Error fetching registrations:", err));
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ================= REGISTER FOR EVENT ================= */

  const handleRegister = (eventId: number) => {
    if (!user || !studentId) {
      navigate("/login");
      return;
    }
    navigate(`/event-register/${eventId}`);
  };

  /* ================= DELETE EVENT ================= */

  const handleDelete = async (eventId: number) => {
    if (!user || !isCoordinator || !studentId) return;

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

      setConfirmDeleteId(null);
      fetchEvents();
    } catch {
      alert("Server error. Please try again.");
    }
  };

  /* ================= UI ================= */

  return (
    <>
      <Navigation />
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

        {!loading && events.length > 0 && (
          <>
            <div className="grid md:grid-cols-2 gap-6 mb-16">
              {events
                .filter((e: any) => new Date(e.date).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0))
                .map((e: any) => renderEventCard(e, false))}
            </div>

            {events.some((e: any) => new Date(e.date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) && (
              <>
                <h2 className="text-2xl font-bold mb-6 text-gray-500 border-t pt-8">Past Events</h2>
                <div className="grid md:grid-cols-2 gap-6 opacity-75">
                  {events
                    .filter((e: any) => new Date(e.date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0))
                    .map((e: any) => renderEventCard(e, true))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );

  function renderEventCard(e: any, isPast: boolean) {
    return (
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
                {typeof e.date === 'string' ? e.date.replace(' 00:00:00', '').replace(' GMT', '').replace('GMT', '') : e.date}{e.time ? ` at ${e.time}` : ''}
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
                confirmDeleteId === e.event_id ? (
                  <div className="flex items-center gap-3 mt-4">
                    <span className="text-sm text-gray-600">Delete this event?</span>
                    <button
                      type="button"
                      onClick={() => handleDelete(e.event_id)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Yes, Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(null)}
                      className="border px-3 py-1 rounded text-sm text-gray-600 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteId(e.event_id)}
                    className="border px-3 py-1 rounded text-sm text-red-600 hover:bg-red-50 mt-4"
                  >
                    Delete
                  </button>
                )
              ) : isPast ? (
                <button
                  type="button"
                  disabled
                  className="bg-gray-200 text-gray-500 px-4 py-2 rounded cursor-not-allowed font-medium mt-4"
                >
                  Ended
                </button>
              ) : registeredEventIds.includes(e.event_id) ? (
                <button
                  type="button"
                  disabled
                  className="bg-gray-100 text-gray-500 px-4 py-2 rounded cursor-not-allowed font-medium mt-4"
                >
                  Registered
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleRegister(e.event_id)}
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 mt-4"
                >
                  Register
                </button>
              )}
            </div>
    );
  }
};

export default Events;
