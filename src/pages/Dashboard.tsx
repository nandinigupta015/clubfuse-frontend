import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/ui/navigation";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext"; // <-- Socket import
import {
  Users,
  Calendar,
  Bell,
  TrendingUp,
  Activity,
  Trophy,
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const socket = useSocket(); // <-- Socket instance
  const navigate = useNavigate();

  const studentId = localStorage.getItem("student_id");
  const roleId = localStorage.getItem("role_id");
  const isCoordinator = roleId === "2";

  const roleLabel =
    roleId === "2"
      ? "Coordinator"
      : "Student";

  const [clubs, setClubs] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]); // <-- notifications state

  // CREATE EVENT STATES
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [venue, setVenue] = useState("");
  const [description, setDescription] = useState("");

  // FETCH DASHBOARD DATA
  useEffect(() => {
    if (!studentId) return;

    const url = isCoordinator
      ? `/api/dashboard/coordinator/${studentId}`
      : `/api/dashboard/student/${studentId}`;

    fetch(`http://127.0.0.1:5000${url}`)
      .then(res => res.json())
      .then(data => {
        const clubMap = new Map();
        const eventArr: any[] = [];
        const regArr: any[] = [];

        data.forEach((r: any) => {
          if (r.club_name) {
            clubMap.set(r.club_name, {
              club_id: r.club_id,
              name: r.club_name,
              category: r.club_category || "General",
            });
          }

          if (r.event_title && r.event_date) {
            eventArr.push({
              title: r.event_title,
              date: r.event_date,
              clubName: r.club_name,
            });
          }

          if (isCoordinator && r.registrations) {
            regArr.push(r);
          }
        });

        eventArr.sort(
          (a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        const finalEvents = isCoordinator
          ? eventArr
          : eventArr.slice(0, 3);

        setClubs([...clubMap.values()]);
        setEvents(finalEvents);
        setRegistrations(regArr);
      })
      .catch(err => console.error("Dashboard fetch error:", err));

    // Fetch initial notifications
    fetch(`http://127.0.0.1:5000/api/notifications/${studentId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setNotifications(data);
        }
      })
      .catch(err => console.error("Notifications fetch error:", err));
  }, [studentId, roleId]);

  // SOCKET.IO: LISTEN FOR NEW EVENTS
  useEffect(() => {
    if (!socket) return;

    socket.on("new-event", (eventData: any) => {
      alert(`New Event: ${eventData.title} by ${eventData.clubName}`);

      // Add to events list
      setEvents(prev => [eventData, ...prev]);

      // Add to notifications
      setNotifications(prev => [
        {
          message: `New Event: ${eventData.title} by ${eventData.clubName}`,
          read_status: "unread",
          sent_time: new Date(),
        },
        ...prev,
      ]);
    });

    return () => {
      socket.off("new-event");
    };
  }, [socket]);

  // CREATE EVENT
  const handleCreateEvent = async () => {
    if (!title || !date || !time || !venue) {
      alert("Please fill all required fields");
      return;
    }

    if (!studentId || !clubs.length) {
      alert("Coordinator club not found");
      return;
    }

    const clubId = clubs[0].club_id;

    try {
      const res = await fetch("http://127.0.0.1:5000/api/create-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: studentId,
          club_id: clubId,
          title,
          date,
          time,
          venue,
          description,
          type: "technical",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Event creation failed");
        return;
      }

      alert("Event created successfully");
      setShowCreateEvent(false);
      setTitle("");
      setDate("");
      setTime("");
      setVenue("");
      setDescription("");

      navigate("/events");
    } catch (err) {
      console.error(err);
      alert("Server error while creating event");
    }
  };

  return (
    <>
      <Navigation />

      <div className="max-w-7xl mx-auto p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-2">
          {isCoordinator
            ? `Coordinator Dashboard – ${clubs[0]?.name || ""}`
            : `Welcome, ${user?.name}`}
        </h1>

        <p className="text-gray-500 mb-8">
          {isCoordinator
            ? "Manage events and registrations"
            : "Your campus engagement overview"}
        </p>

        {/* STATS */}
        <div className="grid md:grid-cols-4 gap-6 mb-10">
          <Stat icon={<Users />} label="Clubs" value={clubs.length.toString()} />
          <Stat icon={<Calendar />} label="Events" value={events.length.toString()} />
          <Stat
            icon={<Bell />}
            label={isCoordinator ? "Registrations" : "Notifications"}
            value={isCoordinator ? registrations.length.toString() : notifications.length.toString()}
          />
          <Stat
            icon={<TrendingUp />}
            label="Role"
            value={roleLabel}
          />
        </div>

        {/* CONTENT */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card title={isCoordinator ? "Managed Events" : "Upcoming Events"}>
            {events.map((e, i) => (
              <div key={i} className="border p-4 rounded mb-3">
                <h4 className="font-semibold">{e.title}</h4>
                <p className="text-sm text-purple-600">{e.clubName}</p>
                <p className="text-xs text-gray-400">{typeof e.date === 'string' ? e.date.replace(' 00:00:00', '').replace(' GMT', '').replace('GMT', '') : e.date}{e.time ? ` at ${e.time}` : ''}</p>
              </div>
            ))}
          </Card>

          <Card title={isCoordinator ? "My Club" : "My Clubs"}>
            {clubs.map((c, i) => (
              <div key={i} className="border p-4 rounded mb-3">
                <h4 className="font-semibold">{c.name}</h4>
                <p className="text-sm text-gray-500">{c.category}</p>
              </div>
            ))}
          </Card>
        </div>

        {/* ACTIONS */}
        <div className="mt-10 grid md:grid-cols-3 gap-4">
          {isCoordinator ? (
            <>
              <Action icon={<Calendar />} label="Create Event" onClick={() => setShowCreateEvent(true)} />
              <Action icon={<Users />} label="My Events" onClick={() => navigate("/events")} />
              <Action icon={<Activity />} label="Manage Club" onClick={() => navigate("/clubs")} />
            </>
          ) : (
            <>
              <Action icon={<Activity />} label="Explore Clubs" onClick={() => navigate("/clubs")} />
              <Action icon={<Calendar />} label="Browse Events" onClick={() => navigate("/events")} />
              <Action icon={<Trophy />} label="Achievements" />
            </>
          )}
        </div>
      </div>

      {/* CREATE EVENT MODAL */}
      {showCreateEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create Event</h2>

            <input
              className="w-full border p-2 mb-3 rounded"
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <input
              type="date"
              className="w-full border p-2 mb-3 rounded"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
            <input
              type="time"
              className="w-full border p-2 mb-3 rounded"
              value={time}
              onChange={e => setTime(e.target.value)}
            />
            <input
              className="w-full border p-2 mb-3 rounded"
              placeholder="Venue"
              value={venue}
              onChange={e => setVenue(e.target.value)}
            />
            <textarea
              className="w-full border p-2 mb-3 rounded"
              placeholder="Description"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button
                className="border px-4 py-2 rounded"
                onClick={() => setShowCreateEvent(false)}
              >
                Cancel
              </button>
              <button
                className="bg-purple-600 text-white px-4 py-2 rounded"
                onClick={handleCreateEvent}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;

/* ===== COMPONENTS ===== */
function Stat({ icon, label, value }: any) {
  return (
    <div className="bg-white p-6 rounded shadow flex justify-between">
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className="text-purple-600">{icon}</div>
    </div>
  );
}

function Card({ title, children }: any) {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}

function Action({ icon, label, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="bg-white border rounded p-4 flex flex-col items-center hover:shadow"
    >
      <div className="mb-2 text-purple-600">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}