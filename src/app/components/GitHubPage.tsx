import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  GitBranch,
  GitCommit,
  GitPullRequest,
  Star,
  GitMerge,
} from "lucide-react";

const API_URL = import.meta.env.DEV
  ? "/api/github"
  : "https://28gthv6fu1.execute-api.us-east-1.amazonaws.com/prod/github";

interface GitHubData {
  commits: { sha: string; message: string; author: string; date: string; url: string }[];
  pullRequests: { number: number; title: string; state: "open" | "closed" | "merged"; author: string; createdAt: string; url: string }[];
  stats: { totalCommits: number; totalPRsOpened: number; totalPRsMerged: number; totalReviews: number };
}

function fallbackGitHubData(): GitHubData {
  return {
    commits: [
      {
        sha: "demo1",
        message: "Set up Cognito login flow",
        author: "You",
        date: new Date().toISOString(),
        url: "#",
      },
      {
        sha: "demo2",
        message: "Fix CORS handling for signup endpoint",
        author: "You",
        date: new Date(Date.now() - 86_400_000).toISOString(),
        url: "#",
      },
    ],
    pullRequests: [
      {
        number: 101,
        title: "Add Cognito auth integration",
        state: "open",
        author: "You",
        createdAt: new Date().toISOString(),
        url: "#",
      },
    ],
    stats: {
      totalCommits: 2,
      totalPRsOpened: 1,
      totalPRsMerged: 0,
      totalReviews: 0,
    },
  };
}

export function GitHubPage() {
  const [data, setData] = useState<GitHubData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 90);

    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            githubToken: import.meta.env.VITE_GITHUB_TOKEN,
            owner: "brandonyen",
            repo: "wdygd_web",
            startDate: start.toISOString(),
            endDate: end.toISOString(),
          }),
        });

        if (!response.ok) {
          throw new Error(`GitHub API request failed: ${response.status}`);
        }

        const json = (await response.json()) as GitHubData;
        setData(json);
      } catch (err) {
        setData(fallbackGitHubData());
        if (err instanceof Error) {
          setError(`${err.message}. Showing local demo data.`);
        } else {
          setError("GitHub data is unavailable. Showing local demo data.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const commits = data?.commits ?? [];
  const pullRequests = data?.pullRequests ?? [];
  const stats = {
    commits: data?.stats.totalCommits ?? 0,
    pullRequests: data?.stats.totalPRsOpened ?? 0,
    reviews: data?.stats.totalReviews ?? 0,
    merged: data?.stats.totalPRsMerged ?? 0,
  };

  return (
    <div className="px-8 py-8">
      <div className="max-w-7xl mx-auto lg:h-full flex flex-col gap-8">
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
          {error && (
            <p className="text-sm mt-2 ml-15" style={{ color: "#c45c5c" }}>
              {error}
            </p>
          )}
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <div className="p-6 rounded-2xl" style={{ backgroundColor: "var(--card)" }}>
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

          <div className="p-6 rounded-2xl" style={{ backgroundColor: "var(--card)" }}>
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

          <div className="p-6 rounded-2xl" style={{ backgroundColor: "var(--card)" }}>
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

          <div className="p-6 rounded-2xl" style={{ backgroundColor: "var(--card)" }}>
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-sm"
                style={{ color: "var(--zen-charcoal-light)" }}
              >
                Merged
              </span>
              <GitMerge
                className="w-4 h-4"
                style={{ color: "var(--zen-sage)" }}
              />
            </div>
            <p
              className="text-3xl"
              style={{ color: "var(--zen-charcoal)", fontWeight: 300 }}
            >
              {stats.merged}
            </p>
          </div>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:flex-1 lg:min-h-0">
          {/* Recent Commits */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="pl-8 pt-8 pb-8 pr-6 rounded-3xl space-y-6 max-h-[52vh] flex flex-col lg:min-h-0"
            style={{ backgroundColor: "var(--card)" }}
          >
            <h3 style={{ color: "var(--zen-charcoal)" }}>Recent Commits</h3>
            {isLoading && (
              <p className="text-sm" style={{ color: "var(--zen-charcoal-light)" }}>
                Loading GitHub data...
              </p>
            )}
            <div className="space-y-4 overflow-y-auto pr-1 flex-1 min-h-0 pr-3">
              {commits.map((commit, index) => (
                <motion.div
                  key={commit.sha}
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
                        <span className="truncate">{commit.author}</span>
                        <span>•</span>
                        <span>{new Date(commit.date).toLocaleDateString()}</span>
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
            className="pl-8 pt-8 pb-8 pr-6 rounded-3xl space-y-6 max-h-[52vh] flex flex-col lg:min-h-0"
            style={{ backgroundColor: "var(--card)" }}
          >
            <h3 style={{ color: "var(--zen-charcoal)" }}>Pull Requests</h3>
            {isLoading && (
              <p className="text-sm" style={{ color: "var(--zen-charcoal-light)" }}>
                Loading GitHub data...
              </p>
            )}
            <div className="space-y-4 overflow-y-auto pr-1 flex-1 min-h-0 pr-3">
              {pullRequests.map((pr, index) => (
                <motion.div
                  key={pr.number}
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
                          pr.state === "merged"
                            ? "var(--zen-sage-light)"
                            : pr.state === "open"
                              ? "var(--zen-blue)"
                              : "var(--zen-sand)",
                      }}
                    >
                      {pr.state === "merged" ? (
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
                        <span className="truncate">{pr.author}</span>
                        <span>•</span>
                        <span className="capitalize">{pr.state}</span>
                        <span>•</span>
                        <span>{new Date(pr.createdAt).toLocaleDateString()}</span>
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
