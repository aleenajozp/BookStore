export const API_BASE = import.meta.env.VITE_API_URL || "";

export const getImageUrl = (url) => {
  if (!url) return "https://via.placeholder.com/150x200?text=No+Image";
  if (url.startsWith("http://localhost:3000")) {
    return url.replace("http://localhost:3000", "");
  }
  return url;
};
