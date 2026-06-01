import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import api from "../api/api"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, LineChart, Line,
  ScatterChart, Scatter, ZAxis, ResponsiveContainer, Legend
} from "recharts"
import { Cell } from "recharts"

function SmartDashboard() {
  const navigate = useNavigate()
  const location = useLocation()

  const [question, setQuestion] = useState("")
  const [results, setResults] = useState([])
  const [chartData, setChartData] = useState([])
  const [insights, setInsights] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [sql, setSql] = useState("")
  const [chartType, setChartType] = useState("")
  const [loading, setLoading] = useState(false)

  const [kpis, setKpis] = useState([])
  const [charts, setCharts] = useState([])

  const [connections, setConnections] = useState([])
  const [selectedConnectionId, setSelectedConnectionId] = useState("")
  const [mode, setMode] = useState("db")
  const [showSql, setShowSql] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showDataResults, setShowDataResults] = useState(false)

  const COLORS = [
    "#3b82f6", "#10b981", "#f59e0b",
    "#ef4444", "#8b5cf6", "#06b6d4"
  ]

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get("mode") === "csv") {
      setMode("csv")
    }
  }, [location.search])

  useEffect(() => {
    const loadConnections = async () => {
      try {
        const res = await api.get("/database/connections")
        const list = res.data?.data || []
        setConnections(list)
        if (list.length > 0) {
          setSelectedConnectionId(String(list[0].id))
        }
      } catch (err) {
        console.error("Failed to load connections", err)
      }
    }
    loadConnections()
  }, [])

  const handleLogout = () => {
    // Clear any stored tokens/auth data
    localStorage.removeItem("token")
    sessionStorage.clear()
    // Redirect to homepage
    navigate("/")
  }

  const handleAsk = async () => {
    if (!question.trim()) return

    try {
      setLoading(true)

      if (mode === "db") {
        const res = await api.post("/analytics/query", {
          connection_id: Number(selectedConnectionId),
          question
        })

        const data = res.data.data

        setResults(data.results || [])
        setInsights(data.insights || [])
        setRecommendations(data.recommendations || [])
        setSql(data.generated_sql || "")
        setChartType(data.chart_type || "")
        setKpis(data.kpis || [])
        setCharts(data.charts || [])
        setChartData([])
      } else {
        const res = await api.post("/csv/ask", null, {
          params: { question }
        })

        const data = res.data
        const dashboard = data.dashboard || {}

        setResults(data.results || [])
        setInsights(data.insights || dashboard.insights || [])
        setRecommendations(data.recommendations || dashboard.recommendations || [])
        setKpis(data.kpis || dashboard.kpis || [])
        setCharts(data.charts || dashboard.charts || [])
        setChartData(data.chart_data || data.results || [])
        setChartType(data.chart_type || dashboard.chart_type || "")
        setSql("")
      }
    } catch (err) {
      console.error("Query error:", err)
      alert(err?.response?.data?.detail || "Error processing your query")
    } finally {
      setLoading(false)
    }
  }

  const tooltipStyle = {
    backgroundColor: "rgba(15, 23, 42, 0.95)",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    borderRadius: "8px",
    padding: "12px",
    color: "#e2e8f0",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
  }

  const axisStyle = { fill: "#64748b", fontSize: 11, fontWeight: 500 }

  const toNumeric = (value) => {
    if (typeof value === "number") return value
    const parsed = Number(String(value).replace(/,/g, ""))
    return Number.isFinite(parsed) ? parsed : null
  }

  const isNumericColumn = (rows, key) =>
    rows.some((row) => toNumeric(row?.[key]) !== null)

  const getFirstNumericKey = (rows) =>
    Object.keys(rows[0] || {}).find((key) => isNumericColumn(rows, key)) || ""

  const getFirstCategoricalKey = (rows, numericKey = "") =>
    Object.keys(rows[0] || {}).find((key) => key !== numericKey && !isNumericColumn(rows, key)) || ""

  const getSecondNumericKey = (rows, firstKey = "") =>
    Object.keys(rows[0] || {}).find((key) => key !== firstKey && isNumericColumn(rows, key)) || ""

  const getPromptIntent = (questionText) => {
    const text = (questionText || question || "").toLowerCase()
    if (text.includes("compare") || text.includes("vs") || text.includes("versus") || text.includes("difference")) return "comparison"
    if (text.includes("trend") || text.includes("over time") || text.includes("month") || text.includes("weekly") || text.includes("daily")) return "trend"
    if (text.includes("distribution") || text.includes("breakdown") || text.includes("share") || text.includes("percentage") || text.includes("mix")) return "distribution"
    if (text.includes("relationship") || text.includes("correlation") || text.includes("scatter")) return "relationship"
    if (text.includes("sales") || text.includes("revenue") || text.includes("profit") || text.includes("orders")) return "sales"
    if (text.includes("furniture")) return "furniture"
    if (text.includes("customer") || text.includes("client")) return "customer"
    if (text.includes("product") || text.includes("item")) return "product"
    if (text.includes("inventory") || text.includes("stock")) return "inventory"
    return "general"
  }

  const getIntentLabel = (intent) => {
    switch (intent) {
      case "comparison":
        return "Comparison"
      case "trend":
        return "Trend"
      case "distribution":
        return "Distribution"
      case "relationship":
        return "Relationship"
      case "sales":
        return "Sales"
      case "furniture":
        return "Furniture"
      case "customer":
        return "Customer"
      case "product":
        return "Product"
      case "inventory":
        return "Inventory"
      default:
        return "Analytics"
    }
  }

  const getSortDirection = (questionText, chartSort = "") => {
    if (chartSort === "asc" || chartSort === "desc") return chartSort
    const text = (questionText || question || "").toLowerCase()
    if (text.includes("lowest") || text.includes("least") || text.includes("smallest") || text.includes("bottom")) return "asc"
    if (text.includes("highest") || text.includes("top") || text.includes("most") || text.includes("largest") || text.includes("best")) return "desc"
    return "desc"
  }

  const sanitizeChartLabel = (value, questionText, fallbackIndex = 0) => {
    const label = String(value ?? "").trim()
    const intent = getPromptIntent(questionText)

    if (!label) {
      return `Item ${fallbackIndex + 1}`
    }

    if (intent === "furniture") {
      const furnitureTerms = [
        "furniture", "chair", "table", "sofa", "desk", "bed",
        "cabinet", "shelf", "storage", "office", "home", "wood",
        "dining", "living", "bedroom"
      ]
      const lowered = label.toLowerCase()
      const hit = furnitureTerms.find((term) => lowered.includes(term))
      if (hit) {
        return hit.charAt(0).toUpperCase() + hit.slice(1)
      }
      return "Furniture"
    }

    const cleaned = label
      .replace(/\bclass\b/gi, "")
      .replace(/\bstandard\b/gi, "")
      .replace(/\s+/g, " ")
      .trim()
    return cleaned || `Item ${fallbackIndex + 1}`
  }

  const aggregateChartData = (rows, xKey, yKey, chartSort = "") => {
    const grouped = new Map()

    rows.forEach((row, index) => {
      const rawLabel =
        row?.[xKey] ??
        row?.category ??
        row?.name ??
        row?.label ??
        `Item ${index + 1}`
      const label = sanitizeChartLabel(rawLabel, question, index)
      const numericValue = toNumeric(row?.[yKey])
      const fallbackValue = numericValue ?? 1

      const current = grouped.get(label) || 0
      grouped.set(label, current + fallbackValue)
    })

    const direction = getSortDirection(question, chartSort)
    return Array.from(grouped.entries())
      .map(([label, value]) => ({
        __x: label,
        __y: value
      }))
      .sort((a, b) => direction === "asc" ? a.__y - b.__y : b.__y - a.__y)
  }

  const normalizeChartData = (rows, xKey, yKey) =>
    rows.map((row, index) => ({
      ...row,
      __x:
        sanitizeChartLabel(
          row?.[xKey] ??
          row?.category ??
          row?.name ??
          row?.label ??
          `Item ${index + 1}`,
          question,
          index
        ),
      __y: toNumeric(row?.[yKey])
    }))

  const buildScatterData = (dataToUse, xKey, yKey) =>
    dataToUse
      .map((row) => ({
        x: toNumeric(row?.[xKey]),
        y: toNumeric(row?.[yKey])
      }))
      .filter((point) => point.x !== null && point.y !== null)

  const renderChart = (c, dataToUse, xKey, yKey, index) => {
    const chartType = c.type || c.chart_type
    const safeXKey = xKey || getFirstCategoricalKey(dataToUse, yKey) || Object.keys(dataToUse[0] || {})[0]
    const safeYKey = yKey || getFirstNumericKey(dataToUse) || Object.keys(dataToUse[0] || {})[1]

    if (chartType === "bar") {
      const barData = aggregateChartData(dataToUse, safeXKey, safeYKey, c.sort || "")
      return (
        <BarChart data={barData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
          <XAxis dataKey="__x" tick={axisStyle} />
          <YAxis tick={axisStyle} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
          <Bar dataKey="__y" fill={COLORS[index % COLORS.length]} radius={[6, 6, 0, 0]} />
        </BarChart>
      )
    }

    if (chartType === "line") {
      const lineData = dataToUse.map((row, index) => ({
        ...row,
        __x:
          sanitizeChartLabel(
            row?.[safeXKey] ??
            row?.category ??
            row?.name ??
            row?.label ??
            `Item ${index + 1}`,
            question,
            index
          ),
        __y: toNumeric(row?.[safeYKey])
      }))
      return (
        <LineChart data={lineData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
          <XAxis dataKey="__x" tick={axisStyle} />
          <YAxis tick={axisStyle} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
          <Line
            dataKey="__y"
            stroke={COLORS[index % COLORS.length]}
            strokeWidth={2.5}
            dot={{ r: 4, fill: COLORS[index % COLORS.length] }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      )
    }

    if (chartType === "pie") {
      const pieData = aggregateChartData(dataToUse.slice(0, 25), safeXKey, safeYKey, c.sort || "").slice(0, 8)

      return (
        <PieChart>
          <Pie
            data={pieData}
            dataKey="__y"
            nameKey="__x"
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={50}
            paddingAngle={2}
            label={({ name, percent }) => `${sanitizeChartLabel(name, question)}: ${(percent * 100).toFixed(0)}%`}
          >
            {pieData.map((_, idx) => (
              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
        </PieChart>
      )
    }

    if (chartType === "scatter") {
      const xNumericKey = toNumeric(dataToUse[0]?.[safeXKey]) !== null ? safeXKey : getFirstNumericKey(dataToUse)
      const yNumericKey = toNumeric(dataToUse[0]?.[safeYKey]) !== null ? safeYKey : getSecondNumericKey(dataToUse, xNumericKey)
      const scatterData = buildScatterData(
        dataToUse,
        xNumericKey || safeXKey,
        yNumericKey || safeYKey
      )
      return (
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
          <XAxis dataKey="x" type="number" tick={axisStyle} name={xNumericKey || safeXKey} />
          <YAxis dataKey="y" type="number" tick={axisStyle} name={yNumericKey || safeYKey} />
          <ZAxis range={[60, 60]} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ strokeDasharray: "3 3" }} />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
          <Scatter
            name={`${xNumericKey || safeXKey} vs ${yNumericKey || safeYKey}`}
            data={scatterData}
            fill={COLORS[index % COLORS.length]}
          />
        </ScatterChart>
      )
    }

    return null
  }

  const getKPIIcon = (index) => {
    const icons = [
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>,
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>,
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ]
    return icons[index % icons.length]
  }

  const getChartTitle = (chart, xKey, yKey, questionText) => {
    const chartType = chart.type || chart.chart_type || "chart"
    const intent = getPromptIntent(questionText)
    const intentLabel = getIntentLabel(intent)
    const baseLabel = xKey && yKey ? `${intentLabel}: ${xKey} vs ${yKey}` : `${intentLabel}`
    return `${baseLabel} ${chartType} Chart`
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 to-slate-100 lg:flex-row">
      <header className="border-b border-slate-200 bg-white px-4 py-4 shadow-sm lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-blue-600">Smart Analytics</p>
            <h1 className="text-lg font-semibold text-slate-900">DataPulse AI</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
            >
              Menu
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
            >
              Dashboard
            </button>
          </div>
        </div>
      </header>
      
      {/* SIDEBAR */}
      {mobileMenuOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      ) : null}

      <aside className={`${sidebarOpen ? 'w-72' : 'w-20'} fixed inset-y-0 left-0 z-40 hidden bg-white border-r border-slate-200 transition-all duration-300 ease-in-out shadow-sm flex-col lg:static lg:flex ${mobileMenuOpen ? "flex translate-x-0" : "-translate-x-full lg:translate-x-0 lg:flex"}`}>
        
        {/* Logo & Toggle */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          {sidebarOpen ? (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-800">DataPulse AI</h1>
                <p className="text-xs text-slate-500">Analytics Hub</p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg mx-auto">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <svg className={`w-5 h-5 text-slate-600 transition-transform ${!sidebarOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Mode Selection */}
        <div className="p-4 space-y-2">
          <p className={`text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 ${!sidebarOpen && 'hidden'}`}>
            Data Source
          </p>
          
          <button
            onClick={() => setMode("db")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
              mode === "db"
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                : "hover:bg-slate-100 text-slate-700"
            }`}
            title="Database"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
            {sidebarOpen && <span className="font-medium">Database</span>}
          </button>

          <button
            onClick={() => setMode("csv")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
              mode === "csv"
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                : "hover:bg-slate-100 text-slate-700"
            }`}
            title="CSV Dataset"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {sidebarOpen && <span className="font-medium">CSV Dataset</span>}
          </button>
        </div>

        {/* Connection Selector */}
        {mode === "db" && sidebarOpen && connections.length > 0 && (
          <div className="px-4 pb-4">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Connection
            </label>
            <select
              value={selectedConnectionId}
              onChange={(e) => setSelectedConnectionId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {connections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.database_name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Navigation Links */}
        <div className="p-4 space-y-2 border-t border-slate-200">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-100 text-slate-700 transition-all"
            title="Dashboard"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {sidebarOpen && <span className="font-medium">Dashboard</span>}
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 transition-all"
            title="Logout"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-auto">
        
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-4 py-4 shadow-sm sm:px-6 sm:py-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800">Smart Analytics</h2>
            <p className="text-slate-600 mt-1">Ask questions and get instant insights from your data</p>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 max-w-7xl mx-auto space-y-6 sm:p-6 lg:p-8">
          
          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6">
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Ask anything about your data... (e.g., 'Show me top 10 customers by revenue')"
                  disabled={loading}
                />
              </div>
              <button
                onClick={handleAsk}
                disabled={loading || !question.trim()}
                className="inline-flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3.5 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-blue-500/50 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 md:w-auto"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Ask AI</span>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* KPIs */}
          {kpis.length > 0 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {kpis.map((k, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-lg sm:p-6"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                  
                  <div className="relative z-10 flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-500 mb-2">{k.title}</p>
                      <p className="text-3xl font-bold text-slate-800">{k.value}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl flex items-center justify-center text-blue-600">
                      {getKPIIcon(i)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Insights */}
          {insights.length > 0 && (
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-sm border border-blue-100 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800">AI Insights</h3>
              </div>
              <ul className="space-y-3">
                {insights.map((insight, idx) => (
                  <li key={idx} className="flex items-start space-x-3 text-slate-700">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 3c1.657 0 3 .895 3 2s-1.343 2-3 2-3 .895-3 2 1.343 2 3 2 3 .895 3 2-1.343 2-3 2" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Business Recommendations</h3>
                    <p className="text-sm text-slate-500">Practical next steps based on the current data</p>
                  </div>
                </div>
                <span className="text-sm text-slate-500">{recommendations.length} actions</span>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {recommendations.map((item, idx) => (
                    <div key={idx} className="rounded-xl border border-amber-100 bg-amber-50/70 p-4">
                      <div className="flex items-start space-x-3">
                        <div className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-500 flex-shrink-0"></div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-1">
                            Recommendation {idx + 1}
                          </p>
                          <p className="text-sm text-slate-700">{item}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SQL Query */}
          {sql && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-slate-800">Generated SQL Query</h3>
                </div>
                <button
                  onClick={() => setShowSql(!showSql)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
                >
                  <span>{showSql ? 'Hide' : 'Show'}</span>
                  <svg className={`w-4 h-4 transition-transform ${showSql ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              {showSql && (
                <div className="p-6 bg-slate-900 overflow-x-auto">
                  <pre className="text-sm text-green-400 font-mono">{sql}</pre>
                </div>
              )}
            </div>
          )}

          {/* Charts */}
          {(charts.length > 0 || chartData.length > 0) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {(charts.length > 0 ? charts : [{
                type: chartType,
                x: Object.keys(results[0] || {})[0],
                y: Object.keys(results[0] || {})[1]
              }]).map((c, i) => {
                const dataToUse =
                  chartData.length > 0 ? chartData :
                  results.length > 0 ? results : []

                if (!dataToUse.length) return null

                const keys = Object.keys(dataToUse[0])
                const numericKey = getFirstNumericKey(dataToUse)
                const categoricalKey = getFirstCategoricalKey(dataToUse, numericKey)
                const currentChartType = c.type || c.chart_type || chartType
                const xKey = c.x && keys.includes(c.x) ? c.x : (currentChartType === "scatter" ? numericKey || keys[0] : categoricalKey || keys[0])
                const yKey = c.y && keys.includes(c.y) ? c.y : (currentChartType === "scatter" ? getSecondNumericKey(dataToUse, xKey) || numericKey || keys[1] : numericKey || keys[1])

                return (
                  <div
                    key={i}
                    className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-slate-800 capitalize flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <span>{getChartTitle(c, xKey, yKey)}</span>
                      </h3>
                      <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                        {dataToUse.length} data points
                      </span>
                    </div>

                    <ResponsiveContainer width="100%" height={320}>
                      {renderChart(c, dataToUse, xKey, yKey, i)}
                    </ResponsiveContainer>
                  </div>
                )
              })}
            </div>
          )}

          {/* Data Table */}
          {results.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <h3 className="font-semibold text-slate-800 flex items-center space-x-2">
                  <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Data Results</span>
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-500">{results.length} rows</span>
                  <button
                    onClick={() => setShowDataResults(!showDataResults)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {showDataResults ? "Hide" : "Show"} data
                  </button>
                </div>
              </div>
              {showDataResults && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        {Object.keys(results[0] || {}).map((key) => (
                          <th key={key} className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {results.slice(0, 10).map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          {Object.values(row).map((val, i) => (
                            <td key={i} className="px-6 py-4 text-sm text-slate-700 whitespace-nowrap">
                              {String(val)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {showDataResults && results.length > 10 && (
                <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-sm text-slate-500 text-center">
                  Showing 10 of {results.length} rows
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {!loading && !kpis.length && !insights.length && !charts.length && !results.length && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Ready to Analyze</h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                Ask a question about your data to get started. Our AI will generate insights, charts, and detailed analysis instantly.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => setQuestion("Show me total revenue by month")}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm rounded-lg transition-colors"
                >
                  Revenue by month
                </button>
                <button
                  onClick={() => setQuestion("Top 10 customers")}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm rounded-lg transition-colors"
                >
                  Top customers
                </button>
                <button
                  onClick={() => setQuestion("Sales trends over time")}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm rounded-lg transition-colors"
                >
                  Sales trends
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default SmartDashboard
