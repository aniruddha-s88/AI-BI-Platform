import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/api"

function Dashboard() {
  const navigate = useNavigate()
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const loadSummary = async () => {
      try {
        setLoading(true)
        const res = await api.get("/database/summary")
        setSummary(res.data?.data || null)
      } catch (err) {
        setError(err?.response?.data?.detail || "Failed to load dashboard")
      } finally {
        setLoading(false)
      }
    }

    loadSummary()
  }, [])

  const stats = summary?.stats || {
    datasets: 0,
    queries: 0,
    insights: 0,
    reports: 0
  }

  const datasets = summary?.recent_datasets || []
  const activity = summary?.recent_activity || []

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 lg:flex-row">
      <header className="border-b border-slate-200 bg-white px-4 py-4 shadow-sm lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-700">AI BI Platform</p>
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
            >
              Menu
            </button>
            <button
              onClick={() => navigate("/upload")}
              className="rounded-lg bg-cyan-500 px-3 py-2 text-xs font-semibold text-slate-950"
            >
              Upload
            </button>
            <button
              onClick={() => navigate("/smart-dashboard")}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
            >
              Smart
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      ) : null}

      <aside className={`fixed inset-y-0 left-0 z-40 w-72 flex-col border-r border-slate-200 bg-white shadow-sm transition-transform lg:static lg:flex ${mobileMenuOpen ? "flex translate-x-0" : "hidden -translate-x-full lg:translate-x-0 lg:flex"}`}>
        <div className="border-b border-slate-200 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-700">AI BI Platform</p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-2 text-sm text-slate-500">
            Navigate datasets, uploads, and smart analysis from one place.
          </p>
        </div>

        <nav className="space-y-2 p-4">
          <button className="w-full rounded-xl bg-slate-900 px-4 py-3 text-left text-sm font-semibold text-white">
            Overview
          </button>
          <button
            onClick={() => navigate("/upload")}
            className="w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Upload Dataset
          </button>
          <button
            onClick={() => navigate("/smart-dashboard")}
            className="w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Smart Dashboard
          </button>
        </nav>

        <div className="mt-auto border-t border-slate-200 p-4">
          <button
            onClick={() => {
              localStorage.removeItem("token")
              window.location.href = "/login"
            }}
            className="w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.14),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),transparent_35%)]" />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-700/80">Overview</p>
                <h2 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                  {loading ? "Loading your workspace..." : "Your data workspace, live and ready."}
                </h2>
                <p className="mt-4 max-w-2xl text-sm text-slate-600">
                  {error
                    ? error
                    : "Upload datasets, switch to Smart Dashboard, and analyze everything from a single control center."}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => navigate("/upload")}
                  className="w-full rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 sm:w-auto"
                >
                  Add Dataset
                </button>
                <button
                  onClick={() => navigate("/smart-dashboard")}
                  className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
                >
                  Open Smart Dashboard
                </button>
              </div>
            </div>
          </section>

          <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Datasets", value: stats.datasets, hint: "Connected sources" },
              { label: "Queries", value: stats.queries, hint: "Prompt history" },
              { label: "Insights", value: stats.insights, hint: "Recent activity" },
              { label: "Reports", value: stats.reports, hint: "Derived from usage" }
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="text-sm text-slate-500">{item.label}</p>
                <p className="mt-3 text-3xl font-semibold text-slate-950">{item.value}</p>
                <p className="mt-2 text-xs text-slate-500">{item.hint}</p>
              </div>
            ))}
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">Recent Datasets</h3>
                  <p className="mt-1 text-sm text-slate-500">Latest connected sources.</p>
                </div>
                <button
                  onClick={() => navigate("/upload")}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Upload New
                </button>
              </div>

              {loading ? (
                <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                  Loading datasets...
                </div>
              ) : datasets.length > 0 ? (
                <div className="mt-5 space-y-3">
                  {datasets.map((dataset) => (
                    <div
                      key={dataset.name}
                      className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">{dataset.name}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          {dataset.rows} · Updated {dataset.updated}
                        </p>
                      </div>
                      <span className="inline-flex w-fit rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-800">
                        {dataset.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
                  No datasets yet. Upload one to start tracking it here.
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-950">Recent Activity</h3>
              <p className="mt-1 text-sm text-slate-500">
                The latest questions and queries from your workspace.
              </p>

              <div className="mt-5 space-y-3">
                {activity.length > 0 ? (
                  activity.map((entry) => (
                    <div
                      key={`${entry.label}-${entry.meta}`}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                    >
                      <p className="font-medium text-slate-900">{entry.label}</p>
                      <p className="mt-1 text-xs text-slate-500">{entry.meta}</p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                    No recent queries yet. Ask something in Smart Dashboard.
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
