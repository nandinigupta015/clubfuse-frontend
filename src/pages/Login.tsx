import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Users,
  ChevronDown,
} from "lucide-react";
import heroImage from "../assets/hero-campus.png";
import { useAuth } from "../context/AuthContext";

type Mode = "login" | "signup";
type Role = "student" | "coordinator";

export default function Login() {
  const [mode, setMode] = useState<Mode>("login");
  const [role, setRole] = useState<Role>("student");
  const [showPassword, setShowPassword] = useState(false);

  // common
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // signup-only
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [dept, setDept] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [departments, setDepartments] = useState<any[]>([]);


  const [clubId, setClubId] = useState("");

  const [clubs, setClubs] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  /* ================= LOAD CLUBS ================= */
  useEffect(() => {
    // Fetch clubs
    fetch("http://127.0.0.1:5000/api/clubs")
      .then(res => res.json())
      .then(data => setClubs(data))
      .catch(() => { });

    // Fetch departments
    fetch("http://127.0.0.1:5000/api/departments")
      .then(res => res.json())
      .then(data => setDepartments(data))
      .catch(() => { });
  }, []);


  /* ================= VALIDATIONS ================= */
  const isBanasthaliEmail = (email: string) =>
    email.trim().endsWith("@banasthali.in");

  const isValidPhone = (phone: string) =>
    /^[0-9]{10}$/.test(phone.trim());

  const isValidPassword = (password: string) =>
    password.length >= 6 && /\d/.test(password);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!isBanasthaliEmail(email)) {
      setMessage("Only @banasthali.in email is allowed");
      return;
    }

    if (mode === "signup" && !isValidPhone(phone)) {
      setMessage("Phone number must be exactly 10 digits");
      return;
    }

    if (mode === "signup" && !isValidPassword(password)) {
      setMessage("Password must be at least 6 characters long and contain at least one number");
      return;
    }

    if (mode === "signup" && role === "coordinator" && !clubId) {
      setMessage("Please select a club");
      return;
    }

    try {
      if (mode === "login") {
        /* ================= LOGIN ================= */
        const res = await fetch("http://127.0.0.1:5000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        });

        const data = await res.json();

        if (data.status === "success") {
          // 🔧 FIX: Normalize the role_name returned by the DB ("Student","Coordinator")
          //         to the lowercase union type used by AuthContext
          const rawRole = (data.role_name as string)?.toLowerCase() as
            | "student"
            | "coordinator";

          login({
            name: data.name,
            email,
            role: rawRole,
          });

          localStorage.setItem("student_id", data.student_id);
          localStorage.setItem("role_id", data.role_id);

          navigate("/dashboard");
        } else {
          setMessage("Invalid email or password");
        }
      } else {
        /* ================= SIGNUP ================= */
        const res = await fetch("http://127.0.0.1:5000/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            student_id: studentId.trim(),
            name: name.trim(),
            email: email.trim(),
            dept: dept.trim(),
            phone: `${countryCode}${phone.trim()}`,

            password,
            role_id:
              role === "student"
                ? 1
                : 2, // coordinator
            club_id: role === "coordinator" ? clubId : null,
          }),
        });

        const data = await res.json();

        if (data.status === "success") {
          setMessage("Signup successful! Please login.");
          setMode("login");

          setStudentId("");
          setName("");
          setDept("");
          setPhone("");
          setCountryCode("+91");

          setClubId("");
          setPassword("");
        } else {
          setMessage(data.error || "Signup failed");
        }
      }
    } catch {
      setMessage("Server error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-lg bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-600">
            <Users className="text-white" />
          </div>
          <h2 className="text-2xl font-bold">Welcome to ClubFuse</h2>
          <p className="text-gray-500 text-sm">
            Your gateway to campus engagement
          </p>
        </div>

        {/* Tabs */}
        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            className={`flex-1 py-2 rounded-md text-sm font-medium ${mode === "login"
                ? "bg-white shadow text-purple-600"
                : "text-gray-500"
              }`}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 rounded-md text-sm font-medium ${mode === "signup"
                ? "bg-white shadow text-purple-600"
                : "text-gray-500"
              }`}
            onClick={() => setMode("signup")}
          >
            Sign Up
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <>
              {/* ROLE */}
              <div className="relative">
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as Role)}
                  className="w-full border rounded-lg p-2 pr-10"
                >
                  <option value="student">Student</option>
                  <option value="coordinator">Coordinator</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              </div>

              {/* CLUB SELECT */}
              {role === "coordinator" && (
                <select
                  className="w-full border rounded-lg p-2"
                  value={clubId}
                  onChange={e => setClubId(e.target.value)}
                >
                  <option value="">Select Club</option>
                  {clubs.map((c: any) => (
                    <option key={c.club_id} value={c.club_id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              )}

              <input className="w-full border rounded-lg p-2" placeholder="ID" value={studentId} onChange={e => setStudentId(e.target.value)} required />
              <input className="w-full border rounded-lg p-2" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
              <select
                className="w-full border rounded-lg p-2"
                value={dept}
                onChange={e => setDept(e.target.value)}
                required
              >
                <option value="">Select Department</option>
                {departments.map((d: any) => (
                  <option key={d.dept_id} value={d.dept_name}>
                    {d.dept_name}
                  </option>
                ))}
              </select>

              <div className="flex gap-2">
                <select
                  className="border rounded-lg p-2 w-36"
                  value={countryCode}
                  onChange={e => setCountryCode(e.target.value)}
                >
                  <option value="+61">🇦🇺 Australia (+61)</option>
                  <option value="+55">🇧🇷 Brazil (+55)</option>
                  <option value="+86">🇨🇳 China (+86)</option>
                  <option value="+33">🇫🇷 France (+33)</option>
                  <option value="+49">🇩🇪 Germany (+49)</option>
                  <option value="+91">🇮🇳 India (+91)</option>
                  <option value="+39">🇮🇹 Italy (+39)</option>
                  <option value="+81">🇯🇵 Japan (+81)</option>
                  <option value="+7">🇷🇺 Russia (+7)</option>
                  <option value="+27">🇿🇦 South Africa (+27)</option>
                  <option value="+82">🇰🇷 South Korea (+82)</option>
                  <option value="+34">🇪🇸 Spain (+34)</option>
                  <option value="+971">🇦🇪 UAE (+971)</option>
                  <option value="+44">🇬🇧 UK (+44)</option>
                  <option value="+1">🇺🇸 USA (+1)</option>
                </select>


                <input
                  className="w-full border rounded-lg p-2"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                />
              </div>

            </>
          )}

          {/* EMAIL */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border rounded-lg pl-10 p-2"
              placeholder="Email (@banasthali.in)"
            />
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border rounded-lg pl-10 pr-10 p-2"
              placeholder="Password"
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold"
          >
            {mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        {message && (
          <p className="text-center text-sm text-red-500 mt-4">
            {message}
          </p>
        )}

        <p className="text-center text-sm text-gray-500 mt-4">
          <Link to="/" className="text-purple-600 hover:underline">
            Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
}
