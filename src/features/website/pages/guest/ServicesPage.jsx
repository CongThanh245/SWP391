import React, { useState } from 'react';
import styles from './ServicesPage.module.css';

// Service Information Component
const ServiceInfo = ({ service }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Tổng quan' },
    { id: 'process', label: 'Quy trình'},
    { id: 'preparation', label: 'Chuẩn bị'},
    { id: 'notes', label: 'Lưu ý' }
  ];

  return (
    <div className={styles.serviceSection}>
      <div className={styles.serviceHeader}>
        <div className={styles.serviceIcon}>
          {service.icon}
        </div>
        <div className={styles.serviceTitleGroup}>
          <h2 className={styles.serviceTitle}>{service.title}</h2>
          <p className={styles.serviceShortDesc}>{service.shortDescription}</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabsNav}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`${styles.tabButton} ${activeTab === tab.id ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className={styles.tabContent}>
          {activeTab === 'overview' && (
            <div className={styles.tabPanel}>
              <h3 className={styles.contentTitle}>Định nghĩa và ứng dụng</h3>
              <p className={styles.contentText}>{service.definition}</p>
              
              <h4 className={styles.contentSubtitle}>Chỉ định điều trị:</h4>
              <ul className={styles.contentList}>
                {service.indications.map((indication, index) => (
                  <li key={index} className={styles.listItem}>
                    {indication}
                  </li>
                ))}
              </ul>

              <h4 className={styles.contentSubtitle}>Ưu điểm:</h4>
              <ul className={styles.contentList}>
                {service.advantages.map((advantage, index) => (
                  <li key={index} className={styles.listItem}>
                    <span className={styles.listIcon}>⭐</span>
                    {advantage}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'process' && (
            <div className={styles.tabPanel}>
              <h3 className={styles.contentTitle}>Quy trình thực hiện</h3>
              <div className={styles.processSteps}>
                {service.process.map((step, index) => (
                  <div key={index} className={styles.processStep}>
                    <div className={styles.stepNumber}>{index + 1}</div>
                    <div className={styles.stepContent}>
                      <h4 className={styles.stepTitle}>{step.title}</h4>
                      <p className={styles.stepDescription}>{step.description}</p>
                      {step.duration && (
                        <span className={styles.stepDuration}>⏱️ {step.duration}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'preparation' && (
            <div className={styles.tabPanel}>
              <h3 className={styles.contentTitle}>Chuẩn bị trước điều trị</h3>
              
              <div className={styles.preparationGrid}>
                <div className={styles.preparationCard}>
                  <h4 className={styles.preparationTitle}>👩‍⚕️ Cho nữ giới</h4>
                  <ul className={styles.preparationList}>
                    {service.preparation.female.map((item, index) => (
                      <li key={index} className={styles.preparationItem}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className={styles.preparationCard}>
                  <h4 className={styles.preparationTitle}>👨‍⚕️ Cho nam giới</h4>
                  <ul className={styles.preparationList}>
                    {service.preparation.male.map((item, index) => (
                      <li key={index} className={styles.preparationItem}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className={styles.preparationCard}>
                <h4 className={styles.preparationTitle}>📄 Giấy tờ cần thiết</h4>
                <ul className={styles.preparationList}>
                  {service.preparation.documents.map((doc, index) => (
                    <li key={index} className={styles.preparationItem}>{doc}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className={styles.tabPanel}>
              <h3 className={styles.contentTitle}>Lưu ý quan trọng</h3>
              
              <div className={styles.notesGrid}>
                <div className={styles.noteCard}>
                  <h4 className={styles.noteTitle}>*Trước điều trị</h4>
                  <ul className={styles.notesList}>
                    {service.notes.before.map((note, index) => (
                      <li key={index} className={styles.noteItem}>{note}</li>
                    ))}
                  </ul>
                </div>

                <div className={styles.noteCard}>
                  <h4 className={styles.noteTitle}>Trong quá trình</h4>
                  <ul className={styles.notesList}>
                    {service.notes.during.map((note, index) => (
                      <li key={index} className={styles.noteItem}>{note}</li>
                    ))}
                  </ul>
                </div>

                <div className={styles.noteCard}>
                  <h4 className={styles.noteTitle}>Sau điều trị</h4>
                  <ul className={styles.notesList}>
                    {service.notes.after.map((note, index) => (
                      <li key={index} className={styles.noteItem}>{note}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Services Page Component
const ServicesPage = () => {
  const services = [
    {
      id: 'iui',
      title: 'IUI - Thụ tinh nhân tạo trong tử cung',
      shortDescription: 'Phương pháp hỗ trợ sinh sản ít xâm lấn, phù hợp cho nhiều trường hợp hiếm muộn',
      icon: '🧬',
      definition: 'IUI (Intrauterine Insemination) là kỹ thuật đưa tinh trùng đã được xử lý vào buồng tử cung thông qua ống thông mềm vào thời điểm phóng noãn. Đây là phương pháp hỗ trợ sinh sản đơn giản, ít xâm lấn và có chi phí hợp lý.',
      indications: [
        'Rối loạn phóng noãn, chu kỳ kinh không đều',
        'Tắc nghẽn cổ tử cung, dày nhầy cổ tử cung',
        'Tinh trùng yếu, ít, dị dạng nhẹ',
        'Vô sinh không rõ nguyên nhân',
        'Nội mạc tử cung mỏng',
        'Sử dụng tinh trùng của người hiến tặng'
      ],
      advantages: [
        'Quy trình đơn giản, thời gian ngắn',
        'Chi phí thấp hơn so với IVF',
        'Ít tác dụng phụ',
        'Không cần phẫu thuật',
        'Có thể thực hiện nhiều chu kỳ'
      ],
      process: [
        {
          title: 'Khám và tư vấn ban đầu',
          description: 'Bác sĩ thăm khám, đánh giá tình trạng sức khỏe và chỉ định các xét nghiệm cần thiết',
          duration: '1-2 tuần'
        },
        {
          title: 'Kích thích rung trứng',
          description: 'Sử dụng thuốc kích thích để tăng số lượng noãn trưởng thành',
          duration: '10-14 ngày'
        },
        {
          title: 'Theo dõi phát triển noãn',
          description: 'Siêu âm và xét nghiệm hormone để theo dõi sự phát triển của noãn',
          duration: '3-4 lần khám'
        },
        {
          title: 'Gây phóng noãn',
          description: 'Tiêm thuốc HCG để kích thích phóng noãn vào thời điểm thích hợp',
          duration: '1 ngày'
        },
        {
          title: 'Xử lý tinh trùng',
          description: 'Thu thập và xử lý tinh trùng để chọn lọc những tinh trùng tốt nhất',
          duration: '2-3 giờ'
        },
        {
          title: 'Thực hiện IUI',
          description: 'Đưa tinh trùng vào buồng tử cung thông qua ống thông mềm',
          duration: '15-20 phút'
        },
        {
          title: 'Kiểm tra kết quả',
          description: 'Xét nghiệm beta-HCG sau 14 ngày để xác định có thai hay không',
          duration: '2 tuần sau'
        }
      ],
      preparation: {
        female: [
          'Bổ sung acid folic ít nhất 1 tháng trước',
          'Duy trì chế độ ăn uống lành mạnh, tập thể dục nhẹ',
          'Tránh thuốc lá, rượu bia và chất kích thích',
          'Theo dõi chu kỳ kinh nguyệt trong 3 tháng',
          'Thực hiện đầy đủ các xét nghiệm được chỉ định',
          'Giữ tinh thần thoải mái, tránh stress'
        ],
        male: [
          'Kiêng quan hệ tình dục 2-5 ngày trước ngày thực hiện',
          'Tránh thuốc lá, rượu bia ít nhất 3 tháng',
          'Tránh tiếp xúc với môi trường nóng (sauna, bồn tắm nóng)',
          'Bổ sung vitamin E, C và kẽm',
          'Tập thể dục đều đặn, ngủ đủ giấc',
          'Hạn chế stress và làm việc quá sức'
        ],
        documents: [
          'Giấy chứng minh nhân dân/CCCD (bản gốc)',
          'Giấy đăng ký kết hôn (bản gốc)',
          'Các kết quả xét nghiệm trong vòng 6 tháng',
          'Hồ sơ bệnh án (nếu có)',
          'Bảo hiểm y tế (nếu có)'
        ]
      },
      notes: {
        before: [
          'Thông báo cho bác sĩ về tất cả thuốc đang sử dụng',
          'Không tự ý ngừng thuốc mà không có chỉ định của bác sĩ',
          'Báo cáo ngay nếu có triệu chứng bất thường',
          'Đến đúng lịch hẹn để theo dõi'
        ],
        during: [
          'Thực hiện đúng chỉ định của bác sĩ về thuốc và lịch khám',
          'Không quan hệ tình dục từ ngày gây phóng noãn đến ngày xét nghiệm',
          'Tránh hoạt động thể lực nặng',
          'Nghỉ ngơi 30 phút sau khi thực hiện IUI'
        ],
        after: [
          'Không tắm bồn trong 48 giờ đầu',
          'Tránh mang vác nặng và vận động mạnh',
          'Theo dõi triệu chứng và báo cáo bất thường',
          'Xét nghiệm đúng lịch hẹn để xác định kết quả'
        ]
      }
    },
    {
      id: 'ivf',
      title: 'IVF - Thụ tinh ống nghiệm',
      shortDescription: 'Công nghệ hỗ trợ sinh sản tiên tiến nhất, mang lại hy vọng cao cho các cặp vợ chồng hiếm muộn',
      icon: '🔬',
      definition: 'IVF (In Vitro Fertilization) là kỹ thuật thụ tinh ngoài cơ thể, trong đó trứng được lấy ra từ buồng trứng, thụ tinh với tinh trùng trong phòng thí nghiệm, sau đó phôi được chuyển vào tử cung. Đây là phương pháp có tỷ lệ thành công cao nhất trong các kỹ thuật hỗ trợ sinh sản.',
      indications: [
        'Tắc vòi trứng hai bên hoặc cắt bỏ vòi trứng',
        'Nội mạc tử cung lạc chỗ nặng',
        'Tinh trùng yếu, ít, dị dạng nặng',
        'Vô sinh không rõ nguyên nhân kéo dài',
        'Thất bại IUI nhiều lần',
        'Tuổi cao (trên 35 tuổi)',
        'Rối loạn phóng noãn không đáp ứng điều trị',
        'Cần chẩn đoán di truyền tiền làm tổ (PGT)'
      ],
      advantages: [
        'Tỷ lệ thành công cao nhất trong các phương pháp hỗ trợ sinh sản',
        'Có thể chọn lọc phôi khỏe mạnh nhất',
        'Phù hợp với nhiều nguyên nhân vô sinh',
        'Có thể bảo quản phôi dư cho lần sau',
        'Kiểm soát được số lượng phôi chuyển'
      ],
      process: [
        {
          title: 'Khám và tư vấn chi tiết',
          description: 'Đánh giá toàn diện tình trạng sức khỏe, lập kế hoạch điều trị cá nhân hóa',
          duration: '2-3 tuần'
        },
        {
          title: 'Chuẩn bị và tiền điều trị',
          description: 'Điều chỉnh chu kỳ, chuẩn bị nội mạc tử cung và kích thích buồng trứng',
          duration: '2-4 tuần'
        },
        {
          title: 'Kích thích buồng trứng',
          description: 'Sử dụng hormone để kích thích nhiều noãn phát triển cùng lúc',
          duration: '8-14 ngày'
        },
        {
          title: 'Theo dõi phát triển noãn',
          description: 'Siêu âm và xét nghiệm hormone thường xuyên để theo dõi đáp ứng',
          duration: '4-6 lần khám'
        },
        {
          title: 'Gây phóng noãn',
          description: 'Tiêm thuốc kích thích phóng noãn khi noãn đã chín',
          duration: '1 ngày'
        },
        {
          title: 'Lấy trứng',
          description: 'Thủ thuật lấy trứng qua đường âm đạo dưới hướng dẫn siêu âm',
          duration: '20-30 phút'
        },
        {
          title: 'Thụ tinh và nuôi cấy phôi',
          description: 'Thụ tinh trứng với tinh trùng và nuôi cấy phôi trong phòng thí nghiệm',
          duration: '3-6 ngày'
        },
        {
          title: 'Chuyển phôi',
          description: 'Chuyển phôi tốt nhất vào buồng tử cung',
          duration: '15-20 phút'
        },
        {
          title: 'Hỗ trợ pha hoàng thể',
          description: 'Sử dụng progesterone để hỗ trợ làm tổ của phôi',
          duration: '2 tuần'
        },
        {
          title: 'Kiểm tra kết quả',
          description: 'Xét nghiệm beta-HCG và siêu âm để xác nhận thai',
          duration: '2-4 tuần sau'
        }
      ],
      preparation: {
        female: [
          'Bổ sung acid folic và vitamin tổng hợp 3 tháng trước',
          'Duy trì cân nặng lý tưởng (BMI 18.5-24.9)',
          'Tập thể dục nhẹ nhàng đều đặn',
          'Tránh hoàn toàn thuốc lá, rượu bia và ma túy',
          'Hạn chế caffeine (<200mg/ngày)',
          'Giữ tinh thần thoải mái, quản lý stress tốt',
          'Thực hiện đầy đủ các xét nghiệm và tiêm phòng cần thiết'
        ],
        male: [
          'Cải thiện chất lượng tinh trùng 3 tháng trước',
          'Kiêng quan hệ 2-5 ngày trước ngày lấy trứng',
          'Tránh thuốc lá, rượu bia và chất kích thích',
          'Tránh môi trường nóng và bức xạ',
          'Bổ sung antioxidant (vitamin C, E, coenzyme Q10)',
          'Duy trì chế độ ăn giàu protein và omega-3',
          'Tập thể dục vừa phải, tránh căng thẳng'
        ],
        documents: [
          'Giấy chứng minh nhân dân/CCCD của cả hai vợ chồng',
          'Giấy đăng ký kết hôn (bản gốc và bản sao)',
          'Tất cả kết quả xét nghiệm và hình ảnh học',
          'Hồ sơ bệnh án và điều trị trước đó',
          'Giấy chứng nhận sức khỏe tiền hôn nhân',
          'Bảo hiểm y tế và thẻ BHXH (nếu có)'
        ]
      },
      notes: {
        before: [
          'Tuân thủ nghiêm ngặt phác đồ điều trị của bác sĩ',
          'Báo cáo ngay mọi tác dụng phụ hoặc triệu chứng bất thường',
          'Không tự ý thay đổi liều lượng hoặc thời gian dùng thuốc',
          'Đến khám đúng lịch hẹn để theo dõi đáp ứng điều trị'
        ],
        during: [
          'Nghỉ ngơi tuyệt đối sau thủ thuật lấy trứng',
          'Tránh quan hệ tình dục từ ngày lấy trứng đến khi có kết quả',
          'Uống nhiều nước và ăn protein cao sau lấy trứng',
          'Theo dõi triệu chứng OHSS và báo cáo ngay nếu có',
          'Dùng thuốc hỗ trợ đúng chỉ định'
        ],
        after: [
          'Hạn chế hoạt động mạnh trong 2 tuần đầu',
          'Không tắm bồn, không bơi lội trong thời gian chờ kết quả',
          'Theo dõi dấu hiệu mang thai và biến chứng',
          'Tiếp tục bổ sung acid folic và vitamin',
          'Khám thai định kỳ nếu có thai'
        ]
      }
    }
  ];

  return (
    <div className={styles.servicesPage}>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Dịch Vụ Hỗ Trợ Sinh Sản</h1>
          <p className={styles.pageSubtitle}>
            Thông tin chi tiết về các phương pháp hỗ trợ sinh sản hiện đại, 
            giúp bạn hiểu rõ quy trình và chuẩn bị tốt nhất cho hành trình điều trị
          </p>
        </div>

        {services.map(service => (
          <ServiceInfo key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;