import {BrowserRouter, Route,Routes} from "react-router-dom"
import SignUp from "./views/SignUp"
import SignIn from "./views/SignIn"
import DashBoard from "./views/DashBoard"
import SendMoney from "./views/SendMoney"

function App() {
  return (
    <>
       <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/send" element={<SendMoney />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
