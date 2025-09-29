import { useState } from "react";
import CustomInput from "@/components/Input/Input";
import { Container } from "@mui/material";
import { Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { IoEyeSharp } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa";
import { toast } from "react-hot-toast";
import axiosInterceptor from "@/utils/authorAxios";

export default function Register() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    try {
      if (!displayName || !email || !password || !confirmPassword) {
        toast.error("Please fill in all fields");
        return;
      }
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      setIsLoading(true);

      const response = await axiosInterceptor.post("/auth/register", {
        name: displayName,
        email,
        password,
      });

      if (response.data.status === "Success") {
        toast.success("Tài khoản đã được tạo, vui lòng đăng nhập!");
        setTimeout(() => {
          navigate("/auth/login");
        }, 500);
      } else {
        toast.error(response.data.message || "Registration failed");
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || "Registration failed";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Container
        maxWidth="sm"
        className="rounded-2xl shadow-xl p-8 bg-white border border-gray-200"
      >
        <Typography
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "0.5rem",
            color: "#1e293b",
          }}
        >
          Pet Store register
        </Typography>
        <h3 className="text-center text-gray-500 mb-8">REGISTER</h3>

        <div className="space-y-5">
          <CustomInput
            icon={<UserOutlined />}
            placeholder="Full name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            type="text"
          />

          <CustomInput
            icon={<UserOutlined />}
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />

          <CustomInput
            icon={<LockOutlined />}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
            rightIcon={
              showPassword ? <IoEyeSharp size={20} /> : <FaEyeSlash size={20} />
            }
            onRightIconClick={() => setShowPassword((prev) => !prev)}
          />

          <CustomInput
            icon={<LockOutlined />}
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type={showConfirm ? "text" : "password"}
            rightIcon={
              showConfirm ? <IoEyeSharp size={20} /> : <FaEyeSlash size={20} />
            }
            onRightIconClick={() => setShowConfirm((prev) => !prev)}
          />

          <button
            onClick={handleRegister}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md transition duration-200 font-medium disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/auth/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </div>
      </Container>
    </div>
  );
}
