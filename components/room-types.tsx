"use client";

import Image from "next/image";
import { useState } from "react";
import { SnowflakeIcon } from "@phosphor-icons/react/dist/csr/Snowflake";
import { WindIcon } from "@phosphor-icons/react/dist/csr/Wind";
import { ShowerIcon } from "@phosphor-icons/react/dist/csr/Shower";
import { DropIcon } from "@phosphor-icons/react/dist/csr/Drop";
import { BathtubIcon } from "@phosphor-icons/react/dist/csr/Bathtub";
import { StudentIcon } from "@phosphor-icons/react/dist/csr/Student";
import { UsersThreeIcon } from "@phosphor-icons/react/dist/csr/UsersThree";
import { CaretLeftIcon } from "@phosphor-icons/react/dist/csr/CaretLeft";
import { CaretRightIcon } from "@phosphor-icons/react/dist/csr/CaretRight";
import type { RoomType } from "../lib/rooms";

const imagesOf = (room: RoomType) => room.room_images.length ? room.room_images : [{ secure_url: "/images/room-1/cua-phong.jpg", alt_text: `Phòng ${room.name}`, sort_order: 1 }];

export default function RoomTypes({ rooms }: { rooms: RoomType[] }) {
  const [active, setActive] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  const room = rooms[active];
  const images = imagesOf(room);
  const selectPreviousImage = () => setActiveImage((current) => (current - 1 + images.length) % images.length);
  const selectNextImage = () => setActiveImage((current) => (current + 1) % images.length);

  return (
    <section id="khong-gian" className="rooms-section" aria-labelledby="rooms-title">
      <div className="container">
        <div className="section-intro">
          <h2 id="rooms-title">Hình ảnh tại nhà trọ Hồng Khang</h2>
        </div>
        <div className="room-selector" aria-label="Chọn loại phòng">
          {rooms.map((item, index) => (
            <button key={item.id} type="button" aria-pressed={active === index} aria-controls="room-detail" className={active === index ? "is-active" : ""} onClick={() => { setActive(index); setActiveImage(0); }}>
              <span className="room-selector-photo"><Image src={item.room_images[0]?.secure_url ?? "/images/room-1/cua-phong.jpg"} alt="" fill sizes="(max-width: 640px) 28vw, 220px" /></span>
              <strong>{item.name}</strong>
              <span>Xem chi tiết</span>
            </button>
          ))}
        </div>
        <article id="room-detail" className="room-detail" aria-live="polite">
          <div className="room-detail-media">
            {images.length > 1 && <div className="room-gallery" role="group" aria-label={`Hình ảnh khác của ${room.name}`}>
              {images.map((image, index) => <button key={image.id ?? image.secure_url} type="button" aria-label={`Xem ảnh ${index + 1} của phòng ${room.name}`} aria-pressed={activeImage === index} onClick={() => setActiveImage(index)}><Image src={image.secure_url} alt="" fill sizes="50px" /></button>)}
            </div>}
            <div className="room-detail-photo">
              {/* Render every room photo stacked and show only the active one, so switching photos never waits for a download. */}
              {rooms.map((item, roomIndex) => imagesOf(item).map((image, imageIndex) => {
                const isActive = roomIndex === active && imageIndex === activeImage;
                return <Image key={`${item.id}-${image.secure_url}`} className={isActive ? "is-active" : undefined} src={image.secure_url} alt={isActive ? image.alt_text || `Phòng ${item.name}` : ""} aria-hidden={!isActive} fill loading={isActive ? "eager" : "lazy"} sizes="(max-width: 900px) 100vw, 58vw" />;
              }))}
              {images.length > 1 && <>
                <span className="room-image-count" aria-live="polite">{activeImage + 1} / {images.length}</span>
                <div className="room-image-navigation" aria-label="Điều khiển thư viện ảnh">
                  <button type="button" onClick={selectPreviousImage} aria-label="Xem ảnh trước"><CaretLeftIcon aria-hidden="true" size={24} weight="bold" /></button>
                  <button type="button" onClick={selectNextImage} aria-label="Xem ảnh tiếp theo"><CaretRightIcon aria-hidden="true" size={24} weight="bold" /></button>
                </div>
              </>}
            </div>
          </div>
          <div className="room-detail-copy">
            <p className="demo-label">Dữ liệu minh họa</p>
            <h3>Phòng {room.name}</h3>
            <div className="room-price-row">
              <p className="room-price">{room.price_vnd ? `${(room.price_vnd / 1000000).toLocaleString("vi-VN")} triệu` : "Liên hệ"} {room.price_vnd && <span>/ tháng</span>}</p>
              {room.available_rooms !== undefined && <span className="room-availability">Còn {room.available_rooms} phòng</span>}
            </div>
            <ul className="room-notes">
              <li><StudentIcon aria-hidden="true" size={22} weight="bold" /><span>Sinh viên giảm 500.000đ/tháng</span></li>
              <li><UsersThreeIcon aria-hidden="true" size={22} weight="bold" /><span>Phòng ở được từ 1–3 người</span></li>
            </ul>
            <ul className="amenity-list">
              {room.amenities.map((label) => {
                const text = label.toLowerCase();
                const Icon = text.includes("lạnh") ? WindIcon : text.includes("rửa") ? DropIcon : text.includes("vệ sinh") ? BathtubIcon : text.includes("tắm") ? ShowerIcon : SnowflakeIcon;
                return <li key={label}><Icon aria-hidden="true" size={24} weight="bold" /><span>{label}</span></li>;
              })}
            </ul>
            <p className="demo-note">Giá và tiện ích cần được thay bằng thông tin thực tế trước khi đăng chính thức.</p>
            <a className="primary-button" href="tel:0767245949">Liên hệ xem phòng</a>
          </div>
        </article>
      </div>
    </section>
  );
}
