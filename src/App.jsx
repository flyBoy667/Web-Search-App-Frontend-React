import {BrowserRouter, Route, Routes} from "react-router-dom";
import HomePage from "./Pages/HomePage/index.jsx";
import {NotFound} from "./Pages/NotFound/index.jsx";

function App() {

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<HomePage/>} index/>
                    <Route path='*' element={<NotFound/>}/>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
