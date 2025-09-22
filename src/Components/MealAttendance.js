import React, { useEffect, useState } from "react";

export default function MealAttendance({ stud }) {
  const [present, setPresent] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!stud) {
      setPresent(false);
      setLoading(false);
      return;
    }

    const ac = new AbortController();

    const fetchInfo = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          "https://bf39nos9jf.execute-api.us-east-1.amazonaws.com/midday-analytics",
          { signal: ac.signal }
        );
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();

        // format today's date as YYYY-MM-DD (local)
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const dd = String(today.getDate()).padStart(2, "0");
        const todayStr = `${yyyy}-${mm}-${dd}`;

        const found = data.find((rec) => {
          if (rec.date !== todayStr) return false;

          // Prefer rollNumber match if present in record and stud
          if (rec.rollNumber && stud.rollNumber) {
            return String(rec.rollNumber) === String(stud.rollNumber);
          }

          // Fallback to matching firstName + lastName (case-insensitive)
          if (rec.firstName && rec.lastName && stud.firstName && stud.lastName) {
            return (
              rec.firstName.toLowerCase().trim() === stud.firstName.toLowerCase().trim() &&
              rec.lastName.toLowerCase().trim() === stud.lastName.toLowerCase().trim()
            );
          }

          return false;
        });

        setPresent(Boolean(found));
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
        setPresent(false);
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
    return () => ac.abort();
  }, [stud]);

  // Render
  if (!stud) return null;
  if (loading) return <div className="text-gray-400 text-sm">Checking...</div>;
  if (error) return <div className="text-red-400 text-sm">Err</div>;

  return (
    <div className="flex flex-col items-center">
      <h1 className={`text-sm font-semibold ${present ? "text-green-400" : "text-red-400"}`}>
        {present ? "Present" : "Absent"}
      </h1>
      <span className="text-[12px] text-gray-500">Meal</span>
    </div>
  );
}
