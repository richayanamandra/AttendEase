import React from "react";

export default function FormRegister({ onSubmit, submitLabel = "Register Student" }) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
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

      <button type="submit" className="px-4 py-2 bg-blue-600 rounded-xl hover:bg-blue-700 mt-3 absolute bottom-10 right-32 w-[400px]">
        {submitLabel}
      </button>
    </form>
  );
}
