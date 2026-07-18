"use client";

import Link from "next/link";
import "@/components/sections/FaqSection.css";

const questions = [
  "Bagaimana cara pembayaran dan bagaimana proses konfirmasinya?",
  "Adakah grup WhatsApp resmi untuk peserta?",
  "Apakah technical meeting wajib diikuti oleh seluruh peserta?",
  "Technical meeting dilaksanakan kapan dan melalui platform apa (online/offline)?",
  "Melalui media apa pengumuman finalis/pemenang akan disampaikan?",
  "Apakah seluruh peserta (tidak hanya pemenang) akan mendapatkan e-sertifikat?",
  "Bagaimana jika belum mendapat balasan/konfirmasi dari panitia setelah menghubungi CP?",
  "Apakah ada kemungkinan perpanjangan batas waktu pengumpulan karya?",
  "Apakah pendaftaran dilakukan per individu atau per tim?",
  "Apakah biaya pendaftaran sudah termasuk konsumsi?",
  "Apakah keputusan juri bisa diganggu gugat atau banding?",
  "Apakah wajib menggunakan referensi atau sumber tertentu?",
  "Apakah boleh menggunakan bantuan AI dalam pembuatan karya?",
  "Apakah nilai atau skor dari juri akan diberitahukan ke peserta?",
  "Jika nilai peserta seri, bagaimana penentuan pemenangnya?",
  "Bagaimana jika nama pada sertifikat salah ketik atau typo?",
  "Apakah pemenang akan dipublikasikan secara resmi?",
  "Siapa yang bisa dihubungi jika ada kendala administrasi?",
  "Bagaimana jika peserta salah mengunggah dokumen pendaftaran?",
  "Bagaimana teknis pelaksanaan hari final secara offline?",
  "Apakah ada biaya tambahan untuk mengikuti acara final offline?",
  "Apakah biaya tambahan offline termasuk penginapan dan transportasi?",
  "Jika finalis tidak sanggup membayar biaya offline, apakah bisa ikut online?",
  "Bagaimana cara mengetahui update terbaru jika jadwal berubah mendadak?",
];

function QuestionCard({ question }) {
  return (
    <article className="faq-card">
      <div className="faq-card__dashed-border">
        <p>{question}</p>
      </div>
    </article>
  );
}

export default function FaqPage() {
  return (
    <section className="faq-section" id="faq">
      <div className="faq-container">
        <header className="faq-header">
          <div className="faq-badge">
            <div className="faq-badge__dashed">
              Tanya Jawab
            </div>
          </div>

          <h2 className="faq-title">
            Cari Tahu Semua Pertanyaanmu!
          </h2>
        </header>

        <div className="faq-grid">
          {questions.map((question) => (
            <QuestionCard
              key={question}
              question={question}
            />
          ))}
        </div>

        <div className="faq-actions">
          <Link
            href="/"
            className="faq-button"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </section>
  );
}
