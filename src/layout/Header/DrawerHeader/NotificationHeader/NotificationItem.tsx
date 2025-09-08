import { INotification } from "@/types";

interface NotificationItemProps {
  notification: INotification;
  onClick?: () => void;
}

const getTypeLabel = (type: string) => {
  switch (type) {
    case "order":
      return "Đơn hàng";
    case "product":
      return "Sản phẩm";
    case "appointment":
      return "Lịch hẹn";
    case "promotion":
      return "Khuyến mãi";
    case "health":
      return "Sức khỏe";
    case "delivery":
      return "Giao hàng";
    default:
      return "Thông báo";
  }
};

export default function NotificationItem({
  notification,
  onClick,
}: NotificationItemProps) {
  const formatTime = (date: Date | string) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInMinutes = Math.floor(
      (now.getTime() - notificationDate.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Vừa xong";
    if (diffInMinutes < 60) return `${diffInMinutes}p trước`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h trước`;
    return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
  };

  return (
    <div
      onClick={onClick}
      className="gap-2 p-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer relative"
    >
      <div>
        <span className="p-0.5 rounded-md bg-orange-300 text-white text-xs font-medium">
          {getTypeLabel(notification.type)}
        </span>
      </div>
      <div className="flex items-start ">
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm leading-snug mb-1 ${
              !notification.isRead
                ? "text-gray-900 font-medium"
                : "text-gray-700"
            }`}
          >
            {notification.message}
          </p>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {formatTime(notification.createdAt || "")}
            </span>
          </div>
        </div>

        {!notification.isRead && (
          <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
        )}
      </div>
    </div>
  );
}
