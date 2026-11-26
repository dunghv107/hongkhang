"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { CaretLeftIcon } from "@phosphor-icons/react/dist/csr/CaretLeft";
import { CaretRightIcon } from "@phosphor-icons/react/dist/csr/CaretRight";
import { ShoppingBagIcon } from "@phosphor-icons/react/dist/csr/ShoppingBag";
import { recommendedItems, type RecommendedItem } from "../data/recommended-items";

const formatPrice = (item: RecommendedItem) => `${item.afterVoucher ? "" : "Khoảng "}${item.priceVnd?.toLocaleString("vi-VN")}đ`;

function CardContent({ item }: { item: RecommendedItem }) {
  return <>
    <span className="recommended-photo">
      {item.image
        ? <Image src={item.image} alt="" fill draggable={false} sizes="(max-width: 900px) 50vw, 280px" />
        : <ShoppingBagIcon aria-hidden="true" size={40} weight="light" />}
    </span>
    <strong>{item.name}</strong>
    {item.originalName && <span className="recommended-origin">{item.originalName}</span>}
    {item.priceVnd !== undefined && <span className="recommended-price">{formatPrice(item)}{item.afterVoucher && <small>sau voucher</small>}</span>}
  </>;
}

export default function RecommendedItems() {
  const track = useRef<HTMLUListElement>(null);
  const drag = useRef({ active: false, moved: false, startX: 0, startScroll: 0 });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  function updateArrows() {
    const el = track.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 2);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  }

  useEffect(() => {
    updateArrows();
    window.addEventListener("resize", updateArrows);
    return () => window.removeEventListener("resize", updateArrows);
  }, []);

  const behavior = (): ScrollBehavior => (window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth");

  // Each click moves one full visible group: 4 cards on desktop, 2 on smaller screens.
  function slide(direction: 1 | -1) {
    const el = track.current;
    if (el) el.scrollBy({ left: direction * el.clientWidth, behavior: behavior() });
  }

  // Touch devices scroll natively; mouse users drag the track, then it settles on the nearest card.
  function onPointerDown(event: PointerEvent<HTMLUListElement>) {
    if (event.pointerType !== "mouse" || !track.current) return;
    drag.current = { active: true, moved: false, startX: event.clientX, startScroll: track.current.scrollLeft };
  }

  function onPointerMove(event: PointerEvent<HTMLUListElement>) {
    const el = track.current;
    if (!drag.current.active || !el) return;
    const distance = event.clientX - drag.current.startX;
    if (Math.abs(distance) > 5) {
      drag.current.moved = true;
      el.classList.add("is-dragging");
    }
    el.scrollLeft = drag.current.startScroll - distance;
  }

  function endDrag() {
    const el = track.current;
    if (!drag.current.active || !el) return;
    drag.current.active = false;
    if (!drag.current.moved) return;
    el.classList.remove("is-dragging");
    const step = (el.firstElementChild as HTMLElement | null)?.offsetWidth ?? el.clientWidth;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    el.scrollTo({ left: Math.round(el.scrollLeft / (step + gap)) * (step + gap), behavior: behavior() });
    // The click that follows a drag is swallowed below; clear the flag right after it so later clicks work.
    setTimeout(() => { drag.current.moved = false; }, 0);
  }

  if (!recommendedItems.length) return null;

  return (
    <section id="do-dung" className="recommended-section" aria-labelledby="recommended-title">
      <div className="container">
        <div className="recommended-header">
          <div className="section-intro">
            <h2 id="recommended-title">Đồ dùng có thể bạn thích</h2>
          </div>
          <div className="recommended-controls">
            <button type="button" onClick={() => slide(-1)} disabled={!canPrev} aria-label="Xem các món trước"><CaretLeftIcon aria-hidden="true" size={22} weight="bold" /></button>
            <button type="button" onClick={() => slide(1)} disabled={!canNext} aria-label="Xem các món tiếp theo"><CaretRightIcon aria-hidden="true" size={22} weight="bold" /></button>
          </div>
        </div>
        <ul
          ref={track}
          className="recommended-track"
          aria-label="Danh sách đồ dùng"
          onScroll={updateArrows}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          onClickCapture={(event) => { if (drag.current.moved) event.preventDefault(); }}
        >
          {recommendedItems.map((item, index) => (
            <li key={item.url ?? index}>
              {item.url
                ? <a className="recommended-card" href={item.url} target="_blank" rel="sponsored noopener noreferrer" draggable={false} aria-label={[item.name, item.originalName, item.priceVnd !== undefined && `${formatPrice(item)}${item.afterVoucher ? " sau voucher" : ""}`, "mở trang mua hàng trong tab mới"].filter(Boolean).join(", ")}><CardContent item={item} /></a>
                : <div className="recommended-card"><CardContent item={item} /></div>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
