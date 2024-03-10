import { Dispatch, SetStateAction, useRef } from "react";
import { IoMdClose } from "react-icons/io";

type SearchBarProps = {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
};

export default function SearchBar(props: SearchBarProps) {
  const { search, setSearch } = props;

  // Used to clear the search input field value and the state, on clicking the clear search button
  const searchBarRef = useRef<HTMLInputElement>(null);
  const searchBar = searchBarRef.current;

  return (
    <div className="relative mx-auto flex w-full max-w-[900px] items-center justify-center">
      <input
        ref={searchBarRef}
        id="searchBar"
        onChange={(e) => setSearch(e.target.value)}
        type="text"
        placeholder="Search"
        className="grow rounded-full bg-zinc-800 p-2 opacity-80 outline-none duration-200 ease-in-out hover:opacity-100 focus:opacity-100 md:p-3"
      />
      <button
        className={`absolute right-0 h-full rounded-r-full bg-zinc-700 p-2 text-lg duration-200 ease-in-out hover:bg-zinc-600 md:p-3 md:text-xl ${search ? "visible" : "invisible"}`}
        aria-label="Clear search"
        onClick={() => {
          searchBar && (searchBar.value = "");
          setSearch("");
        }}
      >
        <IoMdClose />
      </button>
    </div>
  );
}
