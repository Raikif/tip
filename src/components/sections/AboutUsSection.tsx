import React from "react";
import Image from "next/image";

export default function AboutUsSection() {
  return (
    <section id="about" className="panel panel-hidden bg-about items-center justify-center overflow-y-auto">
      <div className="max-w-6xl mx-auto px-6 w-full flex flex-col justify-center pt-24 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Tentang Kami
          </h2>
          <p className="text-slate-700 max-w-2xl mx-auto">
            Tech Innovation Paper (TIP) 2026 diselenggarakan melalui kolaborasi luar biasa.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-stretch justify-center">
          {/* Cendekia Teknika */}
          <div className="flex flex-col bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white flex-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-brand-purple)] rounded-bl-full opacity-10" />
            <div className="flex items-center gap-6 mb-6">
              <div className="relative w-24 h-24 bg-white rounded-full p-2 shadow-md border-2 border-slate-100 flex-shrink-0">
                <Image 
                  src="/logo CT fIX DAN rESMI 1.png" 
                  alt="Logo Cendekia Teknika" 
                  fill
                  sizes="96px"
                  className="object-contain p-2"
                />
              </div>
              <h3 className="text-2xl font-bold text-[var(--color-brand-purple)]">Cendekia Teknika UGM</h3>
            </div>
            <p className="text-slate-700 leading-relaxed text-sm flex-grow">
              Badan Semi Otonom (BSO) di Fakultas Teknik UGM yang berfokus pada ranah Akademik dan Keprofesian Teknik. Kami mewadahi potensi mahasiswa untuk menjadi insan akademis yang profesional, berwawasan luas, dan berkarakter unggul melalui program pengembangan riset, inovasi, dan diskusi ilmiah.
            </p>
          </div>

          {/* LPKTA */}
          <div className="flex flex-col bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white flex-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-brand-orange)] rounded-bl-full opacity-10" />
            <div className="flex items-center gap-6 mb-6">
              <div className="relative w-24 h-24 bg-white rounded-full p-2 shadow-md border-2 border-slate-100 flex-shrink-0">
                <Image 
                  src="/cropped-LOGO-LPKTA-1.png" 
                  alt="Logo LPKTA" 
                  fill
                  sizes="96px"
                  className="object-contain p-2"
                />
              </div>
              <h3 className="text-2xl font-bold text-[var(--color-brand-orange-dark)]">LPKTA</h3>
            </div>
            <p className="text-slate-700 leading-relaxed text-sm flex-grow">
              Lembaga Pengembangan Keilmuan dan Teknologi merupakan wadah bagi para mahasiswa untuk mengembangkan minat dan bakat di bidang akademik, riset, dan inovasi teknologi. Berkomitmen untuk terus mendukung lahirnya inovasi-inovasi mutakhir dari generasi muda bangsa.
            </p>
          </div>
        </div>

        {/* Footer info minimalis */}
        <div className="mt-16 text-center text-slate-500 text-sm">
          <p>&copy; 2026 Tech Innovation Paper. All rights reserved.</p>
        </div>
      </div>
    </section>
  );
}
