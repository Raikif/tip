import React, { useState } from "react";
import { FaCalendarAlt, FaCheckCircle, FaTrophy, FaUpload, FaFlagCheckered, FaInfoCircle } from "react-icons/fa";

export default function TimelineSection() {
  const [activeTab, setActiveTab] = useState<"lkti" | "poster">("lkti");

  const lktiEvents = [
    { id: 1, title: "Open Registration", date: "21 Juli", icon: <FaInfoCircle /> },
    { id: 2, title: "Pendaftaran & Extend", date: "21 Juli - 06 Agustus", icon: <FaCalendarAlt /> },
    { id: 3, title: "Penilaian Abstrak", date: "07 Agustus - 11 Agustus", icon: <FaCheckCircle /> },
    { id: 4, title: "Abstrak Announce", date: "12 Agustus", icon: <FaCheckCircle /> },
    { id: 5, title: "Early Bird", date: "12 Agustus - 19 Agustus", icon: <FaCalendarAlt /> },
    { id: 6, title: "Gelombang 1", date: "20 Agustus - 27 Agustus", icon: <FaCalendarAlt /> },
    { id: 7, title: "Gelombang 2 & Extend", date: "28 Agustus - 08 September", icon: <FaFlagCheckered /> },
    { id: 8, title: "Penilaian Full Paper", date: "09 September - 16 September", icon: <FaCheckCircle /> },
    { id: 9, title: "Full Paper Announce", date: "17 September", icon: <FaCheckCircle /> },
    { id: 10, title: "Final & Awarding", date: "26 September", icon: <FaTrophy /> },
  ];

  const posterEvents = [
    { id: 1, title: "Open Registration", date: "21 Juli", icon: <FaInfoCircle /> },
    { id: 2, title: "Early Bird", date: "21 Juli - 02 Agustus", icon: <FaCalendarAlt /> },
    { id: 3, title: "Gelombang 1 & Extend", date: "03 Agustus - 19 Agustus", icon: <FaCalendarAlt /> },
    { id: 4, title: "Penilaian Poster", date: "20 Agustus - 02 September", icon: <FaCheckCircle /> },
    { id: 5, title: "Pengumuman Poster", date: "03 September", icon: <FaCheckCircle /> },
    { id: 6, title: "Seleksi Like", date: "04 Agustus - 11 September", icon: <FaUpload /> },
    { id: 7, title: "Penilaian Keseluruhan (Final)", date: "12 September - 17 September", icon: <FaCheckCircle /> },
    { id: 8, title: "Pengumuman Final Poster", date: "18 September", icon: <FaCheckCircle /> },
    { id: 9, title: "Final & Awarding", date: "26 September", icon: <FaTrophy /> },
  ];

  const eventsToDisplay = activeTab === "lkti" ? lktiEvents : posterEvents;

  return (
    <section id="timeline" className="panel panel-hidden bg-timeline flex items-center justify-center">
      {/* Inner Scroll Container to prevent clipping issues with GSAP */}
      <div className="w-full h-full flex flex-col pt-24 pb-12 overflow-y-auto no-scrollbar relative">
        <div className="max-w-5xl mx-auto px-6 w-full flex-grow">
          
          <div className="text-center mb-12 flex-shrink-0">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 drop-shadow-sm">
              Timeline Kegiatan
            </h2>
            <p className="text-slate-700 max-w-2xl mx-auto mb-8 font-medium">
              Catat tanggal-tanggal penting ini dan jangan sampai terlewatkan kesempatanmu untuk menjadi juara di TIP 2026.
            </p>

            <div className="flex justify-center gap-4">
              <button 
                onClick={() => setActiveTab("lkti")}
                className={`px-8 py-3 text-sm font-bold rounded-full transition-all duration-300 shadow-lg ${activeTab === "lkti" ? "bg-[var(--color-brand-purple)] text-white scale-105" : "bg-white/50 backdrop-blur-md border border-white text-slate-700 hover:bg-white/80"}`}
              >
                LKTI & ESSAY
              </button>
              <button 
                onClick={() => setActiveTab("poster")}
                className={`px-8 py-3 text-sm font-bold rounded-full transition-all duration-300 shadow-lg ${activeTab === "poster" ? "bg-[var(--color-brand-pink)] text-white scale-105" : "bg-white/50 backdrop-blur-md border border-white text-slate-700 hover:bg-white/80"}`}
              >
                DIGITAL POSTER
              </button>
            </div>
          </div>
          
          {/* Interactive Timeline */}
          <div className="relative w-full max-w-4xl mx-auto mt-4 pb-16 flex-grow">
            {/* Vertical line connecting events */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-[var(--color-brand-purple)] via-[var(--color-brand-pink)] to-[var(--color-brand-orange)] rounded-full hidden md:block opacity-30"></div>
            
            <div className="space-y-6 md:space-y-0 relative z-10">
              {eventsToDisplay.map((event, index) => (
                <div 
                  key={event.id} 
                  className={`relative flex flex-col md:flex-row items-center justify-center md:justify-between w-full group ${
                    index % 2 === 0 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Center dot/icon */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm border-4 border-[var(--color-brand-purple)] rounded-full hidden md:flex items-center justify-center text-[var(--color-brand-purple)] text-lg shadow-[0_0_15px_rgba(164,69,201,0.5)] group-hover:scale-125 group-hover:bg-[var(--color-brand-purple)] group-hover:text-white transition-all duration-300 z-20">
                    {event.icon}
                  </div>

                  {/* Content Box */}
                  <div className="w-full md:w-5/12 py-3">
                    <div className={`bg-white/40 backdrop-blur-xl p-5 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white/60 transition-all duration-300 group-hover:-translate-y-2 group-hover:bg-white/70 group-hover:shadow-[0_8px_32px_rgba(0,0,0,0.15)] ${
                      index % 2 === 0 ? "md:text-right md:mr-6" : "md:text-left md:ml-6"
                    }`}>
                      <span className={`inline-block px-4 py-1.5 font-bold text-xs rounded-full mb-3 shadow-inner ${activeTab === 'lkti' ? 'bg-purple-100/80 text-[var(--color-brand-purple-dark)]' : 'bg-pink-100/80 text-[var(--color-brand-pink-dark)]'}`}>
                        {event.date}
                      </span>
                      <h3 className="text-xl font-bold text-slate-800 drop-shadow-sm">{event.title}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
