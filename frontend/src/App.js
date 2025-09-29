    // import React from "react";
    // import ReactDOM from "react-dom/client";
    // import { BrowserRouter, Routes, Route } from "react-router";
    // import HomePage from "./Pages/HomePage";
    // import Dashboard from "./Pages/Dashboard";
    // import Attendance from "./Pages/Attendance";
    // import StudProfile from "./Pages/StudProfile";
    // import ScanPage from "./Pages/ScanPage";
    // import Complain from "./Pages/Complain";
    // function App(){
    //     return(
    //         <>
    //             <BrowserRouter>
    //                 <Routes>
    //                     <Route path="/" element={<HomePage></HomePage>}>
    //                         <Route index element={<Dashboard></Dashboard>}/>
    //                         <Route path="/dashboard" element={<Dashboard></Dashboard>}/>
    //                         <Route path="/attendance" element={<Attendance></Attendance>}/>
    //                         <Route path="/studentProfile/:id" element={<StudProfile></StudProfile>}/>
    //                         <Route path="/scan" element={<ScanPage></ScanPage>}/>
    //                         <Route path="/complain" element={<Complain></Complain>}/>
    //                     </Route>
    //                 </Routes>
    //             </BrowserRouter>
    //         </>
    //     )
    // }

    // ReactDOM.createRoot(document.getElementById("root")).render(<App />);

// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "./Pages/HomePage";
import Dashboard from "./Pages/Dashboard";
import Attendance from "./Pages/Attendance";
import StudProfile from "./Pages/StudProfile";
import ScanPage from "./Pages/ScanPage";
import Complain from "./Pages/Complain";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />}>
                    <Route index element={<Dashboard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/attendance" element={<Attendance />} />
                    <Route path="/studentProfile/:id" element={<StudProfile />} />
                    <Route path="/scan" element={<ScanPage />} />
                    <Route path="/complain" element={<Complain />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
