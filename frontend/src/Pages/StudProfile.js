
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, UserStar, Calendar, Mail, Phone, MapPin } from "lucide-react";

const attendanceData = [
  { month: "Jan", attendance: 90 },
  { month: "Feb", attendance: 85 },
  { month: "Mar", attendance: 95 },
  { month: "Apr", attendance: 80 },
  { month: "May", attendance: 92 },
  { month: "Jun", attendance: 87 },
  { month: "Jul", attendance: 94 },
  { month: "Aug", attendance: 88 },
  { month: "Sep", attendance: 91 },
  { month: "Oct", attendance: 89 },
  { month: "Nov", attendance: 93 },
  { month: "Dec", attendance: 90 },
];

export default function StudProfile() {
  const { id } = useParams(); // id === rollNumber
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ac = new AbortController();

    const fetchStudent = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "https://bf39nos9jf.execute-api.us-east-1.amazonaws.com/fetcher",
          { signal: ac.signal }
        );
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();

        // find by rollNumber (string-safe)
        const found = data.find((s) => String(s.rollNumber) === String(id));
        setStudent(found || null);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
    return () => ac.abort();
  }, [id]);

  if (loading) return <div className="text-white p-6">Loading...</div>;
  if (error) return <div className="text-red-400 p-6">Error: {error}</div>;
  if (!student) return <div className="text-gray-400 p-6">Student not found</div>;

  const fullName = `${student.firstName || ""} ${student.lastName || ""}`.trim();
  const initials =
    (student.firstName?.[0] || "").toUpperCase() + (student.lastName?.[0] || "").toUpperCase();

  return (
    <div className="w-full h-screen bg-[#14161a]">
      <div className="h-full w-[90%] container mx-auto bg-[#14161a] text-white pt-6">
        <div className="flex gap-5 items-center ">
          <Link to="/attendance">
            <ArrowLeft size={24} className="hover:bg-blue-500 rounded-xl h-8 w-8" />
          </Link>
          <h1 className="text-2xl font-bold">Student Profile</h1>
        </div>

        <div className="flex pt-6 gap-6">
          {/* LEFT-PART */}
          <div className="w-[35%] bg-[#181b20] rounded-2xl p-5 border border-gray-800 gap-4 pb-35">
            <div className="flex flex-col items-center">
              <div className="bg-blue-600 rounded-full h-20 w-20 flex items-center justify-center font-medium text-2xl text-black">
                {initials || "NA"}
              </div>
              <div className="flex flex-col items-center mt-2">
                <p className="font-medium text-xl">{fullName || "No name"}</p>
                <p className="text-gray-500 text-[14px]">
                  {`Roll #${student.rollNumber} • Class ${student.className || "N/A"} • Grade ${student.grade || "N/A"}`}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-6 text-[12px]">
              <div className="flex gap-2 items-center">
                <UserStar size={14} className="text-gray-600" />
                <p>{`Grade: ${student.grade || "N/A"}`}</p>
              </div>
              <div className="flex gap-2 items-center">
                <Calendar size={14} className="text-gray-600" />
                <p>{student.dob || "N/A"}</p>
              </div>
              <div className="flex gap-2 items-center">
                <Mail size={14} className="text-gray-600" />
                <p>{student.email || "No email available"}</p>
              </div>
              <div className="flex gap-2 items-center">
                <Phone size={14} className="text-gray-600" />
                <p>{student.phoneNumber || "N/A"}</p>
              </div>
              <div className="flex gap-2 items-center">
                <MapPin size={14} className="text-gray-600" />
                <p>{student.address || "N/A"}</p>
              </div>
            </div>

            <div className="border-t border-gray-700 mt-4 pt-4 text-[12px]">
              <p className="font-medium pb-2">Emergency Contacts</p>
              <p className="font-semibold">{student.emergencyContactName || "N/A"}</p>
              <p className="text-gray-400 pb-2">{student.emergencyContactPhone || "N/A"}</p>
            </div>
          </div>

          {/* RIGHT-PART */}
          <div className="w-[65%] flex flex-col gap-5">
            <div className="flex gap-3 font-bold">
              <div className="flex flex-col gap-1 p-3 pl-5 border border-gray-800 rounded-3xl w-[33%] bg-[#181b20]">
                <h2 className="text-[14px]">Attendance Rate</h2>
                <p className="text-green-500 ">
                  95%
                </p>
              </div>
              <div className="flex flex-col p-3 pl-5 border border-gray-800 rounded-3xl w-[33%] bg-[#181b20]">
                <h2 className="text-[14px] pb-1">Present Days</h2>
                <p className="text-green-500 ">115</p>
                <p className="text-gray-600 text-[10px] text-medium">out of 120</p>
              </div>
              <div className="flex flex-col p-3 pl-5 border border-gray-800 rounded-3xl w-[33%] bg-[#181b20]">
                <h2 className="text-[14px] pb-1">Absent Days</h2>
                <p className="text-red-500 ">5</p>
                <p className="text-gray-600 text-[10px] text-medium">This semester</p>
              </div>
            </div>

            <div className="p-1 rounded-xl bg bg-[#1c1f24] w-[33%]">
              <div className="text-[12px] p-2 bg-[#14161a] w-[50%] rounded-xl font-medium">Attendance History</div>
            </div>

            <div className="w-full bg-[#181b20] h-96 rounded-3xl border border-gray-800 p-5">
              <h2 className="text-white text-lg font-semibold mb-4">Monthly Attendance</h2>


            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
