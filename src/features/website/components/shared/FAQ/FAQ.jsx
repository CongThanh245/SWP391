import React, { useState } from 'react';
import styles from './FAQ.module.css';
import Button from '@components/common/Button/Button';

const FAQ = () => {
  const faqs = [
    {
      question: "FertiCare có những chức năng chính nào?",
      answer: "FertiCare cung cấp nhiều chức năng hỗ trợ điều trị hiếm muộn như: quản lý hồ sơ khám bệnh, xem và theo dõi đơn thuốc, đặt lịch hẹn thăm khám, theo dõi tiến trình điều trị, kết nối trực tiếp với bác sĩ chuyên khoa, và nhắc nhở lịch uống thuốc, tiêm thuốc cũng như các mốc quan trọng trong quá trình điều trị."
    },
    {
      question: "Làm thế nào để tạo tài khoản trên FertiCare?",
      answer: "Bạn có thể tạo tài khoản mới bằng cách tải ứng dụng FertiCare từ App Store hoặc Google Play, hoặc truy cập website của chúng tôi. Nhấn vào 'Đăng ký', điền thông tin cá nhân theo yêu cầu, xác nhận email và hoàn tất quá trình đăng ký. Sau đó, bạn có thể thiết lập hồ sơ y tế của mình."
    },
    {
      question: "Thông tin y tế của tôi có được bảo mật không?",
      answer: "Tuyệt đối. FertiCare cam kết bảo mật thông tin y tế của người dùng theo tiêu chuẩn cao nhất. Chúng tôi sử dụng công nghệ mã hóa end-to-end, tuân thủ các quy định về bảo vệ dữ liệu y tế, và không bao giờ chia sẻ thông tin của bạn với bên thứ ba mà không có sự đồng ý."
    },
    {
      question: "Tôi có thể đặt lịch hẹn với bác sĩ qua FertiCare không?",
      answer: "Có, FertiCare cho phép bạn đặt lịch hẹn trực tuyến với các bác sĩ chuyên khoa hiếm muộn hàng đầu. Bạn có thể chọn ngày giờ phù hợp, lựa chọn hình thức tư vấn trực tiếp hoặc trực tuyến, và nhận thông báo nhắc nhở trước thời gian hẹn."
    },
    {
      question: "Làm thế nào để xem đơn thuốc của tôi trên ứng dụng?",
      answer: "Sau khi đăng nhập vào tài khoản FertiCare, bạn có thể truy cập mục 'Đơn thuốc' để xem tất cả đơn thuốc hiện tại và quá khứ. Mỗi đơn thuốc sẽ hiển thị thông tin chi tiết về thuốc, liều lượng, hướng dẫn sử dụng và lưu ý từ bác sĩ."
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? -1 : index);
  };

  return (
    <section className={styles.faqSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <p className={styles.subtitle}>Câu hỏi thường gặp</p>
          <h2 className={styles.title}>Giải đáp thắc mắc của bạn</h2>
          <p className={styles.description}>
            Tìm hiểu thêm về FertiCare và cách chúng tôi có thể hỗ trợ bạn trong hành trình điều trị hiếm muộn.
          </p>
        </div>

        <div className={styles.faqList}>
          {faqs.map((faq, index) => (
            <div key={index} className={styles.faqItem}>
              <div 
                className={styles.faqQuestion} 
                onClick={() => toggleFaq(index)}
              >
                {faq.question}
                <span className={styles.toggleIcon}>
                  {activeIndex === index ? '-' : '+'}
                </span>
              </div>
              {activeIndex === index && (
                <div className={styles.faqAnswer}>
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={styles.moreQuestionsWrapper}>
          <p className={styles.moreQuestions}>Bạn vẫn còn thắc mắc khác?</p>
          <Button variant="primary">Liên hệ tư vấn</Button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;