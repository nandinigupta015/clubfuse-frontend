import { useParams } from "react-router-dom";
import Navigation from "../components/ui/navigation";
import { Calendar, Users } from "lucide-react";

const clubs = [
  {
    id: 1,
    name: "MSC BV",
    description:
      "Microsoft Student Chapter of Banasthali Vidyapith focuses on cloud, AI, and development technologies.",
    mentor: "Dr. Neha Sharma",
    logo: "/src/assets/msc.jpg",
    members: 220,
    events: [
      {
        title: "Tech Talk on Azure",
        date: "12 Feb 2026",
        venue: "Apaji Auditorium",
      },
      {
        title: "AI Bootcamp",
        date: "22 Feb 2026",
        venue: "Lab 301",
      },
    ],
  },
  {
    id: 2,
    name: "GeeksforGeeks BV",
    description:
      "A DSA and placement-oriented community helping students crack technical interviews.",
    mentor: "Prof. Ritu Agarwal",
    logo: "/src/assets/gfg.jpg",
    members: 300,
    events: [
      {
        title: "DSA Bootcamp",
        date: "15 Feb 2026",
        venue: "Lab 204",
      },
    ],
  },
  {
    id: 3,
    name: "Google Developer Student Club",
    description:
      "Google-supported developer community focusing on real-world solutions using technology.",
    mentor: "Dr. Pooja Verma",
    logo: "/src/assets/gdsc.jpg",
    members: 180,
    events: [
      {
        title: "Android Development Workshop",
        date: "20 Feb 2026",
        venue: "Computer Lab 2",
      },
    ],
  },
  {
    id: 4,
    name: "AlgoByte",
    description:
      "Competitive programming and problem-solving focused club for coding enthusiasts.",
    mentor: "Dr. Amit Jain",
    logo: "/src/assets/algob.jpg",
    members: 150,
    events: [
      {
        title: "Hack The Horizon",
        date: "25 Feb 2026",
        venue: "AI Centre Auditorium",
      },
    ],
  },
  {
    id: 5,
    name: "CodeChef BV",
    description:
      "Competitive coding community conducting contests and long challenges.",
    mentor: "Prof. Sunita Meena",
    logo: "/src/assets/codechef.jpg",
    members: 260,
    events: [
      {
        title: "CodeChef Long Challenge",
        date: "10 Feb 2026",
        venue: "Online",
      },
    ],
  },
  {
    id: 6,
    name: "ACM BV",
    description:
      "Association for Computing Machinery student chapter promoting research and innovation.",
    mentor: "Dr. Rakesh Gupta",
    logo: "/src/assets/acm.jpg",
    members: 170,
    events: [
      {
        title: "Research Paper Writing Session",
        date: "22 Feb 2026",
        venue: "Seminar Hall",
      },
    ],
  },
  {
    id: 7,
    name: "OSCODE",
    description:
      "Open-source development community contributing to global open-source projects.",
    mentor: "Dr. Kiran Joshi",
    logo: "/src/assets/oscode.jpg",
    members: 140,
    events: [
      {
        title: "Open Source Sprint",
        date: "25 Feb 2026",
        venue: "Innovation Lab",
      },
    ],
  },
  {
    id: 8,
    name: "E-Cell Banasthali",
    description:
      "Entrepreneurship Cell promoting startup culture and innovation among students.",
    mentor: "Prof. Neelam Saxena",
    logo: "/src/assets/ecell.jpg",
    members: 200,
    events: [
      {
        title: "Women Entrepreneurship Development Program",
        date: "28 Feb 2026",
        venue: "Nav Mandir Auditorium",
      },
    ],
  },
  {
    id: 9,
    name: "Thehrav",
    description:
      "Performing arts and cultural society celebrating theatre, dance, and drama.",
    mentor: "Dr. Anjali Mishra",
    logo: "/src/assets/thehrav.jpg",
    members: 120,
    events: [
      {
        title: "Annual Stage Play",
        date: "28 Feb 2026",
        venue: "Ratan Mandir",
      },
    ],
  },
  {
    id: 10,
    name: "Logos",
    description:
      "Literary and debating society fostering critical thinking and expression.",
    mentor: "Prof. Kavita Sharma",
    logo: "/src/assets/logos.jpg",
    members: 110,
    events: [
      {
        title: "Inter-College Debate Meet",
        date: "26 Feb 2026",
        venue: "Lecture Hall 1",
      },
    ],
  },
];

export default function ClubDetails() {
  const { id } = useParams();
  const club = clubs.find((c) => c.id === Number(id));

  if (!club) {
    return (
      <>
        <Navigation />
        <div className="p-10 text-center text-gray-500">
          Club not found
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
          <img
            src={club.logo}
            alt={club.name}
            className="w-20 h-20 object-contain"
          />
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
            Faculty Mentor
          </h2>
          <p className="text-gray-700">{club.mentor}</p>
        </div>

        {/* UPCOMING EVENTS */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">
            Upcoming Events
          </h2>

          {club.events.map((event, index) => (
            <div
              key={index}
              className="border rounded p-4 mb-3"
            >
              <h3 className="font-semibold">{event.title}</h3>
              <p className="text-sm text-gray-500">
                {event.date} · {event.venue}
              </p>
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
