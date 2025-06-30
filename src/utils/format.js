export const formatValue = (value, defaultText = "Chưa cập nhật") =>
  value || defaultText;

// export const formatDate = (dateStr) => {
//   if (!dateStr) return "Chưa cập nhật";
//   const date = new Date(dateStr);
//   return date.toLocaleDateString("vi-VN"); // VD: 31/05/2025
// };
export const formatDate = (dateString) => {
  if (!dateString) return "Chưa cập nhật";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Chưa cập nhật";
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

export const parseDateForInput = (formattedDate) => {
  if (!formattedDate || formattedDate === "Chưa cập nhật") return "";
  const [month, day, year] = formattedDate.split("/");
  if (!month || !day || !year) return "";
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

export const formatDateForAPI = (inputDate) => {
  if (!inputDate) return null;
  const date = new Date(inputDate);
  if (isNaN(date.getTime())) return null;
  return date.toISOString().split("T")[0]; // Returns "YYYY-MM-DD"
};
