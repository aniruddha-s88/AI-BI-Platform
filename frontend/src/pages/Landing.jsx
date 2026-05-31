import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

function Landing() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      title: "Natural Language Queries",
      description: "Transform complex questions into actionable insights. Simply ask in plain English, and our AI translates your intent into powerful SQL queries instantly.",
      tag: "Smart AI"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Intelligent Dashboards",
      description: "Auto-generated visualizations that adapt to your data. Beautiful charts, graphs, and reports created in seconds, not hours.",
      tag: "Auto-Generate"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
      title: "Instant Data Upload",
      description: "Drag, drop, and analyze. Upload CSV, Excel, or connect to your database. Our AI understands your data structure automatically.",
      tag: "Plug & Play"
    }
  ]

  const trustedBy = [
    "Microsoft", "Salesforce", "IBM", "Oracle", "SAP", "Adobe"
  ]

  const benefits = [
    { metric: "10x", label: "Faster Analysis", sublabel: "vs Traditional BI" },
    { metric: "95%", label: "Time Saved", sublabel: "On Report Generation" },
    { metric: "500+", label: "Enterprise Clients", sublabel: "Worldwide" },
    { metric: "99.9%", label: "Uptime SLA", sublabel: "Guaranteed" }
  ]

  return (
    <div className="relative min-h-screen bg-[#0A0E27] text-white overflow-hidden">
      
      {/* Sophisticated gradient mesh background */}
      <div className="fixed inset-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.15), transparent 50%)`
          }}
        ></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="fixed inset-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }}></div>

      {/* Glassmorphic Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-[#0A0E27]/80 backdrop-blur-2xl border-b border-white/5 shadow-2xl' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo */}
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">DataPulse AI</h1>
                <p className="text-xs text-gray-400">Business Intelligence</p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#benefits" className="text-sm text-gray-300 hover:text-white transition-colors">Benefits</a>
              <a href="#pricing" className="text-sm text-gray-300 hover:text-white transition-colors">Pricing</a>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/login")}
                className="px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/register")}
                className="group relative px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium text-sm overflow-hidden shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
              >
                <span className="relative z-10">Get Started Free</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            
            {/* Announcement Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-5 py-2 hover:bg-white/10 transition-all cursor-pointer group">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                Introducing GPT-4 Powered Analytics
              </span>
              <svg className="w-4 h-4 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>

            {/* Main Headline */}
            <div className="space-y-6">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight">
                Your Data,
                <br />
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Instantly Intelligent
                  </span>
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 blur-2xl opacity-30 -z-10"></div>
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-400 leading-relaxed max-w-3xl mx-auto font-light">
                Transform raw data into strategic insights with AI-powered analytics. 
                No coding required. No data science degree needed.
              </p>
            </div>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => navigate("/register")}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-lg shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 w-full sm:w-auto"
              >
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <span>Start Free Trial</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl -z-10"></div>
              </button>
              
              <button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="group px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300 w-full sm:w-auto"
              >
                <span className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Watch Demo</span>
                </span>
              </button>
            </div>

            {/* Trusted By Section */}
            <div className="pt-16 space-y-6">
              <p className="text-sm text-gray-500 uppercase tracking-wider font-medium">
                Trusted by Industry Leaders
              </p>
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-40">
                {trustedBy.map((company, i) => (
                  <div key={i} className="text-xl font-bold text-gray-400 hover:text-gray-300 transition-colors cursor-default">
                    {company}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Stats Section */}
      <section id="benefits" className="relative py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {benefits.map((benefit, i) => (
              <div 
                key={i}
                className="relative group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 text-center space-y-2">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {benefit.metric}
                  </div>
                  <div className="text-sm md:text-base font-semibold text-white">
                    {benefit.label}
                  </div>
                  <div className="text-xs text-gray-500">
                    {benefit.sublabel}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <div className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-sm font-medium text-blue-400 mb-4">
              Platform Features
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Everything You Need to
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Analyze Smarter
              </span>
            </h2>
            <p className="text-lg text-gray-400">
              Enterprise-grade analytics powered by cutting-edge AI technology
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group relative bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                {/* Gradient glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 via-purple-600/0 to-pink-600/0 group-hover:from-blue-600/10 group-hover:via-purple-600/10 group-hover:to-pink-600/10 rounded-3xl transition-all duration-500 -z-10"></div>
                
                {/* Tag */}
                <div className="inline-block px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs font-medium text-blue-400 mb-6">
                  {feature.tag}
                </div>

                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 rounded-2xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 group-hover:border-white/20 transition-all duration-300">
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>

                {/* Learn More Link */}
                <div className="mt-6 flex items-center text-sm font-medium text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Learn more</span>
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Preview Section */}
      <section className="relative py-20 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl p-2 shadow-2xl">
            {/* Browser Chrome */}
            <div className="bg-[#1a1f3a] rounded-t-2xl px-4 py-3 flex items-center space-x-2 border-b border-white/10">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1.5 bg-white/5 rounded-lg text-xs text-gray-400">
                  app.datapulse.ai/dashboard
                </div>
              </div>
            </div>
            
            {/* Dashboard Preview */}
            <div className="bg-gradient-to-br from-[#0f1629] to-[#1a1f3a] rounded-b-2xl p-8 min-h-[400px] flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 rounded-2xl flex items-center justify-center mx-auto">
                  <svg className="w-10 h-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-gray-400">Interactive Dashboard Preview</p>
                <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition-colors">
                  View Live Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-20 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-12 md:p-16 text-center shadow-2xl">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: '40px 40px'
              }}></div>
            </div>

            <div className="relative z-10 space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Ready to Transform Your
                <br />
                Data Analysis?
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Join 500+ companies already making data-driven decisions with AI-powered insights.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                <button
                  onClick={() => navigate("/register")}
                  className="group px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 w-full sm:w-auto"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>Start Free Trial</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </button>
                
                <button className="px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 w-full sm:w-auto">
                  Schedule Demo
                </button>
              </div>

              <p className="text-sm text-white/70 pt-4">
                No credit card required • 14-day free trial • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/5 py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="font-bold text-lg">DataPulse AI</span>
              </div>
              <p className="text-sm text-gray-400">
                AI-powered business intelligence for modern enterprises.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; 2024 DataPulse AI. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-white transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default Landing