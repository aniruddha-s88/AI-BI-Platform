import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/api"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie
} from "recharts"

function Dashboard() {
  const navigate = useNavigate()

  const [question, setQuestion] = useState("")
  const [results, setResults] = useState([])
  const [sql, setSql] = useState("")
  const [insights, setInsights] = useState([])
  const [chartType, setChartType] = useState("table")
  const [loading, setLoading] = useState(false)
  const [uploadFile, setUploadFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  const handleQuery = async () => {
    if (!question.trim()) return

    try {
      setLoading(true)

      const res = await api.post("/analytics/query", {
        connection_id: 9,
        question
      })

      const data = res.data.data

      setResults(data.results || [])
      setSql(data.generated_sql || "")
      setInsights(data.insights || [])
      setChartType(data.chart_type || "table")
    } catch {
      alert("Query failed")
    } finally {
      setLoading(false)
    }
  }

  const handleUploadCsv = async () => {
    if (!uploadFile) {
      alert("Please select a CSV file")
      return
    }

    const formData = new FormData()
    formData.append("file", uploadFile)

    try {
      setUploading(true)

      await api.post("/upload/csv", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })

      navigate("/smart-dashboard?mode=csv")
    } catch (err) {
      alert(err?.response?.data?.detail || "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <aside className="w-72 border-r border-white/10 bg-slate-950/95 p-6">
        <h1 className="text-2xl font-bold tracking-tight">AI Analytics</h1>

        <nav className="mt-8 space-y-2 text-sm">
          <button
            className="block w-full rounded-xl bg-white/5 px-4 py-3 text-left font-medium hover:bg-white/10"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>
          <button
            className="block w-full rounded-xl bg-white/5 px-4 py-3 text-left font-medium hover:bg-white/10"
            onClick={() => navigate("/smart-dashboard")}
          >
            Smart Dashboard
          </button>
          <button
            className="block w-full rounded-xl bg-white/5 px-4 py-3 text-left font-medium hover:bg-white/10"
            onClick={() => navigate("/upload")}
          >
            Upload Page
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("token")
              window.location.href = "/login"
            }}
            className="mt-8 text-left text-rose-400 hover:text-rose-300"
          >
            Logout
          </button>
        </nav>
      </aside>

      <main className="flex-1 overflow-auto p-8">
        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20">
            <h2 className="text-xl font-semibold">Ask your database</h2>
            <p className="mt-1 text-sm text-slate-400">
              Query your connected database from here.
            </p>

            <div className="mt-5 flex gap-3">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask anything about your data..."
                className="flex-1 rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm outline-none placeholder:text-slate-500 focus:border-cyan-400/50"
              />
              <button
                onClick={handleQuery}
                className="rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-400"
              >
                {loading ? "Thinking..." : "Ask"}
              </button>
            </div>

            {sql && (
              <div className="mt-6 rounded-2xl bg-slate-950/80 p-4 text-green-400">
                <p className="mb-2 text-sm">Generated SQL</p>
                <pre className="overflow-x-auto text-sm">{sql}</pre>
              </div>
            )}

            {insights.length > 0 && (
              <div className="mt-6 rounded-2xl bg-cyan-400/10 p-5">
                <h3 className="mb-3 text-lg font-semibold text-cyan-100">AI Insights</h3>
                <ul className="list-disc space-y-2 pl-5 text-sm text-cyan-50/90">
                  {insights.map((i, idx) => (
                    <li key={idx}>{i}</li>
                  ))}
                </ul>
              </div>
            )}

            {results.length > 0 && (
              <div className="mt-6 overflow-auto rounded-2xl border border-white/10 bg-slate-950/50">
                <table className="w-full text-sm">
                  <thead className="bg-white/5">
                    <tr>
                      {Object.keys(results[0]).map((key) => (
                        <th key={key} className="border-b border-white/10 px-4 py-3 text-left">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((row, i) => (
                      <tr key={i} className="border-b border-white/10">
                        {Object.values(row).map((val, j) => (
                          <td key={j} className="px-4 py-3 text-slate-300">
                            {String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {results.length > 0 && Object.keys(results[0]).length >= 2 && (
              <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/50 p-5">
                <h3 className="mb-4 text-base font-semibold">Visualization</h3>
                {chartType === "bar" && (
                  <BarChart width={600} height={300} data={results}>
                    <XAxis dataKey={Object.keys(results[0])[0]} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey={Object.keys(results[0])[1]} />
                  </BarChart>
                )}
                {chartType === "pie" && (
                  <PieChart width={400} height={300}>
                    <Pie
                      data={results}
                      dataKey={Object.keys(results[0])[1]}
                      nameKey={Object.keys(results[0])[0]}
                      outerRadius={100}
                      label
                    />
                  </PieChart>
                )}
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20">
            <h2 className="text-xl font-semibold">Upload CSV</h2>
            <p className="mt-1 text-sm text-slate-400">
              Upload the file here, then continue to Smart Dashboard to ask questions with a prompt.
            </p>

            <div className="mt-5 rounded-2xl border border-dashed border-white/15 bg-slate-950/50 p-5">
              <label className="block text-sm font-medium text-slate-300">CSV file</label>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                className="mt-3 block w-full text-sm text-slate-300 file:mr-4 file:rounded-xl file:border-0 file:bg-cyan-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-950 hover:file:bg-cyan-400"
              />
              <p className="mt-3 text-xs text-slate-500">
                {uploadFile?.name || "No file selected"}
              </p>
            </div>

            <button
              onClick={handleUploadCsv}
              disabled={uploading}
              className="mt-4 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploading ? "Uploading..." : "Upload and Continue"}
            </button>

            <div className="mt-6 rounded-2xl bg-white/5 p-4 text-sm text-slate-300">
              After upload, go to Smart Dashboard and enter your prompt there to generate AI results.
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
