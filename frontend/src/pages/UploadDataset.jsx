import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/api"

function UploadDataset() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const fileName = useMemo(() => file?.name || "No file selected", [file])

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

      const datasetId = res.data?.dataset_id || res.data?.id
      navigate("/smart-dashboard?mode=csv", {
        state: {
          datasetId,
          fileName: file?.name || ""
        }
      })
    } catch (err) {
      alert(err?.response?.data?.detail || "Upload failed")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFile(null)
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 lg:flex-row">
      <header className="border-b border-slate-200 bg-white px-4 py-4 shadow-sm lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-700">AI BI Platform</p>
            <h1 className="text-lg font-semibold text-slate-900">Upload Dataset</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
            >
              Menu
            </button>
            <button
              onClick={() => navigate("/smart-dashboard")}
              className="rounded-lg bg-cyan-500 px-3 py-2 text-xs font-semibold text-slate-950"
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

      <aside
        className={`fixed inset-y-0 left-0 z-40 border-r border-slate-200 bg-white transition-all duration-300 ease-in-out shadow-sm flex-col lg:static lg:flex ${
          sidebarOpen ? "w-72" : "w-20"
        } ${mobileMenuOpen ? "flex translate-x-0" : "hidden -translate-x-full lg:translate-x-0 lg:flex"}`}
      >
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          {sidebarOpen ? (
            <div>
              <h1 className="text-lg font-bold text-slate-800">DataPulse AI</h1>
              <p className="text-xs text-slate-500">Analytics Hub</p>
            </div>
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mx-auto" />
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <svg
              className={`w-5 h-5 text-slate-600 transition-transform ${!sidebarOpen ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        <div className="p-4 space-y-2">
          <p className={`text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 ${!sidebarOpen && "hidden"}`}>
            Navigation
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-100 text-slate-700 transition-all"
          >
            <span className="text-sm font-medium">{sidebarOpen && "Dashboard"}</span>
          </button>
          <button
            onClick={() => navigate("/upload")}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-blue-600 text-white shadow-lg transition-all"
          >
            <span className="text-sm font-medium">{sidebarOpen && "Upload Dataset"}</span>
          </button>
          <button
            onClick={() => navigate("/smart-dashboard")}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-100 text-slate-700 transition-all"
          >
            <span className="text-sm font-medium">{sidebarOpen && "Smart Dashboard"}</span>
          </button>
        </div>

        <div className="flex-1" />

        <div className="p-4 space-y-2 border-t border-slate-200">
          <button
            onClick={() => {
              localStorage.removeItem("token")
              window.location.href = "/login"
            }}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 transition-all"
          >
            <span className="text-sm font-medium">{sidebarOpen && "Logout"}</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-700/80">
                Dataset Upload
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Add a dataset
              </h1>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                Upload a CSV file, then continue to Smart Dashboard to ask questions and generate insights there.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => navigate("/smart-dashboard")}
                className="w-full rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 sm:w-auto"
              >
                Open Smart Dashboard
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.95fr]">
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-xl font-semibold text-slate-900">Upload CSV</h2>
              <p className="mt-1 text-sm text-slate-500">
                Choose a CSV file from your computer and submit it to create a new dataset.
              </p>

              <div className="mt-5 rounded-3xl border border-dashed border-cyan-300 bg-cyan-50 p-6">
                <label className="block text-sm font-medium text-slate-700">
                  CSV file
                </label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="mt-3 block w-full text-sm text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-cyan-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-cyan-400"
                />
                <p className="mt-3 text-xs text-slate-500">{fileName}</p>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleUpload}
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {loading ? "Uploading..." : "Add Dataset"}
                </button>
                <button
                  onClick={resetForm}
                  type="button"
                  className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
                >
                  Reset
                </button>
              </div>
            </section>
          </div>

          <div className="mt-6 grid gap-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-slate-900">What happens next</h2>
              <p className="mt-3 text-sm text-slate-600">
                After upload, you will be redirected to Smart Dashboard. There you can type a prompt, ask questions about the dataset, and get the insights, SQL, and charts.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

export default UploadDataset
