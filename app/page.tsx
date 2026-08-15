import Image from "next/image";
import NearbyMap from "../components/nearby-map";
import RoomTypes from "../components/room-types";
import { getPublicRooms } from "../lib/rooms";

export default async function Home() {
  const rooms = await getPublicRooms();
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

      <RoomTypes rooms={rooms} />

      <NearbyMap />

      <section id="vi-tri" className="location-section" aria-labelledby="location-title">
        <div className="container location-grid">
          <div className="location-copy">
            <h2 id="location-title">Liên hệ và vị trí</h2>
            <p className="address">75/19E, Phường Phước Hậu, Tỉnh Vĩnh Long</p>
            <p>Gọi trực tiếp để hỏi thông tin và thống nhất thời gian đến xem phòng.</p>
            <div className="contact-actions">
              <a className="primary-button" href="tel:0767245949">Gọi 0767 245 949</a>
            </div>
          </div>
          <div className="map-wrap">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3926.3928982489756!2d105.9626565!3d10.229861699999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310a83004c01a997%3A0x5270a76fd135cf1a!2zQ29mZmVlIE5ow6AgR-G7lw!5e0!3m2!1svi!2s!4v1786720977491!5m2!1svi!2s" title="Bản đồ vị trí Nhà trọ Hồng Khang" loading="lazy" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
          </div>
        </div>
      </section>

      <aside className="floating-contact" aria-label="Liên hệ nhanh">
        <a href="https://www.facebook.com/people/Coffee-Nh%C3%A0-G%E1%BB%97/61576986390039/" target="_blank" rel="noreferrer" aria-label="Xem Facebook Coffee Nhà Gỗ, mở trong tab mới">
          <Image className="floating-contact-icon contact-icon" src="/icons/facebook.svg" alt="" aria-hidden="true" width={26} height={26} />
        </a>
        <a href="https://zalo.me/0707352905" target="_blank" rel="noreferrer" aria-label="Nhắn Zalo cho Nhà trọ Hồng Khang, mở trong tab mới">
          <Image className="floating-contact-icon contact-icon" src="/icons/zalo.svg" alt="" aria-hidden="true" width={28} height={28} />
        </a>
        <a className="floating-call" href="tel:0767245949" aria-label="Gọi Nhà trọ Hồng Khang theo số 0767 245 949">
          <Image className="floating-contact-icon" src="/icons/phone.svg" alt="" aria-hidden="true" width={24} height={24} />
        </a>
      </aside>

      <footer className="site-footer">
        <div className="container footer-inner">
          <a className="brand footer-brand" href="#top"><Image className="brand-logo" src="/images/logo-hong-khang.png" alt="" width={64} height={64} /><span>Nhà trọ <strong>Hồng Khang</strong></span></a>
          <p>75/19E, Phường Phước Hậu, Tỉnh Vĩnh Long<br /><a href="/dang-nhap">Đăng nhập</a></p>
        </div>
      </footer>
    </main>
  );
}
