import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Mail, CheckCircle2, Instagram, Github } from 'lucide-react';

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
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-transparent py-24 px-6 sm:px-10 lg:px-12 xl:px-16"
    >
      {/* Glassmorphism Form Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-xl p-8 sm:p-10 md:p-12 rounded-3xl bg-[#240d25]/80 backdrop-blur-xl border border-white/15 shadow-2xl shadow-purple-950/60 text-left"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight"
          >
            Get in Touch
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.75, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-md mx-auto"
          >
            Have a project in mind or want to collaborate? Send me a message and let's create something extraordinary together.
          </motion.p>
        </div>

        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
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
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.6, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.6, delay: 0.29, ease: [0.16, 1, 0.3, 1] }}
            >
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
            </motion.div>

            <motion.button
              id="send-message-btn"
              type="submit"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-sm hover:opacity-95 hover:scale-[1.01] transition-all duration-200 shadow-lg shadow-purple-600/30 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Send Message</span>
              <Send className="w-4 h-4" />
            </motion.button>
          </form>
        )}

        {/* Direct Email & Instagram Links */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Mail className="w-3.5 h-3.5 text-purple-400" />
            <span>Email:</span>
            <a
              id="contact-email-link"
              href="mailto:nexa.am.dz@gmail.com"
              className="font-sans-modern font-semibold text-pink-300 hover:text-pink-200 underline decoration-pink-400/40 underline-offset-4 transition-colors"
            >
              nexa.am.dz@gmail.com
            </a>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              id="contact-github-link"
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-purple-300 transition-all text-xs font-medium group cursor-pointer"
            >
              <Github className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
              <span>GitHub</span>
            </a>

            <a
              id="contact-instagram-link"
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-pink-300 transition-all text-xs font-medium group cursor-pointer"
            >
              <Instagram className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform" />
              <span>Instagram</span>
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
