export default function ClassCard({item}){
    return(
        <div className="flex w-[90%] border bg-[#181b20] rounded-xl border-gray-600 my-4 justify-between p-4 text-white container mx-auto">
            <div>
                <h1>{item.grade}</h1>
                <h2 className="text-gray-500">{item.time}</h2>
            </div>
            <div className="flex flex-col justify-center items-center">
                <p>{`${item.present}/${item.total}`}</p>
                <p className="text-gray-500">Present</p>
            </div>
        </div>
    )
}