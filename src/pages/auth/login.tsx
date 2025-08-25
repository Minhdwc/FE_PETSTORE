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

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        toast.error("Please fill in all fields");
        return;
      }

      setIsLoading(true);

      const response = await axiosInterceptor.post("/auth/login", {
        email,
        password,
      });

      if (response.data.status === "Success") {
        const { accessToken, refreshToken } = response.data.data;

        // Store tokens
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        toast.success("Login successful");
        setTimeout(() => {
          navigate("/");
        }, 500);
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || "Login failed";
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
          Pet Store login
        </Typography>
        <h3 className="text-center text-gray-500 mb-8">LOGIN</h3>

        <div className="space-y-5">
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
            type={show ? "text" : "password"}
            rightIcon={
              show ? <IoEyeSharp size={20} /> : <FaEyeSlash size={20} />
            }
            onRightIconClick={() => setShow((prev) => !prev)}
          />

          <div className="text-right">
            <Link
              to="/auth/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md transition duration-200 font-medium disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link to="/auth/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </div>
      </Container>
    </div>
  );
}
