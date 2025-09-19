import { Phone, Mail, UserCheck } from "lucide-react";

export default function StudMenu({ onClose, id}) {
  return (
    <div className="absolute top-9 right-0 mt-2 w-48 bg-[#1d1f26] text-white rounded-xl shadow-lg border border-gray-700 z-50">
      <ul className="flex flex-col">
        <li
          className="flex items-center gap-2 px-4 py-2 hover:bg-blue-500 cursor-pointer"
          onClick={onClose}
        >
          <UserCheck size={16} /> Take Attendance
        </li>
        <li
          className="flex items-center gap-2 px-4 py-2 hover:bg-blue-500 cursor-pointer"
          onClick={onClose}
        >
          <Phone size={16} /> Call Parent
        </li>
        <li
          className="flex items-center gap-2 px-4 py-2 hover:bg-blue-500 cursor-pointer"
          onClick={onClose}
        >
          <Mail size={16} /> Send Email
        </li>
      </ul>
    </div>
  );
}
