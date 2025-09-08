import { useGetNotificationsByUserQuery } from "@/store/services/notification.service";
import NotificationItem from "./NotificationItem";
import { BellOutlined, CheckCircleOutlined } from "@ant-design/icons";

type NotificationProps = {
  isOpen: boolean;
};

export default function Notification({ isOpen }: NotificationProps) {
  const accessToken = localStorage.getItem("accessToken");
  const { data, isFetching, isError } = useGetNotificationsByUserQuery(
    { page: 1, limit: 10 },
    { skip: !isOpen || !accessToken }
  );

  if (!accessToken) {
    return (
      <div className="p-6 text-center">
        <BellOutlined className="text-4xl text-gray-300 mb-3" />
        <div className="text-sm text-gray-500">
          Vui lòng đăng nhập để xem thông báo.
        </div>
      </div>
    );
  }

  if (isFetching) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
        <div className="text-sm text-gray-500">Đang tải thông báo...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-500 mb-3">
          <svg
            className="w-8 h-8 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="text-sm text-red-500">
          Không thể tải thông báo. Vui lòng thử lại.
        </div>
      </div>
    );
  }

  const notifications = data?.data || [];

  if (!notifications.length) {
    return (
      <div className="p-6 text-center">
        <CheckCircleOutlined className="text-4xl text-green-300 mb-3" />
        <div className="text-sm text-gray-500">Chưa có thông báo nào.</div>
        <div className="text-xs text-gray-400 mt-1">
          Tất cả thông báo đã được xem!
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-end-safe space-x-2">
        <button className="text-xs text-blue-600 cursor-pointer hover:text-blue-800 hover:underline">
          Đánh dấu tất cả đã đọc
        </button>
      </div>{" "}
      <div className="space-y-3  overflow-y-auto">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification._id}
            notification={notification}
          />
        ))}
      </div>
    </div>
  );
}
