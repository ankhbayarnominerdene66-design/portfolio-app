// src/lib/validation.js

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validateRequired = (value) => {
  if (typeof value === 'string') return value.trim().length > 0;
  return value !== null && value !== undefined;
};

export const validateUrl = (url) => {
  if (!url) return true; // optional
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateContactForm = (data) => {
  const errors = {};
  if (!validateRequired(data.name)) errors.name = 'Нэр оруулна уу';
  if (!validateRequired(data.email)) errors.email = 'И-мэйл оруулна уу';
  else if (!validateEmail(data.email)) errors.email = 'И-мэйл буруу байна';
  if (!validateRequired(data.message)) errors.message = 'Зурвас оруулна уу';
  else if (data.message.trim().length < 10)
    errors.message = 'Зурвас хамгийн багадаа 10 тэмдэгт байх ёстой';
  return { isValid: Object.keys(errors).length === 0, errors };
};

export const validateProjectForm = (data) => {
  const errors = {};
  if (!validateRequired(data.title)) errors.title = 'Гарчиг оруулна уу';
  if (!validateRequired(data.description)) errors.description = 'Тайлбар оруулна уу';
  if (!validateRequired(data.image)) errors.image = 'Зураг upload хийнэ үү';
  if (data.liveUrl && !validateUrl(data.liveUrl)) errors.liveUrl = 'URL буруу байна';
  if (data.githubUrl && !validateUrl(data.githubUrl)) errors.githubUrl = 'URL буруу байна';
  return { isValid: Object.keys(errors).length === 0, errors };
};

export const validateSkillForm = (data) => {
  const errors = {};
  if (!validateRequired(data.name)) errors.name = 'Чадварын нэр оруулна уу';
  if (!validateRequired(data.category)) errors.category = 'Ангилал сонгоно уу';
  const level = Number(data.level);
  if (isNaN(level) || level < 0 || level > 100)
    errors.level = 'Түвшин 0-100 хооронд байх ёстой';
  return { isValid: Object.keys(errors).length === 0, errors };
};
