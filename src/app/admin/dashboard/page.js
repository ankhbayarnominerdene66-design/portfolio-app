'use client';
// src/app/admin/dashboard/page.js

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FolderKanban,
  Wrench,
  MessageCircle,
  TrendingUp,
  Home,
  User,
  ArrowRight,
} from 'lucide-react';
import { useCollection } from '@/hooks/useFirestore';
import { Spinner } from '@/components/ui/Loading';

const StatCard = ({ icon: Icon, label, value, href, color, loading }) => (
  <Link href={href}>
    <motion.div
      whileHover={{ y: -4 }}
      className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:shadow-primary-500/5 transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <ArrowRight className="w-4 h-4 text-gray-400" />
      </div>
      <p className="text-3xl font-display font-bold mb-1">
        {loading ? <Spinner size="sm" /> : value}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </motion.div>
  </Link>
);

const QuickAction = ({ icon: Icon, label, href, description }) => (
  <Link
    href={href}
    className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-800 transition-colors group"
  >
    <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900 dark:to-accent-900 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform">
      <Icon className="w-5 h-5" />
    </div>
    <div className="flex-1">
      <p className="font-medium text-sm">{label}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
    </div>
    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
  </Link>
);

export default function DashboardPage() {
  const { data: projects, loading: projectsLoading } = useCollection('projects');
  const { data: skills, loading: skillsLoading } = useCollection('skills');
  const { data: messages, loading: messagesLoading } = useCollection('messages');

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold mb-2">Тавтай морилно уу</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Portfolio-ийн админ самбар. Энд бүх контентыг удирдах боломжтой.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={FolderKanban}
          label="Нийт төсөл"
          value={projects.length}
          href="/admin/projects"
          color="bg-gradient-to-br from-primary-400 to-primary-600"
          loading={projectsLoading}
        />
        <StatCard
          icon={Wrench}
          label="Нийт чадвар"
          value={skills.length}
          href="/admin/skills"
          color="bg-gradient-to-br from-accent-400 to-accent-600"
          loading={skillsLoading}
        />
        <StatCard
          icon={MessageCircle}
          label="Нийт зурвас"
          value={messages.length}
          href="/admin/contact"
          color="bg-gradient-to-br from-blue-400 to-blue-600"
          loading={messagesLoading}
        />
        <StatCard
          icon={TrendingUp}
          label="Уншаагүй зурвас"
          value={unreadCount}
          href="/admin/contact"
          color="bg-gradient-to-br from-green-400 to-green-600"
          loading={messagesLoading}
        />
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="font-display text-xl font-semibold mb-4">Хурдан удирдлага</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <QuickAction
            icon={Home}
            label="Нүүр хуудас засах"
            description="Hero хэсэг, танилцуулга шинэчлэх"
            href="/admin/home"
          />
          <QuickAction
            icon={User}
            label="Танилцуулга засах"
            description="Боловсрол, туршлага оруулах"
            href="/admin/about"
          />
          <QuickAction
            icon={FolderKanban}
            label="Шинэ төсөл нэмэх"
            description="Бүтээгдсэн төслүүдээ нэмэх"
            href="/admin/projects"
          />
          <QuickAction
            icon={Wrench}
            label="Чадвар нэмэх"
            description="Технологи, мэдлэг шинэчлэх"
            href="/admin/skills"
          />
        </div>
      </div>

      {/* Recent messages */}
      {messages.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold">Сүүлийн зурвасууд</h2>
            <Link
              href="/admin/contact"
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              Бүгдийг үзэх
            </Link>
          </div>
          <div className="space-y-2">
            {messages.slice(0, 3).map((msg) => (
              <div
                key={msg.id}
                className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex items-start justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm">{msg.name}</p>
                    {!msg.read && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                        Шинэ
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{msg.email}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {msg.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
