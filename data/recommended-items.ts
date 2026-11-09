export type RecommendedItem = {
  name: string;
  /** Ảnh đặt trong public/images/products, ví dụ "/images/products/quat-dung.jpg". */
  image: string;
  /** Link mua hàng (affiliate). */
  url: string;
  /** Giá tham khảo tại thời điểm thêm vào, có thể thay đổi trên trang bán. */
  priceVnd?: number;
};

// Section "Đồ dùng có thể bạn thích" chỉ hiển thị khi danh sách này có ít nhất một món.
export const recommendedItems: readonly RecommendedItem[] = [];
