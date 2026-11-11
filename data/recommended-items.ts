export type RecommendedItem = {
  name: string;
  /** Ảnh đặt trong public/images/products, ví dụ "/images/products/quat-dung.jpg". Bỏ trống thì thẻ hiện icon thay thế. */
  image?: string;
  /** Link mua hàng (affiliate). Bỏ trống thì thẻ không bấm được. */
  url?: string;
  /** Giá tham khảo tại thời điểm thêm vào, có thể thay đổi trên trang bán. */
  priceVnd?: number;
};

// Section "Đồ dùng có thể bạn thích" chỉ hiển thị khi danh sách này có ít nhất một món.
// 4 thẻ chờ bên dưới: thay bằng sản phẩm thật (tên, ảnh, link) khi có.
export const recommendedItems: readonly RecommendedItem[] = [
  { name: "Sắp cập nhật" },
  { name: "Sắp cập nhật" },
  { name: "Sắp cập nhật" },
  { name: "Sắp cập nhật" },
];
