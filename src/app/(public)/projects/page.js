'use client';
// src/app/(public)/projects/page.js

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { useCollection } from '@/hooks/useFirestore';
import { CardSkeleton } from '@/components/ui/Loading';
import Card from '@/components/ui/Card';

export default function ProjectsPage() {
  const { data: projects, loading, error } = useCollection('projects');
  const [filter, setFilter] = useState('all');

  // Get unique categories
  const categories = ['all', ...new Set(projects.map((p) => p.category).filter(Boolean))];

  const filtered =
    filter === 'all' ? projects : projects.filter((p) => p.category === filter);

  return (
    <div className="container-custom py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">Төслүүд</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Сурч буй явцдаа хийсэн төслүүдийн жагсаалт. Хэрэглэгчдийн туршлагыг
          сайжруулах, орчин үеийн web технологиор бүтээгдсэн.
        </p>
        <div className="w-20 h-1 bg-gradient-to-r from-primary-400 to-accent-400 mx-auto rounded-full mt-6" />
      </motion.div>

      {/* Filter buttons */}
      {categories.length > 1 && (
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all
                ${
                  filter === cat
                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }
              `}
            >
              {cat === 'all' ? 'Бүгд' : cat}
            </button>
          ))}
        </div>
      )}

      {error && (
        <p className="text-center text-red-500 py-12">
          Алдаа гарлаа: {error}
        </p>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 dark:text-gray-400">Төсөл байхгүй байна</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
            >
              <Card className="h-full flex flex-col">
                {project.image && (
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {project.category && (
                      <span className="absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur text-primary-600 dark:text-primary-400 font-medium">
                        {project.category}
                      </span>
                    )}
                  </div>
                )}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-display text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1">
                    {project.description}
                  </p>

                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:gap-2 transition-all"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Live demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white ml-auto"
                      >
                        <Github className="w-4 h-4" />
                        Code
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
