import { Link } from "react-router"; 
import { useParams } from "react-router";
import { grades } from "./Attendance";
import { ArrowLeft,UserStar,Calendar,Mail, Phone,MapPin } from "lucide-react";
export default function StudProfile(){
    const{id} = useParams();
    const student = grades
    .flatMap((grade) => grade.students) 
    .find((s) => String(s.id) === String(id));
    return(
        <div className="w-full h-screen bg-[#14161a]">
            <div className="h-full w-[90%] container mx-auto bg-[#14161a] text-white pt-6">
                <div className="flex gap-5 items-center ">
                    <Link to="/attendance">
                        <ArrowLeft size={24} className="hover:bg-blue-500 rounded-xl h-8 w-8"/>
                    </Link>
                    <h1 className="text-2xl font-bold">Student Profile</h1>
                </div>
                
                <div className="flex pt-6 gap-6">
                    {/* LEFT-PART */}
                    <div className="w-[35%] bg-[#181b20] rounded-2xl p-5  border border-gray-800 gap-4 pb-35">
                        <div className="flex flex-col items-center">
                            <div className="bg-blue-600 rounded-full h-20 w-20 flex items-center justify-center font-medium text-2xl text-black">{student.initials}</div>
                            <div className="flex flex-col items-center">
                                <p className="font-medium text-xl">{student.name}</p>
                                <p className="text-gray-500 text-[14px]">{`Roll #${student.id} • Grade ""`}</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 pt-6 text-[12px]">
                            <div className="flex gap-2 items-center">
                                <UserStar size={14} className="text-gray-600"/>
                                <p>{student.subject +" Grade"}</p>
                            </div>
                            <div className="flex gap-2 items-center">
                                <Calendar size={14} className="text-gray-600"/>
                                <p>DOB</p>
                            </div>
                            <div className="flex gap-2 items-center">
                                <Mail size={14} className="text-gray-600"/>   
                                <p>Mail</p>
                            </div>
                            <div className="flex gap-2 items-center">
                                <Phone size={14} className="text-gray-600"/>
                                <p>XXXXXXXXXX</p>
                            </div>
                            <div className="flex gap-2 items-center">
                                <MapPin size={14} className="text-gray-600"/>
                                <p>123 Main St, Rural Town, ST 12345</p>
                            </div>
                        </div>
                        <div className="border-t border-gray-700 mt-4 pt-4 text-[12px]">
                            <p className="font-medium pb-2">Emergency Contacts</p>
                            <p className="font-semibold">John Johnson</p>
                            <p className="text-gray-400 pb-2">+1 (555) 987-6543</p>
                            <p className="text-gray-500 ">Jane Johnson - +1 (555) 456-7890</p>
                        </div>
                        <div>

                        </div>
                    </div>
                    {/* RIGHT-PART */}
                    <div className="w-[65%] flex flex-col gap-5">
                        <div className="flex gap-3 font-bold">
                            <div className="flex flex-col gap-1 p-3 pl-5 border border-gray-800 rounded-3xl w-[33%] bg-[#181b20]">
                                <h2 className="text-[14px]">Attendance Rate</h2>
                                <p className="text-green-500 ">{student.attendance+"%"}</p>
                            </div>
                            <div className="flex flex-col p-3 pl-5 border border-gray-800 rounded-3xl w-[33%] bg-[#181b20]">
                                <h2 className="text-[14px] pb-1">Present Days</h2>
                                <p className="text-green-500 ">114</p>
                                <p className="text-gray-600 text-[10px] text-medium">out of 120</p>
                            </div>
                            <div className="flex flex-col p-3 pl-5 border border-gray-800 rounded-3xl w-[33%] bg-[#181b20]">
                                <h2 className="text-[14px] pb-1">Absent Days</h2>
                                <p className="text-red-500 ">4</p>
                                <p className="text-gray-600 text-[10px] text-medium">This semester</p>
                            </div>
                        </div>
                        <div className="p-1 rounded-xl bg bg-[#1c1f24] w-[33%]">
                            <div className="text-[12px] p-2 bg-[#14161a] w-[50%] rounded-xl font-medium">Attendance History</div>
                        </div>
                        <div className="w-full bg-[#181b20] h-105 rounded-3xl border border-gray-800">

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}