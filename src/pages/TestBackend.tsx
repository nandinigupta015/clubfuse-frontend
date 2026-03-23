import { useEffect, useState } from "react";

function TestBackend() {
  const [msg, setMsg] = useState("Connecting to backend...");

  useEffect(() => {
    fetch("http://localhost:5000/api/test")
      .then((res) => res.json())
      .then((data) => setMsg(data.message))
      .catch(() => setMsg("❌ Backend not reachable"));
  }, []);

  return (
    <div style={{ padding: "40px", fontSize: "22px" }}>
      <h2>Backend Connection Test</h2>
      <p>{msg}</p>
    </div>
  );
}

export default TestBackend;
