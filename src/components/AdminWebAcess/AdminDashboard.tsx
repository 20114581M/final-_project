import AdminContent from "./AdminContent"
import AdminNvigation from "./AdminNvigation"           
function AdminDashboard() {
  return (
    <div style={{ minHeight: "100vh", background: "#0a1a0a", display: "flex", flexDirection: "column" }}>
        <AdminNvigation />
        <AdminContent />
    </div>
  )
}

export default AdminDashboard
