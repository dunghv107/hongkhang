"use client";

import Image from "next/image";
import { useState } from "react";
import { SnowflakeIcon } from "@phosphor-icons/react/dist/csr/Snowflake";
import { WindIcon } from "@phosphor-icons/react/dist/csr/Wind";
import { ShowerIcon } from "@phosphor-icons/react/dist/csr/Shower";
import type { RoomType } from "../lib/rooms";

export default function RoomTypes({ rooms }: { rooms: RoomType[] }) {
  const [active, setActive] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  const room = rooms[active];
  const images = room.room_images.length ? room.room_images : [{ secure_url: "/images/phong-ngu-hong-khang.jpg", alt_text: `Phòng ${room.name}`, sort_order: 1 }];
  const selectedImage = images[activeImage] ?? images[0];

  return (
    <section id="khong-gian" className="rooms-section" aria-labelledby="rooms-title">
      <div className="container">
        <div className="section-intro">
          <h2 id="rooms-title">Các loại phòng hiện có</h2>
          <p>Chọn một loại phòng để xem hình ảnh, giá và tiện ích đi kèm.</p>
        </div>
        <div className="room-selector" aria-label="Chọn loại phòng">
          {rooms.map((item, index) => (
            <button key={item.id} type="button" aria-pressed={active === index} aria-controls="room-detail" className={active === index ? "is-active" : ""} onClick={() => { setActive(index); setActiveImage(0); }}>
              <span className="room-selector-photo"><Image src={item.room_images[0]?.secure_url ?? "/images/phong-ngu-hong-khang.jpg"} alt="" fill sizes="(max-width: 640px) 28vw, 220px" /></span>
              <strong>{item.name}</strong>
              <span>Xem chi tiết</span>
            </button>
          ))}
        </div>
        <article id="room-detail" className="room-detail" aria-live="polite">
          <div className="room-detail-photo">
            <Image src={selectedImage.secure_url} alt={selectedImage.alt_text || `Phòng ${room.name}`} fill loading="eager" sizes="(max-width: 900px) 100vw, 58vw" />
          </div>
          <div className="room-detail-copy">
            <p className="demo-label">Dữ liệu minh họa</p>
            <h3>Phòng {room.name}</h3>
            <p className="room-price">{room.price_vnd ? `${(room.price_vnd / 1000000).toLocaleString("vi-VN")} triệu` : "Liên hệ"} {room.price_vnd && <span>/ tháng</span>}</p>
            <ul className="amenity-list">
              {room.amenities.map((label) => {
                const Icon = label.toLowerCase().includes("tắm") ? ShowerIcon : label.toLowerCase().includes("lạnh") ? WindIcon : SnowflakeIcon;
                return <li key={label}><Icon aria-hidden="true" size={24} weight="bold" /><span>{label}</span></li>;
              })}
            </ul>
            <p className="demo-note">Giá và tiện ích cần được thay bằng thông tin thực tế trước khi đăng chính thức.</p>
            <a className="primary-button" href="tel:0767245949">Liên hệ xem phòng</a>
          </div>
        </article>
        {images.length > 1 && <div className="room-gallery" aria-label={`Ảnh phòng ${room.name}`}>
          {images.map((image, index) => <button key={image.id ?? image.secure_url} type="button" aria-label={`Xem ảnh ${index + 1} của phòng ${room.name}`} aria-pressed={activeImage === index} onClick={() => setActiveImage(index)}><Image src={image.secure_url} alt="" fill sizes="(max-width: 640px) 30vw, 180px" /></button>)}
        </div>}
      </div>
    </section>
  );
}
