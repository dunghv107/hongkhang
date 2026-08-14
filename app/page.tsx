import Image from "next/image";

const rooms = [
  { title: "Không gian phòng ngủ", description: "Ảnh chụp thực tế bên trong phòng tại Nhà trọ Hồng Khang.", image: "/images/phong-ngu-hong-khang.jpg", position: "center" },
  { title: "Lối đi giữa các phòng", description: "Không gian di chuyển chung được chụp trực tiếp tại khu trọ.", image: "/images/loi-di-hong-khang.jpg", position: "30% center" },
  { title: "Phòng tắm", description: "Hình ảnh thực tế để bạn xem trước khi đến xem phòng.", image: "/images/phong-tam-hong-khang.jpg", position: "72% center" },
];

export default function Home() {
  return (
    <main className="site-shell">
      <a className="skip-link" href="#noi-dung">Đi đến nội dung chính</a>
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="#top" aria-label="Nhà trọ Hồng Khang, trang chủ">
            <Image className="brand-logo" src="/images/logo-hong-khang.png" alt="" width={64} height={64} priority />
            <span>Nhà trọ<br /><strong>Hồng Khang</strong></span>
          </a>
          <nav aria-label="Điều hướng chính">
            <a href="#khong-gian">Không gian</a>
            <a href="#vi-tri">Vị trí</a>
            <a className="auth-link" href="/dang-nhap">Đăng nhập</a>
            <a className="header-call" href="tel:0767245949">Gọi ngay</a>
          </nav>
        </div>
      </header>

      <section id="top" className="hero" aria-labelledby="hero-title">
        <Image className="hero-image" src="/images/san-chung-hong-khang.jpg" alt="Sân chung nhiều cây xanh tại Nhà trọ Hồng Khang" fill priority sizes="100vw" />
        <div className="hero-overlay" />
        <div className="container hero-content" id="noi-dung">
          <h1 id="hero-title">Nhà trọ Hồng Khang<br />tại Phước Hậu</h1>
          <p>Xem ảnh không gian thực tế và liên hệ trực tiếp để hẹn lịch xem phòng.</p>
          <a className="primary-button" href="#khong-gian">Xem hình ảnh phòng</a>
        </div>
      </section>

      <section className="quick-contact" aria-label="Thông tin liên hệ nhanh">
        <div className="container quick-contact-grid">
          <div><span>Địa chỉ</span><strong>75/19E, Phường Phước Hậu, Tỉnh Vĩnh Long</strong></div>
          <div>
            <span>Điện thoại</span>
            <div className="phone-list"><a href="tel:0767245949">0767 245 949</a><a href="tel:0764494933">0764 494 933</a></div>
          </div>
        </div>
      </section>

      <section id="khong-gian" className="rooms-section" aria-labelledby="rooms-title">
        <div className="container">
          <div className="section-intro"><h2 id="rooms-title">Hình ảnh thực tế</h2><p>Xem trước phòng và khu vực chung trước khi liên hệ hẹn lịch.</p></div>
          <div className="room-grid">
            {rooms.map((room) => (
              <article className="room-card" key={room.title}>
                <div className="room-photo">
                  <Image src={room.image} alt={room.title} fill sizes="(max-width: 720px) 100vw, (max-width: 1024px) 50vw, 33vw" style={{ objectPosition: room.position }} />
                </div>
                <div className="room-copy"><h3>{room.title}</h3><p>{room.description}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="vi-tri" className="location-section" aria-labelledby="location-title">
        <div className="container location-grid">
          <div className="location-copy">
            <h2 id="location-title">Liên hệ và vị trí</h2>
            <p className="address">75/19E, Phường Phước Hậu, Tỉnh Vĩnh Long</p>
            <p>Gọi trực tiếp để hỏi thông tin và thống nhất thời gian đến xem phòng.</p>
            <div className="contact-actions">
              <a className="primary-button" href="tel:0767245949">Gọi 0767 245 949</a>
              <a className="secondary-button" href="tel:0764494933">Gọi 0764 494 933</a>
            </div>
          </div>
          <div className="map-wrap">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3926.3928982489756!2d105.9626565!3d10.229861699999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310a83004c01a997%3A0x5270a76fd135cf1a!2zQ29mZmVlIE5ow6AgR-G7lw!5e0!3m2!1svi!2s!4v1786720977491!5m2!1svi!2s" title="Bản đồ vị trí Nhà trọ Hồng Khang" loading="lazy" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-inner">
          <a className="brand footer-brand" href="#top"><Image className="brand-logo" src="/images/logo-hong-khang.png" alt="" width={64} height={64} /><span>Nhà trọ <strong>Hồng Khang</strong></span></a>
          <p>75/19E, Phường Phước Hậu, Tỉnh Vĩnh Long<br /><a href="/dang-nhap">Đăng nhập</a></p>
        </div>
      </footer>
    </main>
  );
}
