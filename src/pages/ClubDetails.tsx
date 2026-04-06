import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Navigation from "../components/ui/navigation";
import { Calendar, Users, Loader2 } from "lucide-react";
import { getClubLogo } from "../utils/getClubLogo";

const API = "http://127.0.0.1:5000";

interface ClubEvent {
  event_id: number;
  title: string;
  date: string;
  time?: string;
  venue: string;
  description: string;
}

interface ClubDetail {
  club_id: number;
  name: string;
  category: string;
  description: string;
  members: number;
  mentor: string;
  events: ClubEvent[];
}

export default function ClubDetails() {
  const { id } = useParams();
  const [club, setClub] = useState<ClubDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API}/api/clubs/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Club not found");
        return res.json();
      })
      .then((data) => setClub(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="p-10 text-center text-gray-500 flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading club details...
        </div>
      </>
    );
  }

  if (error || !club) {
    return (
      <>
        <Navigation />
        <div className="p-10 text-center text-gray-500">
          {error || "Club not found"}
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* HEADER */}
        <div className="flex items-center gap-6 mb-8">
          {getClubLogo(club.name) ? (
            <div className="w-20 h-20 rounded-lg border overflow-hidden shrink-0 flex items-center justify-center bg-white shadow-sm">
               <img src={getClubLogo(club.name)!} alt={club.name} className="w-full h-full object-contain p-2" />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-lg bg-purple-100 flex items-center justify-center border shrink-0">
              <Users className="w-10 h-10 text-purple-600" />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold">{club.name}</h1>
            <p className="text-gray-600 mt-1">
              {club.description}
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Stat icon={<Users />} label="Members" value={club.members} />
          <Stat
            icon={<Calendar />}
            label="Upcoming Events"
            value={club.events.length}
          />
        </div>

        {/* MENTOR */}
        <div className="bg-white p-6 rounded shadow mb-8">
          <h2 className="text-xl font-semibold mb-2">
            Coordinator
          </h2>
          <p className="text-gray-700">{club.mentor}</p>
        </div>

        {/* UPCOMING EVENTS */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">
            Upcoming Events
          </h2>

          {club.events.map((event) => (
            <div
              key={event.event_id}
              className="border rounded p-4 mb-3"
            >
              <h3 className="font-semibold">{event.title}</h3>
              <p className="text-sm text-gray-500">
                {typeof event.date === 'string' ? event.date.replace(' 00:00:00', '').replace(' GMT', '').replace('GMT', '') : event.date}{event.time ? ` at ${event.time}` : ''} · {event.venue}
              </p>
              {event.description && (
                <p className="text-sm text-gray-600 mt-1">{event.description}</p>
              )}
            </div>
          ))}

          {club.events.length === 0 && (
            <p className="text-gray-500">
              No upcoming events
            </p>
          )}
        </div>
      </div>
    </>
  );
}

/* ---------- SMALL STAT COMPONENT ---------- */

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="bg-white p-5 rounded shadow flex items-center gap-3">
      <div className="text-purple-600">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  );
}
