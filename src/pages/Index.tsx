import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "../components/ui/navigation";
import { useAuth } from "../context/AuthContext";
import {
  Users,
  Calendar,
  Trophy,
  ArrowRight,
  Activity,
} from "lucide-react";

import banasthaliLogo from "../assets/banasthali.jpg";
import campusImage from "../assets/banasthali-campus.png";
import { getClubLogo } from "../utils/getClubLogo";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isCoordinator = user && localStorage.getItem("role_id") === "2";
  const studentId = localStorage.getItem("student_id");
  const [featuredEvents, setFeaturedEvents] = useState<any[]>([]);
  const [allClubs, setAllClubs] = useState<{ club_id: number; name: string }[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/clubs")
      .then((res) => res.json())
      .then((data) => setAllClubs(data.map((c: any) => ({ club_id: c.club_id, name: c.name }))))
      .catch(() => {});

    const url = isCoordinator
      ? `http://127.0.0.1:5000/api/events/coordinator/${studentId}`
      : `http://127.0.0.1:5000/api/events/student/guest`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const upcoming = data.filter((e: any) => new Date(e.date).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0));
          setFeaturedEvents(upcoming.slice(0, 3));
        } else {
          setFeaturedEvents([]);
        }
      })
      .catch(() => {});
  }, [isCoordinator, studentId]);

  return (
    <div className="min-h-screen">
      {/* NAVIGATION */}
      <Navigation />

      {/* HERO */}
      <section
        className="min-h-[85vh] flex items-center justify-center text-white text-center px-6 relative"
        style={{
          backgroundImage: `linear-gradient(rgba(88,28,135,0.85), rgba(88,28,135,0.85)), url(${campusImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-4xl relative z-10">
          <img
            src={banasthaliLogo}
            alt="Banasthali Vidyapith"
            className="mx-auto mb-6 w-24 h-24 object-contain bg-white rounded-full p-2"
          />

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            ClubFuse
          </h1>

          <p className="text-xl mb-8 text-gray-100">
            A unified digital platform for clubs, events, and student engagement
            at Banasthali Vidyapith
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/clubs"
              className="border border-white px-6 py-3 rounded hover:bg-white hover:text-purple-700 transition"
            >
              Explore Clubs
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <Stat icon={<Users className="w-6 h-6" />} value="30+" label="Active Communities" />
          <Stat icon={<Calendar className="w-6 h-6" />} value="150+" label="Annual Events" />
          <Stat icon={<Activity className="w-6 h-6" />} value="6000+" label="Engaged Students" />
          <Stat icon={<Trophy className="w-6 h-6" />} value="800+" label="Milestones" />
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight mb-2">Upcoming Events - Discover</h2>
            <p className="text-gray-500 font-medium">Join the latest buzzing events on campus</p>
          </div>
          <Link to="/events" className="text-purple-600 font-bold flex items-center gap-2 group">
            See All Events <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {featuredEvents.filter((e) => new Date(e.date).setHours(0,0,0,0) >= new Date().setHours(0,0,0,0)).map((event) => {
            const logo = getClubLogo(event.club_name);
            return (
              <div
                key={event.event_id || Math.random()}
                onClick={() => navigate("/events")}
                className="cursor-pointer bg-white/60 backdrop-blur-md border border-white/80 p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all ring-1 ring-black/5 flex flex-col items-center text-center"
              >
                {logo ? (
                  <div className="w-20 h-20 mb-6 bg-white shadow-sm border p-2 shrink-0 rounded-[1.5rem]">
                    <img src={logo} alt={event.club_name} className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <div className="text-4xl mb-6 bg-purple-50 w-20 h-20 flex items-center justify-center rounded-[1.5rem]">
                    🎟️
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-1 leading-tight">{event.title}</h3>
                <p className="text-purple-600 font-bold mb-4">{event.club_name}</p>
                <div className="flex items-center justify-center gap-4 text-sm font-semibold text-gray-500 mt-2 border-t pt-4 border-gray-100 w-full">
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{typeof event.date === 'string' ? event.date.replace(' 00:00:00', '').replace(' GMT', '').replace('GMT', '') : event.date}{event.time ? ` at ${event.time}` : ''}</span>
                  <span className="text-purple-700">{event.venue}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CLUB MARQUEE */}
      <section className="py-24 overflow-hidden relative">
        <div className="absolute inset-0 bg-purple-600/5 -skew-y-2 -z-10" />
        <h2 className="text-3xl font-extrabold text-center mb-12 tracking-tight">Trusted Communities</h2>

        <div className="flex gap-8 animate-marquee whitespace-nowrap px-6">
          {[...allClubs, ...allClubs].map((club, i) => {
            const logo = getClubLogo(club.name);
            return (
              <div
                key={`${club.club_id}-${i}`}
                onClick={() => navigate(`/clubs/${club.club_id}`)}
                className="cursor-pointer min-w-[280px] bg-white/80 backdrop-blur-md px-8 py-6 rounded-3xl shadow-sm border border-white hover:border-purple-200 transition-all text-center ring-1 ring-black/5 flex flex-col items-center justify-center gap-3"
              >
                {logo && (
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border p-2 shrink-0">
                    <img src={logo} alt={club.name} className="w-full h-full object-contain" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{club.name}</h3>
                  <p className="text-xs font-bold text-purple-600 mt-1 uppercase tracking-widest">
                    OFFICIAL
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-[#0d0c15] text-white text-center px-6 relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-5xl font-extrabold mb-6 tracking-tight">
            Ready to shape your campus legacy?
          </h2>
          <p className="text-xl mb-12 text-gray-400 font-medium">
            Join thousands of students growing, learning, and leading at Banasthali.
          </p>

          <Link
            to="/login"
            className="bg-white text-gray-900 px-10 py-5 rounded-2xl font-bold text-lg inline-flex items-center gap-2 hover:scale-105 transition-all shadow-xl hover:shadow-white/10"
          >
            Create Your Account <ArrowRight size={22} />
          </Link>
        </div>

        {/* Abstract shapes for CTA */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full" />
      </section>

      {/* FOOTER */}
      <footer className="py-10 bg-white text-center text-sm text-gray-500">
        © 2026 ClubFuse · Banasthali Vidyapith
      </footer>
    </div>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div>
      <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center bg-purple-100 text-purple-600 rounded-full">
        {icon}
      </div>
      <h3 className="text-3xl font-bold">{value}</h3>
      <p className="text-gray-500">{label}</p>
    </div>
  );
}
