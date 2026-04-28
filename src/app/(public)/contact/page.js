'use client';
// src/app/(public)/contact/page.js

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send, Github, Linkedin, Facebook, Instagram } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDocument } from '@/hooks/useFirestore';
import { submitContactMessage } from '@/lib/firestore';
import { validateContactForm } from '@/lib/validation';
import Input, { Textarea } from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ContactPage() {
  const { data: contact } = useDocument('contact');
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { isValid, errors: validationErrors } = validateContactForm(form);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      await submitContactMessage(form);
      toast.success('Зурвас амжилттай илгээгдлээ! Удахгүй хариу өгье.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Зурвас илгээхэд алдаа гарлаа');
    } finally {
      setSubmitting(false);
    }
  };

  const socialLinks = [
    { key: 'github', Icon: Github, label: 'GitHub' },
    { key: 'linkedin', Icon: Linkedin, label: 'LinkedIn' },
    { key: 'facebook', Icon: Facebook, label: 'Facebook' },
    { key: 'instagram', Icon: Instagram, label: 'Instagram' },
  ];

  return (
    <div className="container-custom py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
          Холбоо барих
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Хамтран ажиллах хүсэлт, асуулт, эсвэл зүгээр л мэндчилэх — бүгдийг хүлээж авна
        </p>
        <div className="w-20 h-1 bg-gradient-to-r from-primary-400 to-accent-400 mx-auto rounded-full mt-6" />
      </motion.div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Contact info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="p-6 rounded-2xl bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-950/50 dark:to-accent-950/50 border border-primary-100 dark:border-primary-900">
            <h2 className="font-display text-xl font-semibold mb-4">
              Холбогдох мэдээлэл
            </h2>
            <div className="space-y-4">
              {contact?.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-3 group"
                >
                  <div className="p-2.5 rounded-xl bg-white dark:bg-gray-900 group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">И-мэйл</p>
                    <p className="text-sm font-medium">{contact.email}</p>
                  </div>
                </a>
              )}
              {contact?.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center gap-3 group"
                >
                  <div className="p-2.5 rounded-xl bg-white dark:bg-gray-900 group-hover:scale-110 transition-transform">
                    <Phone className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Утас</p>
                    <p className="text-sm font-medium">{contact.phone}</p>
                  </div>
                </a>
              )}
              {contact?.location && (
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-gray-900">
                    <MapPin className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Хаяг</p>
                    <p className="text-sm font-medium">{contact.location}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {contact && (
            <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
              <h3 className="font-display text-lg font-semibold mb-4">
                Сошиал сүлжээ
              </h3>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map(({ key, Icon, label }) =>
                  contact[key] ? (
                    <a
                      key={key}
                      href={contact[key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={label}
                      className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900 hover:text-primary-600 transition-colors"
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  ) : null
                )}
              </div>
            </div>
          )}
        </motion.div>

        {/* Contact form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-3"
        >
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 space-y-5"
          >
            <h2 className="font-display text-xl font-semibold mb-2">
              Зурвас илгээх
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Нэр"
                name="name"
                value={form.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="Таны нэр"
              />
              <Input
                label="И-мэйл"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="[email protected]"
              />
            </div>

            <Input
              label="Гарчиг"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Зурвасны гарчиг"
            />

            <Textarea
              label="Зурвас"
              name="message"
              rows={5}
              value={form.message}
              onChange={handleChange}
              error={errors.message}
              placeholder="Юу хэлэх гэсэн бэ?"
            />

            <Button type="submit" loading={submitting} className="w-full sm:w-auto">
              <Send className="w-4 h-4" />
              Илгээх
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
