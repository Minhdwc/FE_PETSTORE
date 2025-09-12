import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
      }}
    >
      <Result
        status="404"
        title="404"
        subTitle="Xin lỗi, trang bạn đang tìm không tồn tại."
        extra={
          <Button type="primary" onClick={() => navigate("/")}>
            Quay lại Trang chủ
          </Button>
        }
      />
    </div>
  );
}
