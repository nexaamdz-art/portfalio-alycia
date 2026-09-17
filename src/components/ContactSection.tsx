import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Mail, CheckCircle2 } from 'lucide-react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSubmitted(true);
  };

  return (
    <section
      id="contact"
      aria-label="Contact"
      dir="ltr"
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#0b0416] py-24 px-6 sm:px-10 lg:px-12 xl:px-16"
    >
      {/* Glassmorphism Form Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-xl p-8 sm:p-10 md:p-12 rounded-3xl bg-[#130924]/75 backdrop-blur-xl border border-white/15 shadow-2xl shadow-purple-950/60 text-left"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
            Get in Touch
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
            Have a project in mind or want to collaborate? Send me a message and let's create something extraordinary together.
          </p>
        </div>

        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-center flex flex-col items-center gap-3"
          >
            <CheckCircle2 className="w-12 h-12 text-pink-400" />
            <h3 className="text-xl font-bold text-white">Message Sent Successfully</h3>
            <p className="text-sm text-slate-300 max-w-sm">
              Thank you, {formData.name}! I have received your note and will get back to you promptly.
            </p>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setFormData({ name: '', email: '', message: '' });
              }}
              className="mt-4 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition"
            >
              Send Another Message
            </button>
          </motion.div>
        ) : (
          /* Contact Form */
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="contact-name"
                className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider"
              >
                Full Name
              </label>
              <input
                id="contact-name"
                type="text"
                required
                placeholder="Jane Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="contact-email"
                className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider"
              >
                Email Address
              </label>
              <input
                id="contact-email"
                type="email"
                required
                placeholder="jane@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider"
              >
                Project Details / Message
              </label>
              <textarea
                id="contact-message"
                rows={4}
                required
                placeholder="Tell me about your project or idea..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all text-sm resize-none"
              />
            </div>

            <button
              id="send-message-btn"
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-sm hover:opacity-95 hover:scale-[1.01] transition-all duration-200 shadow-lg shadow-purple-600/30 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Send Message</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Direct Email Badge */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center flex flex-col sm:flex-row items-center justify-center gap-2">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-purple-400" /> Or reach out directly via email:
          </span>
          <a
            href="mailto:contact@alycia.dev"
            className="text-xs font-sans-modern font-semibold text-pink-300 hover:text-pink-200 underline decoration-pink-400/40 underline-offset-4 transition-colors"
          >
            contact@alycia.dev
          </a>
        </div>
      </motion.div>
    </section>
  );
}
