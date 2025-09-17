import Header from "../Components/Header"
import { Outlet } from "react-router"

export default function HomePage(){
    return(
        <>
            <Header></Header>
            <Outlet></Outlet>
        </>
    )
}