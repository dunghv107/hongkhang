# Nhà trọ Hồng Khang

Website giới thiệu phòng trọ Hồng Khang, giúp khách xem thông tin và liên hệ thuê phòng. Hệ thống dự kiến dùng Supabase cho dữ liệu/backend, Vercel để triển khai, Cloudinary để lưu và phân phối ảnh, Cloudflare để quản lý DNS.

## Thiết lập dự án

Phần source ứng dụng chưa được khởi tạo trong repository này. Sau khi chọn framework, bổ sung vào README các lệnh cài dependency, chạy local, kiểm tra và deploy tương ứng; không ghi lệnh giả khi dự án chưa có `package.json`.

Tạo file môi trường từ `.env.example` khi file mẫu đã có. Không commit `.env` hoặc service-role key. Biến Cloudinary dùng để ký upload và Supabase service-role key chỉ được sử dụng ở server.

## Quy tắc dành cho coding agent

Codex tự đọc [AGENTS.md](./AGENTS.md), sau đó file này yêu cầu đọc toàn bộ [.agent.md](./.agent.md). `.agent.md` là nguồn quy tắc chung của dự án: mục tiêu sản phẩm, hạ tầng, SEO, palette và tiêu chí hoàn thành.

Các thư mục `.agents/`, `.agent/`, `.claude/`, `.codex/`, `.gemini/`, `.impeccable/` và `.kiro/` là công cụ cục bộ, đã được ignore và không được push lên GitHub. Chỉ `AGENTS.md` và `.agent.md` là tài liệu agent thuộc dự án cần commit.

## Cài các skill đang dùng

Skill được cài trên từng máy, không copy thư mục skill vào repository.

### Taste Skill

Yêu cầu Node.js/npm, sau đó chạy tại thư mục dự án:

```bash
npx skills add Leonxlnx/taste-skill
```

Lệnh này cung cấp các skill taste hiện có như `design-taste-frontend`, `gpt-taste`, `high-end-visual-design` và các biến thể liên quan.

### Impeccable

Cài bản dành cho Codex ở phạm vi project:

```bash
npx impeccable skills install -y --providers=codex --scope=project
```

Hoặc cài bản Agent Skills dùng chung:

```bash
npx skills add pbakaus/impeccable
```

### UI/UX Pro Max

```bash
npx skills add nextlevelbuilder/ui-ux-pro-max-skill
```

Sau khi cài, kiểm tra agent nhận ra `impeccable` và `ui-ux-pro-max` trước khi làm UI.

### Ponytail

Ponytail hiện được cung cấp dưới dạng Codex plugin. Mở phần Plugins/Marketplace của Codex, tìm **Ponytail**, cài plugin và xác nhận skill `ponytail` xuất hiện trong danh sách skill khả dụng. Không cần commit cache plugin vào repository.

codex plugin marketplace add DietrichGebert/ponytail

codex plugin add ponytail@ponytail

## Quy trình làm việc đề xuất

1. Mở repository ở thư mục gốc để `AGENTS.md` có hiệu lực.
2. Yêu cầu agent xác nhận đã đọc `.agent.md` trước thay đổi lớn.
3. Với UI, gọi rõ các skill cần dùng, ví dụ: `ponytail + impeccable + ui-ux-pro-max + gpt-taste`.
4. Chạy lint, typecheck, test và build phù hợp trước khi commit.
5. Dùng `git status` và `git diff` để chắc chắn chỉ source/tài liệu của dự án được đưa lên GitHub.

## Xác thực Supabase và email Resend

Website dùng Supabase Auth cho đăng nhập quản trị và đặt lại mật khẩu. Website không mở đăng ký công khai. Resend chỉ làm nhà cung cấp SMTP cho Supabase; không đặt Resend API key trong biến `NEXT_PUBLIC_*` hoặc source code.

### Cấu hình Resend

1. Trong Resend, xác minh domain hoặc subdomain gửi mail, ví dụ `auth.chinsu.click`.
2. Mở **Integrations**, kết nối Resend với Supabase và chọn đúng project Hồng Khang. Đây là cách ngắn nhất.
3. Nếu cấu hình SMTP thủ công trong Supabase tại **Authentication > Email > SMTP Settings**, dùng:
   - Host: `smtp.resend.com`
   - Port: `465`
   - Username: `resend`
   - Password: Resend API key
   - Sender email: địa chỉ thuộc domain đã xác minh, ví dụ `no-reply@auth.chinsu.click`
   - Sender name: `Nhà trọ Hồng Khang`

### Cấu hình URL trong Supabase

Tại **Authentication > URL Configuration**:

- Site URL production: `https://chinsu.click`
- Redirect URLs:
  - `http://localhost:3000/**`
  - `https://chinsu.click/**`

Các route xác thực hiện có:

- `/dang-nhap`
- `/quen-mat-khau`
- `/dat-lai-mat-khau`

Sau khi SMTP và redirect URL được lưu, thử quên mật khẩu bằng email quản trị để kiểm tra toàn bộ luồng gửi thư. Trong **Authentication > General Configuration**, tắt **Allow new users to sign up** để chặn cả yêu cầu đăng ký gọi trực tiếp tới Supabase Auth API.

### Mẫu email

Mẫu HTML khôi phục mật khẩu có sẵn tại [`emails/reset-password.html`](emails/reset-password.html). Hướng dẫn dán mẫu vào Supabase và tái sử dụng khung cho các email khác nằm tại [`emails/README.md`](emails/README.md).

## Tài khoản quản trị Supabase

Trang `/admin` chỉ cho phép user có App Metadata:

```json
{
  "role": "admin"
}
```

Chọn đúng user trong **Supabase Dashboard > Authentication > Users** và gán trường trên vào **App Metadata**, không dùng User Metadata. Sau khi thay đổi role, đăng xuất rồi đăng nhập lại để Supabase phát token mới.

- Tài khoản có `app_metadata.role = "admin"` được chuyển tới `/admin` sau khi đăng nhập.
- Tài khoản bình thường được chuyển về trang chủ.
- `/admin` luôn kiểm tra lại user và role ở server.
- `/admin` cho phép sửa tên loại phòng, giá, tiện ích, trạng thái hiển thị và thư viện ảnh Cloudinary.

### Khởi tạo dữ liệu loại phòng

Chạy migration [`supabase/migrations/202608150001_create_room_catalog.sql`](supabase/migrations/202608150001_create_room_catalog.sql) bằng Supabase CLI (`supabase db push`) hoặc dán toàn bộ file vào **Supabase Dashboard > SQL Editor** và chọn **Run**. Migration tạo ba loại phòng mẫu, bảng ảnh và chính sách RLS: khách chỉ đọc dữ liệu đã xuất bản; tài khoản có `app_metadata.role = "admin"` mới được thay đổi dữ liệu.

Ảnh tải tại `/admin` được gửi thẳng từ Server Action lên Cloudinary. Supabase chỉ lưu URL, public ID, alt text và thứ tự hiển thị; không lưu tệp ảnh.
