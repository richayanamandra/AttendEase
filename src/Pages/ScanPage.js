import React,{useState, useEffect} from "react"
export default function ScanPage(){
    const [isClicked, setIsClicked] = useState('attendance')

    function handleClickAttendance(){
        if(isClicked==='register'){
            setIsClicked('attendance')
        }
    }

    function handleClickRegister(){
        if(isClicked==='attendance'){
            setIsClicked('register')
        }
    }
    

    if(isClicked==='attendance'){
        return(
            <div className="bg-[#14161a] h-screen text-white">
                <div className="w-[90%] container mx-auto pt-6">
                    <div className="flex gap-4 p-2 border items-center justify-end border-gray-800 rounded-2xl">
                        <div className="p-2 border border-gray-800 rounded-xl bg-blue-700 font-medium hover:bg-blue-600" onClick={handleClickAttendance}>Take Attendance</div>
                        <div className="p-2 border border-gray-800 rounded-xl font-medium hover:bg-gray-700" onClick={handleClickRegister}>Register Student</div>
                    </div>
                    <div className="border items-center justify-end border-gray-800 rounded-2xl mt-6 h-140">
                        <div>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
    else{
        return(
            <div className="bg-[#14161a] h-screen text-white">
                <div className="w-[90%] container mx-auto pt-6">
                    <div className="flex gap-4 p-2 border items-center justify-end border-gray-800 rounded-2xl">
                        <div className="p-2 border border-gray-800 rounded-xl font-medium hover:bg-gray-700" onClick={handleClickAttendance}>Take Attendance</div>
                        <div className="p-2 border border-gray-800 rounded-xl bg-blue-700 font-medium hover:bg-blue-600" onClick={handleClickRegister}  >Register Student</div>
                    </div>
                    <div className="border items-center justify-end border-gray-800 rounded-2xl mt-6 h-140">
                        <div>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}