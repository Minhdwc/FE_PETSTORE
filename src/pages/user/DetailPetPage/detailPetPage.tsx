import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetPetDetailQuery,
  useGetpetsQuery,
} from "@/store/services/pet.service";
import {
  useGetCartByUserQuery,
  useAddToCartMutation,
  useUpdateToCartMutation,
} from "@/store/services/cart.service";
import type { IPet } from "@/types";
import CustomPetsGrid from "@/components/CustomPetsGrid/CustomPetsGrid";
import {
  Card,
  Button,
  Tag,
  Space,
  Skeleton,
  Alert,
  Divider,
  Row,
  Col,
  Typography,
  Tooltip,
  Image,
} from "antd";
import {
  FaHeart,
  FaShoppingCart,
  FaPaw,
  FaArrowLeft,
  FaShare,
  FaPhone,
  FaEnvelope,
  FaBirthdayCake,
  FaTag,
  FaEye,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

const { Title, Text, Paragraph } = Typography;

export default function DetailPetPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const {
    data: petDetail,
    isLoading,
    isError,
    refetch,
  } = useGetPetDetailQuery(id || "");
  const pet: IPet | undefined = petDetail?.data;

  const { data: relatedPetsData } = useGetpetsQuery({
    page: 1,
    limit: 4,
    species: pet?.species,
  });
  const relatedPets: IPet[] =
    relatedPetsData?.data?.filter((p) => p._id !== id) || [];

  const hasAccessToken = Boolean(localStorage.getItem("accessToken"));
  const { data: cartData } = useGetCartByUserQuery(
    { page: 1, limit: 100 },
    { skip: !hasAccessToken }
  );
  const [addToCart] = useAddToCartMutation();
  const [updateToCart] = useUpdateToCartMutation();

  const isPetInCart = (petId: string) => {
    if (!cartData?.data) return false;
    for (const cart of cartData.data) {
      if (cart.items && cart.items.some((item) => item.itemId === petId)) {
        return true;
      }
    }
    return false;
  };

  const getPetFromCart = (petId: string) => {
    if (!cartData?.data) return null;
    for (const cart of cartData.data) {
      const item = cart.items?.find((item) => item.itemId === petId);
      if (item) return { cart, item };
    }
    return null;
  };

  const handleAddToCart = async () => {
    if (!pet) return;

    try {
      setIsAddingToCart(true);
      const isAuthenticated = localStorage.getItem("accessToken");

      if (!isAuthenticated) {
        toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng");
        navigate("/auth/login");
        return;
      }

      const existingCart = cartData?.data?.[0];
      const petInCart = getPetFromCart(pet._id);

      if (existingCart) {
        if (petInCart) {
          toast.success("Thú cưng này đã có trong giỏ hàng của bạn");
          return;
        } else {
          const updatedItems = [
            ...existingCart.items,
            {
              itemId: pet._id,
              itemType: "Pet" as const,
              quantity: 1,
              price: typeof pet.price === "number" ? pet.price : 0,
            },
          ];

          await updateToCart({ items: updatedItems }).unwrap();
          toast.success("Đã thêm vào giỏ hàng!");
        }
      } else {
        const addData = {
          items: [
            {
              itemId: pet._id,
              itemType: "Pet" as const,
              quantity: 1,
              price: typeof pet.price === "number" ? pet.price : 0,
            },
          ],
          totalQuantity: 1,
          totalPrice: typeof pet.price === "number" ? pet.price : 0,
        };

        await addToCart(addData).unwrap();
        toast.success("Đã thêm vào giỏ hàng!");
      }
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      if (error?.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        localStorage.removeItem("accessToken");
        navigate("/auth/login");
      } else {
        toast.error("Không thể thêm vào giỏ hàng. Vui lòng thử lại.");
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(
      isFavorite ? "Đã xóa khỏi yêu thích" : "Đã thêm vào yêu thích"
    );
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: pet?.name,
        text: `Xem thú cưng ${pet?.name} tại Pet Store`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Đã sao chép link!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="mb-6">
            <Button
              icon={<FaArrowLeft />}
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              Quay lại
            </Button>
          </div>
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <Skeleton.Image style={{ width: "100%", height: 500 }} active />
            </Col>
            <Col xs={24} lg={12}>
              <Skeleton active paragraph={{ rows: 8 }} />
            </Col>
          </Row>
        </div>
      </div>
    );
  }

  if (isError || !pet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="mb-6">
            <Button
              icon={<FaArrowLeft />}
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              Quay lại
            </Button>
          </div>
          <Alert
            message="Không tìm thấy thú cưng"
            description="Thú cưng bạn đang tìm kiếm không tồn tại hoặc đã bị xóa."
            type="error"
            showIcon
            action={
              <Button size="small" onClick={() => refetch()}>
                Thử lại
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6">
          <Button
            icon={<FaArrowLeft />}
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            Quay lại
          </Button>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Card className="rounded-2xl shadow-lg overflow-hidden">
              {pet.image_url ? (
                <Image
                  src={pet.image_url}
                  alt={pet.name}
                  className="w-full"
                  style={{ height: 500, objectFit: "cover" }}
                  preview={{
                    mask: (
                      <div className="flex items-center justify-center">
                        <FaEye className="mr-2" />
                        Xem ảnh
                      </div>
                    ),
                  }}
                />
              ) : (
                <div className="w-full h-96 bg-gray-100 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <FaPaw className="text-6xl mb-4" />
                    <p>Không có ảnh</p>
                  </div>
                </div>
              )}
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Title level={1} className="mb-0 text-3xl">
                    {pet.name}
                  </Title>
                  <Space>
                    <Tooltip
                      title={
                        isFavorite ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"
                      }
                    >
                      <Button
                        type="text"
                        icon={<FaHeart />}
                        onClick={handleToggleFavorite}
                        className={`text-2xl ${
                          isFavorite ? "text-red-500" : "text-gray-400"
                        }`}
                      />
                    </Tooltip>
                    <Tooltip title="Chia sẻ">
                      <Button
                        type="text"
                        icon={<FaShare />}
                        onClick={handleShare}
                        className="text-2xl text-gray-400"
                      />
                    </Tooltip>
                  </Space>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <Tag
                    color={pet.status === "available" ? "green" : "red"}
                    className="text-sm px-3 py-1"
                  >
                    {pet.status === "available" ? "✅ Còn bán" : "❌ Đã bán"}
                  </Tag>
                  <Tag color="blue" className="text-sm px-3 py-1">
                    🐾 {pet.species}
                  </Tag>
                  {pet.breed && (
                    <Tag color="purple" className="text-sm px-3 py-1">
                      {pet.breed}
                    </Tag>
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <Text className="text-gray-600 text-lg">Giá bán</Text>
                    <div className="text-3xl font-bold text-blue-600">
                      {typeof pet.price === "number"
                        ? pet.price.toLocaleString()
                        : "Liên hệ"}{" "}
                      ₫
                    </div>
                  </div>
                  <div className="text-right">
                    <Text className="text-gray-500 text-sm">ID: {pet._id}</Text>
                  </div>
                </div>
              </div>

              <Card title="Thông tin chi tiết" className="rounded-2xl">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <FaTag className="text-blue-500" />
                    <Text strong>Giới tính:</Text>
                    <Text>
                      {pet.gender !== undefined
                        ? pet.gender
                          ? "♂️ Đực"
                          : "♀️ Cái"
                        : "Chưa xác định"}
                    </Text>
                  </div>

                  {pet.age && (
                    <div className="flex items-center gap-3">
                      <FaBirthdayCake className="text-green-500" />
                      <Text strong>Tuổi:</Text>
                      <Text>{pet.age} tháng</Text>
                    </div>
                  )}

                  {pet.breed && (
                    <div className="flex items-center gap-3">
                      <FaPaw className="text-orange-500" />
                      <Text strong>Giống:</Text>
                      <Text>{pet.breed}</Text>
                    </div>
                  )}

                  {pet.generic && (
                    <div className="flex items-center gap-3">
                      <FaTag className="text-purple-500" />
                      <Text strong>Mô tả ngắn:</Text>
                      <Text>{pet.generic}</Text>
                    </div>
                  )}
                </div>
              </Card>

              {pet.description && (
                <Card title="Mô tả" className="rounded-2xl">
                  <Paragraph className="text-gray-700 leading-relaxed">
                    {pet.description}
                  </Paragraph>
                </Card>
              )}

              <div className="space-y-4">
                {pet.status === "available" && (
                  <Button
                    type="primary"
                    size="large"
                    icon={<FaShoppingCart />}
                    onClick={handleAddToCart}
                    loading={isAddingToCart}
                    disabled={isPetInCart(pet._id)}
                    className="w-full h-12 text-lg font-semibold rounded-2xl"
                  >
                    {isPetInCart(pet._id)
                      ? "Đã có trong giỏ hàng"
                      : "Thêm vào giỏ hàng"}
                  </Button>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    size="large"
                    icon={<FaPhone />}
                    className="h-12 rounded-2xl"
                  >
                    Gọi điện
                  </Button>
                  <Button
                    size="large"
                    icon={<FaEnvelope />}
                    className="h-12 rounded-2xl"
                  >
                    Liên hệ
                  </Button>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {relatedPets.length > 0 && (
          <div className="mt-16">
            <Divider>
              <Title level={2} className="mb-0 flex items-center gap-2">
                <FaPaw className="text-blue-500" />
                Thú cưng liên quan
              </Title>
            </Divider>

            <CustomPetsGrid
              pets={relatedPets}
              showFavoriteButton={true}
              showCartButton={true}
              onToggleFavorite={() => {}}
              onAddToCart={() => {}}
              gridCols="4"
              gap="md"
              emptyMessage="Không có thú cưng liên quan"
            />
          </div>
        )}
      </div>
    </div>
  );
}
