'use client';
// src/app/admin/skills/page.js

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCollection } from '@/hooks/useFirestore';
import { addDocument, updateDocument, deleteDocument } from '@/lib/firestore';
import { validateSkillForm } from '@/lib/validation';
import Button from '@/components/ui/Button';
import Input, { Select } from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { PageLoader } from '@/components/ui/Loading';

const emptySkill = { name: '', category: 'Frontend', level: 70, icon: '' };

const categoryOptions = [
  { value: 'Frontend', label: 'Frontend' },
  { value: 'Backend', label: 'Backend' },
  { value: 'Database', label: 'Database' },
  { value: 'Tools', label: 'Tools' },
  { value: 'Design', label: 'Design' },
  { value: 'Other', label: 'Other' },
];

export default function AdminSkillsPage() {
  const { data: skills, loading, refetch } = useCollection('skills');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptySkill);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const openCreate = () => {
    setForm(emptySkill);
    setEditingId(null);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (skill) => {
    setForm({
      name: skill.name || '',
      category: skill.category || 'Frontend',
      level: skill.level || 50,
      icon: skill.icon || '',
    });
    setEditingId(skill.id);
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
    const { isValid, errors: validationErrors } = validateSkillForm(form);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      const payload = { ...form, level: Number(form.level) };

      if (editingId) {
        await updateDocument('skills', editingId, payload);
        toast.success('Чадвар амжилттай шинэчлэгдлээ');
      } else {
        await addDocument('skills', payload);
        toast.success('Чадвар амжилттай нэмэгдлээ');
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
      await deleteDocument('skills', id);
      toast.success('Чадвар устгагдлаа');
      refetch();
    } catch (error) {
      toast.error('Устгахад алдаа гарлаа');
    } finally {
      setDeleteConfirm(null);
    }
  };

  if (loading) return <PageLoader />;

  // Group by category
  const grouped = skills.reduce((acc, skill) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold mb-2">Чадварууд</h1>
          <p className="text-gray-600 dark:text-gray-400">Нийт {skills.length} чадвар</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4" />
          Шинэ чадвар
        </Button>
      </div>

      {skills.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
          <p className="text-gray-500 mb-4">Чадвар байхгүй байна</p>
          <Button onClick={openCreate}>
            <Plus className="w-4 h-4" />
            Эхний чадвар нэмэх
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([category, categorySkills]) => (
            <div key={category}>
              <h2 className="font-display text-lg font-semibold mb-4">{category}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categorySkills.map((skill) => (
                  <motion.div
                    key={skill.id}
                    layout
                    className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {skill.icon && <span className="text-xl">{skill.icon}</span>}
                        <h3 className="font-medium">{skill.name}</h3>
                      </div>
                      <span className="text-sm text-gray-500">{skill.level}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-3">
                      <div
                        className="h-full bg-gradient-to-r from-primary-400 to-accent-400"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => openEdit(skill)}
                        className="flex-1"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Засах
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => setDeleteConfirm(skill)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Чадвар засах' : 'Шинэ чадвар нэмэх'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Чадварын нэр *"
            name="name"
            value={form.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="React"
          />

          <Select
            label="Ангилал *"
            name="category"
            value={form.category}
            onChange={handleChange}
            error={errors.category}
            options={categoryOptions}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Түвшин: {form.level}%
            </label>
            <input
              type="range"
              name="level"
              min="0"
              max="100"
              step="5"
              value={form.level}
              onChange={handleChange}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
            {errors.level && <p className="mt-1 text-xs text-red-500">{errors.level}</p>}
          </div>

          <Input
            label="Эмодзи / Icon (заавал биш)"
            name="icon"
            value={form.icon}
            onChange={handleChange}
            placeholder="⚛️"
          />

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
          <strong>{deleteConfirm?.name}</strong> чадварыг устгах гэж байна.
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
