import React, { useMemo, useState } from "react";
import { useGetpetsQuery } from "@/store/services/pet.service";
import type { IPet } from "@/types";
import CustomPetsGrid from "@/components/CustomPetsGrid/CustomPetsGrid";
import useCartWishlist from "@/hooks/useCartWishlist";
import { Input, Select, Pagination, Drawer, Button, Radio, Slider } from "antd";
import { FaSearch, FaFilter } from "react-icons/fa";

const { Option } = Select;

export default function PetPage() {
  const {
    isPetInCart,
    handlePetAddToCart,
    isAddingToCart,
    isPetInWishlist,
    toggleFavoritePet,
  } = useCartWishlist();

  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [search, setSearch] = useState("");
  const [species, setSpecies] = useState<string | undefined>();
  const [gender, setGender] = useState<string | undefined>();
  const [status, setStatus] = useState<string | undefined>();
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [sort, setSort] = useState<string | undefined>("newest");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const debounced = useDebounce(search, 350);

  const query = useMemo(
    () => ({
      page,
      limit,
      species,
      generic: debounced || undefined,
      gender: gender === undefined ? undefined : gender === "male",
      minPrice,
      maxPrice,
      status: "available",
    }),
    [page, limit, species, debounced, gender, minPrice, maxPrice, status]
  );

  const { data, isFetching } = useGetpetsQuery(query);
  const pets: IPet[] = data?.data || [];
  const totalPages = data?.totalPages || 1;

  const shownPets = useMemo(() => {
    const list = [...pets];
    if (sort === "name_asc")
      return list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    if (sort === "name_desc")
      return list.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
    if (sort === "price_asc")
      return list.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sort === "price_desc")
      return list.sort((a, b) => (b.price || 0) - (a.price || 0));
    if (sort === "newest")
      return list.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );
    return list;
  }, [pets, sort]);

  const resetAll = () => {
    setSearch("");
    setSpecies(undefined);
    setGender(undefined);
    setStatus(undefined);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setSort("newest");
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
      <div className="flex flex-col items-center text-center space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          Pet Store
        </h1>
        <p className="text-slate-600 max-w-lg">
          Khám phá thú cưng phù hợp với bạn, lọc theo giá, loài, giới tính và
          trạng thái.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl shadow-sm p-4">
        <div className="flex items-center gap-2 w-full sm:w-1/3">
          <Input
            size="large"
            prefix={<FaSearch />}
            placeholder="Tìm kiếm..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="hidden md:flex items-center gap-4">
          <Radio.Group value={sort} onChange={(e) => setSort(e.target.value)}>
            <Radio.Button value="newest">Mới nhất</Radio.Button>
            <Radio.Button value="price_asc">Giá ↑</Radio.Button>
            <Radio.Button value="price_desc">Giá ↓</Radio.Button>
            <Radio.Button value="name_asc">Tên A-Z</Radio.Button>
            <Radio.Button value="name_desc">Tên Z-A</Radio.Button>
          </Radio.Group>
        </div>
        <Button
          icon={<FaFilter />}
          className="md:hidden"
          onClick={() => setDrawerOpen(true)}
        >
          Bộ lọc
        </Button>
      </div>

      <CustomPetsGrid
        pets={shownPets}
        isLoading={isFetching}
        isPetInCart={isPetInCart}
        isAddingToCart={isAddingToCart}
        isFavorite={isPetInWishlist}
        onAddToCart={handlePetAddToCart}
        onToggleFavorite={toggleFavoritePet}
        showFavoriteButton={true}
        showCartButton={true}
        gridCols="4"
        gap="md"
      />

      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination
            current={page}
            pageSize={limit}
            total={totalPages * limit}
            onChange={(p) => setPage(p)}
            showSizeChanger={false}
          />
        </div>
      )}

      <Drawer
        title="Bộ lọc"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        placement="bottom"
        height={420}
      >
        <div className="space-y-4">
          <Select
            size="large"
            allowClear
            value={species}
            onChange={(v) => setSpecies(v || undefined)}
            placeholder="Loài"
            className="w-full"
          >
            <Option value="dog">Chó</Option>
            <Option value="cat">Mèo</Option>
            <Option value="bird">Chim</Option>
            <Option value="fish">Cá</Option>
          </Select>
          <Select
            size="large"
            allowClear
            value={gender}
            onChange={(v) => setGender(v || undefined)}
            placeholder="Giới tính"
            className="w-full"
          >
            <Option value="male">Đực</Option>
            <Option value="female">Cái</Option>
          </Select>
          <Select
            size="large"
            allowClear
            value={status}
            onChange={(v) => setStatus(v || undefined)}
            placeholder="Trạng thái"
            className="w-full"
          >
            <Option value="available">Còn bán</Option>
            <Option value="sold">Đã bán</Option>
          </Select>
          <Slider
            range
            min={0}
            max={2000000}
            step={10000}
            onChange={(val: any) => {
              const [min, max] = val as [number, number];
              setMinPrice(min);
              setMaxPrice(max);
            }}
            tooltip={{ formatter: (v) => `${(v || 0).toLocaleString()}đ` }}
          />
          <div className="flex justify-between gap-2 pt-2">
            <Button onClick={resetAll} type="text">
              Xóa
            </Button>
            <Button type="primary" onClick={() => setDrawerOpen(false)}>
              Áp dụng
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}

function useDebounce<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value as T);
  React.useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
