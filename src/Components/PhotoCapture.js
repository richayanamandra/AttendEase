import { useState } from "react";
import { User } from "lucide-react";

function PhotoCapture({ videoRef, useCapture, setUseCapture }) {
  const [uploadedImage, setUploadedImage] = useState(null);

  // Handle file upload + preview
  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-lg font-bold mb-4">Upload or Capture Photo</h2>

      {/* Big Icon / Camera / Uploaded Image */}
      <div className="w-84 h-84 bg-gray-800 rounded-xl flex items-center justify-center mb-4 overflow-hidden mt-3">
        {!useCapture && !uploadedImage && (
          <User size={96} className="text-gray-500" />
        )}

        {/* Uploaded image */}
        {!useCapture && uploadedImage && (
          <img
            src={uploadedImage}
            alt="Uploaded preview"
            className="w-full h-full object-cover"
          />
        )}

        {/* Camera feed */}
        {useCapture && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover rounded-xl"
          />
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setUseCapture(false)}
          className={`px-4 py-2 rounded-lg ${
            !useCapture 
            ? "bg-blue-700 hover:bg-blue-600"
            : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          Upload Image
        </button>
        <button
          onClick={() => setUseCapture(true)}
          className={`px-4 py-2 rounded-lg ${
            useCapture
            ? "bg-blue-700 hover:bg-blue-600"
            : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          Capture Image
        </button>
      </div>

      {/* File Input (only when upload mode is active) */}
      {!useCapture && (
        <input
          type="file"
          name="photo"
          accept="image/*"
          onChange={handleFileChange}
          className="text-sm text-gray-300 text-center"
        />
      )}
    </div>
  );
}

export default PhotoCapture;
