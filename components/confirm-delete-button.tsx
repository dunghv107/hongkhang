"use client";

export function ConfirmDeleteButton() {
  return (
    <button
      className="admin-delete-image"
      type="submit"
      onClick={(event) => {
        if (!window.confirm("Xóa ảnh này vĩnh viễn? Ảnh cũng sẽ bị xóa khỏi Cloudinary.")) {
          event.preventDefault();
        }
      }}
    >
      Xóa
    </button>
  );
}
