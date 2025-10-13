"use client";
import { useRef, useState, useEffect } from "react";
import { Check, Star, Zap, Users, Award } from 'lucide-react';

export default function PricingSectionINR() {
  const [isYearly, setIsYearly] = useState(false);
  const pricingRef = useRef<HTMLDivElement>(null);

  const togglePricingPeriod = (value: string) =>
    setIsYearly(Number.parseInt(value) === 1);

  // Pricing data with monthly/yearly options
  const plans = [
    {
      name: "Free",
      description: "Basic features at no cost",
      monthlyPrice: 0,
      yearlyPrice: 0,
      price: "₹0",
      period: "Forever",
      buttonText: "Start Free",
      buttonVariant: "outline" as const,
      includes: [
        "Access to 2 AI models",
        "10 comparisons per month",
        "Basic metrics & analytics",
        "Export results (CSV)",
        "Community support",
      ],
      features: [
        "Basic model comparisons",
        "Standard response time",
        "Email support",
        "Community access"
      ]
    },
    {
      name: "Pro",
      description: "Great for professionals who need more power",
      monthlyPrice: 199,
      yearlyPrice: 1999,
      price: isYearly ? "₹1,999" : "₹199",
      period: isYearly ? "per year" : "per month",
      buttonText: "Get Pro",
      buttonVariant: "default" as const,
      popular: true,
      includes: [
        "Access to 4+ models",
        "200 comparisons per month",
        "Advanced comparison matrix",
        "Advanced visualizations",
        "Priority support",
        "Unlimited projects",
      ],
      features: [
        "Advanced model comparisons",
        "Faster response times",
        "Priority email support",
        "Advanced analytics",
        "Export to multiple formats"
      ]
    },
    {
      name: "Pro Plus",
      description: "Advanced features for scaling your business",
      monthlyPrice: 399,
      yearlyPrice: 3999,
      price: isYearly ? "₹3,999" : "₹399",
      period: isYearly ? "per year" : "per month",
      buttonText: "Get Pro Plus",
      buttonVariant: "outline" as const,
      includes: [
        "Access to all AI models",
        "Unlimited comparisons",
        "Advanced AutoML capabilities",
        "Team collaboration",
        "All Pro features",
        "Advanced analytics",
      ],
      features: [
        "All AI models unlocked",
        "Fastest response times",
        "24/7 priority support",
        "Team collaboration tools",
        "Advanced analytics dashboard",
        "Custom integrations"
      ]
    },
  ];

  // Update plans when isYearly changes
  const updatedPlans = plans.map(plan => ({
    ...plan,
    price: plan.name === "Free" 
      ? "₹0" 
      : isYearly 
        ? `₹${plan.yearlyPrice.toLocaleString()}` 
        : `₹${plan.monthlyPrice.toLocaleString()}`,
    period: plan.name === "Free" 
      ? "Forever" 
      : isYearly 
        ? "per year" 
        : "per month"
  }));

  return (
    <div
      className="min-h-screen mx-auto relative bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-x-hidden"
      ref={pricingRef}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="text-center mb-16 pt-24 max-w-4xl mx-auto space-y-6 relative z-10">
        <div className="inline-flex items-center space-x-2 backdrop-blur-sm rounded-full px-4 py-2 mb-4 relative overflow-hidden bg-gray-800/60 border border-gray-700/50">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-transparent to-yellow-400/10 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
          <Zap className="w-4 h-4 text-blue-400 relative z-10" />
          <span className="text-sm font-medium text-gray-300 relative z-10">
            Pricing Plans
          </span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-purple-200">
          Choose Your Perfect Plan
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Flexible options for individuals, professionals, and teams. 
          <span className="font-semibold text-blue-400"> Scale as you grow.</span>
        </p>
        
        <div className="flex justify-center">
          <div className="relative z-10 mx-auto flex w-fit rounded-2xl bg-gray-800/60 border border-gray-700/50 p-1 backdrop-blur-sm">
            <button
              onClick={() => togglePricingPeriod("0")}
              className={`relative z-10 w-fit h-12 rounded-xl sm:px-8 px-6 sm:py-3 py-2 font-semibold transition-all duration-300 ${
                !isYearly 
                  ? "text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/20" 
                  : "text-gray-300 hover:text-white"
              }`}
            >
              <span className="relative flex items-center gap-2">
                Monthly
                {!isYearly && (
                  <span className="absolute -top-2 -right-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                    Current
                  </span>
                )}
              </span>
            </button>

            <button
              onClick={() => togglePricingPeriod("1")}
              className={`relative z-10 w-fit h-12 flex-shrink-0 rounded-xl sm:px-8 px-6 sm:py-3 py-2 font-semibold transition-all duration-300 ${
                isYearly 
                  ? "text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/20" 
                  : "text-gray-300 hover:text-white"
              }`}
            >
              <span className="relative flex items-center gap-2">
                Yearly
                <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                  Save 20%
                </span>
                {isYearly && (
                  <span className="absolute -top-2 -right-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                    Current
                  </span>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 max-w-7xl gap-8 py-12 mx-auto px-4 relative z-10">
        {updatedPlans.map((plan, index) => (
          <div
            key={plan.name}
            className={`relative rounded-3xl p-8 transition-all duration-300 hover:scale-105 ${
              plan.popular
                ? "bg-gradient-to-br from-gray-800/80 via-gray-900/80 to-gray-800/80 border border-blue-500/30 shadow-2xl shadow-blue-500/20 z-20"
                : "bg-gradient-to-br from-gray-800/60 via-gray-900/60 to-gray-800/60 border border-gray-700/50 z-10"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-current" />
                  <span>Most Popular</span>
                </div>
              </div>
            )}
            
            <div className="text-left mb-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400">{plan.description}</p>
                </div>
                {plan.popular && (
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    POPULAR
                  </div>
                )}
              </div>
              
              <div className="flex items-baseline mb-6">
                <span className="text-5xl font-bold text-white">
                  {plan.price}
                </span>
                <span className="text-gray-400 ml-2">
                  /{plan.period.includes("year") ? "year" : plan.period.includes("month") ? "month" : plan.period}
                </span>
              </div>
              
              {isYearly && plan.monthlyPrice > 0 && (
                <div className="text-green-400 text-sm font-medium mb-4">
                  Save ₹{(plan.monthlyPrice * 12 - plan.yearlyPrice).toLocaleString()} per year
                </div>
              )}
            </div>

            <button
              className={`w-full mb-8 py-4 text-lg rounded-xl font-bold transition-all duration-300 hover:shadow-lg ${
                plan.popular
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/30"
                  : plan.buttonVariant === "outline"
                  ? "bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white border border-gray-600"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              }`}
            >
              {plan.buttonText}
            </button>

            <div className="space-y-4 pt-6 border-t border-gray-700">
              <h4 className="font-bold text-lg text-white mb-4 flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                What&#39;s included
              </h4>
              <ul className="space-y-3">
                {plan.includes.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className="flex items-start"
                  >
                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Additional features section */}
            {plan.features && (
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h4 className="font-bold text-lg text-white mb-4">Key Features</h4>
                <ul className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-400">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Trust indicators */}
      <div className="max-w-4xl mx-auto px-4 pb-24 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="p-4">
            <div className="text-3xl font-bold text-white mb-2">10K+</div>
            <div className="text-gray-400 text-sm">Active Users</div>
          </div>
          <div className="p-4">
            <div className="text-3xl font-bold text-white mb-2">500K+</div>
            <div className="text-gray-400 text-sm">Comparisons Made</div>
          </div>
          <div className="p-4">
            <div className="text-3xl font-bold text-white mb-2">99.9%</div>
            <div className="text-gray-400 text-sm">Uptime</div>
          </div>
          <div className="p-4">
            <div className="text-3xl font-bold text-white mb-2">4.9/5</div>
            <div className="text-gray-400 text-sm">User Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
}