import React from 'react'
import { TrendingUp, BarChart3, Shield, Zap, DollarSign, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">SpaceMan</h1>
            <div className="flex items-center space-x-4">
              <a
                href="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with HD Image of People Pursuing Dreams */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background with HD Image of People Pursuing Dreams */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80" 
            alt="People pursuing dreams and success" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/70 to-purple-900/80"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="text-white">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Chase Your
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {" "}Financial Dreams
                </span>
                <br />
                With Confidence
              </h1>
              
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Join thousands of ambitious traders on SpaceMan, the ultimate platform for turning your financial dreams into reality. 
                Real-time data, advanced analytics, and the tools you need to succeed.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/register"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all duration-200 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 h-6 w-6" />
                </a>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center bg-white/20 hover:bg-white/30 text-white font-semibold text-lg px-8 py-4 rounded-2xl transition-all duration-200 backdrop-blur-sm border border-white/30"
                >
                  Discover More
                </a>
              </div>
            </div>
            
            {/* Right Column - Hero Image */}
            <div className="relative">
              <div className="relative z-10">
                {/* Stock Market Chart Image */}
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white text-center mb-6">
                    <TrendingUp className="w-16 h-16 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Your Success Story</h3>
                    <p className="text-blue-100">Build wealth, achieve dreams</p>
                  </div>
                  
                  {/* Mock Chart */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="font-semibold text-gray-800">AAPL</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">$175.43</div>
                        <div className="text-sm text-green-600">+2.34%</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="font-semibold text-gray-800">TSLA</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">$248.50</div>
                        <div className="text-sm text-red-600">-1.87%</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="font-semibold text-gray-800">GOOGL</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">$142.56</div>
                        <div className="text-sm text-green-600">+0.95%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-pink-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose SpaceMan?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of trading with our cutting-edge platform designed for both beginners and professionals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Real-Time Data</h3>
              <p className="text-gray-600">
                Get instant access to live market data, charts, and analytics to make informed trading decisions.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Advanced Analytics</h3>
              <p className="text-gray-600">
                Powerful tools and indicators to analyze market trends and identify profitable opportunities.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Secure Trading</h3>
              <p className="text-gray-600">
                Bank-level security and encryption to protect your funds and personal information.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Lightning Fast</h3>
              <p className="text-gray-600">
                Execute trades in milliseconds with our high-performance trading engine.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mb-6">
                <DollarSign className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Low Fees</h3>
              <p className="text-gray-600">
                Competitive pricing with transparent fee structure and no hidden charges.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Portfolio Tracking</h3>
              <p className="text-gray-600">
                Monitor your investments and track performance with comprehensive portfolio analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Chase Your Dreams?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of successful traders and take control of your financial future today.
          </p>
          <a
            href="/register"
            className="inline-flex items-center justify-center bg-white text-blue-600 hover:bg-gray-100 font-bold text-lg px-8 py-4 rounded-2xl transition-all duration-200 transform hover:scale-105 shadow-xl"
          >
            Start Your Journey
            <ArrowRight className="ml-2 h-6 w-6" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">SpaceMan</span>
              </div>
              <p className="text-gray-400">
                The ultimate platform for stock market mastery and successful trading.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SpaceMan. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
