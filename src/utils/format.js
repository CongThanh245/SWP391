export const formatValue = (value, defaultText = 'Chưa cập nhật') => value || defaultText;

export const formatDate = (dateStr) => {
    if (!dateStr) return "Chưa cập nhật";
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN'); // VD: 31/05/2025
  };