import { useMemo, useState } from "react"
import api from "../api/api"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts"

function UploadDataset() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState([])
  const [insights, setInsights] = useState([])
  const [profile, setProfile] = useState(null)
  const [chartRecommendations, setChartRecommendations] = useState([])
  const [loading, setLoading] = useState(false)
  const pieColors = ["#06b6d4", "#3b82f6", "#8b5cf6", "#14b8a6", "#f59e0b"]

  const fileName = useMemo(() => file?.name || "No file selected", [file])
  const previewColumns = preview.length > 0 ? Object.keys(preview[0]) : []

  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] || null)
  }

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a CSV file")
      return
    }

    const formData = new FormData()
    formData.append("file", file)

    try {
      setLoading(true)

      const res = await api.post("/upload/csv", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })

      const data = res.data || {}
      setPreview(data.preview || [])
      setInsights(data.insights || [])
      setProfile(data.profile || null)
      setChartRecommendations(data.chart_recommendations || [])
    } catch (err) {
      alert(err?.response?.data?.detail || "Upload failed")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFile(null)
    setPreview([])
    setInsights([])
    setProfile(null)
    setChartRecommendations([])
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/80">
            Dataset Upload
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Upload a dataset
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-300">
            Add a CSV file and the app will return a dataset profile, AI insights, and a data preview.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-black/20">
            <h2 className="text-xl font-semibold">Upload CSV</h2>
            <p className="mt-1 text-sm text-slate-400">
              Uploading stores the dataset so you can ask questions later in Smart Dashboard.
            </p>

            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-dashed border-white/15 bg-slate-950/50 p-5">
                <label className="block text-sm font-medium text-slate-300">
                  CSV file
                </label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="mt-3 block w-full text-sm text-slate-300 file:mr-4 file:rounded-xl file:border-0 file:bg-cyan-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-950 hover:file:bg-cyan-400"
                />
                <p className="mt-3 text-xs text-slate-500">
                  {fileName}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleUpload}
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Uploading..." : "Upload & Analyze"}
                </button>
                <button
                  onClick={resetForm}
                  type="button"
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                >
                  Reset
                </button>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-xl shadow-black/20">
                <p className="text-sm text-slate-400">Rows</p>
                <p className="mt-2 text-3xl font-semibold">
                  {profile?.rows ?? "-"}
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-xl shadow-black/20">
                <p className="text-sm text-slate-400">Columns</p>
                <p className="mt-2 text-3xl font-semibold">
                  {profile?.columns ?? "-"}
                </p>
              </div>
            </div>

            {profile ? (
              <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-black/20">
                <h2 className="text-lg font-semibold">Dataset Profile</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Column Names
                    </p>
                    <p className="mt-2 text-sm text-slate-300">
                      {profile.column_names?.join(", ")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Numeric Columns
                    </p>
                    <p className="mt-2 text-sm text-slate-300">
                      {profile.numeric_columns?.join(", ") || "None"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Categorical Columns
                    </p>
                    <p className="mt-2 text-sm text-slate-300">
                      {profile.categorical_columns?.join(", ") || "None"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Next Step
                    </p>
                    <p className="mt-2 text-sm text-slate-300">
                      Use Smart Dashboard to ask questions about this dataset.
                    </p>
                  </div>
                </div>
              </section>
            ) : null}

          {chartRecommendations.length > 0 ? (
              <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-black/20">
                <h2 className="text-lg font-semibold">Recommended Charts</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {chartRecommendations.map((chart, index) => (
                    <span
                      key={index}
                      className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200"
                    >
                      {chart.chart_type}
                    </span>
                  ))}
                </div>
              </section>
            ) : null}

            {preview.length > 0 && previewColumns.length >= 2 ? (
              <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-black/20">
                <h2 className="text-lg font-semibold">Visualization</h2>
                <p className="mt-1 text-sm text-slate-400">
                  A quick chart generated from the uploaded data preview.
                </p>

                <div className="mt-4 h-[320px] rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartRecommendations.some((chart) => chart.chart_type === "pie") ? (
                      <PieChart>
                        <Pie
                          data={preview}
                          dataKey={previewColumns[1]}
                          nameKey={previewColumns[0]}
                          outerRadius={110}
                          label
                        >
                          {preview.map((_, index) => (
                            <Cell key={index} fill={pieColors[index % pieColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    ) : (
                      <BarChart data={preview}>
                        <XAxis dataKey={previewColumns[0]} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey={previewColumns[1]} fill="#06b6d4" />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </section>
            ) : null}
          </section>
        </div>

        <div className="mt-6 grid gap-6">
          {insights.length > 0 ? (
            <section className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6 shadow-xl shadow-black/20">
              <h2 className="text-lg font-semibold text-cyan-100">
                AI Insights
              </h2>
              <ul className="mt-4 space-y-2 text-sm text-cyan-50/90">
                {insights.map((ins, i) => (
                  <li
                    key={i}
                    className="rounded-xl border border-cyan-300/10 bg-slate-950/40 px-4 py-3"
                  >
                    {ins}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {preview.length > 0 ? (
            <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-black/20">
              <h2 className="text-lg font-semibold">Preview</h2>
              <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
                <table className="min-w-full divide-y divide-white/10 text-sm">
                  <thead className="bg-white/5">
                    <tr>
                      {Object.keys(preview[0]).map((key) => (
                        <th
                          key={key}
                          className="px-4 py-3 text-left font-semibold text-slate-200"
                        >
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {preview.map((row, i) => (
                      <tr key={i} className="hover:bg-white/5">
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
            </section>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default UploadDataset
