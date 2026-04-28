'use client';
// src/app/admin/projects/page.js

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, ExternalLink, Github } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCollection } from '@/hooks/useFirestore';
import { addDocument, updateDocument, deleteDocument } from '@/lib/firestore';
import { validateProjectForm } from '@/lib/validation';
import Button from '@/components/ui/Button';
import Input, { Textarea } from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import ImageUpload from '@/components/ui/ImageUpload';
import { CardSkeleton } from '@/components/ui/Loading';

const emptyProject = {
  title: '',
  description: '',
  image: '',
  category: '',
  technologies: '',
  liveUrl: '',
  githubUrl: '',
};

export default function AdminProjectsPage() {
  const { data: projects, loading, refetch } = useCollection('projects');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyProject);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const openCreate = () => {
    setForm(emptyProject);
    setEditingId(null);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (project) => {
    setForm({
      title: project.title || '',
      description: project.description || '',
      image: project.image || '',
      category: project.category || '',
      technologies: (project.technologies || []).join(', '),
      liveUrl: project.liveUrl || '',
      githubUrl: project.githubUrl || '',
    });
    setEditingId(project.id);
    setErrors({});
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { isValid, errors: validationErrors } = validateProjectForm(form);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        technologies: form.technologies
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };

      if (editingId) {
        await updateDocument('projects', editingId, payload);
        toast.success('Төсөл амжилттай шинэчлэгдлээ');
      } else {
        await addDocument('projects', payload);
        toast.success('Төсөл амжилттай нэмэгдлээ');
      }

      setModalOpen(false);
      refetch();
    } catch (error) {
      toast.error('Алдаа гарлаа: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDocument('projects', id);
      toast.success('Төсөл устгагдлаа');
      refetch();
    } catch (error) {
      toast.error('Устгахад алдаа гарлаа');
    } finally {
      setDeleteConfirm(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold mb-2">Төслүүд</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Нийт {projects.length} төсөл
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4" />
          Шинэ төсөл
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
          <p className="text-gray-500 mb-4">Төсөл байхгүй байна</p>
          <Button onClick={openCreate}>
            <Plus className="w-4 h-4" />
            Эхний төсөл нэмэх
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
            >
              {project.image && (
                <div className="relative h-44">
                  <Image src={project.image} alt={project.title} fill className="object-cover" />
                </div>
              )}
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold mb-1">{project.title}</h3>
                {project.category && (
                  <p className="text-xs text-primary-600 dark:text-primary-400 mb-2">
                    {project.category}
                  </p>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                  {project.description}
                </p>
                {project.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => openEdit(project)}
                    className="flex-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Засах
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setDeleteConfirm(project)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Төсөл засах' : 'Шинэ төсөл нэмэх'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <ImageUpload
            label="Зураг *"
            value={form.image}
            onChange={(url) => setForm((prev) => ({ ...prev, image: url }))}
          />
          {errors.image && <p className="text-xs text-red-500">{errors.image}</p>}

          <Input
            label="Гарчиг *"
            name="title"
            value={form.title}
            onChange={handleChange}
            error={errors.title}
            placeholder="Жишээ: Portfolio Website"
          />

          <Textarea
            label="Тайлбар *"
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            error={errors.description}
            placeholder="Төслийн тухай товч тайлбар..."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Ангилал"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Web App"
            />
            <Input
              label="Технологи (таслалаар тусгаарла)"
              name="technologies"
              value={form.technologies}
              onChange={handleChange}
              placeholder="React, Next.js, Tailwind"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Live URL"
              name="liveUrl"
              value={form.liveUrl}
              onChange={handleChange}
              error={errors.liveUrl}
              placeholder="https://..."
            />
            <Input
              label="GitHub URL"
              name="githubUrl"
              value={form.githubUrl}
              onChange={handleChange}
              error={errors.githubUrl}
              placeholder="https://github.com/..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" loading={submitting} className="flex-1">
              {editingId ? 'Шинэчлэх' : 'Нэмэх'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setModalOpen(false)}
              disabled={submitting}
            >
              Болих
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirm */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Устгах уу?"
        maxWidth="max-w-md"
      >
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          <strong>{deleteConfirm?.title}</strong> төслийг устгах гэж байна. Энэ үйлдлийг
          буцаах боломжгүй.
        </p>
        <div className="flex gap-3">
          <Button
            variant="danger"
            onClick={() => handleDelete(deleteConfirm.id)}
            className="flex-1"
          >
            <Trash2 className="w-4 h-4" />
            Устгах
          </Button>
          <Button
            variant="secondary"
            onClick={() => setDeleteConfirm(null)}
            className="flex-1"
          >
            Болих
          </Button>
        </div>
      </Modal>
    </div>
  );
}
