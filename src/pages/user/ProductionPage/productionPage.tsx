import { useParams, useNavigate } from "react-router-dom";
import { useGetProductionDetailQuery } from "@/store/services/production.service";
import { toast } from "react-hot-toast";
import { Button, Card, Row, Col } from "antd";
import {
  SafetyCertificateOutlined,
  CarOutlined,
  CreditCardOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

export default function ProductionPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useGetProductionDetailQuery(
    id as string,
    { skip: !id }
  );

  if (!id) {
    return <div className="p-4">ID sản phẩm không hợp lệ</div>;
  }

  if (isLoading) {
    return <div className="p-4 text-blue-600">Đang tải thông tin...</div>;
  }

  if (isError) {
    const message =
      (error as any)?.data?.message || "Không thể tải thông tin sản phẩm";
    toast.error(message);
    return (
      <div className="p-4">
        <p className="text-red-600 mb-2">{message}</p>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
          onClick={() => navigate(-1)}
        >
          Quay lại
        </button>
      </div>
    );
  }

  const product = data?.data;

  if (!product) {
    return <div className="p-4">Không tìm thấy sản phẩm</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex justify-center items-center">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full max-w-md h-auto rounded-xl shadow-md object-cover"
            />
          </div>

          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-slate-800">
              {product.name}
            </h1>
            <p className="text-slate-600 mb-6">
              {product.description || "Chưa có mô tả"}
            </p>

            <div className="space-y-3 mb-8">
              {product.brand && (
                <p>
                  <span className="font-semibold text-slate-700">
                    Thương hiệu:
                  </span>{" "}
                  {product.brand}
                </p>
              )}
              {product.category && (
                <p>
                  <span className="font-semibold text-slate-700">
                    Danh mục:
                  </span>{" "}
                  {product.category}
                </p>
              )}
              {product.stock !== undefined && (
                <p>
                  <span className="font-semibold text-slate-700">Tồn kho:</span>{" "}
                  {product.stock}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-blue-700">
                {typeof product.price === "number"
                  ? `${product.price.toLocaleString("vi-VN")} ₫`
                  : "Liên hệ"}
              </div>
              <Button type="primary" size="large">
                Thêm vào giỏ hàng
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Card title="Chính sách & Cam kết" className="shadow-md rounded-xl">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card bordered={false} className="text-center">
              <SafetyCertificateOutlined className="text-3xl text-green-600 mb-2" />
              <p>Sản phẩm chính hãng</p>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card bordered={false} className="text-center">
              <CarOutlined className="text-3xl text-blue-600 mb-2" />
              <p>Giao hàng nhanh</p>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card bordered={false} className="text-center">
              <CreditCardOutlined className="text-3xl text-purple-600 mb-2" />
              <p>Thanh toán linh hoạt</p>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card bordered={false} className="text-center">
              <FileTextOutlined className="text-3xl text-orange-600 mb-2" />
              <p>Hóa đơn đầy đủ</p>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
