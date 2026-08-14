# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js App Router, TypeScript và CSS thuần; triển khai trên Vercel. Lựa chọn này được suy luận từ cấu hình Next.js/Supabase mà người dùng đã chọn trong phiên thiết lập.

## Users

Khách đang tìm phòng trọ, ưu tiên trải nghiệm trên điện thoại, cần xem nhanh không gian, thông tin cơ bản và cách liên hệ trực tiếp với chủ trọ.

## Product Purpose

Website công khai giúp khách khám phá Nhà trọ Hồng Khang và đi đến quyết định liên hệ xem phòng. Giai đoạn sau có thể phát triển thành hệ thống quản lý trọ nhưng chưa thuộc phạm vi hiện tại.

## Operating Context

Người dùng truy cập từ tìm kiếm địa phương, liên kết chia sẻ hoặc domain `chinsu.click`; xem nội dung và ảnh phòng trước khi liên hệ.

## Capabilities and Constraints

- Supabase lưu dữ liệu; Cloudinary lưu và phân phối ảnh; Vercel build/host; Cloudflare quản lý DNS.
- Không lưu ảnh upload trên Vercel.
- Tình trạng phòng, giá, địa chỉ chi tiết, số điện thoại và tiện ích thực tế vẫn là dữ liệu mở; không được tự bịa.
- Chưa xây dashboard, hợp đồng, hóa đơn hoặc phân quyền quản trị.

## Brand Commitments

- Tên: Nhà trọ Hồng Khang.
- Giọng điệu tiếng Việt tự nhiên, gần gũi và đáng tin.
- Bảng màu đã chốt: `#f2f2f2`, `#d3d2d1`, `#a7a4a1`, `#5d5248`, `#c4bfba`, `#000000`.

## Evidence on Hand

Có ảnh thực tế của khu trọ và phòng trong thư mục local `docs/`; các ảnh được chọn để xuất bản được copy sang `public/images/`. Chưa có logo, bảng giá, đánh giá hoặc dữ liệu tình trạng phòng. Không được tự bịa các dữ liệu còn thiếu.

## Product Principles

- Cho khách hiểu nơi ở và cách liên hệ trong vài giây.
- Ảnh thật và thông tin rõ ràng quan trọng hơn hiệu ứng trang trí.
- Mobile-first, tải nhanh và dễ đọc.
- Chỉ xây nghiệp vụ quản lý khi có yêu cầu thực tế.

## Accessibility & Inclusion

Hỗ trợ bàn phím, focus rõ, nội dung thay thế cho ảnh, tương phản WCAG AA và reduced motion.
