'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Play, Pause, Brain, MessageSquare, Zap, BarChart3, MousePointer, Check, Users, Cpu, Shield, Star, ArrowRight, Grid, List, TrendingUp } from 'lucide-react'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface VideoTutorialPopupProps {
  isOpen: boolean
  onClose: () => void
}

export default function VideoTutorialPopup({ isOpen, onClose }: VideoTutorialPopupProps) {
  const { darkMode } = useDarkMode()
  const { user } = useAuth()
  const router = useRouter()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [currentSection, setCurrentSection] = useState(0)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Prevent background scrolling when popup is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  // Video simulation logic with detailed sections
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 0.1
          
          // Update section based on time (total 35 seconds)
          if (newTime >= 0 && newTime < 7) {
            setCurrentSection(0) // Introduction
          } else if (newTime >= 7 && newTime < 14) {
            setCurrentSection(1) // Step 1: Choose Models
          } else if (newTime >= 14 && newTime < 21) {
            setCurrentSection(2) // Step 2: Send Message
          } else if (newTime >= 21 && newTime < 28) {
            setCurrentSection(3) // Step 3: Compare Results
          } else if (newTime >= 28 && newTime < 35) {
            setCurrentSection(4) // Conclusion
          } else {
            // Loop back to beginning
            return 0
          }
          
          // Loop video after 35 seconds
          if (newTime >= 35) {
            return 0
          }
          return newTime
        })
      }, 100)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying])

  if (!isOpen) return null

  // Close popup when clicking outside the video container
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Toggle video play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  // Reset video
  const resetVideo = () => {
    setCurrentTime(0)
    setCurrentSection(0)
    setIsPlaying(false)
  }

  // Handle CTA button click
  const handleCtaClick = () => {
    onClose()
    if (user) {
      router.push('/chat')
    } else {
      router.push('/auth')
    }
  }

  // Format time as MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  // Get section title and description
  const getSectionInfo = () => {
    switch (currentSection) {
      case 0:
        return {
          title: "Welcome to AI Fiesta",
          description: "The ultimate platform for comparing AI models side-by-side"
        }
      case 1:
        return {
          title: "Step 1: Choose Your Models",
          description: "Select from 9+ premium AI models including GPT-5, Claude 4, and Gemini 2.5"
        }
      case 2:
        return {
          title: "Step 2: Send Your Message",
          description: "Type your prompt once and send it to all selected models simultaneously"
        }
      case 3:
        return {
          title: "Step 3: Compare Responses",
          description: "Review responses side-by-side and choose the best one for your needs"
        }
      case 4:
        return {
          title: "Get Started Now",
          description: "Join thousands of researchers and developers using AI Fiesta daily"
        }
      default:
        return {
          title: "AI Fiesta Tutorial",
          description: "Learn how to compare AI models effectively"
        }
    }
  }

  const sectionInfo = getSectionInfo()

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div 
        className={`relative w-full max-w-6xl rounded-3xl border shadow-2xl overflow-hidden ${
          darkMode 
            ? 'bg-gradient-to-br from-gray-900 via-violet-900/20 to-black border-gray-700' 
            : 'bg-gradient-to-br from-white via-blue-50 to-indigo-50 border-gray-200'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors z-20 backdrop-blur-sm"
          aria-label="Close"
        >
          <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className={`text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent`}>
              How AI Fiesta Works
            </h2>
            <p className={`mt-2 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Watch this detailed tutorial to get started
            </p>
          </div>

          {/* Modern Animated Video Player */}
          <div className="relative aspect-video bg-gradient-to-br from-gray-900 via-violet-900/30 to-black rounded-2xl overflow-hidden border border-gray-700/50 shadow-2xl">
            {/* Animated background elements - ONLY visible when playing */}
            {isPlaying && (
              <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/3 right-1/3 w-48 h-48 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-2/3 left-1/3 w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
              </div>
            )}
            
            {/* Main content area - ONLY visible when playing */}
            {isPlaying ? (
              <div className="w-full h-full flex flex-col p-6 relative">
                {/* Section header with modern design */}
                <div className="text-center mb-6 animate-slide-in">
                  <div className="inline-flex items-center space-x-2 backdrop-blur-xl rounded-full px-4 py-2 mb-4 relative overflow-hidden transition-all duration-300 border border-gray-700/50">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-purple-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-gray-300">
                      Section {currentSection + 1}/5
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{sectionInfo.title}</h3>
                  <p className="text-gray-300 max-w-3xl mx-auto">{sectionInfo.description}</p>
                </div>
                
                {/* Content based on current section with modern design */}
                <div className="flex-grow flex items-center justify-center">
                  {currentSection === 0 && (
                    // Introduction section
                    <div className="text-center max-w-3xl animate-fade-in-up">
                      <div className="flex justify-center mb-8">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl blur-xl animate-pulse opacity-30"></div>
                          <div className="relative w-32 h-32 rounded-3xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-2xl border border-white/10">
                            <Brain className="w-16 h-16 text-white" />
                          </div>
                          <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                            <Zap className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      </div>
                      <h4 className="text-2xl font-bold text-white mb-4">Compare 9+ AI Models Instantly</h4>
                      <p className="text-gray-300 mb-8 text-lg">Send one message to multiple AI models and compare their responses side-by-side</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                        {[
                          { icon: Cpu, value: "9+", label: "AI Models", color: "from-blue-500 to-cyan-500" },
                          { icon: Users, value: "10K+", label: "Active Users", color: "from-purple-500 to-pink-500" },
                          { icon: Zap, value: "0.5s", label: "Avg Response", color: "from-yellow-500 to-orange-500" }
                        ].map((stat, index) => {
                          const Icon = stat.icon
                          return (
                            <div 
                              key={index} 
                              className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-5 border border-gray-700/50 hover:border-white/20 transition-all duration-300 transform hover:scale-105"
                            >
                              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg`}>
                                <Icon className="w-6 h-6 text-white" />
                              </div>
                              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                              <div className="text-gray-400 text-sm">{stat.label}</div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                  
                  {currentSection === 1 && (
                    // Step 1: Choose Models
                    <div className="w-full max-w-5xl animate-fade-in-up">
                      <div className="flex justify-between items-center mb-6">
                        <h4 className="text-xl font-bold text-white flex items-center">
                          <Cpu className="w-6 h-6 mr-3 text-blue-400" />
                          Available AI Models
                        </h4>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${
                              viewMode === 'grid' 
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                            }`}
                          >
                            <Grid className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${
                              viewMode === 'list' 
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                            }`}
                          >
                            <List className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      
                      {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                          {[
                            { name: "GPT-5", provider: "OpenAI", capabilities: ["text", "image"], color: "from-green-500 to-emerald-500", selected: true },
                            { name: "Claude 4 Sonnet", provider: "Anthropic", capabilities: ["text", "image"], color: "from-blue-500 to-cyan-500", selected: true },
                            { name: "Gemini 2.5", provider: "Google", capabilities: ["text", "image", "video"], color: "from-yellow-500 to-orange-500", selected: true },
                            { name: "DeepSeek", provider: "DeepSeek", capabilities: ["text"], color: "from-purple-500 to-pink-500", selected: false },
                            { name: "Qwen 2.5", provider: "Alibaba", capabilities: ["text", "image"], color: "from-red-500 to-rose-500", selected: false },
                            { name: "Llama 4", provider: "Meta", capabilities: ["text"], color: "from-indigo-500 to-blue-500", selected: false }
                          ].map((model, index) => (
                            <div 
                              key={index}
                              className={`bg-gray-800/50 backdrop-blur-xl rounded-2xl p-5 border transition-all duration-300 transform hover:scale-[1.02] cursor-pointer ${
                                model.selected 
                                  ? 'border-blue-500/50 shadow-lg shadow-blue-500/20' 
                                  : 'border-gray-700/50 hover:border-white/20'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-4">
                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${model.color} flex items-center justify-center`}>
                                  <Brain className="w-6 h-6 text-white" />
                                </div>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                  model.selected ? 'bg-green-500' : 'bg-gray-700'
                                }`}>
                                  {model.selected ? <Check className="w-4 h-4 text-white" /> : <div className="w-2 h-2 bg-gray-400 rounded-full"></div>}
                                </div>
                              </div>
                              
                              <div className="mb-3">
                                <div className="font-bold text-white text-lg">{model.name}</div>
                                <div className="text-gray-400 text-sm">{model.provider}</div>
                              </div>
                              
                              <div className="flex flex-wrap gap-2 mb-4">
                                {model.capabilities.map((cap, capIndex) => (
                                  <span 
                                    key={capIndex} 
                                    className="text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded-full"
                                  >
                                    {cap}
                                  </span>
                                ))}
                              </div>
                              
                              <button className={`w-full py-2 rounded-lg text-sm font-medium transition-all ${
                                model.selected 
                                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                              }`}>
                                {model.selected ? 'Selected' : 'Select Model'}
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {[
                            { name: "GPT-5", provider: "OpenAI", capabilities: ["text", "image"], color: "from-green-500 to-emerald-500", selected: true },
                            { name: "Claude 4 Sonnet", provider: "Anthropic", capabilities: ["text", "image"], color: "from-blue-500 to-cyan-500", selected: true },
                            { name: "Gemini 2.5", provider: "Google", capabilities: ["text", "image", "video"], color: "from-yellow-500 to-orange-500", selected: true },
                            { name: "DeepSeek", provider: "DeepSeek", capabilities: ["text"], color: "from-purple-500 to-pink-500", selected: false },
                            { name: "Qwen 2.5", provider: "Alibaba", capabilities: ["text", "image"], color: "from-red-500 to-rose-500", selected: false },
                            { name: "Llama 4", provider: "Meta", capabilities: ["text"], color: "from-indigo-500 to-blue-500", selected: false }
                          ].map((model, index) => (
                            <div 
                              key={index}
                              className={`bg-gray-800/50 backdrop-blur-xl rounded-2xl p-5 border transition-all duration-300 transform hover:scale-[1.01] cursor-pointer flex items-center ${
                                model.selected 
                                  ? 'border-blue-500/50 shadow-lg shadow-blue-500/20' 
                                  : 'border-gray-700/50 hover:border-white/20'
                              }`}
                            >
                              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${model.color} flex items-center justify-center mr-4`}>
                                <Brain className="w-6 h-6 text-white" />
                              </div>
                              
                              <div className="flex-grow">
                                <div className="flex justify-between items-center mb-1">
                                  <div className="font-bold text-white text-lg">{model.name}</div>
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                    model.selected ? 'bg-green-500' : 'bg-gray-700'
                                  }`}>
                                    {model.selected ? <Check className="w-4 h-4 text-white" /> : <div className="w-2 h-2 bg-gray-400 rounded-full"></div>}
                                  </div>
                                </div>
                                
                                <div className="text-gray-400 text-sm mb-2">{model.provider}</div>
                                
                                <div className="flex flex-wrap gap-2">
                                  {model.capabilities.map((cap, capIndex) => (
                                    <span 
                                      key={capIndex} 
                                      className="text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded-full"
                                    >
                                      {cap}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              
                              <button className={`ml-4 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                model.selected 
                                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                              }`}>
                                {model.selected ? 'Selected' : 'Select'}
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {currentSection === 2 && (
                    // Step 2: Send Message
                    <div className="w-full max-w-4xl animate-fade-in-up">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                          <h4 className="text-xl font-bold text-white mb-6 flex items-center">
                            <MessageSquare className="w-6 h-6 mr-3 text-green-400" />
                            Your Message
                          </h4>
                          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
                            <div className="mb-4">
                              <label className="block text-gray-400 text-sm mb-2">To: 3 Selected Models</label>
                              <div className="flex space-x-2 mb-4">
                                {['GPT-5', 'Claude 4', 'Gemini 2.5'].map((model, index) => (
                                  <div key={index} className="px-3 py-1 bg-gray-700/50 rounded-full text-gray-300 text-sm">
                                    {model}
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="mb-6">
                              <label className="block text-gray-400 text-sm mb-2">Your Prompt</label>
                              <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                                <div className="text-white mb-3">
                                  &quot;Explain quantum computing in simple terms&quot;
                                </div>
                                <div className="flex items-center text-gray-500 text-sm">
                                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                                  <span>Ready to send</span>
                                </div>
                              </div>
                            </div>
                            
                            <button className="w-full py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center">
                              <Zap className="w-5 h-5 mr-2" />
                              Send to All Models
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-xl font-bold text-white mb-6 flex items-center">
                            <TrendingUp className="w-6 h-6 mr-3 text-yellow-400" />
                            Real-time Processing
                          </h4>
                          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 h-full">
                            <div className="space-y-5">
                              <div className="p-4 bg-gray-700/50 rounded-xl">
                                <div className="flex justify-between mb-2">
                                  <span className="text-gray-300">Response Time</span>
                                  <span className="text-cyan-400 font-bold">0.4s</span>
                                </div>
                                <div className="w-full bg-gray-600 rounded-full h-2.5">
                                  <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2.5 rounded-full w-4/5 animate-pulse"></div>
                                </div>
                              </div>
                              
                              <div className="p-4 bg-gray-700/50 rounded-xl">
                                <div className="flex justify-between mb-2">
                                  <span className="text-gray-300">Tokens Used</span>
                                  <span className="text-purple-400 font-bold">127</span>
                                </div>
                                <div className="w-full bg-gray-600 rounded-full h-2.5">
                                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2.5 rounded-full w-3/5 animate-pulse"></div>
                                </div>
                              </div>
                              
                              <div className="p-4 bg-gray-700/50 rounded-xl">
                                <div className="flex justify-between mb-2">
                                  <span className="text-gray-300">Models Responded</span>
                                  <span className="text-green-400 font-bold">3/3</span>
                                </div>
                                <div className="w-full bg-gray-600 rounded-full h-2.5">
                                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2.5 rounded-full w-full animate-pulse"></div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-6 p-4 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-xl border border-green-500/30">
                              <div className="flex items-center">
                                <Check className="w-5 h-5 text-green-400 mr-2" />
                                <span className="text-green-400 font-bold">All responses received successfully!</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {currentSection === 3 && (
                    // Step 3: Compare Results
                    <div className="w-full max-w-5xl animate-fade-in-up">
                      <h4 className="text-xl font-bold text-white mb-6 flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 mr-3 text-purple-400" />
                        Side-by-Side Comparison
                      </h4>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((model) => (
                          <div 
                            key={model}
                            className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden transition-all duration-300 hover:border-purple-500/50 transform hover:scale-[1.02]"
                          >
                            <div className="p-5 border-b border-gray-700/50">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${['from-green-500 to-emerald-500', 'from-blue-500 to-cyan-500', 'from-yellow-500 to-orange-500'][model-1]} flex items-center justify-center mr-3`}>
                                    <Brain className="w-5 h-5 text-white" />
                                  </div>
                                  <div>
                                    <div className="font-bold text-white">Model {model}</div>
                                    <div className="text-gray-400 text-sm">Response Quality: {95 - model * 5}%</div>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                  <span className="text-yellow-400 text-sm font-bold ml-1">{5.0 - model * 0.2}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="p-5">
                              <div className="text-gray-300 text-sm mb-4 line-clamp-4">
                                Quantum computing uses quantum bits (qubits) that can exist in multiple states simultaneously, allowing for parallel processing of information. This enables quantum computers to solve certain problems much faster than classical computers...
                              </div>
                              
                              <div className="grid grid-cols-2 gap-3 mb-5">
                                <div className="bg-gray-700/50 rounded-lg p-3">
                                  <div className="text-gray-400 text-xs mb-1">Length</div>
                                  <div className="text-white font-bold">{120 + model * 15} words</div>
                                </div>
                                <div className="bg-gray-700/50 rounded-lg p-3">
                                  <div className="text-gray-400 text-xs mb-1">Clarity</div>
                                  <div className="text-white font-bold">{90 - model * 5}%</div>
                                </div>
                              </div>
                              
                              <button className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold rounded-lg hover:opacity-90 transition-opacity">
                                Select as Best Response
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6 flex justify-center">
                        <div className="inline-flex items-center bg-gray-800/50 backdrop-blur-xl rounded-full px-5 py-2.5 border border-gray-700/50">
                          <Star className="w-5 h-5 text-yellow-400 fill-current mr-2" />
                          <span className="text-gray-300">Model 1 provides the clearest and most comprehensive explanation</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {currentSection === 4 && (
                    // Conclusion section
                    <div className="text-center max-w-4xl animate-fade-in-up">
                      <div className="flex justify-center mb-8">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-teal-500 rounded-full blur-xl animate-pulse opacity-30"></div>
                          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-green-600 to-teal-600 flex items-center justify-center mx-auto mb-6 shadow-2xl border border-white/10">
                            <Check className="w-12 h-12 text-white" />
                          </div>
                        </div>
                      </div>
                      
                      <h4 className="text-3xl font-bold text-white mb-4">You&#39;re Ready to Go!</h4>
                      <p className="text-gray-300 mb-10 text-lg max-w-2xl mx-auto">
                        Start comparing AI models today and find the perfect response for every task. 
                        Join thousands of researchers and developers who trust AI Fiesta.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-10">
                        {[
                          { icon: Users, value: "10K+", label: "Active Users", color: "from-blue-500 to-cyan-500" },
                          { icon: Cpu, value: "9+", label: "AI Models", color: "from-purple-500 to-pink-500" },
                          { icon: Zap, value: "0.5s", label: "Avg Response", color: "from-yellow-500 to-orange-500" }
                        ].map((stat, index) => {
                          const Icon = stat.icon
                          return (
                            <div 
                              key={index} 
                              className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:border-white/20 transition-all duration-300 transform hover:scale-105"
                            >
                              <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg`}>
                                <Icon className="w-7 h-7 text-white" />
                              </div>
                              <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                              <div className="text-gray-400">{stat.label}</div>
                            </div>
                          )
                        })}
                      </div>
                      
                      <button 
                        onClick={handleCtaClick}
                        className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:opacity-90 transition-opacity shadow-2xl flex items-center mx-auto group text-lg"
                      >
                        Start Comparing Now
                        <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Modern video thumbnail with play button - NO content when paused
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full flex flex-col items-center justify-center">
                  {/* Video thumbnail background - solid color when paused */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-violet-900/30 to-black"></div>
                  
                  {/* Play button overlay with modern design */}
                  <div className="relative z-10 flex flex-col items-center">
                    <button
                      onClick={togglePlayPause}
                      className="w-28 h-28 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-8 hover:from-blue-500 hover:to-purple-500 transition-all duration-300 cursor-pointer group shadow-2xl border-4 border-white/20"
                    >
                      <Play className="w-12 h-12 text-white ml-2 group-hover:scale-110 transition-transform" />
                    </button>
                    <h3 className="text-3xl font-bold text-white mb-3">AI Fiesta Tutorial</h3>
                    <p className="text-gray-300 text-xl">Detailed walkthrough (2:35)</p>
                    <div className="mt-8 flex items-center space-x-8 text-gray-400">
                      <div className="flex items-center">
                        <Cpu className="w-6 h-6 mr-3 text-blue-400" />
                        <span className="text-lg">9+ Models</span>
                      </div>
                      <div className="flex items-center">
                        <Zap className="w-6 h-6 mr-3 text-yellow-400" />
                        <span className="text-lg">Instant Results</span>
                      </div>
                      <div className="flex items-center">
                        <Shield className="w-6 h-6 mr-3 text-green-400" />
                        <span className="text-lg">Secure</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Modern video controls - ALWAYS visible */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-5">
                  <button 
                    onClick={togglePlayPause}
                    className="w-12 h-12 rounded-full bg-gray-800/50 backdrop-blur-sm flex items-center justify-center hover:bg-gray-700/50 transition-colors border border-gray-700/50"
                  >
                    {isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white" />}
                  </button>
                  <button 
                    onClick={resetVideo}
                    className="w-12 h-12 rounded-full bg-gray-800/50 backdrop-blur-sm flex items-center justify-center hover:bg-gray-700/50 transition-colors border border-gray-700/50"
                  >
                    <MousePointer className="w-6 h-6 text-white" />
                  </button>
                </div>
                
                <div className="flex-1 max-w-2xl">
                  <div className="flex items-center space-x-4">
                    <span className="text-white text-sm w-12">{formatTime(currentTime)}</span>
                    <div className="flex-grow h-2 bg-gray-700/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" 
                        style={{ width: `${(currentTime / 35) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-white text-sm w-12">2:35</span>
                  </div>
                  
                  {/* Modern section indicators */}
                  <div className="flex mt-3 space-x-2">
                    {[0, 1, 2, 3, 4].map((section) => (
                      <div 
                        key={section}
                        className={`h-1.5 rounded-full flex-grow transition-all duration-300 ${
                          currentSection === section 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                            : currentSection > section 
                              ? 'bg-green-500' 
                              : 'bg-gray-600'
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Shield className="w-6 h-6 text-green-400" />
                  <span className="text-white text-sm">Secure & Private</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-7">
            <div className={`p-6 rounded-2xl backdrop-blur-xl border transition-all duration-300 transform hover:scale-[1.02] ${
              darkMode 
                ? 'bg-gray-800/50 border-gray-700/50 hover:border-white/20' 
                : 'bg-white/50 border-gray-200/50 hover:border-gray-300/50'
            }`}>
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mr-4">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className={`font-bold text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Step 1: Choose Models
                  </h3>
                  <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Select from 9+ premium AI models
                  </p>
                </div>
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Each model has unique strengths for different tasks. Select models with complementary capabilities for comprehensive comparison.
              </p>
            </div>
            <div className={`p-6 rounded-2xl backdrop-blur-xl border transition-all duration-300 transform hover:scale-[1.02] ${
              darkMode 
                ? 'bg-gray-800/50 border-gray-700/50 hover:border-white/20' 
                : 'bg-white/50 border-gray-200/50 hover:border-gray-300/50'
            }`}>
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center mr-4">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className={`font-bold text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Step 2: Send Message
                  </h3>
                  <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Type once, send to all models
                  </p>
                </div>
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Save time with universal input. Your prompt is sent simultaneously to all selected models for instant responses.
              </p>
            </div>
            <div className={`p-6 rounded-2xl backdrop-blur-xl border transition-all duration-300 transform hover:scale-[1.02] ${
              darkMode 
                ? 'bg-gray-800/50 border-gray-700/50 hover:border-white/20' 
                : 'bg-white/50 border-gray-200/50 hover:border-gray-300/50'
            }`}>
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center mr-4">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className={`font-bold text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Step 3: Compare Results
                  </h3>
                  <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Review side-by-side comparisons
                  </p>
                </div>
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Analyze responses with quality metrics. Choose the best response for your specific needs with our comparison tools.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        .animate-slide-in {
          animation: slide-in 0.4s ease-out forwards;
        }
        
        @media (max-width: 768px) {
          .aspect-video {
            aspect-ratio: auto;
            height: 500px;
          }
        }
      `}</style>
    </div>
  )
}