import { useState } from "react";
import {
  Button,
  Card,
  Input,
  DatePicker,
  Row,
  Col,
  Typography,
  Space,
  Divider,
} from "antd";
import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import ServiceCard from "@/components/ServiceCard";
import PetSelector from "@/components/PetSelector";
import { IPet } from "@/types";
import { toast } from "react-hot-toast";

const { TextArea } = Input;
const { Title, Text } = Typography;

// Mock data for services
const services = [
  {
    id: "1",
    name: "Tắm rửa & Cắt tỉa lông",
    description:
      "Dịch vụ tắm rửa, cắt tỉa lông và chăm sóc cơ bản cho thú cưng",
    price: 150000,
    duration: 60,
    category: "grooming" as const,
    icon: "🛁",
  },
  {
    id: "2",
    name: "Kiểm tra sức khỏe tổng quát",
    description: "Khám sức khỏe định kỳ, tiêm phòng và tư vấn dinh dưỡng",
    price: 300000,
    duration: 45,
    category: "health" as const,
    icon: "🏥",
  },
  {
    id: "3",
    name: "Huấn luyện cơ bản",
    description: "Huấn luyện các lệnh cơ bản và hành vi tốt cho thú cưng",
    price: 200000,
    duration: 90,
    category: "training" as const,
    icon: "🎓",
  },
  {
    id: "4",
    name: "Chăm sóc răng miệng",
    description: "Vệ sinh răng miệng và kiểm tra sức khỏe răng",
    price: 100000,
    duration: 30,
    category: "health" as const,
    icon: "🦷",
  },
];

// Mock data for pets
const mockPets: IPet[] = [
  {
    _id: "1",
    name: "Buddy",
    species: "Chó",
    breed: "Golden Retriever",
    age: 3,
    image_url: "",
    status: "available",
  },
  {
    _id: "2",
    name: "Whiskers",
    species: "Mèo",
    breed: "Persian",
    age: 2,
    image_url: "",
    status: "available",
  },
];

export default function Appointment() {
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedPet, setSelectedPet] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
  ];

  const handleSubmit = async () => {
    if (!selectedService || !selectedPet || !selectedDate || !selectedTime) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Đặt lịch thành công! Chúng tôi sẽ liên hệ lại với bạn.");

      // Reset form
      setSelectedService(null);
      setSelectedPet("");
      setSelectedDate(null);
      setSelectedTime("");
      setNotes("");
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPrice = selectedService ? selectedService.price : 0;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Title level={1} className="mb-2">
            Đặt lịch hẹn cho thú cưng
          </Title>
          <Text className="text-gray-600">
            Chọn dịch vụ và thời gian phù hợp để chăm sóc thú cưng của bạn
          </Text>
        </div>

        <Row gutter={[24, 24]}>
          {/* Left Column - Form */}
          <Col xs={24} lg={14}>
            <Space direction="vertical" size="large" className="w-full">
              {/* Step 1: Select Service */}
              <Card
                title={
                  <Space>
                    <span className="text-2xl">🛠️</span>
                    Bước 1: Chọn dịch vụ
                  </Space>
                }
              >
                <Space direction="vertical" size="middle" className="w-full">
                  {services.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      isSelected={selectedService?.id === service.id}
                      onSelect={setSelectedService}
                    />
                  ))}
                </Space>
              </Card>

              {/* Step 2: Select Pet */}
              <Card
                title={
                  <Space>
                    <span className="text-2xl">🐾</span>
                    Bước 2: Chọn thú cưng
                  </Space>
                }
              >
                <PetSelector
                  pets={mockPets}
                  selectedPetId={selectedPet}
                  onSelectPet={setSelectedPet}
                />
              </Card>

              {/* Step 3: Select Date & Time */}
              <Card
                title={
                  <Space>
                    <span className="text-2xl">📅</span>
                    Bước 3: Chọn ngày và giờ
                  </Space>
                }
              >
                <Space direction="vertical" size="middle" className="w-full">
                  <div>
                    <Text strong>Ngày hẹn</Text>
                    <DatePicker
                      className="w-full mt-2"
                      value={selectedDate}
                      onChange={setSelectedDate}
                      disabledDate={(date) =>
                        date && date < dayjs().startOf("day")
                      }
                      placeholder="Chọn ngày"
                      format="DD/MM/YYYY"
                      suffixIcon={<CalendarOutlined />}
                    />
                  </div>

                  <div>
                    <Text strong>Giờ hẹn</Text>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {timeSlots.map((time) => (
                        <Button
                          key={time}
                          type={selectedTime === time ? "primary" : "default"}
                          size="small"
                          onClick={() => setSelectedTime(time)}
                          disabled={!selectedDate}
                          icon={<ClockCircleOutlined />}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                </Space>
              </Card>

              {/* Step 4: Notes */}
              <Card
                title={
                  <Space>
                    <span className="text-2xl">📝</span>
                    Bước 4: Ghi chú thêm
                  </Space>
                }
              >
                <TextArea
                  placeholder="Nhập ghi chú hoặc yêu cầu đặc biệt..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </Card>
            </Space>
          </Col>

          {/* Right Column - Summary */}
          <Col xs={24} lg={10}>
            <Card title="Tóm tắt đặt lịch" className="sticky top-4">
              <Space direction="vertical" size="middle" className="w-full">
                {selectedService && (
                  <div>
                    <Text strong className="block mb-2">
                      Dịch vụ đã chọn
                    </Text>
                    <Space>
                      <span className="text-2xl">{selectedService.icon}</span>
                      <div>
                        <Text strong>{selectedService.name}</Text>
                        <br />
                        <Text type="secondary">
                          {selectedService.duration} phút
                        </Text>
                      </div>
                      <div className="ml-auto">
                        <Text strong className="text-blue-600">
                          {selectedService.price.toLocaleString("vi-VN")} ₫
                        </Text>
                      </div>
                    </Space>
                    <Divider />
                  </div>
                )}

                {selectedPet && (
                  <div>
                    <Text strong className="block mb-2">
                      Thú cưng
                    </Text>
                    <Text>
                      {mockPets.find((pet) => pet._id === selectedPet)?.name}
                    </Text>
                    <Divider />
                  </div>
                )}

                {selectedDate && selectedTime && (
                  <div>
                    <Text strong className="block mb-2">
                      Thời gian
                    </Text>
                    <Text>
                      {selectedDate.format("DD/MM/YYYY")} lúc {selectedTime}
                    </Text>
                    <Divider />
                  </div>
                )}

                <div className="pt-4">
                  <div className="flex justify-between items-center text-lg">
                    <Text strong>Tổng cộng:</Text>
                    <Text strong className="text-blue-600">
                      {totalPrice.toLocaleString("vi-VN")} ₫
                    </Text>
                  </div>
                </div>

                <Button
                  type="primary"
                  size="large"
                  block
                  onClick={handleSubmit}
                  disabled={
                    !selectedService ||
                    !selectedPet ||
                    !selectedDate ||
                    !selectedTime ||
                    isSubmitting
                  }
                  loading={isSubmitting}
                >
                  {isSubmitting ? "Đang xử lý..." : "Đặt lịch ngay"}
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
