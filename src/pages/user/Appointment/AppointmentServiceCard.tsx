import { Card, Typography, Space, Tag } from "antd";
import { IService } from "@/types";

const { Text } = Typography;

interface AppointmentServiceCardProps {
  service: IService;
  isSelected: boolean;
  onToggle: (service: IService) => void;
}

export default function AppointmentServiceCard({
  service,
  isSelected,
  onToggle,
}: AppointmentServiceCardProps) {
  return (
    <Card
      hoverable
      onClick={() => onToggle(service)}
      className={`${isSelected ? "border-blue-500" : "border-transparent"}`}
      bodyStyle={{ padding: 16 }}
    >
      <Space direction="vertical" size={4} className="w-full">
        <div className="flex justify-between items-center">
          <Text strong>{service.name}</Text>
          {service.duration ? (
            <Tag color="blue">{service.duration} phút</Tag>
          ) : null}
        </div>
        {service.description ? (
          <Text type="secondary" className="line-clamp-2">
            {service.description}
          </Text>
        ) : null}
        <Text strong className={`mt-1 ${isSelected ? "text-blue-600" : ""}`}>
          {service.price?.toLocaleString("vi-VN")} ₫
        </Text>
      </Space>
    </Card>
  );
}
