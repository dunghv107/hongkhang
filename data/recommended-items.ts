export type RecommendedItem = {
  name: string;
  /** Ảnh đặt trong public/images/recommend-products, ví dụ "/images/recommend-products/tu-nhua.jpg". Bỏ trống thì thẻ hiện icon thay thế. */
  image?: string;
  /** Link mua hàng (affiliate). Bỏ trống thì thẻ không bấm được. */
  url?: string;
  /** Tên sản phẩm đúng như trên trang bán (Shopee), hiện dưới tên ngắn. */
  originalName?: string;
  /** Giá tham khảo tại thời điểm thêm vào, có thể thay đổi trên trang bán. */
  priceVnd?: number;
  /** true nếu priceVnd là giá sau khi áp voucher. */
  afterVoucher?: boolean;
};

// Section "Đồ dùng có thể bạn thích" chỉ hiển thị khi danh sách này có ít nhất một món.
export const recommendedItems: readonly RecommendedItem[] = [
  { name: "Kệ treo quần áo", originalName: "Kệ Treo Quần Áo Kèm Kệ Giày Đa Năng, Gọn Gàng", priceVnd: 263120, afterVoucher: true, url: "https://s.shopee.vn/6q2CRihIrN", image: "/images/recommend-products/ke-treo-quan-ao.jpg" },
  { name: "Tủ nhựa", originalName: "Tủ Nhựa Để Đồ 4 5 6 tầng ZenZone có ngăn kéo Đa Năng", priceVnd: 307120, afterVoucher: true, url: "https://s.shopee.vn/70Lcgs7oM4", image: "/images/recommend-products/tu-nhua.jpg" },
  { name: "Kệ chén dĩa", originalName: "Kệ Úp Chén Đĩa Nhiều Tầng", priceVnd: 210320, afterVoucher: true, url: "https://s.shopee.vn/7fbJPkgE0T", image: "/images/recommend-products/ke-chen-dia.jpg" },
  { name: "Bộ pijama", originalName: "Đồ Ngủ nữ Kẻ Sọc Dài Tay Viền Đen", priceVnd: 207680, afterVoucher: true, url: "https://s.shopee.vn/7VIGJsvGuy", image: "/images/recommend-products/pijama.jpg" },
];
