export const DEFAULT_BLOG_IMAGE = 'https://via.placeholder.com/1200x600?text=No+Image';

const trimTrailingSlash = (value) => value.replace(/\/+$/, '');

const normalizeStorageBase = (baseUrl) => {
  const trimmed = trimTrailingSlash(String(baseUrl || '').trim());

  if (!trimmed) {
    return '';
  }

  return trimmed.replace(/\/storage\/app\/public$/i, '/storage');
};

const getStorageBaseUrl = () => {
  const configuredBase = normalizeStorageBase(import.meta.env.VITE_BLOG_IMAGE_URL);

  if (configuredBase) {
    return configuredBase;
  }

  const apiBase = trimTrailingSlash(import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api');
  return `${apiBase.replace(/\/api$/i, '')}/storage`;
};

export const getBlogImageUrl = (postOrImagePath, fallback = DEFAULT_BLOG_IMAGE) => {
  const imagePath = typeof postOrImagePath === 'string'
    ? postOrImagePath
    : postOrImagePath?.image || postOrImagePath?.featured_image || postOrImagePath?.image_url;

  if (!imagePath) {
    return fallback;
  }

  const value = String(imagePath).trim();

  if (!value) {
    return fallback;
  }

  if (/^(https?:)?\/\//i.test(value) || value.startsWith('data:') || value.startsWith('blob:')) {
    return value;
  }

  const normalizedPath = value
    .replace(/^\/+/, '')
    .replace(/^public\//i, '')
    .replace(/^storage\/app\/public\//i, '')
    .replace(/^app\/public\//i, '')
    .replace(/^storage\//i, '');

  return `${getStorageBaseUrl()}/${normalizedPath}`;
};
