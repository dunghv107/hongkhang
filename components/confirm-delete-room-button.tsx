"use client";

export function ConfirmDeleteRoomButton({ roomName }: { roomName: string }) {
  return (
    <button
      className="admin-delete-room"
      type="submit"
      onClick={(event) => {
        if (!window.confirm(`Xóa ${roomName} và toàn bộ hình ảnh? Hành động này không thể hoàn tác.`)) {
          event.preventDefault();
        }
      }}
    >
      Xóa loại phòng
    </button>
  );
}
