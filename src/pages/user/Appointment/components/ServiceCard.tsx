import { IAppointmentService } from "@/types/appointment";

interface ServiceCardProps {
  service: IAppointmentService;
  isSelected: boolean;
  onSelect: (service: IAppointmentService) => void;
}

export default function ServiceCard({
  service,
  isSelected,
  onSelect,
}: ServiceCardProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "grooming":
        return "🛁";
      case "health":
        return "🏥";
      case "training":
        return "🎓";
      default:
        return "🐾";
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case "grooming":
        return "Tắm rửa & Chăm sóc";
      case "health":
        return "Kiểm tra sức khỏe";
      case "training":
        return "Huấn luyện";
      default:
        return "Dịch vụ khác";
    }
  };

  return (
    <div
      className={`cursor-pointer rounded-xl border-2 p-4 transition-all hover:shadow-lg ${
        isSelected
          ? "border-blue-500 bg-blue-50 shadow-md"
          : "border-gray-200 bg-white hover:border-blue-300"
      }`}
      onClick={() => onSelect(service)}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl">{getCategoryIcon(service.category)}</div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {service.name}
            </h3>
            <span className="text-sm font-medium text-blue-600">
              {service.price.toLocaleString("vi-VN")} ₫
            </span>
          </div>

          <p className="mt-1 text-sm text-gray-600">
            {getCategoryName(service.category)}
          </p>

          <p className="mt-2 text-sm text-gray-500">{service.description}</p>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-gray-400">
              ⏱️ {service.duration} phút
            </span>
            {isSelected && (
              <span className="text-xs font-medium text-blue-600">
                ✓ Đã chọn
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
