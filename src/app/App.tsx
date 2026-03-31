import { useState } from "react";
import { RouterProvider } from "react-router";
import { LoginPage } from "./components/LoginPage";
import { router } from "./routes";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [connectedIntegrations, setConnectedIntegrations] = useState<string[]>([]);

  const handleLogin = (integrations: string[]) => {
    setConnectedIntegrations(integrations);
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return (
      <div className="size-full">
        <LoginPage onLogin={handleLogin} />
      </div>
    );
  }

  return <RouterProvider router={router} />;
}
