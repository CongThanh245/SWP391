export const translateError = (code, message) => {
  const errorMap = {
    400: {
      "Appointments must be booked at least 24 hours in advance.":
        "Lịch hẹn phải được đặt trước ít nhất 24 giờ.",
    },
    100: {
      "You already have 3 appointments on this date. Please delete unnecessary appointments.":
        "Bạn đã có 3 lịch hẹn vào ngày này. Vui lòng hủy các lịch hẹn không cần thiết.",
      "You already have another appointment at this time.":
        "Bạn đã có lịch hẹn khác vào thời điểm này.",
      default: "Đã xảy ra lỗi không xác định. Vui lòng thử lại.",
    },
  };

  if (errorMap[code] && errorMap[code][message]) {
    return errorMap[code][message];
  }
  return errorMap[code]?.default || "Đã xảy ra lỗi. Vui lòng thử lại.";
};