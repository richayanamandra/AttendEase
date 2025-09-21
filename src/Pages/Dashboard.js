import { Calendar, UserCheck, Utensils,UsersRound,TrendingUpDown } from "lucide-react";
import DashCard from "../Components/DashCard";
import ClassCard from "../Components/ClassCard";
import { Link } from "react-router"; 
const dashboardStats = [
  {
    id: 1,
    title: "Total Students",
    value: 107,
    subtitle: "Across all classes",
    change: "+2.5%",
    changeType: "increase", // could be "increase" or "decrease"
    icon: "Users", // you can map this to a lucide-react icon
  },
  {
    id: 2,
    title: "Present Today",
    value: 95,
    subtitle: "88.8% attendance",
    change: "+5.1%",
    changeType: "increase",
    icon: "UserCheck",
  },
  {
    id: 3,
    title: "Absent Today",
    value: 12,
    subtitle: "11.2% absence rate",
    change: "-2.3%",
    changeType: "decrease",
    icon: "UserX",
  },
  {
    id: 4,
    title: "Late Arrivals",
    value: 3,
    subtitle: "This week",
    change: "-1.2%",
    changeType: "decrease",
    icon: "Clock",
  },
];
const todaysClasses = [
  {
    id: 1,
    grade: "Grade 5",
    time: "08:00 - 09:30",
    present: 26,
    total: 28,
    status: "Present",
    action: "View",
  },
  {
    id: 2,
    grade: "Grade 6",
    time: "10:00 - 11:30",
    present: 22,
    total: 24,
    status: "Present",
    action: "View",
  },
  {
    id: 3,
    grade: "Grade 4",
    time: "13:00 - 14:30",
    total: 30, // no present count given in your example
    status: "Students",
    action: "Start",
  },
  {
    id: 4,
    grade: "Grade 5",
    time: "15:00 - 16:30",
    total: 25,
    status: "Students",
    action: "Start",
  },
];

export default function Dashboard(){
    return(
        <>
            <div className="h-full w-full  bg-[#14161a] pt-6">
                {/* DASHBOARD upper part */}
                <div className="w-[90%] container mx-auto">
                    <h1 className="text-2xl text-white font-bold mb-4">Dashboard</h1>
                    <div className="flex justify-evenly gap-6 mb-6">
                        {
                            dashboardStats.map((item)=><DashCard key={item.id} item={item}></DashCard>)
                        }
                    </div>
                </div>
                {/* TODAYS CLASS, QUICK ACTION */}
                <div className="w-[90%] container mx-auto flex justify-between pb-9">
                    {/* Todays class */}
                    <div className="w-[70%] border bg-[#181b20] rounded-2xl border-gray-600">
                        <div className="flex text-white items-center my-3 mx-11">
                            <Calendar size={24} />
                            <p className="text-2xl text-white font-bold ml-2">Today's Classes</p>
                        </div>
                        <div className="flex flex-col">
                            {
                                todaysClasses.map((item)=><ClassCard key={item.id} item={item}></ClassCard>)
                            }
                        </div>
                    </div>
                    {/* Quick Actions */}
                    <div className="w-[28%] border bg-[#181b20] rounded-2xl border-gray-600">
                        <div className="flex text-white items-center my-3 ml-4">
                            <p className="text-2xl text-white font-bold ml-1">Quick Actions</p>
                        </div>
                        <div className="flex flex-col items-start text-white">
                            <Link to="/scan">
                              <div className="flex m-4 border p-2 border-gray-500 hover:bg-gray-500 hover:text-black rounded-md px-3 py-2 cursor-pointer">
                                  <UserCheck size={24} />
                                  <p className="ml-2 ">Take Class Attendance</p>
                              </div>
                            </Link>
                            <Link to="/scan">
                              <div className="flex m-4 border p-2 border-gray-500 hover:bg-gray-500 hover:text-black rounded-md px-3 py-2 cursor-pointer">
                                  <Utensils size={24} />
                                  <p className="ml-2 ">Mid-Day Meal Attendance</p>
                              </div>
                            </Link>
                            <Link to="/attendance">
                              <div className="flex m-4 border p-2 border-gray-500 hover:bg-gray-500 hover:text-black rounded-md px-3 py-2 cursor-pointer">
                                  <UsersRound size={24} />
                                  <p className="ml-2 ">View All Students</p>
                              </div>
                            </Link>
                            <Link to="/attendance">
                              <div className="flex m-4 border p-2 border-gray-500 hover:bg-gray-500 hover:text-black rounded-md px-3 py-2 cursor-pointer">
                                  <TrendingUpDown size={24} />
                                  <p className="ml-2 ">Manage Attendance</p>
                              </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}