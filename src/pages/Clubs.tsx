import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/ui/navigation";
import {
  Users,
  Search,
  Clock,
  Star,
  Code,
  Paintbrush,
  TrendingUp,
  X,
  Loader2,
  Check,
} from "lucide-react";

interface Club {
  id: number;
  name: string;
  category: string;
  description: string;
  members: number;
  events: number;
  rating: number;
  logo: string;
  nextEvent: string;
  joined: boolean;
}

export default function Clubs() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loadingState, setLoadingState] = useState<{ [key: number]: "loading" | "success" | null }>({});

  const studentId = localStorage.getItem("student_id");
  const isLoggedIn = !!studentId;

  /* ---------- CATEGORIES ---------- */
  const categories = [
    { id: "all", name: "All", icon: Users },
    { id: "tech", name: "Technical", icon: Code },
    { id: "entrepreneurship", name: "Entrepreneurship", icon: TrendingUp },
    { id: "arts", name: "Arts & Literature", icon: Paintbrush },
  ];

  /* ---------- CLUB STATE ---------- */
  const [clubs, setClubs] = useState<Club[]>([
    {
      id: 1,
      name: "MSC BV",
      category: "tech",
      description: "Microsoft Student Chapter of Banasthali Vidyapith",
      members: 220,
      events: 20,
      rating: 4.8,
      logo: "/src/assets/msc.jpg",
      nextEvent: "Tech Talk – Feb 12",
      joined: false,
    },
    {
      id: 2,
      name: "GeeksforGeeks BV",
      category: "tech",
      description: "Coding, DSA & placement-focused community",
      members: 300,
      events: 25,
      rating: 4.9,
      logo: "/src/assets/gfg.jpg",
      nextEvent: "DSA Bootcamp – Feb 15",
      joined: true,
    },
    {
      id: 3,
      name: "Google Developer Student Club",
      category: "tech",
      description: "Google-supported developer community",
      members: 180,
      events: 18,
      rating: 4.8,
      logo: "/src/assets/gdsc.jpg",
      nextEvent: "Android Workshop – Feb 20",
      joined: false,
    },
    {
      id: 4,
      name: "AlgoByte",
      category: "tech",
      description: "Competitive programming & problem solving",
      members: 150,
      events: 12,
      rating: 4.6,
      logo: "/src/assets/algob.jpg",
      nextEvent: "Code Sprint – Feb 18",
      joined: false,
    },
    {
      id: 5,
      name: "CodeChef BV",
      category: "tech",
      description: "Competitive coding and contests",
      members: 260,
      events: 22,
      rating: 4.7,
      logo: "/src/assets/codechef.jpg",
      nextEvent: "Long Challenge – Feb 10",
      joined: true,
    },
    {
      id: 6,
      name: "ACM BV",
      category: "tech",
      description: "Association for Computing Machinery student chapter",
      members: 170,
      events: 15,
      rating: 4.6,
      logo: "/src/assets/acm.jpg",
      nextEvent: "Research Talk – Feb 22",
      joined: false,
    },
    {
      id: 7,
      name: "OSCODE",
      category: "tech",
      description: "Open source development community",
      members: 140,
      events: 10,
      rating: 4.5,
      logo: "/src/assets/oscode.jpg",
      nextEvent: "Open Source Sprint – Feb 25",
      joined: false,
    },
    {
      id: 8,
      name: "E-Cell Banasthali",
      category: "entrepreneurship",
      description: "Entrepreneurship and startup culture",
      members: 200,
      events: 16,
      rating: 4.7,
      logo: "/src/assets/ecell.jpg",
      nextEvent: "Startup Bootcamp – Mar 2",
      joined: true,
    },
    {
      id: 9,
      name: "Thehrav",
      category: "arts",
      description: "Performing arts and cultural society",
      members: 120,
      events: 14,
      rating: 4.6,
      logo: "/src/assets/thehrav.jpg",
      nextEvent: "Stage Play – Feb 28",
      joined: false,
    },
    {
      id: 10,
      name: "Logos",
      category: "arts",
      description: "Literary and debating society",
      members: 110,
      events: 13,
      rating: 4.5,
      logo: "/src/assets/logos.jpg",
      nextEvent: "Debate Meet – Feb 26",
      joined: false,
    },
  ]);

  // Load follow state from backend on mount
  useEffect(() => {
    if (!studentId) return;
    fetch(`http://127.0.0.1:5000/api/clubs/following/${studentId}`)
      .then((res) => res.json())
      .then((followedIds: number[]) => {
        if (Array.isArray(followedIds)) {
          setClubs((prev) =>
            prev.map((c) => ({ ...c, joined: followedIds.includes(c.id) }))
          );
        }
      })
      .catch(() => { });
  }, [studentId]);

  /* ---------- ACTIONS ---------- */
  const followClub = async (id: number, name: string) => {
    setLoadingState(prev => ({ ...prev, [id]: "loading" }));
    if (!isLoggedIn) {
      setLoadingState(prev => ({ ...prev, [id]: null }));
      return;
    }
    try {
      await fetch("http://127.0.0.1:5000/api/clubs/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: studentId, club_id: id, club_name: name }),
      });
      setClubs((prev) => prev.map((c) => (c.id === id ? { ...c, joined: true } : c)));
      setLoadingState(prev => ({ ...prev, [id]: "success" }));
      setTimeout(() => setLoadingState(prev => ({ ...prev, [id]: null })), 2000);
    } catch {
      setLoadingState(prev => ({ ...prev, [id]: null }));
    }
  };

  const unfollowClub = async (id: number) => {
    setLoadingState(prev => ({ ...prev, [id]: "loading" }));
    if (!isLoggedIn) {
      setLoadingState(prev => ({ ...prev, [id]: null }));
      return;
    }
    try {
      await fetch("http://127.0.0.1:5000/api/clubs/unfollow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: studentId, club_id: id }),
      });
      setClubs((prev) => prev.map((c) => (c.id === id ? { ...c, joined: false } : c)));
      setLoadingState(prev => ({ ...prev, [id]: null }));
    } catch {
      setLoadingState(prev => ({ ...prev, [id]: null }));
    }
  };

  /* ---------- FILTER ---------- */
  const filteredClubs = clubs.filter(
    (club) =>
      (selectedCategory === "all" ||
        club.category === selectedCategory) &&
      (club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      <Navigation />

      <div className="min-h-screen bg-gray-50 px-6 py-10 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Explore Campus Clubs</h1>
        <p className="text-gray-500 mb-8">Official clubs of Banasthali Vidyapith University</p>

        {/* SEARCH */}
        <div className="relative max-w-md mb-8">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            className="w-full bg-white border rounded pl-10 pr-4 py-2.5 text-sm shadow-sm focus:ring-2 focus:ring-purple-200 outline-none"
            placeholder="Search clubs, tech, arts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* CATEGORY FILTER */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded border text-sm font-medium transition ${selectedCategory === cat.id
                ? "bg-purple-600 text-white border-purple-600 shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-50 shadow-sm"
                }`}
            >
              <cat.icon size={16} />
              {cat.name}
            </button>
          ))}
        </div>

        {/* CLUBS GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClubs.map((club) => (
                  <div
                    key={club.id}
                    className="relative bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition"
                  >
                    {/* UNFOLLOW */}
                    {club.joined && (
                      <button
                        onClick={() => unfollowClub(club.id)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 z-10"
                      >
                        <X size={16} />
                      </button>
                    )}

                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center p-2 border">
                        <img
                          src={club.logo}
                          alt={club.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{club.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Star size={14} className="text-yellow-500 fill-yellow-500" />
                          {club.rating}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 h-10">
                      {club.description}
                    </p>

                    <div className="flex justify-between text-xs text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Users size={14} /> {club.members} members
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} /> {club.events} events
                      </span>
                    </div>

                    <div className="bg-purple-50 p-3 rounded text-sm mb-4">
                      <span className="text-purple-700 font-semibold">Next:</span> {club.nextEvent}
                    </div>

                    {club.joined ? (
                      <button
                        onClick={() => navigate(`/clubs/${club.id}`)}
                        className="w-full py-2 rounded font-semibold text-sm border border-purple-600 text-purple-600 hover:bg-purple-50 transition"
                      >
                        View Club
                      </button>
                    ) : (
                      <button
                        disabled={loadingState[club.id] === "loading"}
                        onClick={() => followClub(club.id, club.name)}
                        className={`w-full py-2 rounded font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2 ${loadingState[club.id] === "success"
                          ? "bg-green-500 text-white"
                          : "bg-purple-600 text-white hover:bg-purple-700 disabled:bg-purple-300"
                          }`}
                      >
                        {loadingState[club.id] === "loading" ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : loadingState[club.id] === "success" ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          isLoggedIn ? "Follow Club" : "Login to Follow"
                        )}
                      </button>
                    )}
                  </div>
                ))}
        </div>
      </div>
    </>
  );
}
