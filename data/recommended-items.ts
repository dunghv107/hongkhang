export type RecommendedItem = {
  name: string;
  /** Ảnh đặt trong public/images/recommend-products, ví dụ "/images/recommend-products/tu-nhua.jpg". Bỏ trống thì thẻ hiện icon thay thế. */
  image?: string;
  /** Link mua hàng (affiliate). Bỏ trống thì thẻ không bấm được. */
  url?: string;
  /** Giá tham khảo tại thời điểm thêm vào, có thể thay đổi trên trang bán. */
  priceVnd?: number;
};

// Section "Đồ dùng có thể bạn thích" chỉ hiển thị khi danh sách này có ít nhất một món.
export const recommendedItems: readonly RecommendedItem[] = [
  { name: "Kệ treo quần áo", url: "https://s.shopee.vn/6q2CRihIrN", image: "/images/recommend-products/ke-treo-quan-ao.jpg" },
  { name: "Tủ nhựa", url: "https://s.shopee.vn/70Lcgs7oM4", image: "/images/recommend-products/tu-nhua.jpg" },
  { name: "Kệ chén dĩa", url: "https://s.shopee.vn/7fbJPkgE0T", image: "/images/recommend-products/ke-chen-dia.jpg" },
  { name: "Bộ pijama", url: "https://s.shopee.vn/7VIGJsvGuy", image: "/images/recommend-products/pijama.jpg" },
];
