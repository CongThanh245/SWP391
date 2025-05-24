import React from "react";
import styles from "./BlogSection.module.css";
import { Link } from "react-router-dom";

const BlogSection = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Chăm sóc sức khỏe tại nhà: Những điều cần biết",
      excerpt: "Tìm hiểu các phương pháp hiệu quả để chăm sóc sức khỏe tại nhà và khi nào cần đến gặp bác sĩ...",
      image: "/images/blog/home-healthcare.jpg",
      date: "15/05/2025",
      author: "Bs. Nguyễn Văn A"
    },
    {
      id: 2,
      title: "Dinh dưỡng hợp lý cho người cao tuổi",
      excerpt: "Chế độ ăn uống đóng vai trò quan trọng đối với sức khỏe người cao tuổi. Bài viết này sẽ giới thiệu...",
      image: "/images/blog/elderly-nutrition.jpg",
      date: "10/05/2025",
      author: "Bs. Trần Thị B"
    },
    {
      id: 3,
      title: "Phòng ngừa các bệnh mùa hè phổ biến",
      excerpt: "Mùa hè đến cùng với nhiều bệnh lý phổ biến. Hãy tìm hiểu các biện pháp phòng ngừa hiệu quả...",
      image: "/images/blog/summer-prevention.jpg",
      date: "01/05/2025",
      author: "Bs. Phạm Văn C"
    }
  ];

  return (
    <section className={styles.blogSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Kiến Thức Y Khoa</h2>
          <p className={styles.sectionSubtitle}>
            Cập nhật những thông tin sức khỏe và y tế mới nhất từ đội ngũ chuyên gia
          </p>
        </div>

        <div className={styles.blogGrid}>
          {blogPosts.map((post) => (
            <div key={post.id} className={styles.blogCard}>
              <div className={styles.blogImageContainer}>
                <div className={styles.blogImage} style={{ backgroundImage: `url(${post.image})` }} />
              </div>
              <div className={styles.blogContent}>
                <div className={styles.blogMeta}>
                  <span className={styles.blogDate}>{post.date}</span>
                  <span className={styles.blogAuthor}>{post.author}</span>
                </div>
                <h3 className={styles.blogTitle}>{post.title}</h3>
                <p className={styles.blogExcerpt}>{post.excerpt}</p>
                <Link to={`/blog/${post.id}`} className={styles.readMore}>
                  Đọc tiếp <span className={styles.arrow}>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.viewAllContainer}>
          <Link to="/blog" className={styles.viewAllButton}>
            Xem tất cả bài viết
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;