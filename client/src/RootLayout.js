import { Outlet } from "react-router-dom";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";

function RootLayout() {
  return (
    <div style={{backgroundColor:"#BAE3EE"}}>
      <Header />
      <div style={{ minHeight: "70vh" }}>
        <div className="container">
          {" "}
          <Outlet />
        </div>
      </div>
      <div style={{ marginTop: "100px" }}>
        <Footer />
      </div>
    </div>
  );
}

export default RootLayout;
