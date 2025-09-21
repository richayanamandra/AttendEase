import React, { useState, useEffect, useRef } from "react";
import { User } from "lucide-react";

export default function PhotoCapture({ videoRef, onFileSelected, selectedFile }) {
  const [preview, setPreview] = useState(null); // data URL shown in preview box
  const [toast, setToast] = useState(null);
  const canvasRef = useRef(null);

  // If parent provides a selectedFile, derive preview from it.
  useEffect(() => {
    let mounted = true;
    if (!selectedFile) {
      // parent cleared file -> clear preview (show camera)
      setPreview(null);
      return;
    }

    // build dataURL preview from File
    const reader = new FileReader();
    reader.onload = () => {
      if (mounted) setPreview(reader.result);
    };
    reader.onerror = () => {
      if (mounted) setPreview(null);
    };
    reader.readAsDataURL(selectedFile);

    return () => {
      mounted = false;
      // revoke blob URLs if you ever create them
    };
  }, [selectedFile]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 1800);
    return () => clearTimeout(t);
  }, [toast]);

  // Capture current frame from parent's videoRef
  function handleCapture() {
    const video = videoRef?.current;
    if (!video) {
      setToast("Camera not ready");
      return;
    }

    const canvas = canvasRef.current || document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) {
        setToast("Capture failed");
        return;
      }
      const file = new File([blob], `captured_${Date.now()}.jpg`, { type: "image/jpeg" });

      // preview quickly via object URL
      const url = URL.createObjectURL(blob);
      setPreview(url);

      // send file to parent
      if (onFileSelected) onFileSelected(file);

      setToast("Image captured");
      // revoke object URL later when preview changes (below)
    }, "image/jpeg", 0.95);
  }

  // Choose file from input
  function handleFileChange(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    // preview will be derived by parent through selectedFile prop ideally,
    // but we also set local preview for immediate UX
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(f);

    if (onFileSelected) onFileSelected(f);
    setToast("Image selected");
  }

  // cleanup object URLs if we created any
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        try { URL.revokeObjectURL(preview); } catch (e) {}
      }
    };
  }, [preview]);

  return (
    <div className="flex flex-col w-full items-center">
      <h2 className="text-lg font-bold mb-7">Capture Photo</h2>

      {/* choose file button */}
      <div className="mb-4 w-[400px] border p-3 rounded-2xl bg-[#1e2939] border-gray-700">
        <label
          htmlFor="fileInput"
          className="bg-[#14161a] p-2 text-white rounded-xl cursor-pointer hover:bg-gray-600 px-4 font-medium"
        >
          Choose File
        </label>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Preview area — shows preview image if present, otherwise live video */}
      <div className="w-[400px] h-[280px] bg-gray-800 rounded-xl flex justify-center overflow-hidden mb-4">
        {preview ? (
          <img src={preview} alt="preview" className="w-full h-full object-cover rounded-xl" />
        ) : (
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover rounded-xl" />
        )}
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={handleCapture}
          className="px-4 py-2 bg-blue-700 rounded-lg hover:bg-blue-600"
        >
          Capture Photo
        </button>
      </div>

      {toast && <div className="mt-3 text-sm text-green-300 bg-green-900/20 px-3 py-1 rounded">{toast}</div>}

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}
