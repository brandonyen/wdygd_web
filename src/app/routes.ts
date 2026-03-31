import { createBrowserRouter } from "react-router";
import Root from "./Root";
import { Dashboard } from "./components/Dashboard";
import { GitHubPage } from "./components/GitHubPage";
import { SlackPage } from "./components/SlackPage";
import { LinearPage } from "./components/LinearPage";
import { ProfilePage } from "./components/ProfilePage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Dashboard },
      { path: "github", Component: GitHubPage },
      { path: "slack", Component: SlackPage },
      { path: "linear", Component: LinearPage },
      { path: "profile", Component: ProfilePage },
    ],
  },
]);