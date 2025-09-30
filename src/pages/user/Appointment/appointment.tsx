import { useState } from "react";
import {
  Button,
  Card,
  DatePicker,
  Row,
  Col,
  Typography,
  Space,
  Divider,
  Spin,
  Alert,
} from "antd";
import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import AppointmentServiceCard from "./AppointmentServiceCard";
import AppointmentPetInfoForm from "./AppointmentPetInfoForm";
import { useNavigate } from "react-router-dom";
import { useCreateAppointmentMutation } from "@/store/services/appointment.service";
import { useGetActiveServicesQuery } from "@/store/services/service.service";
import { toast } from "react-hot-toast";

const { Title, Text } = Typography;

interface PetInfo {
  name: string;
  breed: string;
  species: string;
  gender: boolean;
  age: number;
  weight: number;
}

export default function Appointment() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const {
    data: servicesData,
    isLoading: isLoadingServices,
    error: servicesError,
  } = useGetActiveServicesQuery();
  const [createAppointment, { isLoading: isSubmitting }] =
    useCreateAppointmentMutation();

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [petInfo, setPetInfo] = useState<PetInfo>({
    name: "",
    breed: "",
    species: "",
    gender: true,
    age: 0,
    weight: 0,
  });
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const timeSlots = Array.from({ length: 19 }, (_, index) => {
    const hour = 9 + Math.floor(index / 2);
    const minute = (index % 2) * 30;
    return `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
  });

  const handleServiceToggle = (service: any) => {
    setSelectedServices((prev) => {
      if (prev.includes(service._id)) {
        return prev.filter((id) => id !== service._id);
      } else {
        return [...prev, service._id];
      }
    });
  };

  const totalPrice = selectedServices.reduce((total, serviceId) => {
    const service = Array.isArray(servicesData)
      ? servicesData.find((s) => s._id === serviceId)
      : null;
    return total + (service?.price || 0);
  }, 0);

  const selectedServicesData = selectedServices
    .map((serviceId) =>
      Array.isArray(servicesData)
        ? servicesData.find((s) => s._id === serviceId)
        : null
    )
    .filter(Boolean);
  const totalDuration = selectedServicesData.reduce((sum: number, s: any) => {
    return sum + (s?.duration || 0);
  }, 0);
  const endTime = (() => {
    if (!selectedTime || totalDuration <= 0) return "";
    const baseDate = selectedDate ? selectedDate : dayjs();
    const start = dayjs(`${baseDate.format("YYYY-MM-DD")} ${selectedTime}`);
    return start.add(totalDuration, "minute").format("HH:mm");
  })();

  const handleSubmit = async () => {
    if (selectedServices.length === 0) {
      toast.error("Vui lòng chọn ít nhất một dịch vụ");
      return;
    }
    if (
      !petInfo.name ||
      !petInfo.breed ||
      !petInfo.species ||
      !petInfo.age ||
      !petInfo.weight
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin thú cưng");
      return;
    }
    if (!selectedDate || !selectedTime) {
      toast.error("Vui lòng chọn ngày và giờ hẹn");
      return;
    }

    try {
      const appointmentData = {
        petInfo,
        services: selectedServices,
        date: selectedDate.format("YYYY-MM-DD"),
        time: selectedTime,
        notes,
      };

      await createAppointment(appointmentData).unwrap();
      toast.success("Đặt lịch thành công! Chúng tôi sẽ liên hệ lại với bạn.");

      setSelectedServices([]);
      setPetInfo({
        name: "",
        breed: "",
        species: "",
        gender: true,
        age: 0,
        weight: 0,
      });
      setSelectedDate(null);
      setSelectedTime("");
      setNotes("");
    } catch (error: any) {
      toast.error(error?.data?.message || "Có lỗi xảy ra, vui lòng thử lại");
    }
  };

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
          <Col xs={24} lg={14}>
            <Space direction="vertical" size="large" className="w-full">
              {step === 1 ? (
                <Card
                  title={
                    <Space>
                      <span className="text-2xl">🛠️</span>
                      Bước 1: Chọn dịch vụ
                    </Space>
                  }
                >
                  {isLoadingServices ? (
                    <div className="text-center py-8">
                      <Spin size="large" />
                      <p className="mt-4 text-gray-500">Đang tải dịch vụ...</p>
                    </div>
                  ) : servicesError ? (
                    <Alert
                      message="Lỗi tải dịch vụ"
                      description="Không thể tải danh sách dịch vụ. Vui lòng thử lại sau."
                      type="error"
                      showIcon
                    />
                  ) : (
                    <Space
                      direction="vertical"
                      size="middle"
                      className="w-full"
                    >
                      {Array.isArray(servicesData) &&
                      servicesData.length > 0 ? (
                        servicesData.map((service) => (
                          <AppointmentServiceCard
                            key={service._id}
                            service={service}
                            isSelected={selectedServices.includes(service._id)}
                            onToggle={handleServiceToggle}
                          />
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <div className="text-4xl text-gray-300 mb-2">🛠️</div>
                          <p className="text-gray-500">Không có dịch vụ nào</p>
                        </div>
                      )}
                    </Space>
                  )}

                  <div className="mt-6 flex justify-end">
                    <Button
                      type="primary"
                      size="large"
                      onClick={() => setStep(2)}
                      disabled={selectedServices.length === 0}
                    >
                      Tiếp tục
                    </Button>
                  </div>
                </Card>
              ) : (
                <>
                  <AppointmentPetInfoForm
                    petInfo={petInfo}
                    onPetInfoChange={setPetInfo}
                  />

                  <Card
                    title={
                      <Space>
                        <span className="text-2xl">📅</span>
                        Bước 2: Chọn ngày và giờ
                      </Space>
                    }
                  >
                    <Space
                      direction="vertical"
                      size="middle"
                      className="w-full"
                    >
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
                              type={
                                selectedTime === time ? "primary" : "default"
                              }
                              size="small"
                              onClick={() => setSelectedTime(time)}
                              disabled={!selectedDate}
                              icon={<ClockCircleOutlined />}
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                        {selectedTime && totalDuration > 0 ? (
                          <div className="mt-3 text-sm text-gray-600">
                            Dự kiến: <strong>{selectedTime}</strong> -{" "}
                            <strong>{endTime}</strong> ({totalDuration} phút)
                          </div>
                        ) : null}
                      </div>
                    </Space>
                  </Card>

                  <div className="mt-2 flex justify-between">
                    <Button onClick={() => setStep(1)}>Quay lại</Button>
                    <Button
                      type="primary"
                      size="large"
                      onClick={async () => {
                        if (selectedServices.length === 0) {
                          toast.error("Vui lòng chọn ít nhất một dịch vụ");
                          return;
                        }
                        if (
                          !petInfo.name ||
                          !petInfo.breed ||
                          !petInfo.species ||
                          !petInfo.age ||
                          !petInfo.weight
                        ) {
                          toast.error(
                            "Vui lòng điền đầy đủ thông tin thú cưng"
                          );
                          return;
                        }
                        if (!selectedDate || !selectedTime) {
                          toast.error("Vui lòng chọn ngày và giờ hẹn");
                          return;
                        }
                        try {
                          const appointmentData = {
                            petInfo,
                            services: selectedServices,
                            date: selectedDate.format("YYYY-MM-DD"),
                            time: selectedTime,
                            notes,
                          };
                          const created = await createAppointment(
                            appointmentData
                          ).unwrap();
                          const createdAppointment =
                            (created as any)?.data ?? created;
                          const createdId = createdAppointment?._id;
                          navigate(
                            createdId
                              ? `/payment?appointmentId=${createdId}`
                              : "/payment?mode=appointment",
                            {
                              state: {
                                source: "appointment",
                                appointment: createdAppointment,
                                services: selectedServicesData,
                                totalPrice,
                                date: selectedDate.format("YYYY-MM-DD"),
                                time: selectedTime,
                              },
                            }
                          );
                        } catch (error: any) {
                          toast.error(
                            error?.data?.message ||
                              "Có lỗi xảy ra, vui lòng thử lại"
                          );
                        }
                      }}
                      disabled={
                        selectedServices.length === 0 ||
                        !petInfo.name ||
                        !petInfo.breed ||
                        !petInfo.species ||
                        !petInfo.age ||
                        !petInfo.weight ||
                        !selectedDate ||
                        !selectedTime ||
                        isSubmitting
                      }
                      loading={isSubmitting}
                    >
                      Đặt lịch & Thanh toán
                    </Button>
                  </div>
                </>
              )}
            </Space>
          </Col>
          <Col xs={24} lg={10}>
            <Card title="Tóm tắt đặt lịch" className="sticky top-4">
              <Space direction="vertical" size="middle" className="w-full">
                {selectedServicesData.length > 0 && (
                  <div>
                    <Text strong className="block mb-2">
                      Dịch vụ đã chọn ({selectedServicesData.length})
                    </Text>
                    <Space direction="vertical" size="small" className="w-full">
                      {selectedServicesData.map((service) => (
                        <div
                          key={service?._id}
                          className="flex justify-between items-center"
                        >
                          <div>
                            <Text strong>{service?.name}</Text>
                            <br />
                            <Text type="secondary" className="text-xs">
                              {service?.duration} phút
                            </Text>
                          </div>
                          <Text strong className="text-blue-600">
                            {service?.price.toLocaleString("vi-VN")} ₫
                          </Text>
                        </div>
                      ))}
                    </Space>
                    <Divider />
                  </div>
                )}

                {petInfo.name && (
                  <div>
                    <Text strong className="block mb-2">
                      Thông tin thú cưng
                    </Text>
                    <div className="space-y-1">
                      <Text className="block">
                        <strong>Tên:</strong> {petInfo.name}
                      </Text>
                      <Text className="block">
                        <strong>Giống:</strong> {petInfo.breed}
                      </Text>
                      <Text className="block">
                        <strong>Loài:</strong> {petInfo.species}
                      </Text>
                      <Text className="block">
                        <strong>Tuổi:</strong> {petInfo.age} tháng
                      </Text>
                      <Text className="block">
                        <strong>Cân nặng:</strong> {petInfo.weight} kg
                      </Text>
                    </div>
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
                      {totalDuration > 0 && endTime ? (
                        <>
                          {" "}
                          - kết thúc {endTime} ({totalDuration} phút)
                        </>
                      ) : null}
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
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
