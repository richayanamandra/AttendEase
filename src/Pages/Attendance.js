
import Flap from "../Components/Flap";
export const grades = [
  {
    grade: "Grade 5",
    students: [
      {
        id: "2024001",
        name: "Alice Johnson",
        initials: "AJ",
        subject: "Mathematics",
        lastSeen: "Today, 08:00",
        attendance: 95,
      },
      {
        id: "2024002",
        name: "David Miller",
        initials: "DM",
        subject: "Mathematics",
        lastSeen: "Today, 09:10",
        attendance: 90,
      },
      {
        id: "2024003",
        name: "Sophia Williams",
        initials: "SW",
        subject: "Mathematics",
        lastSeen: "Yesterday, 11:30",
        attendance: 88.5,
      },
    ],
  },
  {
    grade: "Grade 6",
    students: [
      {
        id: "2024004",
        name: "Bob Smith",
        initials: "BS",
        subject: "Science",
        lastSeen: "Today, 10:05",
        attendance: 92.5,
      },
      {
        id: "2024005",
        name: "Emily Davis",
        initials: "ED",
        subject: "Science",
        lastSeen: "Today, 10:40",
        attendance: 89,
      },
    ],
  },
  {
    grade: "Grade 4",
    students: [
      {
        id: "2024006",
        name: "Carol Brown",
        initials: "CB",
        subject: "English",
        lastSeen: "Yesterday, 13:30",
        attendance: 88.2,
      },
      {
        id: "2024007",
        name: "Liam Johnson",
        initials: "LJ",
        subject: "English",
        lastSeen: "Today, 12:45",
        attendance: 91,
      },
    ],
  },
];


export default function Attendance(){
    
    return(
        <>
        <div className="h-280 h-max-full w-full bg-[#14161a] pt-6">
            <div className="w-[90%] container mx-auto">
                {/* <div className="text-3xl font-bold text-blue-500">Your Classes</div> */}
                {
                    grades.map((item,index)=><Flap key={index} item={item}/>)
                }
            </div>
        </div> 
        </>
    )
}