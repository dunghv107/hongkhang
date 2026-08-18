# Mẫu email Nhà trọ Hồng Khang

- `base.html`: khung giao diện chung, dùng làm nguồn để tạo các loại email mới.
- `reset-password.html`: bản hoàn chỉnh dành cho email đặt lại mật khẩu.

## Dùng trong Supabase

1. Mở **Authentication > Email Templates > Reset password**.
2. Đặt tiêu đề: `Lấy lại mật khẩu Nhà trọ Hồng Khang`.
3. Sao chép toàn bộ nội dung file `reset-password.html` vào phần nội dung email rồi lưu.
4. Tắt click tracking và open tracking trong Resend để đường dẫn xác thực không bị thay đổi.
5. Thử chức năng **Quên mật khẩu** bằng email thật.

Supabase tự thay các biến sau khi gửi:

- `{{ .ConfirmationURL }}`: đường dẫn đặt lại mật khẩu.
- `{{ .Email }}`: email người nhận.
- `{{ .SiteURL }}`: URL website đã cấu hình trong Supabase Auth.

## Tạo loại email mới

1. Sao chép `base.html` thành một file mới.
2. Thay nội dung xem trước và `<title>` trong phần đầu file.
3. Chỉ thay phần giữa `EMAIL_CONTENT_START` và `EMAIL_CONTENT_END`.
4. Thay các chuỗi bắt đầu bằng `THAY_` bằng nội dung và biến Supabase phù hợp.
5. Dán toàn bộ HTML hoàn chỉnh vào template tương ứng trên Supabase.

Supabase không hỗ trợ include/partial dùng chung giữa các Email Template. Vì vậy `base.html` là nguồn thiết kế chung trong repository; mỗi template trên dashboard vẫn cần chứa HTML đầy đủ.
