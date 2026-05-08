import { createBrowserRouter, Navigate } from "react-router";
import Root from "./Root";
import { Dashboard } from "./components/Dashboard";
import { GitHubPage } from "./components/GitHubPage";
import { SlackPage } from "./components/SlackPage";
import { ProfilePage } from "./components/ProfilePage";
import { IntegrationGate } from "./components/IntegrationGate";
import { CustomSummaryPage } from "./components/CustomSummaryPage";

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
      { path: "custom-summaries", Component: CustomSummaryPage },
      { path: "profile", Component: ProfilePage },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
