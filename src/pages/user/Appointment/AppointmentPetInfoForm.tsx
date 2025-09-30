import { Input, Select, Row, Col, Typography, Space, Card } from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  ExperimentOutlined,
} from "@ant-design/icons";

const { Text } = Typography;
const { Option } = Select as any;

export interface AppointmentPetInfo {
  name: string;
  breed: string;
  species: string;
  gender: boolean;
  age: number;
  weight: number;
}

interface AppointmentPetInfoFormProps {
  petInfo: AppointmentPetInfo;
  onPetInfoChange: (petInfo: AppointmentPetInfo) => void;
}

export default function AppointmentPetInfoForm({
  petInfo,
  onPetInfoChange,
}: AppointmentPetInfoFormProps) {
  const handleChange = (field: keyof AppointmentPetInfo, value: any) => {
    onPetInfoChange({ ...petInfo, [field]: value });
  };

  return (
    <Card
      title={
        <Space>
          <span className="text-2xl">🐾</span>Thông tin thú cưng
        </Space>
      }
    >
      <Space direction="vertical" size="middle" className="w-full">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <div>
              <Text strong>Tên thú cưng *</Text>
              <Input
                placeholder="Nhập tên thú cưng"
                value={petInfo.name}
                onChange={(e) => handleChange("name", e.target.value)}
                prefix={<UserOutlined />}
                className="mt-1"
              />
            </div>
          </Col>
          <Col xs={24} sm={12}>
            <div>
              <Text strong>Giống *</Text>
              <Input
                placeholder="Ví dụ: Golden Retriever, Persian"
                value={petInfo.breed}
                onChange={(e) => handleChange("breed", e.target.value)}
                className="mt-1"
              />
            </div>
          </Col>
          <Col xs={24} sm={12}>
            <div>
              <Text strong>Loài *</Text>
              <Select
                placeholder="Chọn loài"
                value={petInfo.species}
                onChange={(value) => handleChange("species", value)}
                className="w-full mt-1"
              >
                <Option value="Chó">🐕 Chó</Option>
                <Option value="Mèo">🐱 Mèo</Option>
                <Option value="Chim">🐦 Chim</Option>
                <Option value="Cá">🐠 Cá</Option>
                <Option value="Khác">🐾 Khác</Option>
              </Select>
            </div>
          </Col>
          <Col xs={24} sm={12}>
            <div>
              <Text strong>Giới tính *</Text>
              <Select
                placeholder="Chọn giới tính"
                value={petInfo.gender}
                onChange={(value) => handleChange("gender", value)}
                className="w-full mt-1"
              >
                <Option value={true}>♂ Đực</Option>
                <Option value={false}>♀ Cái</Option>
              </Select>
            </div>
          </Col>
          <Col xs={24} sm={12}>
            <div>
              <Text strong>Tuổi (tháng) *</Text>
              <Input
                type="number"
                placeholder="Nhập tuổi bằng tháng"
                value={petInfo.age}
                onChange={(e) =>
                  handleChange("age", parseInt(e.target.value) || 0)
                }
                prefix={<CalendarOutlined />}
                className="mt-1"
                min={1}
                max={300}
              />
            </div>
          </Col>
          <Col xs={24} sm={12}>
            <div>
              <Text strong>Cân nặng (kg) *</Text>
              <Input
                type="number"
                placeholder="Nhập cân nặng"
                value={petInfo.weight}
                onChange={(e) =>
                  handleChange("weight", parseFloat(e.target.value) || 0)
                }
                prefix={<ExperimentOutlined />}
                className="mt-1"
                min={0.1}
                max={100}
                step={0.1}
              />
            </div>
          </Col>
        </Row>
        <div className="bg-blue-50 p-3 rounded-lg">
          <Text type="secondary" className="text-sm">
            💡 <strong>Lưu ý:</strong> Thông tin chính xác giúp chúng tôi phục
            vụ tốt hơn.
          </Text>
        </div>
      </Space>
    </Card>
  );
}
