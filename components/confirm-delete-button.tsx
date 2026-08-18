"use client";

export function ConfirmDeleteButton({ hasUnsavedOrder = false }: { hasUnsavedOrder?: boolean }) {
  return (
    <button
      className="admin-delete-image"
      type="submit"
      onClick={(event) => {
        const message = hasUnsavedOrder
          ? "Bạn có thứ tự ảnh chưa xác nhận. Xóa ảnh sẽ bỏ bản sắp xếp này và xóa ảnh vĩnh viễn khỏi Cloudinary. Tiếp tục?"
          : "Xóa ảnh này vĩnh viễn? Ảnh cũng sẽ bị xóa khỏi Cloudinary.";
        if (!window.confirm(message)) {
          event.preventDefault();
        }
      }}
    >
      Xóa
    </button>
  );
}
