import { Outlet } from "react-router";
import { Navigation } from "./components/Navigation";

export default function Root() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Outlet />
    </div>
  );
}
