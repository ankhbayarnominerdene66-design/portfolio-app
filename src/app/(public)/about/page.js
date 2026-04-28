'use client';
// src/app/(public)/about/page.js

import Image from 'next/image';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, MapPin, Mail } from 'lucide-react';
import { useDocument } from '@/hooks/useFirestore';
import { PageLoader } from '@/components/ui/Loading';

export default function AboutPage() {
  const { data: about, loading } = useDocument('about');

  if (loading) return <PageLoader />;

  return (
    <div className="container-custom py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            Танилцуулга
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-400 to-accent-400 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Image and quick info */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {about?.image ? (
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                  <Image
                    src={about.image}
                    alt={about.fullName || 'Profile'}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900 dark:to-accent-900 flex items-center justify-center">
                  <span className="font-display text-9xl font-bold text-gradient">
                    N
                  </span>
                </div>
              )}

              <div className="space-y-3 p-5 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                {about?.university && (
                  <div className="flex items-start gap-3">
                    <GraduationCap className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Их сургууль
                      </p>
                      <p className="text-sm font-medium">{about.university}</p>
                    </div>
                  </div>
                )}
                {about?.year && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Курс</p>
                      <p className="text-sm font-medium">{about.year}</p>
                    </div>
                  </div>
                )}
                {about?.major && (
                  <div className="flex items-start gap-3">
                    <GraduationCap className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Мэргэжил
                      </p>
                      <p className="text-sm font-medium">{about.major}</p>
                    </div>
                  </div>
                )}
                {about?.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Хаяг</p>
                      <p className="text-sm font-medium">{about.location}</p>
                    </div>
                  </div>
                )}
                {about?.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        И-мэйл
                      </p>
                      <p className="text-sm font-medium break-all">{about.email}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="font-display text-2xl font-semibold mb-4">
                {about?.fullName || 'А.Номин-Эрдэнэ'}
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                  {about?.description || 'Танилцуулга бичигдэх болно...'}
                </p>
              </div>
            </div>

            {about?.experience?.length > 0 && (
              <div>
                <h3 className="font-display text-xl font-semibold mb-4">
                  Туршлага
                </h3>
                <div className="space-y-4">
                  {about.experience.map((exp, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {exp.title}
                        </h4>
                        <span className="text-xs text-gray-500">{exp.period}</span>
                      </div>
                      <p className="text-sm text-primary-600 dark:text-primary-400 mb-2">
                        {exp.company}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {about?.education?.length > 0 && (
              <div>
                <h3 className="font-display text-xl font-semibold mb-4">
                  Боловсрол
                </h3>
                <div className="space-y-4">
                  {about.education.map((edu, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {edu.degree}
                        </h4>
                        <span className="text-xs text-gray-500">{edu.period}</span>
                      </div>
                      <p className="text-sm text-primary-600 dark:text-primary-400">
                        {edu.school}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
