'use client';
// src/app/(public)/page.js

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Github, Linkedin, Mail, Sparkles } from 'lucide-react';
import { useDocument, useCollection } from '@/hooks/useFirestore';
import { Spinner } from '@/components/ui/Loading';
import Card from '@/components/ui/Card';

export default function HomePage() {
  const { data: home, loading: homeLoading } = useDocument('home');
  const { data: projects, loading: projectsLoading } = useCollection('projects');
  const { data: contact } = useDocument('contact');

  const featuredProjects = projects?.slice(0, 3) || [];

  return (
    <div className="container-custom">
      {/* Hero Section */}
      <section className="py-20 md:py-32">
        {homeLoading ? (
          <div className="flex justify-center"><Spinner size="lg" /></div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                {home?.tagline || 'Welcome to my portfolio'}
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Сайн байна уу,
                <br />
                Би <span className="text-gradient">{home?.name || 'А.Номин-Эрдэнэ'}</span>
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-lg leading-relaxed">
                {home?.bio ||
                  'Их Засаг Их Сургуулийн 3-р курсын програм хангамжийн оюутан. Орчин үеийн web хөгжүүлэлт, UI/UX дизайны чиглэлээр суралцаж байна.'}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium hover:shadow-lg hover:shadow-primary-500/30 transition-shadow"
                >
                  Төслүүд үзэх
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
                >
                  Холбоо барих
                </Link>
              </div>

              {/* Social links */}
              {contact && (
                <div className="flex items-center gap-3 mt-10">
                  {contact.github && (
                    <a
                      href={contact.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900 hover:text-primary-600 transition-colors"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {contact.linkedin && (
                    <a
                      href={contact.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900 hover:text-primary-600 transition-colors"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {contact.email && (
                    <a
                      href={`mailto:${contact.email}`}
                      className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900 hover:text-primary-600 transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                    </a>
                  )}
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-300 to-accent-300 rounded-[3rem] rotate-6 opacity-30 dark:opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-tl from-primary-400 to-accent-400 rounded-[3rem] -rotate-6 opacity-30 dark:opacity-20" />
                {home?.profileImage ? (
                  <div className="relative w-full h-full rounded-[3rem] overflow-hidden">
                    <Image
                      src={home.profileImage}
                      alt={home.name || 'Profile'}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                ) : (
                  <div className="relative w-full h-full rounded-[3rem] bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900 dark:to-accent-900 flex items-center justify-center">
                    <span className="font-display text-9xl font-bold text-gradient">
                      N
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </section>

      {/* Featured Projects */}
      <section className="py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-2">
              Сонгомол төслүүд
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Сүүлд хийсэн зарим бүтээлүүд
            </p>
          </div>
          <Link
            href="/projects"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:gap-2 transition-all"
          >
            Бүгдийг үзэх
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {projectsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} hover={false} className="animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-gray-800" />
                <div className="p-5 space-y-3">
                  <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-800 rounded" />
                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded" />
                </div>
              </Card>
            ))}
          </div>
        ) : featuredProjects.length === 0 ? (
          <p className="text-center text-gray-500 py-12">Төсөл байхгүй байна</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <Link href={`/projects`}>
                  <Card className="h-full">
                    {project.image && (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="font-display text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                        {project.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {project.description}
                      </p>
                      {project.technologies && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {project.technologies.slice(0, 3).map((tech) => (
                            <span
                              key={tech}
                              className="text-xs px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
