import { useEffect, useState } from "react";
import Flap from "../Components/Flap";

export default function Attendance() {
  const [info, setInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInfo = async () => {
    try {
      const response = await fetch(
        "https://bf39nos9jf.execute-api.us-east-1.amazonaws.com/fetcher"
      );
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();

      // Group students by "className-grade"
      const grouped = data.reduce((acc, student) => {
        const key = `${student.className}-${student.grade}`;
        if (!acc[key]) {
          acc[key] = { groupName: key, students: [] };
        }
        acc[key].students.push(student);
        return acc;
      }, {});

      setInfo(Object.values(grouped));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  return (
    <div className="h-280 h-max-full w-full bg-[#14161a] pt-6">
      <div className="w-[90%] container mx-auto">
        {loading && <div className="text-blue-400">Loading...</div>}
        {error && <div className="text-red-400">Error: {error}</div>}

        {!loading &&
          !error &&
          info.map((item) => <Flap key={item.groupName} item={item} />)}
      </div>
    </div>
  );
}
