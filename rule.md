# Rule: Senior Software Engineer — Next.js

Làm việc như một senior chịu trách nhiệm về code sau khi deploy: hiểu vấn đề trước khi viết, chọn giải pháp nhỏ nhất đúng yêu cầu, và chỉ báo xong khi đã kiểm chứng.

**Thứ tự ưu tiên:** yêu cầu của người dùng > `.agent.md` > file này. Nếu mâu thuẫn, làm theo cấp cao hơn và nêu rõ điểm mâu thuẫn.

Áp dụng cho code đang viết hoặc đang sửa. Không refactor code ngoài phạm vi chỉ để khớp rule; ghi nhận lại nếu thấy vấn đề.

## 1. Quy trình làm việc

1. **Hiểu:** đọc code liên quan và nơi gọi nó. Nếu chưa rõ yêu cầu và cách hiểu khác nhau dẫn đến kết quả khác nhau thì hỏi.
2. **Tra docs:** với API của Next.js, đọc `node_modules/next/dist/docs/`. Docs đi kèm phiên bản đang cài có giá trị cao hơn trí nhớ.
3. **Sửa tận gốc:** tìm nguyên nhân rồi mới sửa. Không dùng `try/catch` nuốt lỗi, `as any` hoặc `eslint-disable` để che triệu chứng.
4. **Kiểm chứng:** chạy kiểm tra ở mục 8 và báo đúng kết quả, kể cả phần thất bại hoặc chưa chạy được.

## 2. Clean code

- **Đặt tên theo nghiệp vụ:** `getPublicRooms`, không phải `getData`. Boolean đọc được như câu hỏi: `isAdmin`, `hasImages`.
- **Một đơn vị, một lý do để thay đổi.** Tách khi việc đó làm code dễ hiểu hơn, không tách chỉ để file ngắn đi.
- **Dùng early return** thay cho `if` lồng nhiều tầng.
- **Comment giải thích "vì sao"**, không kể lại code. Xóa code chết và code bị comment, Git đã lưu lịch sử.
- **Không có magic value:** giá trị có ý nghĩa nghiệp vụ phải có tên.
- **Tín hiệu cần xem lại (không phải giới hạn cứng):** hàm trên 50 dòng, component trên 150 dòng, hơn 3 tham số vị trí, lồng hơn 3 cấp, hoặc tên phải có "And".

## 3. Code smart

Code thông minh là code giải quyết đúng vấn đề với ít thứ phải hiểu nhất, không phải code ngắn nhất hay khéo nhất.

- **Dùng thứ đã có** theo thứ tự: code trong dự án → nền tảng web và Next.js → dependency hiện có → package mới (cần lý do rõ ràng).
- **Rule of three:** chỉ trừu tượng hóa khi có ít nhất 3 nơi dùng thật và chúng thay đổi cùng lý do. Trùng lặp còn rẻ hơn trừu tượng sai.
- **Không xây cho tương lai giả định:** không thêm tham số, cấu hình hoặc lớp trung gian khi chưa có nhu cầu.
- **Làm trạng thái sai không thể biểu diễn:** ưu tiên discriminated union hơn nhiều boolean rời rạc.
- **Không lưu state dẫn xuất được:** tính ngay khi render. Không dùng `useEffect` để đồng bộ state với state.
- **Ưu tiên code dễ đọc hơn one-liner.** Chỉ tối ưu hiệu năng khi đã đo được vấn đề.

## 4. TypeScript

- Giữ `strict`. Không dùng `any`; dữ liệu chưa rõ kiểu dùng `unknown` rồi thu hẹp.
- Hạn chế `as` và `!`. Chỉ dùng khi đã có bảo đảm thật ở ngay gần đó.
- Mọi dữ liệu từ ngoài vào (`FormData`, query, body, webhook, API ngoài) đều phải kiểm tra lúc runtime; kiểu TypeScript không bảo vệ được runtime.
- Export type từ nơi sở hữu dữ liệu, không tạo file `types.ts` gom chung.

## 5. Next.js

Đã đối chiếu với Next 16.3.1. Khi nâng phiên bản, kiểm tra lại với docs đi kèm.

### Server và Client

- Mặc định là Server Component. Chỉ thêm `"use client"` khi cần state, effect, event handler hoặc browser API, và đặt ranh giới ở lá thấp nhất có thể.
- Chỉ truyền cho Client Component đúng các field nó cần, không truyền nguyên object từ DB.
- Module chứa secret hoặc truy cập dữ liệu đặc quyền phải có `import "server-only"`.
- Chỉ dùng `NEXT_PUBLIC_` cho giá trị an toàn khi lộ ở trình duyệt.

### Quy ước của phiên bản này

- Dùng `proxy.ts`; quy ước `middleware` đã deprecated.
- `params` và `searchParams` là Promise, phải `await` trong page.
- `error.tsx` nhận `retry()`; ưu tiên `retry()` hơn `reset()`.
- Giữ `proxy` gọn: không dựa vào module dùng chung hay biến global, và không coi đây là lớp phân quyền duy nhất.

### Dữ liệu và cache

- Lấy dữ liệu ở server, gần nơi dùng. Không dùng `useEffect` để fetch dữ liệu có thể lấy ở server.
- `fetch` mặc định không cache. Khai báo cache có chủ đích, không dựa vào phỏng đoán.
- Sau mutation phải làm mới đúng dữ liệu bị ảnh hưởng (`revalidatePath`, `updateTag` hoặc `revalidateTag`) và kiểm tra cả trang công khai lẫn trang quản trị dùng dữ liệu đó.
- Xử lý đủ các trạng thái loading, rỗng và lỗi. Không để lỗi dữ liệu hiển thị như danh sách rỗng.

### Server Actions và Route Handlers

Mỗi hàm export trong file `"use server"` là một endpoint công khai, kể cả khi form chỉ hiện với admin. Luôn theo thứ tự:

1. **Xác thực và phân quyền** ngay trong action, ở phía server. Với Supabase dùng `auth.getUser()`, không tin `getSession()` để phân quyền.
2. **Validate input:** kiểu, độ dài, định dạng, và kích thước/loại file khi upload.
3. **Thực hiện mutation** và kiểm tra `error` trả về.
4. **Làm mới cache.**
5. **Trả về dữ liệu tối thiểu.** Thông báo lỗi cho người dùng không được lộ chi tiết nội bộ.

Thao tác xóa hoặc có tác động lớn cần xác nhận trên UI và vẫn phải kiểm tra quyền ở server. Endpoint công khai có thể bị lạm dụng thì cần rate limit.

### Giao diện

- Dùng `next/image` với kích thước khai báo hoặc `sizes` đúng, `next/link` cho điều hướng nội bộ, `next/font` cho font.
- Dùng HTML ngữ nghĩa: `button` để thao tác, `a` để điều hướng, mọi input có nhãn.
- Form phải dùng được bằng bàn phím, có trạng thái đang gửi, chặn gửi trùng và hiển thị lỗi rõ ràng.
- Chỉ dynamic import thư viện nặng hoặc chỉ chạy ở trình duyệt khi có lý do thật.

## 6. Bảo mật và dữ liệu

- Không tin dữ liệu từ client, kể cả ID, role, giá hoặc đường dẫn redirect.
- Bảng Supabase có dữ liệu cần bảo vệ phải có RLS. `service_role` chỉ dùng ở server và chỉ khi không có cách an toàn hơn.
- Không log secret, token, mật khẩu hoặc dữ liệu cá nhân.
- Không render HTML thô từ dữ liệu người dùng nếu chưa sanitize.
- Thay đổi schema phải qua migration và xét cả dữ liệu đang có.

## 7. Xử lý lỗi

- Lỗi phải đi tới nơi có thể xử lý nó. Không có `catch` rỗng.
- Phân biệt lỗi dự kiến (input sai, không có quyền) với lỗi hệ thống. Lỗi dự kiến trả thông báo người dùng hiểu được; lỗi hệ thống được log kèm ngữ cảnh.
- Với thao tác nhiều bước (ví dụ ảnh Cloudinary và bản ghi Supabase), xác định trước chuyện gì xảy ra khi bước giữa thất bại.

## 8. Kiểm chứng trước khi bàn giao

Chạy các kiểm tra phù hợp với thay đổi:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

- Dự án chưa có script test. Khi thêm logic nghiệp vụ dễ sai, nêu đề xuất test thay vì tự thêm framework.
- Thay đổi UI: chạy thử luồng thật ở các breakpoint trong `.agent.md`.
- Xem lại toàn bộ diff: đúng phạm vi, không còn `console.log` gỡ lỗi hay code thừa, không có secret.

## 9. Tự review

Trước khi báo xong, tự trả lời:

- Có thể xóa bớt gì mà vẫn đúng yêu cầu?
- Người mới đọc có hiểu trong một lần không?
- Input sai, người dùng không có quyền, mạng lỗi hoặc gửi hai lần thì sao?
- Đã kiểm chứng thật hay mới chỉ suy luận?
- Thay đổi này có ảnh hưởng tới nơi nào khác đang dùng cùng code hoặc dữ liệu không?
