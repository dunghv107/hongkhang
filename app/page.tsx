import Image from "next/image";
import NearbyMap from "../components/nearby-map";
import RecommendedItems from "../components/recommended-items";
import RoomTypes from "../components/room-types";
import { getPublicRooms } from "../lib/rooms";
import { site } from "../lib/site";

const navItems = [
  { href: "#khong-gian", label: "Không gian" },
  { href: "#vi-tri", label: "Vị trí" },
  { href: "#do-dung", label: "Đồ dùng" },
];

export default async function Home() {
  const rooms = await getPublicRooms();
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${site.url}/#business`,
        name: site.name,
        url: site.url,
        image: `${site.url}/images/fly-cam-hong-khang.jpg`,
        logo: `${site.url}/images/logo-hong-khang.png`,
        telephone: site.phones.map((phone) => `+84${phone.slice(1)}`),
        address: {
          "@type": "PostalAddress",
          streetAddress: site.address.street,
          addressLocality: site.address.locality,
          addressRegion: site.address.region,
          addressCountry: site.address.country,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: site.geo.latitude,
          longitude: site.geo.longitude,
        },
        sameAs: [site.facebook],
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        inLanguage: "vi-VN",
        publisher: { "@id": `${site.url}/#business` },
      },
    ],
  };

  return (
    <main className="site-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <a className="skip-link" href="#noi-dung">Đi đến nội dung chính</a>
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="#top" aria-label="Nhà trọ Hồng Khang, trang chủ">
            <Image className="brand-logo" src="/images/logo-hong-khang.png" alt="" width={64} height={64} priority />
            <span>Nhà trọ <strong>Hồng Khang</strong></span>
          </a>
          <nav aria-label="Điều hướng chính">
            {navItems.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
          </nav>
        </div>
      </header>

      <section id="top" className="hero" aria-labelledby="hero-title">
        <Image className="hero-image" src="/images/fly-cam-hong-khang.jpg" alt="Toàn cảnh từ trên cao khu nhà mái đỏ bên bờ sông, xung quanh nhiều cây xanh, tại Nhà trọ Hồng Khang" fill priority sizes="100vw" />
        <div className="hero-overlay" />
        <div className="container hero-content" id="noi-dung">
          <h1 id="hero-title">Nhà trọ Hồng Khang<br />tại Phước Hậu, Vĩnh Long</h1>
          <div className="local-intro-copy">
            <p>Xem phòng trọ, giá, tiện ích và hình ảnh thực tế trước khi liên hệ hẹn lịch xem phòng.</p>
            <p>Nhà trọ Hồng Khang nằm tại 75/19E, Phường Phước Hậu, Vĩnh Long. Trang này tổng hợp thông tin cần thiết để bạn xem phòng trước khi đến.</p>
            <p>Bạn có thể xem từng loại phòng đang được đăng, mức giá, tiện ích, hình ảnh, bản đồ và gọi trực tiếp để hỏi tình trạng phòng.</p>
          </div>
        </div>
      </section>

      <RoomTypes rooms={rooms} />

      <NearbyMap />

      <RecommendedItems />

      <aside className="floating-contact" aria-label="Liên hệ nhanh">
        <a href="https://www.facebook.com/people/Coffee-Nh%C3%A0-G%E1%BB%97/61576986390039/" target="_blank" rel="noreferrer" aria-label="Xem Facebook Coffee Nhà Gỗ, mở trong tab mới">
          <Image className="floating-contact-icon contact-icon" src="/icons/facebook.svg" alt="" aria-hidden="true" width={26} height={26} />
        </a>
        <a href="https://zalo.me/0707352905" target="_blank" rel="noreferrer" aria-label="Nhắn Zalo cho Nhà trọ Hồng Khang, mở trong tab mới">
          <Image className="floating-contact-icon contact-icon" src="/icons/zalo.svg" alt="" aria-hidden="true" width={28} height={28} />
        </a>
        <a href="https://www.instagram.com/poticutee/" target="_blank" rel="noreferrer" aria-label="Xem Instagram, mở trong tab mới">
          <Image className="floating-contact-icon contact-icon" src="/icons/instagram.svg" alt="" aria-hidden="true" width={26} height={26} />
        </a>
      </aside>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div className="footer-about">
            <a className="brand" href="#top"><Image className="brand-logo" src="/images/logo-hong-khang.png" alt="" width={64} height={64} /><span>Nhà trọ <strong>Hồng Khang</strong></span></a>
            <p>Phòng trọ tại Phường Phước Hậu, Tỉnh Vĩnh Long.</p>
          </div>
          <div className="footer-column">
            <p className="footer-heading">Địa chỉ</p>
            <p>75/19E, Phường Phước Hậu, Tỉnh Vĩnh Long</p>
            <a href={`https://www.google.com/maps/search/?api=1&query=${site.geo.latitude},${site.geo.longitude}`} target="_blank" rel="noreferrer">Chỉ đường trên Google Maps</a>
          </div>
          <div className="footer-column">
            <p className="footer-heading">Điện thoại · Zalo</p>
            <a href="https://zalo.me/0767245949" target="_blank" rel="noreferrer" aria-label="Nhắn Zalo cho Gon Duong, số 0767 245 949, mở trong tab mới">0767 245 949 - Gon Duong</a>
            <a href="https://zalo.me/0707352905" target="_blank" rel="noreferrer" aria-label="Nhắn Zalo cho Duy Khang, số 0707 352 905, mở trong tab mới">0707 352 905 - Duy Khang</a>
          </div>
        </div>
        <div className="container footer-bottom"><p>© {new Date().getFullYear()} Nhà trọ Hồng Khang</p></div>
      </footer>
    </main>
  );
}
