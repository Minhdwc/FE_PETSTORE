import { IPet } from "@/types";

interface PetSelectorProps {
  pets: IPet[];
  selectedPetId: string;
  onSelectPet: (petId: string) => void;
}

export default function PetSelector({
  pets,
  selectedPetId,
  onSelectPet,
}: PetSelectorProps) {
  if (pets.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-gray-300 p-8 text-center">
        <div className="text-4xl text-gray-400 mb-2">🐾</div>
        <p className="text-gray-500">Bạn chưa có thú cưng nào</p>
        <p className="text-sm text-gray-400 mt-1">
          Vui lòng thêm thú cưng trước khi đặt lịch
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900">Chọn thú cưng</h3>

      <div className="grid gap-3">
        {pets.map((pet) => (
          <div
            key={pet._id}
            className={`cursor-pointer rounded-xl border-2 p-4 transition-all hover:shadow-md ${
              selectedPetId === pet._id
                ? "border-blue-500 bg-blue-50 shadow-md"
                : "border-gray-200 bg-white hover:border-blue-300"
            }`}
            onClick={() => onSelectPet(pet._id)}
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 overflow-hidden rounded-full">
                {pet.image_url ? (
                  <img
                    src={pet.image_url}
                    alt={pet.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400">
                    🐾
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{pet.name}</h4>
                <p className="text-sm text-gray-600">
                  {pet.breed || pet.species}
                </p>
                <p className="text-xs text-gray-500">
                  {pet.age ? `${pet.age} tuổi` : "Tuổi không xác định"}
                </p>
              </div>

              {selectedPetId === pet._id && (
                <div className="text-blue-600">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
