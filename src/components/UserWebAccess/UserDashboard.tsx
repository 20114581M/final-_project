import UserNavigation from "./UserNavigation";
import UserContentBody from "./UserContentBody";
import Footer from "./Footer";

function UserDashboard() {
  return (
    <div style={{ minHeight: "100vh", background: "#0a1a0a", display: "flex", flexDirection: "column" }}>
      <UserNavigation />
      <div style={{ flex: 1 }}>
        <UserContentBody />
      </div>
      <Footer />
    </div>
  );
}

export default UserDashboard;