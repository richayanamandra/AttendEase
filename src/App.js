    import React from "react";
    import ReactDOM from "react-dom/client";
    import { BrowserRouter, Routes, Route } from "react-router";
    import HomePage from "./Pages/HomePage";
    import Dashboard from "./Pages/Dashboard";
    import Attendance from "./Pages/Attendance";
    import StudProfile from "./Pages/StudProfile";
    import ScanPage from "./Pages/ScanPage";
    function App(){
        return(
            <>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<HomePage></HomePage>}>
                            <Route index element={<Dashboard></Dashboard>}/>
                            <Route path="/dashboard" element={<Dashboard></Dashboard>}/>
                            <Route path="/attendance" element={<Attendance></Attendance>}/>
                            <Route path="/studentProfile/:id" element={<StudProfile></StudProfile>}/>
                            <Route path="/scan" element={<ScanPage></ScanPage>}/>
                        </Route>
                    </Routes>
                </BrowserRouter>
            </>
        )
    }

    ReactDOM.createRoot(document.getElementById("root")).render(<App />);