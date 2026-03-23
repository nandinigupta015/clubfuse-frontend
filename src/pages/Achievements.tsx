import { Trophy } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Achievements = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // 🔐 Optional protection (recommended)
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  // For now empty achievements
  const achievements: any[] = [];

  return (
    <div className="max-w-5xl mx-auto p-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Trophy className="text-yellow-500" />
        Achievements
      </h1>

      {achievements.length === 0 ? (
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
              className="bg-white rounded-lg shadow p-6"
            >
              <h3 className="font-semibold">{a.title}</h3>
              <p className="text-sm text-gray-500">{a.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Achievements;
