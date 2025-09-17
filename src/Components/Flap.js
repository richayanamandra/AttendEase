import React,{ useState } from "react"; 
import { ChevronUp,ChevronDown } from "lucide-react";
import StudCard from "./StudCard";
export default function Flap({item}){
    const [clicked,setClicked] = useState(true)
    function clickHandle(){
        clicked===true ? setClicked(false):setClicked(true)
    }
    if(!clicked){
        return(
            <>
                <div className="border border-gray-500 rounded-2xl mt-6 p-3 ">
                    <div className="flex justify-between items-center text-white px-4 py-3">
                        <h2 className="text-2xl font-bold ">{item.grade}</h2>
                        <button className="text-2xl font-bold mr-10" onClick={clickHandle}>{clicked===true ?<ChevronUp size={24}/>:<ChevronDown size={24}/>}</button>
                    </div>
                </div>
                
            </>
        )
    }
    return(
        <>
            <div className="border border-gray-500 rounded-2xl mt-6 p-3 ">
                <div className="text-white flex justify-between items-center px-4 py-3">
                    <h2 className="text-2xl font-bold ">{item.grade}</h2>
                    <button className="text-2xl font-bold mr-10" onClick={clickHandle}>{clicked?<ChevronUp size={24}/>:<ChevronDown size={24}/>}</button>
                </div>
                <div className="flex flex-col p-3 gap-4">
                    {
                        item.students.map((stud)=><StudCard key={stud.id} stud={stud} grade={item.grade}/>)
                    }
                </div>
            </div>
        </>
    )
}