import React, { useState, useEffect, useRef } from "react";
import PhotoCapture from "../Components/PhotoCapture";
import FormRegister from "../Components/FormRegister";
import { uploadToS3, checkStatus, uploadJson } from "../utils/awsS3";

export default function ScanPage() {
  const [isClicked, setIsClicked] = useState("attendance");
  const [status, setStatus] = useState("Initializing camera...");
  const [feedback, setFeedback] = useState(null);
  const [capturedFile, setCapturedFile] = useState(null); // File to upload
  const [capturedPreview, setCapturedPreview] = useState(null); // dataURL / blob URL for preview
  const [toastMessage, setToastMessage] = useState(null);

  const videoRef = useRef(null);

  // start/stop camera depending on tab
  useEffect(() => {
    let mounted = true;
    async function enableCamera() {
      // always start camera for attendance / meal or registration (we want live preview)
      if (!mounted) return;
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

    return () => {
      mounted = false;
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((t) => t.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, [isClicked]); // restart camera when switching tabs

  // callback from PhotoCapture: either a captured File or selected file
  function handleFileSelected(file) {
    setCapturedFile(file);

    // preview
    const reader = new FileReader();
    reader.onload = () => setCapturedPreview(reader.result);
    reader.readAsDataURL(file);

    setToastMessage("Image ready for registration");
    setTimeout(() => setToastMessage(null), 2000);
  }

  // helper: convert baseName for filenames (safe)
  function normalizeName(name) {
    return name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_-]/g, "");
  }

  // main registration flow replicating the HTML logic:
  // 1) Upload photo to S3 (baseFileName.jpg)
  // 2) poll status/{baseFileName}.json (up to 10 tries)
  // 3) upload metadata JSON baseFileName.json
  async function handleRegisterSubmit(e) {
    e.preventDefault();
    setStatus("Registering student...");

    const form = e.target;
    const fd = new FormData(form);

    const data = {
      firstName: fd.get("firstName"),
      lastName: fd.get("lastName"),
      dob: fd.get("dob"),
      phoneNumber: fd.get("phoneNumber"),
      grade: fd.get("grade"),
      className: fd.get("className"),
      address: fd.get("address"),
      emergencyContactName: fd.get("emergencyContactName"),
      emergencyContactPhone: fd.get("emergencyContactPhone"),
      registrationDate: new Date().toISOString().split("T")[0],
    };

    const baseFileName = normalizeName(`${data.firstName}_${data.lastName}`) || `student_${Date.now()}`;

    // determine photo file
    let photoFile = capturedFile || null;

    if (!photoFile) {
      setStatus("Please capture or choose an image before registering.");
      setToastMessage("No image provided");
      setTimeout(() => setToastMessage(null), 2000);
      return;
    }

    try {
      // 1) upload photo
      setStatus("Uploading photo...");
      await uploadToS3(photoFile, `${baseFileName}.jpg`);

      // 2) poll status JSON (status/{baseFileName}.json), same as HTML script
      setStatus("Waiting for face indexing (polling)...");
      let statusJson = null;
      for (let i = 0; i < 10; i++) {
        await new Promise((r) => setTimeout(r, 2000));
        statusJson = await checkStatus(baseFileName);
        if (statusJson) break;
      }

      if (!statusJson || statusJson.status === "error") {
        const msg = statusJson ? statusJson.message : "No response from Lambda";
        setStatus("Error: " + msg);
        setToastMessage("Error: " + msg);
        setTimeout(() => setToastMessage(null), 3000);
        return;
      }

      // 3) upload metadata JSON
      setStatus("Uploading metadata...");
      await uploadJson(data, `${baseFileName}.json`);

      setStatus("Registration successful!");
      setFeedback({ ...data, message: "Student registered successfully" });
      setToastMessage("🎉 Student Registered!");
      setTimeout(() => setToastMessage(null), 3000);

      // clear captured file & preview and reset form
      setCapturedFile(null);
      setCapturedPreview(null);
      form.reset();

      // restart camera (so video shows again)
      try {
        if (videoRef.current) {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn("Could not restart camera:", err);
      }
    } catch (err) {
      console.error("Registration error:", err);
      setStatus("Error during registration: " + (err.message || err));
      setToastMessage("❌ Registration failed");
      setTimeout(() => setToastMessage(null), 3000);
    }
  }

  // Attendance handlers (unchanged): capture image from video, send to API endpoint
  async function captureAttendance() {
    const canvas = document.createElement("canvas");
    const video = videoRef.current;
    if (!video) {
      setStatus("Camera not ready");
      return;
    }
    canvas.width = video.videoWidth || 320;
    canvas.height = video.videoHeight || 240;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    const base64 = canvas.toDataURL("image/jpeg").split(",")[1];
    setStatus("Marking attendance...");
    try {
      // this assumes you have an API endpoint configured
      const API_BASE = process.env.PARCEL_API_BASE || "";
      const res = await fetch(`${API_BASE}/mark-attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });
      const result = await res.json();
      setStatus(res.ok ? "Attendance marked!" : "Error marking attendance");
      setFeedback(result);
    } catch (err) {
      setStatus("Error: " + err.message);
    }
  }

  async function captureMealAttendance() {
    const canvas = document.createElement("canvas");
    const video = videoRef.current;
    if (!video) {
      setStatus("Camera not ready");
      return;
    }
    canvas.width = video.videoWidth || 320;
    canvas.height = video.videoHeight || 240;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    const base64 = canvas.toDataURL("image/jpeg").split(",")[1];
    setStatus("Marking meal attendance...");
    try {
      const API_BASE = process.env.PARCEL_API_BASE || "";
      const res = await fetch(`${API_BASE}/midday-attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });
      const result = await res.json();
      setStatus(res.ok ? "Meal attendance marked!" : "Error marking meal attendance");
      setFeedback(result);
    } catch (err) {
      setStatus("Error: " + err.message);
    }
  }

  return (
    <div className="bg-[#14161a] h-full text-white">
      <div className="w-[90%] container mx-auto pt-6">
        {/* Tab buttons */}
        <div className="flex gap-4 p-2 border items-center justify-end border-gray-800 rounded-2xl">
          <div
            className={`p-2 border border-gray-800 rounded-xl font-medium cursor-pointer ${
              isClicked === "attendance" ? "bg-blue-700 hover:bg-blue-600" : "hover:bg-gray-700"
            }`}
            onClick={() => { setIsClicked("attendance"); }}
          >
            Take Class Attendance
          </div>
          <div
            className={`p-2 border border-gray-800 rounded-xl font-medium cursor-pointer ${
              isClicked === "meal" ? "bg-blue-700 hover:bg-blue-600" : "hover:bg-gray-700"
            }`}
            onClick={() => { setIsClicked("meal"); }}
          >
            Mid-Day Meal Attendance
          </div>
          <div
            className={`p-2 border border-gray-800 rounded-xl font-medium cursor-pointer ${
              isClicked === "register" ? "bg-blue-700 hover:bg-blue-600" : "hover:bg-gray-700"
            }`}
            onClick={() => { setIsClicked("register"); }}
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

            {/* status + feedback */}
            <p className="mt-4 text-sm text-gray-400">{status}</p>
            {feedback && (
              <div className="mt-4 p-3 bg-gray-900 rounded-lg text-sm w-[400px] flex flex-col items-center">
                {feedback.firstName && feedback.lastName && (
                  <p>
                    <span className="font-semibold">Name:</span> {feedback.firstName} {feedback.lastName}
                  </p>
                )}
                {feedback.date && feedback.time && (
                  <p>
                    <span className="font-semibold">Date & Time:</span> {feedback.date} {feedback.time}
                  </p>
                )}
                <p className="mt-2 text-blue-400">{feedback.message}</p>
              </div>
            )}
          </div>
        )}

        {/* Registration */}
        {isClicked === "register" && (
          <div className="border border-gray-800 rounded-2xl mt-6 p-6 grid grid-cols-1 md:grid-cols-2 gap-6 relative pb-10">
            <FormRegister onSubmit={handleRegisterSubmit} />

            <PhotoCapture
              videoRef={videoRef}
              onFileSelected={handleFileSelected}
              selectedFile={capturedFile}
            />
          </div>
        )}

        {/* toast */}
        {toastMessage && (
          <div className="fixed right-6 bottom-6 bg-black/70 text-white px-4 py-2 rounded">{toastMessage}</div>
        )}
      </div>
    </div>
  );
}
