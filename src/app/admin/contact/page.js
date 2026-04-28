'use client';
// src/app/admin/contact/page.js

import { useState, useEffect } from 'react';
import { Save, Mail, Phone, MapPin, Trash2, Eye, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDocument, useCollection } from '@/hooks/useFirestore';
import {
  setSingleDoc,
  deleteDocument,
  markMessageRead,
} from '@/lib/firestore';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { PageLoader } from '@/components/ui/Loading';

export default function AdminContactPage() {
  const { data: contact, loading: contactLoading, refetch: refetchContact } = useDocument('contact');
  const { data: messages, loading: messagesLoading, refetch: refetchMessages } = useCollection('messages');

  const [form, setForm] = useState({
    email: '',
    phone: '',
    location: '',
    github: '',
    linkedin: '',
    facebook: '',
    instagram: '',
  });
  const [saving, setSaving] = useState(false);
  const [viewMessage, setViewMessage] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState(null);

  useEffect(() => {
    if (contact) {
      setForm({
        email: contact.email || '',
        phone: contact.phone || '',
        location: contact.location || '',
        github: contact.github || '',
        linkedin: contact.linkedin || '',
        facebook: contact.facebook || '',
        instagram: contact.instagram || '',
      });
    }
  }, [contact]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setSingleDoc('contact', form);
      toast.success('Холбоо барих мэдээлэл шинэчлэгдлээ');
      refetchContact();
    } catch (error) {
      toast.error('Хадгалахад алдаа гарлаа');
    } finally {
      setSaving(false);
    }
  };

  const handleViewMessage = async (msg) => {
    setViewMessage(msg);
    if (!msg.read) {
      try {
        await markMessageRead(msg.id);
        refetchMessages();
      } catch (err) {
        // silent fail
      }
    }
  };

  const handleDeleteMessage = async (id) => {
    try {
      await deleteDocument('messages', id);
      toast.success('Зурвас устгагдлаа');
      refetchMessages();
    } catch (err) {
      toast.error('Устгахад алдаа гарлаа');
    } finally {
      setDeleteMessage(null);
    }
  };

  if (contactLoading) return <PageLoader />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold mb-2">Холбоо барих</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Холбогдох мэдээлэл болон ирсэн зурвасуудыг удирдах
        </p>
      </div>

      {/* Contact info form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 space-y-5"
      >
        <h2 className="font-display text-lg font-semibold">Холбогдох мэдээлэл</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="И-мэйл"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="[email protected]"
          />
          <Input
            label="Утас"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+976 9999 9999"
          />
          <Input
            label="Хаяг"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Улаанбаатар, Монгол"
            className="sm:col-span-2"
          />
        </div>

        <h3 className="font-display text-base font-semibold pt-2">Сошиал сүлжээ</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="GitHub"
            name="github"
            value={form.github}
            onChange={handleChange}
            placeholder="https://github.com/username"
          />
          <Input
            label="LinkedIn"
            name="linkedin"
            value={form.linkedin}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/username"
          />
          <Input
            label="Facebook"
            name="facebook"
            value={form.facebook}
            onChange={handleChange}
            placeholder="https://facebook.com/username"
          />
          <Input
            label="Instagram"
            name="instagram"
            value={form.instagram}
            onChange={handleChange}
            placeholder="https://instagram.com/username"
          />
        </div>

        <div className="pt-4">
          <Button type="submit" loading={saving}>
            <Save className="w-4 h-4" />
            Хадгалах
          </Button>
        </div>
      </form>

      {/* Messages */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800">
        <h2 className="font-display text-lg font-semibold mb-5">
          Ирсэн зурвасууд ({messages.length})
        </h2>

        {messagesLoading ? (
          <p className="text-center text-gray-500 py-8">Уншиж байна...</p>
        ) : messages.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Зурвас байхгүй байна</p>
        ) : (
          <div className="space-y-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`
                  p-4 rounded-xl border transition-colors
                  ${
                    msg.read
                      ? 'border-gray-100 dark:border-gray-800'
                      : 'border-primary-200 dark:border-primary-800 bg-primary-50/30 dark:bg-primary-950/20'
                  }
                `}
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-medium">{msg.name}</p>
                      {!msg.read && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                          Шинэ
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{msg.email}</p>
                    {msg.subject && (
                      <p className="text-sm font-medium mt-1">{msg.subject}</p>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                  {msg.message}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleViewMessage(msg)}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Дэлгэрэнгүй
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setDeleteMessage(msg)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View message modal */}
      <Modal
        isOpen={!!viewMessage}
        onClose={() => setViewMessage(null)}
        title="Зурвасны дэлгэрэнгүй"
      >
        {viewMessage && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Нэр</p>
                <p className="font-medium">{viewMessage.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">И-мэйл</p>
                <a
                  href={`mailto:${viewMessage.email}`}
                  className="font-medium text-primary-600 dark:text-primary-400 hover:underline break-all"
                >
                  {viewMessage.email}
                </a>
              </div>
            </div>

            {viewMessage.subject && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Гарчиг</p>
                <p className="font-medium">{viewMessage.subject}</p>
              </div>
            )}

            <div>
              <p className="text-xs text-gray-500 mb-1">Зурвас</p>
              <p className="text-sm whitespace-pre-line p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                {viewMessage.message}
              </p>
            </div>

            <a
              href={`mailto:${viewMessage.email}?subject=Re: ${viewMessage.subject || ''}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium text-sm"
            >
              <Mail className="w-4 h-4" />
              Хариу бичих
            </a>
          </div>
        )}
      </Modal>

      {/* Delete confirm */}
      <Modal
        isOpen={!!deleteMessage}
        onClose={() => setDeleteMessage(null)}
        title="Зурвас устгах уу?"
        maxWidth="max-w-md"
      >
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          <strong>{deleteMessage?.name}</strong>-аас ирсэн зурвасыг устгах гэж байна.
        </p>
        <div className="flex gap-3">
          <Button
            variant="danger"
            onClick={() => handleDeleteMessage(deleteMessage.id)}
            className="flex-1"
          >
            <Trash2 className="w-4 h-4" />
            Устгах
          </Button>
          <Button
            variant="secondary"
            onClick={() => setDeleteMessage(null)}
            className="flex-1"
          >
            Болих
          </Button>
        </div>
      </Modal>
    </div>
  );
}
