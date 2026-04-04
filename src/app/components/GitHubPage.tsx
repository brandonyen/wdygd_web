import { motion } from "motion/react";
import {
  GitBranch,
  GitCommit,
  GitPullRequest,
  Star,
  GitMerge,
} from "lucide-react";

interface Commit {
  id: string;
  message: string;
  repo: string;
  time: string;
  branch: string;
}

interface PullRequest {
  id: string;
  title: string;
  repo: string;
  status: "open" | "merged" | "closed";
  time: string;
}

export function GitHubPage() {
  // Mock data
  const commits: Commit[] = [
    {
      id: "1",
      message: "Add authentication middleware",
      repo: "backend-api",
      time: "2h ago",
      branch: "main",
    },
    {
      id: "2",
      message: "Fix responsive layout on mobile",
      repo: "web-app",
      time: "3h ago",
      branch: "feature/mobile-fix",
    },
    {
      id: "3",
      message: "Update dependencies to latest versions",
      repo: "backend-api",
      time: "4h ago",
      branch: "main",
    },
    {
      id: "4",
      message: "Implement dark mode toggle",
      repo: "web-app",
      time: "5h ago",
      branch: "feature/dark-mode",
    },
    {
      id: "5",
      message: "Add unit tests for payment flow",
      repo: "backend-api",
      time: "6h ago",
      branch: "test/payments",
    },
  ];

  const pullRequests: PullRequest[] = [
    {
      id: "1",
      title: "Refactor authentication system",
      repo: "backend-api",
      status: "merged",
      time: "1h ago",
    },
    {
      id: "2",
      title: "Add user profile page",
      repo: "web-app",
      status: "open",
      time: "2h ago",
    },
    {
      id: "3",
      title: "Fix memory leak in worker",
      repo: "backend-api",
      status: "merged",
      time: "4h ago",
    },
    {
      id: "4",
      title: "Update API documentation",
      repo: "docs",
      status: "open",
      time: "5h ago",
    },
  ];

  const stats = {
    commits: 23,
    pullRequests: 8,
    reviews: 12,
    repos: 3,
  };

  return (
    <div className="min-h-screen px-8 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: "var(--zen-sage-light)" }}
            >
              <GitBranch
                className="w-6 h-6"
                style={{ color: "var(--zen-sage-dark)" }}
              />
            </div>
            <h1
              className="text-4xl"
              style={{ color: "var(--zen-charcoal)", fontWeight: 300 }}
            >
              GitHub Activity
            </h1>
          </div>
          <p
            className="text-lg ml-15"
            style={{ color: "var(--zen-charcoal-light)" }}
          >
            Your code contributions and collaboration
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <div className="p-6 rounded-2xl" style={{ backgroundColor: "white" }}>
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-sm"
                style={{ color: "var(--zen-charcoal-light)" }}
              >
                Commits
              </span>
              <GitCommit
                className="w-4 h-4"
                style={{ color: "var(--zen-sage)" }}
              />
            </div>
            <p
              className="text-3xl"
              style={{ color: "var(--zen-charcoal)", fontWeight: 300 }}
            >
              {stats.commits}
            </p>
          </div>

          <div className="p-6 rounded-2xl" style={{ backgroundColor: "white" }}>
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-sm"
                style={{ color: "var(--zen-charcoal-light)" }}
              >
                Pull Requests
              </span>
              <GitPullRequest
                className="w-4 h-4"
                style={{ color: "var(--zen-sage)" }}
              />
            </div>
            <p
              className="text-3xl"
              style={{ color: "var(--zen-charcoal)", fontWeight: 300 }}
            >
              {stats.pullRequests}
            </p>
          </div>

          <div className="p-6 rounded-2xl" style={{ backgroundColor: "white" }}>
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-sm"
                style={{ color: "var(--zen-charcoal-light)" }}
              >
                Reviews
              </span>
              <Star className="w-4 h-4" style={{ color: "var(--zen-sage)" }} />
            </div>
            <p
              className="text-3xl"
              style={{ color: "var(--zen-charcoal)", fontWeight: 300 }}
            >
              {stats.reviews}
            </p>
          </div>

          <div className="p-6 rounded-2xl" style={{ backgroundColor: "white" }}>
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-sm"
                style={{ color: "var(--zen-charcoal-light)" }}
              >
                Repositories
              </span>
              <GitBranch
                className="w-4 h-4"
                style={{ color: "var(--zen-sage)" }}
              />
            </div>
            <p
              className="text-3xl"
              style={{ color: "var(--zen-charcoal)", fontWeight: 300 }}
            >
              {stats.repos}
            </p>
          </div>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Commits */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-8 rounded-3xl space-y-6"
            style={{ backgroundColor: "white" }}
          >
            <h3 style={{ color: "var(--zen-charcoal)" }}>Recent Commits</h3>
            <div className="space-y-4">
              {commits.map((commit, index) => (
                <motion.div
                  key={commit.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                  className="p-4 rounded-xl border"
                  style={{
                    borderColor: "var(--zen-sand)",
                    backgroundColor: "var(--zen-off-white)",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
                      style={{ backgroundColor: "var(--zen-sage-light)" }}
                    >
                      <GitCommit
                        className="w-4 h-4"
                        style={{ color: "var(--zen-sage-dark)" }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="mb-1"
                        style={{ color: "var(--zen-charcoal)" }}
                      >
                        {commit.message}
                      </p>
                      <div
                        className="flex items-center gap-3 text-sm"
                        style={{ color: "var(--zen-charcoal-light)" }}
                      >
                        <span className="truncate">{commit.repo}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <GitBranch className="w-3 h-3" />
                          {commit.branch}
                        </span>
                        <span>•</span>
                        <span>{commit.time}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Pull Requests */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-8 rounded-3xl space-y-6"
            style={{ backgroundColor: "white" }}
          >
            <h3 style={{ color: "var(--zen-charcoal)" }}>Pull Requests</h3>
            <div className="space-y-4">
              {pullRequests.map((pr, index) => (
                <motion.div
                  key={pr.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                  className="p-4 rounded-xl border"
                  style={{
                    borderColor: "var(--zen-sand)",
                    backgroundColor: "var(--zen-off-white)",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
                      style={{
                        backgroundColor:
                          pr.status === "merged"
                            ? "var(--zen-sage-light)"
                            : pr.status === "open"
                              ? "var(--zen-blue)"
                              : "var(--zen-sand)",
                      }}
                    >
                      {pr.status === "merged" ? (
                        <GitMerge
                          className="w-4 h-4"
                          style={{ color: "var(--zen-sage-dark)" }}
                        />
                      ) : (
                        <GitPullRequest
                          className="w-4 h-4"
                          style={{ color: "white" }}
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="mb-1"
                        style={{ color: "var(--zen-charcoal)" }}
                      >
                        {pr.title}
                      </p>
                      <div
                        className="flex items-center gap-3 text-sm"
                        style={{ color: "var(--zen-charcoal-light)" }}
                      >
                        <span className="truncate">{pr.repo}</span>
                        <span>•</span>
                        <span className="capitalize">{pr.status}</span>
                        <span>•</span>
                        <span>{pr.time}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
