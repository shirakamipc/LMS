Khi người dùng truy cập trang http://localhost:3000/courses, danh sách các khóa học (Courses) được hiển thị.
Khi click vào một khóa học, người dùng được chuyển sang trang học khóa học đó — ví dụ:
👉 http://localhost:3000/courses/:courseId

Trang học này gồm:

Bên trái: video bài học hiện tại đang học + phần mô tả ngắn bên dưới.

Bên phải (sidebar): danh sách bài học (video) trong khóa học đó, có thể click để chuyển video.

Tham khảo layout tương tự như:

https://fullstack.edu.vn/learning/lessons-for-newbie?id=c5d222e4-7a41-4bfa-8a4f-dda9ff844033

Trang chính khi học — chia layout làm 2 phần:

Bên trái (70%): video player + phần mô tả.

Bên phải (30%): sidebar chứa danh sách các bài học trong khóa.


Tất cả dữ liệu sẽ mockAPi cho tôi, giả lập dữ liệu lấy video từ youtube