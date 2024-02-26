import { MdAccountCircle } from "react-icons/md";
import Link from "next/link";
import { useState } from "react";

type NavProps = {
  genres?: string[];
  showNavigationAndSearch: boolean;
};

export default function Nav(props: NavProps) {
  const { genres, showNavigationAndSearch } = props;

  const [showDropdown, setShowDropdown] = useState(false);

  const [search, setSearch] = useState("");

  return (
    <>
      <nav className="flex w-full items-center justify-between bg-zinc-800 px-2 text-white md:px-4">
        <div className="relative flex items-center gap-2 px-4 py-3 md:gap-4">
          <h1 className="cursor-default text-xl font-bold md:px-2 md:text-3xl">
            AnyFlex
          </h1>
          <div className="h-[2rem] w-0.5 bg-zinc-600"></div>
          <Link
            href={"/"}
            className="cursor-pointer text-gray-300 duration-200 ease-in-out hover:text-white"
          >
            Home
          </Link>
          <div
            className={`relative h-full ${showNavigationAndSearch ? "block" : "hidden"}`}
          >
            <span
              className="relative z-20 cursor-pointer py-[100%] text-gray-300 duration-200 ease-in-out hover:text-white"
              onMouseOver={() => setShowDropdown(true)}
              onMouseOut={() => setShowDropdown(false)}
            >
              Genre
            </span>
            <ul
              className={`absolute left-1/2 top-[2.5rem] z-30 flex max-h-48 -translate-x-1/2 flex-col gap-2 overflow-y-scroll rounded-lg border-[1px] border-zinc-700 bg-zinc-800 p-3 md:max-h-72 ${showDropdown ? "block" : "hidden"}`}
              onMouseOver={() => setShowDropdown(true)}
              onMouseOut={() => setShowDropdown(false)}
            >
              {genres?.map((genre, index) => (
                <li key={index}>
                  <button className="w-full rounded-lg bg-transparent px-3 py-1 text-left duration-200 ease-in-out hover:bg-zinc-700">
                    {genre}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Link
          href={"/api/auth/login"}
          className="cursor-pointer px-4 text-2xl text-gray-300 duration-200 ease-in-out hover:text-white md:text-4xl"
        >
          <MdAccountCircle />
        </Link>
      </nav>
      <div
        className={`sticky inset-0 z-20 w-full border-b-[1px] border-zinc-600 bg-zinc-900 px-4 py-5 text-white ${showNavigationAndSearch ? "block" : "hidden"}`}
      >
        <div className="mx-auto flex max-w-[1280px] items-center justify-center">
          <input
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search"
            className="w-full rounded-full bg-zinc-800 p-2 opacity-80 outline-none duration-200 ease-in-out focus:opacity-100 md:p-3"
          />
        </div>
      </div>
    </>
  );
}
