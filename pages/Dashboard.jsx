"use client";
import Routes from "./Routes";

function Dashboard() {
  console.log("process ----.", process.env.BASE_URL);
  return (
    <div>
      <Routes />
    </div>
  );
}

export default Dashboard;
