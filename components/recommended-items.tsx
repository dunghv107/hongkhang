import Image from "next/image";
import { ShoppingBagIcon } from "@phosphor-icons/react/dist/ssr/ShoppingBag";
import { recommendedItems, type RecommendedItem } from "../data/recommended-items";

function CardContent({ item }: { item: RecommendedItem }) {
  return <>
    <span className="recommended-photo">
      {item.image
        ? <Image src={item.image} alt="" fill sizes="(max-width: 900px) 50vw, 280px" />
        : <ShoppingBagIcon aria-hidden="true" size={40} weight="light" />}
    </span>
    <strong>{item.name}</strong>
    {item.priceVnd !== undefined && <span className="recommended-price">Khoảng {item.priceVnd.toLocaleString("vi-VN")}đ</span>}
  </>;
}

export default function RecommendedItems() {
  if (!recommendedItems.length) return null;
  const hasLinks = recommendedItems.some((item) => item.url);

  return (
    <section className="recommended-section" aria-labelledby="recommended-title">
      <div className="container">
        <div className="section-intro">
          <h2 id="recommended-title">Đồ dùng có thể bạn thích</h2>
          {hasLinks && <p>Một số liên kết là liên kết tiếp thị. Nhà trọ có thể nhận hoa hồng khi bạn mua hàng, giá của bạn không đổi.</p>}
        </div>
        <ul className="recommended-grid">
          {recommendedItems.map((item, index) => (
            <li key={item.url ?? index}>
              {item.url
                ? <a className="recommended-card" href={item.url} target="_blank" rel="sponsored noopener noreferrer" aria-label={`${item.name}, mở trang mua hàng trong tab mới`}><CardContent item={item} /></a>
                : <div className="recommended-card"><CardContent item={item} /></div>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
