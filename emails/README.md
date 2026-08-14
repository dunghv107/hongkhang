# Mẫu email Nhà trọ Hồng Khang

`reset-password.html` là mẫu đầu tiên và cũng là khung giao diện chung cho các email sau này.

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

Khi thêm loại email mới, sao chép file này và chỉ thay phần nằm giữa hai comment `Nội dung riêng của từng loại email`.
