import React from "react";

export default function Footer() {
  return (
    <footer className="py-8 lg:pt-16 lg:pb-10 bg-[rgb(24,24,33)] px-4">
      <div className="container mx-auto ">
        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:justify-items-center">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <img
                className="h-24 w-24"
                src="/favicon/logo.png"
                alt=""
              />
              <h1 className="capitalize font-bold text-white">
                Hệ Thống Quản Lý Học Tập
              </h1>
            </div>
            <h3 className="text-tuyn-gray mb-2 text-sm">
              Điện thoại: (024) 3869 2000
            </h3>
            <h3 className="text-tuyn-gray mb-2 text-sm">
              Email: info@hust.edu.vn
            </h3>
            <h3 className="text-tuyn-gray mb-2 text-sm">
              Địa chỉ: Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội
            </h3>
            <img
              className="pt-3"
              src="https://static.fullstack.edu.vn/static/media/dmca.2593d9ecf1c982e3c3a2.png"
              alt=""
            />
          </div>
          <div>
            <h1 className="capitalize font-bold text-white mb-3">VỀ ĐỒ ÁN</h1>
            <h3 className="text-tuyn-gray mb-2 text-sm">Giới thiệu</h3>
            <h3 className="text-tuyn-gray mb-2 text-sm">Tính năng</h3>
            <h3 className="text-tuyn-gray mb-2 text-sm">Công nghệ</h3>
          </div>
          <div>
            <h1 className="capitalize font-bold text-white mb-3">HỖ TRỢ</h1>
            <h3 className="text-tuyn-gray mb-2 text-sm">Liên hệ</h3>
            <h3 className="text-tuyn-gray mb-2 text-sm">Bảo mật</h3>
            <h3 className="text-tuyn-gray mb-2 text-sm">Điều khoản</h3>
          </div>
          <div>
            <h1 className="capitalize font-bold text-white mb-3">
              ĐỒ ÁN TỐT NGHIỆP ĐẠI HỌCH BÁCH KHOA
            </h1>

            <h3 className="text-tuyn-gray mb-2 text-sm">
              Năm học: 2024-2025
            </h3>
            <h3 className="text-tuyn-gray mb-2 text-sm">
              Lĩnh vực: Công nghệ thông tin. Hệ thống được xây dựng nhằm mục đích
              học tập và nghiên cứu, đáp ứng yêu cầu đồ án tốt nghiệp.
            </h3>
          </div>
        </section>
        <section className="flex mt-5">
          <h3 className="text-tuyn-gray mb-2 text-sm">
            © 2024 - 2025 Đại học Bách Khoa Hà Nội. All rights reserved.
          </h3>
        </section>
      </div>
    </footer>
  );
}
