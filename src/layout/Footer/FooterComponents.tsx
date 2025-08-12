import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import Logo from "@/assets/logo.png";

export default function FooterComponents() {
  return (
    <footer className="text-white" style={{ background: "#001529" }}>
      <div className="max-w-7xl mx-auto py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center space-x-3">
            <img
              src={Logo}
              alt="Pet Store"
              width={48}
              height={48}
              className="rounded-full bg-white p-1"
            />
            <div>
              <p className="text-xl font-bold">Pet Store</p>
              <p className="text-sm">Chăm sóc thú cưng của bạn</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6">
            Chúng tôi cung cấp thú cưng khỏe mạnh, sản phẩm chất lượng và dịch
            vụ chăm sóc tận tâm.
          </p>

          <div className="flex items-center space-x-3">
            {[
              { href: "#", icon: <FaFacebookF size={16} /> },
              { href: "#", icon: <FaInstagram size={16} /> },
              { href: "#", icon: <FaTiktok size={16} /> },
            ].map((item, index) => (
              <div
                key={index}
                className="rounded-full bg-white transition-all duration-300 transform hover:scale-110 hover:bg-gray-200 shadow-md"
              >
                <a
                  href={item.href}
                  aria-label="Social Link"
                  className="flex items-center justify-center w-8 h-8 rounded-full text-white"
                >
                  {item.icon}
                </a>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-lg font-semibold">Khám phá</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <Link to="/" className="hover:text-amber-600 transition-colors">
                Trang chủ
              </Link>
            </li>
            <li>
              <Link
                to="/pets"
                className="hover:text-amber-600 transition-colors"
              >
                Thú cưng
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className="hover:text-amber-600 transition-colors"
              >
                Sản phẩm
              </Link>
            </li>
            <li>
              <Link
                to="/appointments"
                className="hover:text-amber-600 transition-colors"
              >
                Lịch hẹn
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-lg font-semibold">Hỗ trợ</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <Link
                to="/about"
                className="text-white hover:text-amber-600 transition-colors"
              >
                Về chúng tôi
              </Link>
            </li>
            <li>
              <Link
                to="/policy/warranty"
                className="text-white hover:text-amber-600 transition-colors"
              >
                Chính sách bảo hành
              </Link>
            </li>
            <li>
              <Link
                to="/policy/return"
                className="text-white hover:text-amber-600 transition-colors"
              >
                Chính sách đổi trả
              </Link>
            </li>
            <li>
              <Link
                to="/policy/privacy"
                className="text-white hover:text-amber-600 transition-colors"
              >
                Chính sách bảo mật
              </Link>
            </li>
            <li>
              <Link
                to="/faq"
                className="text-white hover:text-amber-600 transition-colors"
              >
                Câu hỏi thường gặp
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-lg font-semibold">Liên hệ</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start space-x-3">
              <FiMapPin className="mt-0.5 text-amber-400" size={18} />
              <span>123 Đường ABC, Quận XYZ, TP.HCM</span>
            </li>
            <li className="flex items-start space-x-3">
              <FiPhone className="mt-0.5 text-amber-400" size={18} />
              <a
                href="tel:0123456789"
                className="text-white hover:text-amber-600 transition-colors"
              >
                0123 456 789
              </a>
            </li>
            <li className="flex items-start space-x-3">
              <FiMail className="mt-0.5 text-amber-400" size={18} />
              <a
                href="mailto:contact@petstore.vn"
                className="text-white hover:text-amber-600 transition-colors"
              >
                contact@petstore.vn
              </a>
            </li>
          </ul>

          <div className="mt-5">
            <p className="text-sm font-medium">Nhận bản tin ưu đãi</p>
            <form
              className="mt-3 flex items-center bg-white/10 rounded-lg overflow-hidden"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="w-full bg-transparent placeholder-white/60 text-white text-sm px-3 py-2 focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium transition-colors"
              >
                Đăng ký
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 ">
          <h2 className="text-center">
            © {new Date().getFullYear()} Pet Store. All rights reserved.
          </h2>
        </div>
      </div>
    </footer>
  );
}
