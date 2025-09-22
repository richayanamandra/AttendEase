import React, { useEffect, useState } from "react";

const API = "https://bf39nos9jf.execute-api.us-east-1.amazonaws.com/get-complaints";

function formatDate(isoOrYMD) {
  if (!isoOrYMD) return "N/A";
  try {
    const d = new Date(isoOrYMD);
    if (isNaN(d)) return isoOrYMD;
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return isoOrYMD;
  }
}

export default function Complain() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComplaints = async (signal) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API, { signal });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const json = await res.json();
      // API returns { complaints: [...] }
      const list = Array.isArray(json.complaints) ? json.complaints : [];
      setComplaints(list);
    } catch (err) {
      if (err.name !== "AbortError") setError(err.message || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const ac = new AbortController();
    fetchComplaints(ac.signal);
    return () => ac.abort();
  }, []);

  return (
    <div className="w-[90%] container mx-auto text-white">
      <div className="border border-gray-700 rounded-2xl mt-6 p-4 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-red-500">COMPLAINTS</h1>
          <p className="text-sm text-gray-400 mt-1">Latest complaints submitted by parents/students</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchComplaints()}
            className="px-3 py-1 rounded-md bg-[#0b1220] border border-gray-700 text-sm hover:bg-[#0f1720]"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* status */}
      <div className="mt-4">
        {loading && (
          <div className="text-gray-400">Loading complaints…</div>
        )}

        {error && (
          <div className="text-red-400 flex items-center gap-3">
            <span>Failed to load: {error}</span>
            <button
              onClick={() => fetchComplaints()}
              className="px-2 py-1 text-sm bg-[#0b1220] border border-gray-700 rounded-md"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && complaints.length === 0 && (
          <div className="text-gray-400">No complaints found.</div>
        )}
      </div>

      {/* list */}
      {!loading && !error && complaints.length > 0 && (
        <ul className="grid gap-4 mt-4">
          {complaints.map((c, idx) => {
            // create a key - prefer roll number else fallback to index
            const key = c.studentRollNumber ? c.studentRollNumber + "-" + c.dateofComplaint : `${idx}-${c.dateofComplaint}`;

            return (
              <li key={key} className="bg-[#181b20] border border-gray-800 rounded-2xl p-4">
                <div className="flex items-center justify-between gap-4 ">
                  {/* left: student info */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                    </div>

                    <div className="text-sm text-gray-400">
                      <div><span className="text-gray-300">Date:</span> {formatDate(c.dateofComplaint)}</div>
                    </div>
                  </div>

                  {/* right: message */}
                  <div className="flex-1 pl-6">
                    <div className="bg-[#0f1720] border border-gray-800 rounded-xl p-4 text-gray-200 leading-relaxed">
                      {c.complaintMessage+" !" || <span className="text-gray-500">No message provided</span>}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
