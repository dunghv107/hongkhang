"use client";

import { useEffect, useRef, useState } from "react";
import type { LayerGroup, Map as LeafletMap } from "leaflet";
import { Buildings, GraduationCap, Hospital, Racquet, SoccerBall, Storefront } from "@phosphor-icons/react";
import { renderToStaticMarkup } from "react-dom/server";
import { nearbyPlaces } from "../data/nearby-places";

const HOME = { lat: 10.2298617, lng: 105.9626565 };

const categories = {
  hospital: { label: "Bệnh viện", icon: Hospital },
  market: { label: "Chợ", icon: Storefront },
  school: { label: "Trường học", icon: GraduationCap },
  mall: { label: "Trung tâm thương mại", icon: Buildings },
  football: { label: "Sân bóng đá", icon: SoccerBall },
  badminton: { label: "Sân cầu lông", icon: Racquet },
} as const;

type Category = keyof typeof categories;
function distanceKm(lat: number, lng: number) {
  const radius = 6371;
  const latDelta = ((lat - HOME.lat) * Math.PI) / 180;
  const lngDelta = ((lng - HOME.lng) * Math.PI) / 180;
  const a = Math.sin(latDelta / 2) ** 2 + Math.cos((HOME.lat * Math.PI) / 180) * Math.cos((lat * Math.PI) / 180) * Math.sin(lngDelta / 2) ** 2;
  return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function NearbyMap() {
  const mapNode = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const placeLayer = useRef<LayerGroup | null>(null);
  const [active, setActive] = useState<Category | null>(null);
  const [status, setStatus] = useState("Chọn một loại tiện ích để xem các địa điểm trong bán kính 5 km.");

  useEffect(() => {
    if (!mapNode.current || map.current) return;

    let cancelled = false;
    let handleWheel: ((event: WheelEvent) => void) | undefined;
    const node = mapNode.current;
    import("leaflet").then((L) => {
      if (cancelled || !mapNode.current) return;
      const instance = L.map(mapNode.current, { scrollWheelZoom: true }).setView([HOME.lat, HOME.lng], 13);
      handleWheel = (event) => {
        if (!event.ctrlKey) event.stopImmediatePropagation();
      };
      node.addEventListener("wheel", handleWheel, { capture: true });
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(instance);
      L.circle([HOME.lat, HOME.lng], { radius: 5000, color: "var(--color-brand)", fillColor: "var(--color-soft)", fillOpacity: 0.08, weight: 1 }).addTo(instance);
      L.marker([HOME.lat, HOME.lng], {
        alt: "Vị trí Nhà trọ Hồng Khang",
        title: "Nhà trọ Hồng Khang",
        icon: L.divIcon({ className: "map-home-marker", html: "<span></span>", iconAnchor: [14, 28], iconSize: [28, 28] }),
      }).addTo(instance).bindPopup("Nhà trọ Hồng Khang").openPopup();
      placeLayer.current = L.layerGroup().addTo(instance);
      map.current = instance;
    });

    return () => {
      cancelled = true;
      if (handleWheel) node.removeEventListener("wheel", handleWheel, { capture: true });
      map.current?.remove();
      map.current = null;
    };
  }, []);

  async function showCategory(category: Category) {
    if (!map.current || !placeLayer.current) return;
    setActive(category);
    const places = nearbyPlaces.filter((place) => place.category === category);

    try {
      const L = await import("leaflet");
      placeLayer.current.clearLayers();
      places.forEach((place) => {
        const { lat, lng, name: placeName, address, rating } = place;
        const Icon = categories[category].icon;
        const popup = document.createElement("div");
        const name = document.createElement("strong");
        const details = document.createElement("p");
        name.textContent = placeName;
        details.textContent = `${address || categories[category].label} · ${distanceKm(lat, lng).toFixed(1)} km đường chim bay${rating ? ` · ★ ${rating.toFixed(1)}` : ""}`;
        popup.append(name, details);
        const marker = L.marker([lat, lng], {
          alt: placeName,
          title: placeName,
          icon: L.divIcon({ className: "map-place-marker", html: `<span>${renderToStaticMarkup(<Icon aria-hidden="true" size={18} weight="bold" />)}</span>`, iconAnchor: [18, 18], iconSize: [36, 36] }),
        });
        marker.bindTooltip(rating ? `${placeName} · ★ ${rating.toFixed(1)}` : placeName, { direction: "top", offset: [0, -14] });
        marker.bindPopup(popup).addTo(placeLayer.current!);
      });
      setStatus(places.length ? `Đã tìm thấy ${places.length} địa điểm gần nhất. Bấm vào một ghim để xem thông tin.` : "Chưa có địa điểm thuộc nhóm này trong dữ liệu OpenStreetMap.");
    } catch {
      setStatus("Chưa tải được dữ liệu tiện ích. Vui lòng thử lại sau.");
    }
  }

  return (
    <section className="nearby-section" aria-labelledby="nearby-title">
      <div className="container nearby-grid">
        <div className="nearby-copy">
          <h2 id="nearby-title">Tiện ích xung quanh</h2>
          <p>Xem nhanh các địa điểm trong bán kính 5 km quanh Nhà trọ Hồng Khang.</p>
          <div className="nearby-filters" aria-label="Chọn loại tiện ích">
            {(Object.keys(categories) as Category[]).map((category) => {
              const Icon = categories[category].icon;
              return <button key={category} type="button" className={active === category ? "is-active" : ""} aria-pressed={active === category} onClick={() => showCategory(category)}>
                <Icon aria-hidden="true" size={20} weight="bold" />
                {categories[category].label}
              </button>;
            })}
          </div>
          <p className="nearby-status" aria-live="polite">{status}</p>
        </div>
        <div>
          <div ref={mapNode} className="nearby-map" aria-label="Bản đồ tiện ích trong bán kính 5 km quanh Nhà trọ Hồng Khang" />
          <p className="nearby-map-hint">Giữ Ctrl và lăn chuột để phóng to hoặc thu nhỏ bản đồ.</p>
        </div>
      </div>
    </section>
  );
}
