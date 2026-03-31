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
  Layers,
} from "lucide-react";
import { getClubLogo } from "../utils/getClubLogo";

interface Club {
  club_id: number;
  name: string;
  category: string;
  description: string;
  members: number;
  events: number;
  nextEvent: string;
  joined: boolean;
  coordinator_of: boolean;
}

const API = "http://127.0.0.1:5000";

export default function Clubs() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loadingState, setLoadingState] = useState<{ [key: number]: "loading" | "success" | null }>({});
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  const studentId = localStorage.getItem("student_id");
  const roleId = localStorage.getItem("role_id");
  const isCoordinator = roleId === "2";
  const isLoggedIn = !!studentId;

  /* ---------- CATEGORIES ---------- */
  const categories = [
    { id: "all", name: "All", icon: Layers },
    { id: "tech", name: "Technical", icon: Code },
    { id: "entrepreneurship", name: "Entrepreneurship", icon: TrendingUp },
    { id: "arts", name: "Arts & Literature", icon: Paintbrush },
  ];

  /* ---------- FETCH CLUBS FROM BACKEND ---------- */
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await fetch(`${API}/api/clubs`);
        const data = await res.json();

        let followedIds: number[] = [];
        let coordinatorClubId: number | null = null;
        
        if (studentId) {
          if (isCoordinator) {
            // Fetch dashboard to get their assigned club
            const dashRes = await fetch(`${API}/api/dashboard/coordinator/${studentId}`);
            const dashData = await dashRes.json();
            if (Array.isArray(dashData) && dashData.length > 0) {
              coordinatorClubId = dashData[0].club_id;
            }
          } else {
            const followRes = await fetch(`${API}/api/clubs/following/${studentId}`);
            const followData = await followRes.json();
            if (Array.isArray(followData)) followedIds = followData;
          }
        }

        setClubs(
          data.map((c: any) => ({
            club_id: c.club_id,
            name: c.name,
            category: (c.category || "general").toLowerCase(),
            description: c.description || "",
            members: c.members || 0,
            events: c.events || 0,
            nextEvent: c.nextEvent || "No upcoming events",
            joined: followedIds.includes(c.club_id),
            coordinator_of: isCoordinator && c.club_id === coordinatorClubId,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch clubs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, [studentId]);

  /* ---------- ACTIONS ---------- */
  const followClub = async (id: number, name: string) => {
    setLoadingState(prev => ({ ...prev, [id]: "loading" }));
    if (!isLoggedIn) {
      setLoadingState(prev => ({ ...prev, [id]: null }));
      return;
    }
    try {
      await fetch(`${API}/api/clubs/follow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: studentId, club_id: id, club_name: name }),
      });
      setClubs((prev) => prev.map((c) => (c.club_id === id ? { ...c, joined: true } : c)));
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
      await fetch(`${API}/api/clubs/unfollow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: studentId, club_id: id }),
      });
      setClubs((prev) => prev.map((c) => (c.club_id === id ? { ...c, joined: false } : c)));
      setLoadingState(prev => ({ ...prev, [id]: null }));
    } catch {
      setLoadingState(prev => ({ ...prev, [id]: null }));
    }
  };

  /* ---------- FILTER ---------- */
  const visibleClubs = isCoordinator 
    ? clubs.filter(c => c.coordinator_of)
    : clubs;

  const filteredClubs = visibleClubs.filter(
    (club) =>
      (selectedCategory === "all" ||
        club.category === selectedCategory) &&
      (club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  /* ---------- HELPER: LOGO ICON ---------- */
  const getClubIcon = (category: string) => {
    switch (category) {
      case "tech":
      case "technical": return <Code className="w-6 h-6 text-blue-600" />;
      case "entrepreneurship": return <TrendingUp className="w-6 h-6 text-green-600" />;
      case "arts":
      case "arts & literature": return <Paintbrush className="w-6 h-6 text-pink-600" />;
      default: return <Users className="w-6 h-6 text-purple-600" />;
    }
  };

  const getClubBg = (category: string) => {
    switch (category) {
      case "tech":
      case "technical": return "bg-blue-100 border-blue-200";
      case "entrepreneurship": return "bg-green-100 border-green-200";
      case "arts":
      case "arts & literature": return "bg-pink-100 border-pink-200";
      default: return "bg-purple-100 border-purple-200";
    }
  };

  return (
    <>
      <Navigation />

      <div className="min-h-screen bg-gray-50 px-6 py-10 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">
          {isCoordinator ? "Manage Your Club" : "Explore Campus Clubs"}
        </h1>
        <p className="text-gray-500 mb-8">
          {isCoordinator 
            ? "Overview of your assigned club and details" 
            : "Official clubs of Banasthali Vidyapith University"}
        </p>

        {/* SEARCH (Hidden for coordinator since they only see 1 club) */}
        {!isCoordinator && (
          <div className="relative max-w-md mb-8">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              className="w-full bg-white border rounded pl-10 pr-4 py-2.5 text-sm shadow-sm focus:ring-2 focus:ring-purple-200 outline-none"
              placeholder="Search clubs, tech, arts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        {/* CATEGORY FILTER (Hidden for coordinator) */}
        {!isCoordinator && (
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
        )}

        {/* LOADING STATE */}
        {loading && <p className="text-gray-500">Loading clubs...</p>}

        {/* CLUBS GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClubs.map((club) => (
                  <div
                    key={club.club_id}
                    className="relative bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition"
                  >
                    {/* UNFOLLOW */}
                    {club.joined && !isCoordinator && (
                      <button
                        onClick={() => unfollowClub(club.club_id)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 z-10"
                      >
                        <X size={16} />
                      </button>
                    )}

                    <div className="flex items-center gap-4 mb-4">
                      {getClubLogo(club.name) ? (
                        <div className="w-12 h-12 rounded-lg border overflow-hidden shrink-0 flex items-center justify-center bg-white shadow-sm">
                           <img src={getClubLogo(club.name)!} alt={club.name} className="w-full h-full object-contain p-1" />
                        </div>
                      ) : (
                        <div className={`w-12 h-12 rounded-lg shrink-0 flex items-center justify-center p-2 border ${getClubBg(club.category)}`}>
                          {getClubIcon(club.category)}
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-lg leading-tight">{club.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                          <Star size={14} className="text-yellow-500 fill-yellow-500" />
                          {club.category}
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

                    {isCoordinator ? (
                      <button
                        onClick={() => navigate("/dashboard")}
                        className="w-full py-2 rounded font-semibold text-sm border border-purple-600 bg-purple-600 text-white hover:bg-purple-700 transition"
                      >
                        Go to Coordinator Dashboard
                      </button>
                    ) : club.joined ? (
                      <button
                        onClick={() => navigate(`/clubs/${club.club_id}`)}
                        className="w-full py-2 rounded font-semibold text-sm border border-purple-600 text-purple-600 hover:bg-purple-50 transition"
                      >
                        View Club
                      </button>
                    ) : (
                      <button
                        disabled={loadingState[club.club_id] === "loading"}
                        onClick={() => followClub(club.club_id, club.name)}
                        className={`w-full py-2 rounded font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2 ${loadingState[club.club_id] === "success"
                          ? "bg-green-500 text-white"
                          : "bg-purple-600 text-white hover:bg-purple-700 disabled:bg-purple-300"
                          }`}
                      >
                        {loadingState[club.club_id] === "loading" ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : loadingState[club.club_id] === "success" ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          isLoggedIn ? "Follow Club" : "Login to Follow"
                        )}
                      </button>
                    )}
                  </div>
                ))}
        </div>

        {!loading && filteredClubs.length === 0 && (
          <p className="text-gray-500 text-center mt-8">No clubs found matching your search.</p>
        )}
      </div>
    </>
  );
}
