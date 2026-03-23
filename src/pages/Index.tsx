import { Link, useNavigate } from "react-router-dom";
import Navigation from "../components/ui/navigation";
import {
  Users,
  Calendar,
  Trophy,
  ArrowRight,
  Activity,
} from "lucide-react";

import banasthaliLogo from "../assets/banasthali.jpg";
import campusImage from "../assets/banasthali-campus.png";

export default function Home() {
  const navigate = useNavigate();

  const featuredEvents = [
    {
      id: 1,
      title: "DSA Bootcamp",
      club: "ACM Banasthali",
      date: "Feb 20",
      time: "10:00 AM",
      attendees: 80,
      image: "💻",
    },
    {
      id: 2,
      title: "Hack The Horizon",
      club: "AlgoByte",
      date: "Feb 25",
      time: "9:00 AM",
      attendees: 120,
      image: "🚀",
    },
    {
      id: 3,
      title: "Orientation Session 2026",
      club: "Therav",
      date: "Feb 18",
      time: "3:00 PM",
      attendees: 200,
      image: "🎭",
    },
  ];

  const allClubs = [
    { id: 1, name: "MSC BV" },
    { id: 2, name: "GeeksforGeeks BV" },
    { id: 3, name: "GDSC Banasthali" },
    { id: 4, name: "AlgoByte" },
    { id: 5, name: "CodeChef BV" },
    { id: 6, name: "ACM BV" },
    { id: 7, name: "OSCODE" },
    { id: 8, name: "E-Cell Banasthali" },
    { id: 9, name: "Thehrav" },
    { id: 10, name: "Logos" },
  ];

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
              to="/login"
              className="bg-white text-purple-700 px-6 py-3 rounded font-semibold flex items-center gap-2"
            >
              Get Started <ArrowRight size={18} />
            </Link>

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
            <h2 className="text-4xl font-extrabold tracking-tight mb-2">Live Now – Discover</h2>
            <p className="text-gray-500 font-medium">Join the latest buzzing events on campus</p>
          </div>
          <Link to="/events" className="text-purple-600 font-bold flex items-center gap-2 group">
            See All Events <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {featuredEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => navigate("/events")}
              className="cursor-pointer bg-white/60 backdrop-blur-md border border-white/80 p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all ring-1 ring-black/5"
            >
              <div className="text-4xl mb-6 bg-purple-50 w-16 h-16 flex items-center justify-center rounded-2xl">{event.image}</div>
              <h3 className="text-2xl font-bold mb-1 leading-tight">{event.title}</h3>
              <p className="text-purple-600 font-bold mb-4">{event.club}</p>
              <div className="flex items-center justify-between text-sm font-semibold text-gray-500 mt-2 border-t pt-4 border-gray-100">
                <span>{event.date} · {event.time}</span>
                <span className="text-purple-700">{event.attendees}+ Joined</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CLUB MARQUEE */}
      <section className="py-24 overflow-hidden relative">
        <div className="absolute inset-0 bg-purple-600/5 -skew-y-2 -z-10" />
        <h2 className="text-3xl font-extrabold text-center mb-12 tracking-tight">Trusted Communities</h2>

        <div className="flex gap-8 animate-marquee whitespace-nowrap px-6">
          {[...allClubs, ...allClubs].map((club, i) => (
            <div
              key={`${club.id}-${i}`}
              onClick={() => navigate(`/clubs/${club.id}`)}
              className="cursor-pointer min-w-[280px] bg-white/80 backdrop-blur-md px-8 py-6 rounded-3xl shadow-sm border border-white hover:border-purple-200 transition-all text-center ring-1 ring-black/5"
            >
              <h3 className="text-lg font-bold text-gray-900">{club.name}</h3>
              <p className="text-xs font-bold text-purple-600 mt-1 uppercase tracking-widest">
                OFFICIAL
              </p>
            </div>
          ))}
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
