import Image from "next/image";
import { recommendedItems } from "../data/recommended-items";

export default function RecommendedItems() {
  if (!recommendedItems.length) return null;

  return (
    <section className="recommended-section" aria-labelledby="recommended-title">
      <div className="container">
        <div className="section-intro">
          <h2 id="recommended-title">Đồ dùng có thể bạn thích</h2>
          <p>Một số liên kết là liên kết tiếp thị. Nhà trọ có thể nhận hoa hồng khi bạn mua hàng, giá của bạn không đổi.</p>
        </div>
        <ul className="recommended-grid">
          {recommendedItems.map((item) => (
            <li key={item.url}>
              <a className="recommended-card" href={item.url} target="_blank" rel="sponsored noopener noreferrer" aria-label={`${item.name}, mở trang mua hàng trong tab mới`}>
                <span className="recommended-photo"><Image src={item.image} alt="" fill sizes="(max-width: 640px) 50vw, (max-width: 900px) 33vw, 280px" /></span>
                <strong>{item.name}</strong>
                {item.priceVnd !== undefined && <span className="recommended-price">Khoảng {item.priceVnd.toLocaleString("vi-VN")}đ</span>}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
