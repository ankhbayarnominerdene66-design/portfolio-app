'use client';
// src/components/layout/Footer.js

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useDocument } from '@/hooks/useFirestore';

export default function Footer() {
  const { data: contact } = useDocument('contact');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-100 dark:border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-display text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Nomin-Erdene
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Програм хангамжийн оюутан, Их Засаг Их Сургууль
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Хуудаснууд
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-gray-500 hover:text-primary-500 dark:text-gray-400"
                >
                  Танилцуулга
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-gray-500 hover:text-primary-500 dark:text-gray-400"
                >
                  Төслүүд
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-500 hover:text-primary-500 dark:text-gray-400"
                >
                  Холбоо барих
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Холбоо барих
            </h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              {contact?.email && <li>{contact.email}</li>}
              {contact?.phone && <li>{contact.phone}</li>}
              {contact?.location && <li>{contact.location}</li>}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {year} А.Номин-Эрдэнэ. Бүх эрх хуулиар хамгаалагдсан.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
            Бүтээсэн{' '}
            <Heart className="w-4 h-4 text-accent-500 fill-accent-500" /> Next.js + Firebase
          </p>
        </div>
      </div>
    </footer>
  );
}
