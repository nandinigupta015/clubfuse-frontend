import { Trophy, Calendar, Download } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navigation from "../components/ui/navigation";

const Achievements = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔐 Optional protection (recommended)
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const studentId = localStorage.getItem("student_id");
    if (studentId) {
      fetch(`http://127.0.0.1:5000/api/achievements/${studentId}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setAchievements(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Achievements fetch error:", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <>
      <Navigation />
      <div className="max-w-5xl mx-auto p-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Trophy className="text-yellow-500" />
        Achievements
      </h1>

      {loading ? (
        <p className="text-gray-500">Loading achievements...</p>
      ) : achievements.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Trophy className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600 text-lg">
            No achievements yet
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Participate in events to earn certificates and achievements.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {achievements.map((a, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow p-6 border border-gray-100 flex gap-4 items-start"
            >
              <div className="p-3 bg-yellow-50 rounded-full">
                <Trophy className="w-8 h-8 text-yellow-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900">{a.event_title}</h3>
                <p className="text-sm font-medium text-purple-600 mb-2">{a.club_name}</p>
                
                <div className="flex items-center text-xs text-gray-500 mb-4">
                  <Calendar className="w-3 h-3 mr-1" />
                  Issued: {a.issued_date || "N/A"}
                </div>
                
                {a.certificate_url && (
                  <button className="flex items-center gap-1 text-sm text-blue-600 font-medium hover:text-blue-800 transition-colors">
                    <Download className="w-4 h-4" /> Download Certificate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
};

export default Achievements;
