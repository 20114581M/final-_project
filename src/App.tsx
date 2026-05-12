import { BrowserRouter, Routes,Route } from "react-router-dom"
import MarketingWeb from "./components/MainMarketingWebsite/MarketingWeb"
import Login from "./login"
import AdminDashboard from "./components/AdminWebAcess/AdminDashboard"
import UserDashboard from "./components/UserWebAccess/UserDashboard"
import UserIssueTracker from "./components/UserWebAccess/UserIssueTracker"
function App() {

  return (
    <>
     <BrowserRouter basename="final-_project">
        <Routes>
           <Route path="/" element={<MarketingWeb />} />
           <Route path="/login" element={<Login />} />
           <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/user-dashboard/track" element={<UserIssueTracker />} />
        </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
