
export default function DashCard({item}){
    return(
        <div className="text-white p-4 border w-[25%] bg-[#181b20] rounded-xl border-gray-600">
            <p>{item.title}</p>
            <h2 className="font-bold">{item.value}</h2>
            <p className="text-gray-400 text-s">{item.subtitle}</p>
        </div>
    )
}