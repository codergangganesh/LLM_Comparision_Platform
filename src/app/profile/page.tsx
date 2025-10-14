'use client'

import { Star, Mail, Phone, Globe, Calendar, MapPin, Bookmark } from 'lucide-react'

export default function ProfileClassicPage() {
  return (
    <div className="min-h-screen bg-[#1E90FF] flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600" />
            <span className="font-semibold text-slate-800">Kodecolor</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-600">
            <span className="hidden md:inline cursor-pointer hover:text-slate-900">Find people</span>
            <span className="hidden md:inline cursor-pointer hover:text-slate-900">Messages</span>
            <span className="hidden md:inline cursor-pointer hover:text-slate-900">My Contacts</span>
            <div className="w-8 h-8 rounded-full bg-slate-300" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Left column */}
          <div className="p-6 border-r space-y-8">
            <div>
              <img
                src="/image.png"
                alt="profile"
                className="w-full aspect-square object-cover rounded-xl"
              />
              <div className="mt-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Work</p>
                <div className="mt-3 space-y-4 text-sm">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-800">Spotify New York</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-700">Primary</span>
                    </div>
                    <p className="text-slate-500 leading-5 mt-1">170 William Street<br/>New York, NY 10038-78 212-312-51</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-800">Metropolitan Museum</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700">Secondary</span>
                    </div>
                    <p className="text-slate-500 leading-5 mt-1">525 E 68th Street<br/>New York, NY 10065-78 156-187-60</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Skills</p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-600">
                <span>Branding</span>
                <span>UI/UX</span>
                <span>Web - Design</span>
                <span>Packaging</span>
                <span>Print & Editorial</span>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="md:col-span-2 p-6">
            {/* Header row */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl font-semibold text-slate-800">Jeremy Rose</h1>
                <div className="text-sm text-slate-500">Product Designer <span className="mx-2">•</span> New York, NY</div>
                <div className="mt-2 flex items-center gap-1 text-blue-600">
                  <span className="text-sm font-semibold text-slate-800 mr-1">8,6</span>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-blue-500 text-blue-500" />
                  ))}
                  <Star className="w-4 h-4 text-blue-300" />
                </div>
              </div>
              <button className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-800">
                <Bookmark className="w-4 h-4" /> Bookmark
              </button>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button className="px-3 py-2 rounded bg-blue-600 text-white text-sm">Send message</button>
              <button className="px-3 py-2 rounded border text-sm">Contacts</button>
              <button className="px-3 py-2 rounded border-0 text-sm text-slate-500 hover:text-slate-800">Report user</button>
            </div>

            {/* Tabs */}
            <div className="mt-6 flex items-center gap-6 text-sm">
              <button className="text-slate-500">Timeline</button>
              <button className="text-slate-800 font-medium border-b-2 border-slate-800 pb-1">About</button>
            </div>

            {/* Divider */}
            <div className="mt-4 h-px bg-slate-200" />

            {/* About content */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Contact information</p>
                <div className="mt-3 space-y-4">
                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-slate-400 mt-1" />
                    <div>
                      <div className="text-slate-400">Phone:</div>
                      <div className="text-slate-700">+1 123 456 7890</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-slate-400 mt-1" />
                    <div>
                      <div className="text-slate-400">Address:</div>
                      <div className="text-slate-700 leading-5">525 E 68th Street<br/>New York, NY 10051-78 156-187-60</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-slate-400 mt-1" />
                    <div>
                      <div className="text-slate-400">E-mail:</div>
                      <div className="text-slate-700">hello@jeremyrose.com</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="w-4 h-4 text-slate-400 mt-1" />
                    <div>
                      <div className="text-slate-400">Site:</div>
                      <div className="text-blue-600">www.jeremyrose.com</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Basic information</p>
                <div className="mt-3 space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-slate-400 mt-1" />
                    <div>
                      <div className="text-slate-400">Birthday:</div>
                      <div className="text-slate-700">June 5, 1992</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-4 h-4 mt-1" />
                    <div>
                      <div className="text-slate-400">Gender:</div>
                      <div className="text-slate-700">Male</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}