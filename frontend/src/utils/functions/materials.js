export const detectType = (url) => {
  if (!url) return "link";
  const u = url.toLowerCase();
  if (u.includes("youtube.com") || u.includes("youtu.be")) return "youtube";
  if (u.endsWith(".pdf") || u.includes("/pdf")) return "pdf";
  return "link";
};

export const getYoutubeThumbnail = (url) => {
  try {
    const match =
      url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/) ||
      url.match(/youtube\.com\/embed\/([^?/]+)/);
    if (match) return `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`;
  } catch {}
  return null;
};

export const getDomain = (url) => {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
};

export const timeAgo = (dateStr) => {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 60000);
  if (diff < 1) return "just now";
  if (diff < 60) return `${diff}m ago`;
  const h = Math.floor(diff / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};
