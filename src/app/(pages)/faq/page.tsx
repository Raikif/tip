"use client";

import { useState } from "react";
import Link from "next/link";
import "@/components/sections/FaqSection.css";

type FaqItem = {
  question: string;
  answer: string;
};

type FaqSection = {
  title: string;
  subtitle?: string;
  items: FaqItem[];
};

const faqData: FaqSection[] = [
  {
    title: "A. FAQ Umum",
    subtitle: "Berlaku untuk Lomba Esai, LKTI, dan Poster",
    items: [
      {
        question: "1. Apakah pendaftaran dilakukan secara individu atau per tim?",
        answer:
          "Pendaftaran dan pengumpulan karya cukup dilakukan oleh satu orang perwakilan tim, yaitu ketua tim.",
      },
      {
        question:
          "2. Bagaimana cara melakukan pembayaran dan konfirmasinya?",
        answer:
          "Pembayaran dilakukan melalui nomor rekening yang tercantum dalam guidebook atau formulir pengumpulan karya. Setelah melakukan pembayaran, peserta wajib mengunggah foto atau tangkapan layar bukti pembayaran pada saat pengumpulan karya.",
      },
      {
        question:
          "3. Melalui media apa pengumuman peserta lolos, finalis, dan pemenang disampaikan?",
        answer:
          "Pengumuman akan disampaikan melalui akun Instagram resmi @techinnovation.paper dan dikirimkan ke alamat email masing-masing peserta. Peserta disarankan memantau media informasi resmi secara berkala.",
      },
      {
        question: "4. Apakah seluruh peserta akan mendapatkan e-sertifikat?",
        answer:
          "Ya. Seluruh peserta akan mendapatkan e-sertifikat, tidak terbatas pada finalis atau pemenang.",
      },
      {
        question:
          "5. Apakah ada kemungkinan perpanjangan batas waktu pengumpulan karya?",
        answer:
          "Informasi mengenai kemungkinan perpanjangan batas waktu akan diumumkan melalui Instagram @techinnovation.paper. Peserta disarankan tetap mengikuti jadwal yang tercantum dalam guidebook dan tidak menunggu adanya perpanjangan waktu.",
      },
      {
        question:
          "6. Apakah keputusan juri dapat diganggu gugat atau diajukan banding?",
        answer:
          "Tidak. Keputusan dewan juri bersifat final, mutlak, mengikat, dan tidak dapat diganggu gugat.",
      },
      {
        question: "7. Apakah peserta wajib menggunakan referensi?",
        answer:
          "Ya. Peserta wajib menggunakan sumber atau referensi yang relevan dan dapat dipertanggungjawabkan, seperti jurnal ilmiah, buku, laporan resmi, atau sumber tepercaya lainnya.",
      },
      {
        question:
          "8. Apakah nilai atau skor dari juri akan diberitahukan kepada peserta?",
        answer:
          "Penyampaian nilai atau skor dilakukan sesuai dengan kebijakan panitia. Terlepas dari penyampaian skor tersebut, keputusan dewan juri tetap bersifat final dan tidak dapat diganggu gugat.",
      },
      {
        question:
          "9. Bagaimana jika peserta salah mengunggah dokumen atau mengisi data pendaftaran?",
        answer:
          "Peserta harus segera menghubungi contact person cabang lomba masing-masing. Perbaikan hanya dapat dilakukan selama masih berada dalam tenggat waktu pendaftaran atau pengumpulan yang telah ditentukan.",
      },
      {
        question:
          "10. Bagaimana jika peserta belum mendapatkan balasan dari contact person?",
        answer:
          "Contact person akan merespons pesan berdasarkan urutan pesan yang masuk. Apabila dalam waktu 24 jam belum mendapatkan balasan, peserta diperbolehkan mengirimkan pesan pengingat atau follow-up secara sopan.",
      },
      {
        question: "11. Apakah pemenang akan dipublikasikan secara resmi?",
        answer:
          "Ya. Pemenang akan dipublikasikan melalui media sosial resmi Tech Innovation Paper x Cendekia Days 2026.",
      },
      {
        question:
          "12. Siapa yang dapat dihubungi jika terdapat kendala administrasi?",
        answer:
          "Peserta dapat menghubungi contact person sesuai cabang lomba dan menyampaikan kendala yang dialami dengan jelas serta sopan.",
      },
      {
        question:
          "13. Kapan dan melalui platform apa technical meeting dilaksanakan?",
        answer:
          "Technical meeting akan dilaksanakan secara daring melalui Zoom Meeting. Tanggal dan waktu pelaksanaannya akan diumumkan lebih lanjut oleh panitia.",
      },
    ],
  },
  {
    title: "B. FAQ Khusus Lomba Esai dan LKTI",
    items: [
      {
        question:
          "1. Apakah penggunaan AI, seperti ChatGPT, diperbolehkan?",
        answer:
          "AI diperbolehkan sebagai alat bantu untuk diskusi, pengembangan ide, serta perbaikan tata bahasa dan kalimat. Namun, AI tidak boleh digunakan untuk menghasilkan seluruh karya. Isi dan gagasan utama harus tetap berasal dari pemikiran peserta serta tidak boleh berupa salin-tempel keluaran AI secara langsung.",
      },
      {
        question: "2. Apakah technical meeting wajib diikuti?",
        answer:
          "Ya. Untuk Lomba Esai dan LKTI, technical meeting wajib diikuti oleh peserta yang dinyatakan lolos tahap abstrak.",
      },
      {
        question: "3. Apakah final dilaksanakan secara daring atau luring?",
        answer:
          "Final Lomba Esai dan LKTI dilaksanakan secara luring di Fakultas Teknik, Universitas Gadjah Mada. Finalis akan mempresentasikan karya di hadapan dewan juri dan mengikuti sesi tanya jawab.",
      },
      {
        question:
          "4. Apakah ada biaya tambahan atau HTM untuk mengikuti final secara luring?",
        answer:
          "Tidak ada biaya tambahan atau HTM. Seluruh rangkaian kegiatan, mulai dari tahap penyisihan hingga final, telah tercakup dalam biaya pendaftaran.",
      },
      {
        question: "5. Apakah biaya pendaftaran sudah termasuk konsumsi?",
        answer:
          "Ya. Biaya pendaftaran sudah mencakup konsumsi selama rangkaian acara berlangsung.",
      },
      {
        question:
          "6. Apakah biaya pendaftaran mencakup penginapan dan transportasi?",
        answer:
          "Tidak. Biaya akomodasi dan transportasi tidak termasuk dalam biaya pendaftaran serta menjadi tanggung jawab masing-masing peserta.\n\nCatatan: Pertanyaan ini tercantum pada versi guidebook sebelumnya, sedangkan bagian FAQ pada file terbaru tidak lagi menampilkannya.",
      },
      {
        question: "7. Apakah terdapat ketentuan pakaian untuk pelaksanaan final?",
        answer:
          "Ya. Finalis wajib menggunakan jas almamater perguruan tinggi masing-masing saat mengikuti final secara luring.",
      },
      {
        question: "8. Siapa contact person Lomba Esai?",
        answer:
          "Peserta Lomba Esai dapat menghubungi:\n\nSarah\n+62 858-5643-9655",
      },
      {
        question: "9. Siapa contact person Lomba LKTI?",
        answer:
          "Peserta Lomba LKTI dapat menghubungi:\n\nBilbina\n+62 813-1192-3086",
      },
    ],
  },
  {
    title: "C. FAQ Khusus Lomba Poster",
    items: [
      {
        question:
          "1. Apakah penggunaan AI diperbolehkan dalam pembuatan poster?",
        answer:
          "Tidak. Poster wajib bersifat orisinal dan tidak boleh dibuat menggunakan AI. Peserta juga tidak diperkenankan menggunakan template siap pakai secara langsung, tetapi masih boleh menggunakan elemen bawaan dari aplikasi desain.\n\nCatatan penting: Pada bagian FAQ guidebook disebutkan bahwa AI dapat digunakan sebagai alat bantu diskusi dan pengembangan ide. Namun, ketentuan teknis Poster secara tegas melarang penggunaan AI dalam pembuatan karya. Oleh karena itu, ketentuan teknis yang lebih khusus dan lebih ketat sebaiknya dijadikan acuan.",
      },
      {
        question: "2. Apakah technical meeting wajib diikuti?",
        answer:
          "Ya. Technical meeting wajib diikuti oleh seluruh peserta Lomba Poster.",
      },
      {
        question:
          "3. Apakah final Lomba Poster dilaksanakan secara daring atau luring?",
        answer:
          "Final Lomba Poster dilaksanakan secara daring. Karya delapan tim finalis akan diunggah melalui akun Instagram @techinnovation.paper untuk mengikuti tahap penilaian dan voting.",
      },
      {
        question: "4. Apakah jumlah likes sepenuhnya menentukan juara?",
        answer:
          "Tidak. Jumlah likes tidak sepenuhnya menentukan juara utama. Penentuan juara tetap mempertimbangkan penilaian juri dan komponen penilaian yang tercantum dalam guidebook. Finalis dengan jumlah likes terbanyak akan memperoleh penghargaan Most Favourite.",
      },
      {
        question: "5. Apakah finalis boleh mempromosikan posternya?",
        answer:
          "Ya. Finalis diperbolehkan mempromosikan poster masing-masing. Namun, manipulasi likes atau bentuk kecurangan lainnya dilarang dan dapat menyebabkan diskualifikasi.",
      },
      {
        question: "6. Siapa contact person Lomba Poster?",
        answer:
          "Peserta Lomba Poster dapat menghubungi:\n\nKahe\n+62 822-5986-4141",
      },
    ],
  },
];

function AccordionItem({
  question,
  answer,
  isOpen,
  onClick,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div className={`faq-accordion-item${isOpen ? " faq-accordion-item--open" : ""}`}>
      <button
        type="button"
        onClick={onClick}
        className="faq-accordion-trigger"
        aria-expanded={isOpen}
      >
        <span>{question}</span>
        <span className="faq-accordion-icon" aria-hidden="true">
          {isOpen ? "−" : "+"}
        </span>
      </button>
      {isOpen && (
        <div className="faq-accordion-panel">
          <div
            className="faq-accordion-answer"
            dangerouslySetInnerHTML={{
              __html: answer.replace(/\n/g, "<br />"),
            }}
          />
        </div>
      )}
    </div>
  );
}

export default function FaqPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggle = (key: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [key]: prev[key] ? false : true,
    }));
  };

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
            FAQ Tech Innovation Paper x Cendekia Days 2026
          </h2>
        </header>

        <div className="faq-sections">
          {faqData.map((section) => {
            const sectionKey = section.title;
            return (
              <div key={sectionKey} className="faq-section-block">
                <div className="faq-section-header">
                  <h3 className="faq-section-title">{section.title}</h3>
                  {section.subtitle && (
                    <p className="faq-section-subtitle">{section.subtitle}</p>
                  )}
                </div>

                <div className="faq-accordion">
                  {section.items.map((item) => {
                    const itemKey = `${sectionKey}-${item.question}`;
                    return (
                      <AccordionItem
                        key={itemKey}
                        question={item.question}
                        answer={item.answer}
                        isOpen={!!openItems[itemKey]}
                        onClick={() => toggle(itemKey)}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="faq-actions">
          <Link href="/" className="faq-button">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </section>
  );
}
