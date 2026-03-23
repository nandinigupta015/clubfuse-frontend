import { useParams } from "react-router-dom";
import { useState } from "react";
import Navigation from "../components/ui/navigation";

export default function EventRegister() {
  const { eventId } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    studentId: "",
    email: "",
    department: "",
    year: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Registration Data:", formData);
    alert("✅ Registration Successful!");
  };

  return (
    <>
      <Navigation />

      <div className="min-h-screen bg-gray-50 flex justify-center items-center px-4">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
          <h1 className="text-2xl font-bold mb-2">
            Event Registration
          </h1>
          <p className="text-gray-500 mb-6">
            Event ID: {eventId}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              name="name"
              onChange={handleChange}
              required
            />
            <Input
              label="Student ID"
              name="studentId"
              onChange={handleChange}
              required
            />
            <Input
              label="Email"
              type="email"
              name="email"
              onChange={handleChange}
              required
            />
            <Input
              label="Department"
              name="department"
              onChange={handleChange}
              required
            />
            <Input
              label="Year"
              name="year"
              onChange={handleChange}
              required
            />
            <Input
              label="Phone Number"
              name="phone"
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded font-semibold hover:bg-purple-700"
            >
              Submit Registration
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

/* ---------- Reusable Input ---------- */
function Input({
  label,
  ...props
}: {
  label: string;
  [key: string]: any;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        {...props}
        className="w-full border rounded px-3 py-2"
      />
    </div>
  );
}
