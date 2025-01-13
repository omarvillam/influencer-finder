import { useRef, useState } from "react";
import SearchModal from "~/components/SearchModal/SearchModal";
import { Cog } from "../../../public/icons/Cog";
import { RightArrow } from "../../../public/icons/RightArrow";

interface SearchInputProps {
  onSearch: (influencerName: string) => void;
  isLoading: boolean;
}

export default function SearchInput({ onSearch, isLoading }: SearchInputProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSearch = () => {
    const influencerName = inputRef.current?.value || "";
    onSearch(influencerName);
  };

  return (
    <>
      <SearchModal open={isModalOpen} closeModal={closeModal} />
      <div className={"relative w-full"}>
        <button
          className={"rounded-l-full absolute left-[23px] top-[17px]"}
          onClick={openModal}
        >
          <Cog width={32} height={32} className={"text-gray hover:text-white transition-3"} />
        </button>
        <input
          ref={inputRef}
          className={"rounded-full border border-solid border-gray px-16 py-4 text-2xl w-full"}
          placeholder="Search influencer"
        />
        <button
          className={"rounded-l-full absolute right-[23px] top-[17px]"}
          onClick={handleSearch}
          disabled={isLoading}
        >
          <RightArrow
            width={32}
            height={32}
            className={`${
              isLoading ? "text-gray-400" : "text-gray hover:text-white transition-3"
            }`}
          />
        </button>
      </div>
    </>
  );
}
