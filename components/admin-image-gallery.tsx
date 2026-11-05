"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { deleteRoomImage, saveRoomImageOrder, updateRoomImageAlt, uploadRoomImages } from "../app/admin/actions";
import type { RoomImage } from "../lib/rooms";
import { ConfirmDeleteButton } from "./confirm-delete-button";

type AdminRoomImage = RoomImage & { id: string };

export function AdminImageGallery({ roomId, roomName, initialImages }: {
  roomId: string;
  roomName: string;
  initialImages: AdminRoomImage[];
}) {
  const [images, setImages] = useState(initialImages);
  const [savedIds, setSavedIds] = useState(initialImages.map((image) => image.id));
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const changed = images.some((image, index) => image.id !== savedIds[index]);

  function move(fromIndex: number, toIndex: number) {
    if (fromIndex < 0 || toIndex < 0 || toIndex >= images.length || fromIndex === toIndex) return;
    setImages((current) => {
      const reordered = [...current];
      const [moved] = reordered.splice(fromIndex, 1);
      reordered.splice(toIndex, 0, moved);
      return reordered;
    });
  }

  function dropOn(targetId: string) {
    if (!draggedId || draggedId === targetId) return;
    move(images.findIndex((image) => image.id === draggedId), images.findIndex((image) => image.id === targetId));
    setDraggedId(null);
  }

  function saveOrder() {
    const formData = new FormData();
    formData.set("room_type_id", roomId);
    formData.set("image_ids", JSON.stringify(images.map((image) => image.id)));
    startTransition(async () => {
      await saveRoomImageOrder(formData);
      setSavedIds(images.map((image) => image.id));
    });
  }

  return (
    <>
      {images.length ? <div className="admin-gallery">
        {images.map((image, index) => (
          <article
            key={image.id}
            className={`admin-image${draggedId === image.id ? " is-dragging" : ""}`}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => dropOn(image.id)}
          >
            <div
              className="admin-image-preview admin-image-drag-handle"
              draggable
              onDragStart={(event) => {
                setDraggedId(image.id);
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text/plain", image.id);
              }}
              onDragEnd={() => setDraggedId(null)}
              title="Giữ chuột và kéo để đổi vị trí"
            >
              <Image src={image.secure_url} alt={image.alt_text} fill sizes="(max-width: 640px) 45vw, 220px" />
              <span className="admin-image-order">{index === 0 ? "Ảnh đại diện" : `Ảnh ${index + 1}`}</span>
              <span className="admin-drag-instruction">Kéo để sắp xếp</span>
            </div>
            <form className="admin-image-alt" action={updateRoomImageAlt}>
              <input type="hidden" name="id" value={image.id} />
              <label>
                Mô tả ảnh
                <input name="alt_text" defaultValue={image.alt_text} placeholder={`Ví dụ: Không gian ${roomName}`} required />
              </label>
              <button type="submit">Lưu</button>
            </form>
            <div className="admin-image-actions">
              <button type="button" disabled={index === 0} onClick={() => move(index, index - 1)} aria-label={`Đưa ảnh ${index + 1} lên trước`}>Lên</button>
              <button type="button" disabled={index === images.length - 1} onClick={() => move(index, index + 1)} aria-label={`Đưa ảnh ${index + 1} xuống sau`}>Xuống</button>
              <form action={deleteRoomImage}>
                <input type="hidden" name="id" value={image.id} />
                <input type="hidden" name="public_id" value={image.public_id ?? ""} />
                <ConfirmDeleteButton hasUnsavedOrder={changed} />
              </form>
            </div>
          </article>
        ))}
      </div> : <p className="admin-gallery-empty">Chưa có ảnh cho loại phòng này.</p>}
      {images.length > 0 && <div className="admin-order-confirmation">
        <p aria-live="polite">{changed ? "Thứ tự mới chưa được lưu." : "Thứ tự ảnh đã được lưu."}</p>
        <button className="admin-order-reset" type="button" onClick={() => setImages((current) => savedIds.map((id) => current.find((image) => image.id === id)!))} disabled={!changed || isPending}>Hoàn tác</button>
        <button className="admin-save" type="button" onClick={saveOrder} disabled={!changed || isPending}>{isPending ? "Đang lưu..." : "Xác nhận thứ tự"}</button>
      </div>}
      <form
        className="admin-upload"
        action={uploadRoomImages}
        onSubmit={(event) => {
          if (changed && !window.confirm("Bạn có thứ tự ảnh chưa xác nhận. Tải ảnh mới sẽ bỏ bản sắp xếp này. Tiếp tục?")) {
            event.preventDefault();
          }
        }}
      >
        <input type="hidden" name="room_type_id" value={roomId} />
        <label>Thêm ảnh<input name="images" type="file" accept="image/*" multiple required /></label>
        <label>Mô tả ảnh mới<input name="alt_text" placeholder={`Ví dụ: Không gian ${roomName}`} required /></label>
        <button className="admin-save" type="submit">Tải ảnh lên</button>
      </form>
    </>
  );
}
