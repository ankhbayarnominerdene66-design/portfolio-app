'use client';
// src/app/(public)/skills/page.js

import { motion } from 'framer-motion';
import { useCollection } from '@/hooks/useFirestore';
import { PageLoader } from '@/components/ui/Loading';

export default function SkillsPage() {
  const { data: skills, loading, error } = useCollection('skills');

  if (loading) return <PageLoader />;

  // Group by category
  const grouped = skills.reduce((acc, skill) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <div className="container-custom py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
          Чадварууд
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Програм хангамжийн хөгжүүлэлтийн чиглэлээр эзэмшсэн технологи, чадварууд
        </p>
        <div className="w-20 h-1 bg-gradient-to-r from-primary-400 to-accent-400 mx-auto rounded-full mt-6" />
      </motion.div>

      {error && <p className="text-center text-red-500">{error}</p>}

      {skills.length === 0 ? (
        <p className="text-center text-gray-500 py-12">Чадвар байхгүй байна</p>
      ) : (
        <div className="space-y-12 max-w-4xl mx-auto">
          {Object.entries(grouped).map(([category, categorySkills], catIdx) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: catIdx * 0.1 }}
            >
              <h2 className="font-display text-2xl font-semibold mb-6 flex items-center gap-3">
                <span className="w-8 h-1 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full" />
                {category}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categorySkills.map((skill, idx) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-800 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {skill.icon && (
                          <div className="text-2xl">{skill.icon}</div>
                        )}
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {skill.name}
                        </h3>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        {skill.level}%
                      </span>
                    </div>

                    <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 + idx * 0.05, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-primary-400 to-accent-400 rounded-full"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
