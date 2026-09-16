"use client";

import React, { useState } from "react";
import CosmicBG from "./CosmicBG"; // تأكد من مسار المكون لديك

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // يمكنك إضافة منطق إرسال البيانات هنا
    console.log("Form Submitted:", formData);
  };

  return (
    <section id="contact" className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 py-20 px-4">
      {/* 1. Cosmic Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-80">
        <CosmicBG
          coreColor="#6823C3"
          midColor="#007BFF"
          accentColor="#9900FF"
          outerColor="#0F172A"
          brightness={35}
          speed={15}
          rotation={10}
        />
      </div>

      {/* 2. Glassmorphism Form Container */}
      <div className="relative z-10 w-full max-w-xl p-8 md:p-12 rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-2xl shadow-indigo-950/50 text-right dir-rtl" dir="rtl">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-3 tracking-tight">
            تواصل معي
          </h2>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            عندك فكرة مشروع أو استفسار؟ أرسل لي رسالة وبنبدأ نشتغلوا عليها مع بعض!
          </p>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              الاسم الكامل
            </label>
            <input
              type="text"
              required
              placeholder="اسمك هنا..."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              required
              placeholder="example@domain.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all text-sm dir-ltr text-right"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              تفاصيل الفكرة / الرسالة
            </label>
            <textarea
              rows={4}
              required
              placeholder="احكيلي على مشروعك أو فكرتك..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all text-sm resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-sm hover:opacity-90 hover:scale-[1.01] transition-all duration-200 shadow-lg shadow-indigo-500/25 active:scale-[0.99]"
          >
            إرسال الرسالة &larr;
          </button>
        </form>

        {/* Direct Email Badge */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-xs text-slate-400">
            أو تواصل معي مباشرة عبر البريد الإلكتروني:
          </p>
          <a
            href="mailto:contact@example.com"
            className="inline-block mt-2 text-sm font-sans text-sky-300 hover:underline"
            dir="ltr"
          >
            contact@alycia.dev
          </a>
        </div>
      </div>
    </section>
  );
}
