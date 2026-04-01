import { createBrowserRouter } from "react-router";
import Root from "./Root";
import { Dashboard } from "./components/Dashboard";
import { GitHubPage } from "./components/GitHubPage";
import { SlackPage } from "./components/SlackPage";
import { LinearPage } from "./components/LinearPage";
import { ProfilePage } from "./components/ProfilePage";
import { IntegrationGate } from "./components/IntegrationGate";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Dashboard },
      {
        path: "github",
        element: (
          <IntegrationGate integrationId="github">
            <GitHubPage />
          </IntegrationGate>
        ),
      },
      {
        path: "slack",
        element: (
          <IntegrationGate integrationId="slack">
            <SlackPage />
          </IntegrationGate>
        ),
      },
      {
        path: "linear",
        element: (
          <IntegrationGate integrationId="linear">
            <LinearPage />
          </IntegrationGate>
        ),
      },
      { path: "profile", Component: ProfilePage },
    ],
  },
]);
