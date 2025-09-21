import React, { useState, useEffect, useRef } from "react";
import PhotoCapture from "../Components/PhotoCapture";

export default function ScanPage() {
  const [isClicked, setIsClicked] = useState("attendance");
  const [status, setStatus] = useState("Initializing camera...");
  const [feedback, setFeedback] = useState(null);
  const [useCapture, setUseCapture] = useState(false); // toggle between upload/capture
  const videoRef = useRef(null);

  // ⚡ Your API Gateway base URL
  const API_BASE = process.env.PARCEL_API_BASE;
  // Start webcam only if capture mode is ON
  useEffect(() => {
    async function enableCamera() {
      // open camera if capture mode OR attendance/meal tab
      if (!(useCapture || isClicked === "attendance" || isClicked === "meal")) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStatus("Camera ready");
        }
      } catch (err) {
        setStatus("Webcam access required: " + err.message);
      }
    }

    enableCamera();

    // cleanup: stop camera when leaving
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, [useCapture, isClicked]);

  // Capture image as base64
  function captureImage() {
    const video = videoRef.current;
    if (!video) return null;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 320;
    canvas.height = video.videoHeight || 240;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL("image/jpeg").split(",")[1]; // strip header
  }

  // Handle Class Attendance
  async function captureAttendance() {
    const imageBase64 = captureImage();
    if (!imageBase64) {
      setStatus("Failed to capture image");
      return;
    }
    setStatus("Marking attendance...");

    try {
      const response = await fetch(`${API_BASE}/mark-attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageBase64 }),
      });
      const result = await response.json();
      setStatus(response.ok ? "Attendance marked!" : "Error marking attendance");
      setFeedback(result);
    } catch (err) {
      setStatus("Error: " + err.message);
    }
  }

  // Handle Mid-Day Meal Attendance
  async function captureMealAttendance() {
    const imageBase64 = captureImage();
    if (!imageBase64) {
      setStatus("Failed to capture image");
      return;
    }
    setStatus("Marking meal attendance...");

    try {
      const response = await fetch(`${API_BASE}/mid-day-attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageBase64 }),
      });
      const result = await response.json();
      setStatus(response.ok ? "Meal attendance marked!" : "Error marking meal attendance");
      setFeedback(result);
    } catch (err) {
      setStatus("Error: " + err.message);
    }
  }

  // Handle Registration Submit
  async function handleRegisterSubmit(e) {
    e.preventDefault();
    setStatus("Registering student...");

    const formData = new FormData(e.target);

    let imageBase64 = null;
    if (useCapture) {
      imageBase64 = captureImage();
    } else {
      const file = formData.get("photo");
      if (file && file instanceof File) {
        imageBase64 = await fileToBase64(file);
      }
    }

    if (!imageBase64) {
      setStatus("Please upload or capture an image");
      return;
    }

    const payload = {
      image: imageBase64,
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      dob: formData.get("dob"),
      phoneNumber: formData.get("phoneNumber"),
      grade: formData.get("grade"),
      className: formData.get("className"),
      address: formData.get("address"),
      emergencyContactName: formData.get("emergencyContactName"),
      emergencyContactPhone: formData.get("emergencyContactPhone"),
    };

    try {
      const response = await fetch(`${API_BASE}/register-student`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      setStatus(response.ok ? "Student registered!" : "Error registering student");
      setFeedback(result);
    } catch (err) {
      setStatus("Error: " + err.message);
    }
  }

  // Helper: convert file to base64
  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  return (
    <div className="bg-[#14161a] h-screen text-white">
      <div className="w-[90%] container mx-auto pt-6">
        {/* Tab buttons */}
        <div className="flex gap-4 p-2 border items-center justify-end border-gray-800 rounded-2xl">
          <div
            className={`p-2 border border-gray-800 rounded-xl font-medium cursor-pointer ${
              isClicked === "attendance" ? "bg-blue-700 hover:bg-blue-600" : "hover:bg-gray-700"
            }`}
            onClick={() => setIsClicked("attendance")}
          >
            Take Class Attendance
          </div>
          <div
            className={`p-2 border border-gray-800 rounded-xl font-medium cursor-pointer ${
              isClicked === "meal" ? "bg-blue-700 hover:bg-blue-600" : "hover:bg-gray-700"
            }`}
            onClick={() => setIsClicked("meal")}
          >
            Mid-Day Meal Attendance
          </div>
          <div
            className={`p-2 border border-gray-800 rounded-xl font-medium cursor-pointer ${
              isClicked === "register" ? "bg-blue-700 hover:bg-blue-600" : "hover:bg-gray-700"
            }`}
            onClick={() => setIsClicked("register")}
          >
            Register Student
          </div>
        </div>

        {/* Attendance / Meal */}
        {(isClicked === "attendance" || isClicked === "meal") && (
          <div className="border border-gray-800 rounded-2xl mt-6 p-6 flex flex-col items-center">
            <h1 className="text-xl font-bold mb-4">
              {isClicked === "attendance"
                ? "Face Scan for Class Attendance"
                : "Face Scan for Mid-Day Meal Attendance"}
            </h1>

            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="border border-gray-700 rounded-xl w-[400px] h-[300px] bg-black"
            />

            <div className="mt-4 flex gap-4">
              {isClicked === "attendance" && (
                <button
                  onClick={captureAttendance}
                  className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Capture & Mark Attendance
                </button>
              )}

              {isClicked === "meal" && (
                <button
                  onClick={captureMealAttendance}
                  className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Capture & Mark Meal Attendance
                </button>
              )}
            </div>
                {/* Status + Feedback */}
                <p className="mt-4 text-sm text-gray-400">{status}</p>
                {feedback && (
                  <div className="mt-4 p-3 bg-gray-900 rounded-lg text-sm w-[400px] flex flex-col items-center">
                    {feedback.firstName && feedback.lastName && (
                      <p>
                        <span className="font-semibold">Name:</span>{" "}
                        {feedback.firstName} {feedback.lastName}
                      </p>
                    )}

                    {feedback.date && feedback.time && (
                      <p>
                        <span className="font-semibold">Date & Time:</span>{" "}
                        {feedback.date} {feedback.time}
                      </p>
                    )}

                    <p className="mt-2 text-blue-400">{feedback.message}</p>
                  </div>
                )}
              </div>
            )}

        {/* Registration */}
        {isClicked === "register" && (
          <div className="border border-gray-800 rounded-2xl mt-6 p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Side - Upload or Capture */}
            <PhotoCapture videoRef={videoRef} useCapture={useCapture} setUseCapture={setUseCapture}></PhotoCapture>

            {/* Right Side - Registration Form */}
            <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-3">
              <h2 className="text-lg font-bold mb-4">Student Registration</h2>
              <input className="p-2 rounded-xl bg-gray-800" name="firstName" placeholder="First Name" required />
              <input className="p-2 rounded-xl bg-gray-800" name="lastName" placeholder="Last Name" required />
              <input className="p-2 rounded-xl bg-gray-800" name="dob" type="date" required />
              <input className="p-2 rounded-xl bg-gray-800" name="phoneNumber" placeholder="Phone Number" required />
              <input className="p-2 rounded-xl bg-gray-800" name="grade" placeholder="Grade" required />
              <input className="p-2 rounded-xl bg-gray-800" name="className" placeholder="Class" required />
              <input className="p-2 rounded-xl bg-gray-800" name="address" placeholder="Address" required />
              <input className="p-2 rounded-xl bg-gray-800" name="emergencyContactName" placeholder="Emergency Contact Name" required />
              <input className="p-2 rounded-xl bg-gray-800" name="emergencyContactPhone" placeholder="Emergency Contact Phone" required />

              <button type="submit" className="px-4 py-2 bg-blue-600 rounded-xl hover:bg-blue-700">
                Register Student
              </button>
            </form>
          </div>
        )}

        
      </div>
    </div>
  );
}
