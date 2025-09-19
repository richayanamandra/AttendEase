import React, { useState ,useRef, useEffect} from "react";
import { Eye,EllipsisVertical } from "lucide-react";
import StudMenu from "./StudMenu";
import { Link } from "react-router"; 

export default function StudCard({stud,grade}){
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

  
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        }

        if (menuOpen) {
        document.addEventListener("mousedown", handleClickOutside);
        } else {
        document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuOpen]);
    return(
        <div className="text-white border border-gray-500 rounded-xl flex justify-between items-center bg-[#101114] hover:bg-[#1d1f26] cursor-pointer">
            <div className="flex p-3 gap-3 items-center">
                <div>
                    <div className="bg-gray-600 rounded-full h-14 w-14 flex items-center justify-center font-medium text-xl">{stud.initials}</div>
                </div>
                <div>
                    <div className="flex items-center">
                        <h1 className="font-medium">{stud.name}</h1>
                        <span className="ml-3 px-1 bg-gray-700 rounded-3xl text-[12px]">{`#${stud.id}`}</span>
                    </div>
                    <div className="flex gap-2 text-[14px] text-gray-500">
                        <p>{grade}</p>
                        <p>{stud.subject}</p>
                        <p>{"LastSeen: "+stud.lastSeen}</p>
                    </div>
                </div>
            </div>
            <div className="flex gap-10 items-center mr-5 relative" ref={menuRef}>
                <div className="flex flex-col justify-center text-center">
                    <p>{`${stud.attendance}%`}</p>
                    <span className="text-[14px] text-gray-500">Attendance</span>
                </div>
                <Link to={`/studentProflie/${stud.id}`}>
                    <div className="p-2 rounded-2xl hover:bg-blue-500 cursor-pointer">
                        <Eye size={24} />
                    </div>
                </Link>
                <div
                    className="p-2 rounded-2xl hover:bg-blue-500 cursor-pointer"
                    onClick={() => setMenuOpen(!menuOpen)}
                    >
                    <EllipsisVertical size={24} />
                </div>

                {menuOpen && <StudMenu onClose={() => setMenuOpen(false)} id={stud.id} />}
            </div>
        </div>
    )
}