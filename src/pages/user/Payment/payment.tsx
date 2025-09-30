import React from "react";
import {
  Card,
  Form,
  Input,
  Radio,
  Select,
  Divider,
  Button,
  Typography,
  List,
} from "antd";
import { useLocation } from "react-router-dom";
import { useGetCartByUserQuery } from "@/store/services/cart.service";
import { useGetAppointmentByIdQuery } from "@/store/services/appointment.service";
import { useGetActiveServicesQuery } from "@/store/services/service.service";
import { useGetPetDetailQuery } from "@/store/services/pet.service";
import { useGetProductionDetailQuery } from "@/store/services/production.service";

function CartItemRow({ item }: { item: any }) {
  const isPet = item?.itemType === "Pet";
  const { data: petDetail } = useGetPetDetailQuery(item?.itemId as string, {
    skip: !isPet || !item?.itemId,
  });
  const { data: productionDetail } = useGetProductionDetailQuery(
    item?.itemId as string,
    {
      skip: isPet || !item?.itemId,
    }
  );
  const name = isPet
    ? (petDetail as any)?.data?.name || (petDetail as any)?.name || item?.itemId
    : (productionDetail as any)?.data?.name ||
      (productionDetail as any)?.name ||
      item?.itemId;
  const lineTotal = (item?.price || 0) * (item?.quantity || 1);
  return (
    <div className="w-full flex justify-between text-sm">
      <span className="truncate mr-2">{name}</span>
      <span>x{item?.quantity}</span>
      <span>{lineTotal.toLocaleString()}₫</span>
    </div>
  );
}

export default function payment() {
  const [form] = Form.useForm();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const appointmentId = searchParams.get("appointmentId") || undefined;
  const modeParam = searchParams.get("mode");
  const navSource = (location.state as any)?.source;
  const stateAppointment = (location.state as any)?.appointment;
  const servicesFromState = (location.state as any)?.services || [];
  const isAppointment =
    Boolean(appointmentId) ||
    modeParam === "appointment" ||
    navSource === "appointment";

  const { data: cartPage } = useGetCartByUserQuery(
    { page: 1, limit: 100 },
    { skip: isAppointment }
  );
  const { data: appointmentFromApi } = useGetAppointmentByIdQuery(
    appointmentId as string,
    { skip: !isAppointment || !appointmentId }
  );
  const appointment = stateAppointment || appointmentFromApi;
  const { data: activeServices } = useGetActiveServicesQuery(undefined, {
    skip: !isAppointment,
  });
  const selectedServiceIds: string[] = Array.isArray(
    (appointment as any)?.services
  )
    ? (appointment as any).services
    : [];
  const selectedServicesFromActive = Array.isArray(activeServices)
    ? activeServices.filter((s: any) => selectedServiceIds.includes(s._id))
    : [];
  const selectedServices =
    servicesFromState.length > 0
      ? servicesFromState
      : selectedServicesFromActive;
  const mode = isAppointment ? "appointment" : "cart";
  const cart = cartPage?.data?.[0];
  const cartItems = cart?.items || [];
  const cartSubtotal =
    cart?.totalPrice ||
    cartItems.reduce(
      (sum: number, it: any) => sum + (it.price || 0) * (it.quantity || 1),
      0
    );

  const appointmentPriceFromServices = Array.isArray(selectedServices)
    ? selectedServices.reduce((sum: number, s: any) => sum + (s?.price || 0), 0)
    : 0;
  const appointmentPrice =
    (appointment as any)?.price ||
    (location.state as any)?.totalPrice ||
    appointmentPriceFromServices ||
    0;
  const shippingFee = isAppointment ? 0 : 0;
  const discount = 0;
  const grandTotal = isAppointment
    ? appointmentPrice - discount
    : cartSubtotal + shippingFee - discount;

  const handleSubmit = (values: any) => {
    const payload = {
      mode,
      contact: {
        fullName: values.fullName,
        phone: values.phone,
        email: values.email,
      },
      address: isAppointment
        ? undefined
        : {
            province: values.province,
            district: values.district,
            ward: values.ward,
            address: values.address,
          },
      payment: {
        method: values.paymentMethod,
        card:
          values.paymentMethod === "card"
            ? {
                name: values.cardName,
                number: values.cardNumber,
                expiry: values.expiry,
                cvc: values.cvc,
              }
            : undefined,
      },
      items: isAppointment
        ? [
            {
              type: "service",
              id: (appointment as any)?._id,
              price: appointmentPrice,
            },
          ]
        : cartItems,
      totals: {
        subtotal: isAppointment ? appointmentPrice : cartSubtotal,
        shipping: shippingFee,
        discount,
        grandTotal,
      },
    };
    console.log("Payment submit:", payload);
  };

  return (
    <div className="py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Thông tin liên hệ">
            <Form layout="vertical" form={form} onFinish={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="fullName"
                  label="Họ và tên"
                  rules={[
                    { required: true, message: "Vui lòng nhập họ và tên" },
                  ]}
                >
                  <Input placeholder="Ví dụ: Nguyễn Văn A" />
                </Form.Item>
                <Form.Item
                  name="phone"
                  label="Số điện thoại"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại" },
                  ]}
                >
                  <Input placeholder="0123 456 789" />
                </Form.Item>
              </div>

              <Form.Item
                name="email"
                label="Email"
                rules={[{ type: "email", message: "Email không hợp lệ" }]}
              >
                <Input placeholder="email@domain.com" />
              </Form.Item>

              {!isAppointment && (
                <>
                  <Divider />

                  <Typography.Title level={5} style={{ marginTop: 0 }}>
                    Địa chỉ giao hàng
                  </Typography.Title>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Form.Item
                      name="province"
                      label="Tỉnh/Thành"
                      rules={[{ required: true, message: "Chọn tỉnh/thành" }]}
                    >
                      <Select placeholder="Chọn tỉnh/thành">
                        <Select.Option value="hanoi">Hà Nội</Select.Option>
                        <Select.Option value="hcm">
                          TP. Hồ Chí Minh
                        </Select.Option>
                        <Select.Option value="danang">Đà Nẵng</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="district"
                      label="Quận/Huyện"
                      rules={[{ required: true, message: "Chọn quận/huyện" }]}
                    >
                      <Select placeholder="Chọn quận/huyện">
                        <Select.Option value="quan1">Quận 1</Select.Option>
                        <Select.Option value="quan3">Quận 3</Select.Option>
                        <Select.Option value="tanbinh">Tân Bình</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="ward"
                      label="Phường/Xã"
                      rules={[{ required: true, message: "Chọn phường/xã" }]}
                    >
                      <Select placeholder="Chọn phường/xã">
                        <Select.Option value="phuong1">Phường 1</Select.Option>
                        <Select.Option value="phuong2">Phường 2</Select.Option>
                        <Select.Option value="phuong3">Phường 3</Select.Option>
                      </Select>
                    </Form.Item>
                  </div>

                  <Form.Item
                    name="address"
                    label="Địa chỉ cụ thể"
                    rules={[{ required: true, message: "Nhập địa chỉ cụ thể" }]}
                  >
                    <Input placeholder="Số nhà, đường, ..." />
                  </Form.Item>
                </>
              )}

              <Divider />

              <Typography.Title level={5} style={{ marginTop: 0 }}>
                Phương thức thanh toán
              </Typography.Title>
              <Form.Item
                name="paymentMethod"
                initialValue={isAppointment ? "card" : "cod"}
              >
                <Radio.Group className="flex flex-col gap-2">
                  <Radio value="cod" disabled={isAppointment}>
                    Thanh toán khi nhận hàng (COD)
                  </Radio>
                  <Radio value="card">Thẻ ngân hàng / Thẻ tín dụng</Radio>
                </Radio.Group>
              </Form.Item>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="cardName"
                  label="Tên chủ thẻ"
                  dependencies={["paymentMethod"]}
                >
                  <Input placeholder="Nhập tên in trên thẻ" />
                </Form.Item>
                <Form.Item
                  name="cardNumber"
                  label="Số thẻ"
                  dependencies={["paymentMethod"]}
                >
                  <Input placeholder="1234 5678 9012 3456" maxLength={19} />
                </Form.Item>
                <Form.Item
                  name="expiry"
                  label="Hết hạn (MM/YY)"
                  dependencies={["paymentMethod"]}
                >
                  <Input placeholder="MM/YY" maxLength={5} />
                </Form.Item>
                <Form.Item
                  name="cvc"
                  label="CVC"
                  dependencies={["paymentMethod"]}
                >
                  <Input placeholder="CVC" maxLength={4} />
                </Form.Item>
              </div>

              <div className="flex justify-end">
                <Button type="primary" htmlType="submit" size="large">
                  {isAppointment ? "Thanh toán dịch vụ" : "Xác nhận thanh toán"}
                </Button>
              </div>
            </Form>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card
            title={
              isAppointment
                ? "Thông tin thanh toán dịch vụ"
                : "Tóm tắt đơn hàng"
            }
          >
            <div className="space-y-4">
              {isAppointment ? (
                <>
                  <div className="text-sm text-gray-700">
                    <div className="flex justify-between">
                      <span>Dịch vụ</span>
                      <span>
                        {Array.isArray(selectedServices) &&
                        selectedServices.length > 0
                          ? `${selectedServices.length} dịch vụ`
                          : (appointment as any)?.categoryAppointment || "-"}
                      </span>
                    </div>
                    {Array.isArray(selectedServices) &&
                      selectedServices.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {selectedServices.map((s: any) => (
                            <div key={s?._id} className="flex justify-between">
                              <span className="truncate mr-2">{s?.name}</span>
                              <span className="text-gray-500 text-xs">
                                {s?.duration ? `${s.duration} phút` : ""}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    <div className="flex justify-between mt-2">
                      <span>Thú cưng</span>
                      <span>{(appointment as any)?.petInfo?.name || "-"}</span>
                    </div>
                  </div>
                  <Divider style={{ margin: "8px 0" }} />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tạm tính</span>
                    <span>{appointmentPrice.toLocaleString()}₫</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Giảm giá</span>
                    <span>{discount.toLocaleString()}₫</span>
                  </div>
                  <Divider style={{ margin: "8px 0" }} />
                  <div className="flex justify-between font-semibold text-base">
                    <span>Thành tiền</span>
                    <span>{grandTotal.toLocaleString()}₫</span>
                  </div>
                  <Button type="primary" block size="large" className="mt-2">
                    Thanh toán ngay
                  </Button>
                </>
              ) : (
                <>
                  <List
                    size="small"
                    dataSource={cartItems}
                    renderItem={(item: any) => (
                      <List.Item>
                        <CartItemRow item={item} />
                      </List.Item>
                    )}
                  />
                  <Divider style={{ margin: "8px 0" }} />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tạm tính</span>
                    <span>{cartSubtotal.toLocaleString()}₫</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Phí vận chuyển</span>
                    <span>{shippingFee.toLocaleString()}₫</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Giảm giá</span>
                    <span>{discount.toLocaleString()}₫</span>
                  </div>
                  <Divider style={{ margin: "8px 0" }} />
                  <div className="flex justify-between font-semibold text-base">
                    <span>Thành tiền</span>
                    <span>{grandTotal.toLocaleString()}₫</span>
                  </div>
                  <Button type="primary" block size="large" className="mt-2">
                    Thanh toán
                  </Button>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
