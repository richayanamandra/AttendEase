import { BookOpen, House, Shapes, ClipboardMinus, UserCheck, Settings, Search } from "lucide-react";
import { Link } from "react-router"; 
export default function Header(){
    return(
        <>
        <div className="flex justify-between items-center px-2 py-6 bg-[#101114]">
            <div className="flex gap-1 items-center">
                <BookOpen size={34} className="text-blue-500" />
                <h1 className="font-bold text-2xl text-blue-500">AttendEase</h1>
            </div>
            <div className="flex gap-4 items-center w-[70%] justify-between">
                <Link to="/dashboard">
                    <button className="flex gap-1 text-white hover:bg-gray-500 hover:text-black rounded-md px-3 py-2">
                        <House size={24} />
                        Dashboard
                    </button>
                </Link>
                <button className="flex gap-1 text-white hover:bg-gray-500 hover:text-black rounded-md px-3 py-2">
                    <Shapes size={24} />
                    Classes
                </button>
                <button className="flex gap-1 text-white hover:bg-gray-500 hover:text-black rounded-md px-3 py-2">
                    <ClipboardMinus size={24} />
                    Reports
                </button>
                <Link to="/attendance">
                    <button className="flex gap-1 text-white hover:bg-gray-500 hover:text-black rounded-md px-3 py-2">
                        <UserCheck size={24} />
                        Attendance
                    </button>
                </Link>
                <button className="flex gap-1 text-white hover:bg-gray-500 hover:text-black rounded-md px-3 py-2">
                    <Settings size={24} />
                    Setting
                </button>
                <div className="relative w-full max-w-sm">
                    <Search
                        size={20}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    />
                    <input
                        type="text"
                        placeholder="Search Students"
                        className="w-full bg-gray-200 pl-10 pr-3 py-2 rounded-xl focus:outline-none"
                    />
                </div>
                <div>
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-500 font-bold">AA</div>
                </div>
            </div>
        </div>
        </>
    )
}