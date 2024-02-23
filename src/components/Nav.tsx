import { MdAccountCircle } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import Link from "next/link";

export default function Nav() {
  return (
    <>
      <nav className="flex w-full items-center justify-between bg-zinc-800 px-2 text-white md:px-4">
        <div className="flex items-center gap-2 px-4 py-3 md:gap-4">
          <h1 className="cursor-default text-xl font-bold md:px-2 md:text-3xl">
            AnyFlex
          </h1>
          <div className="h-[2rem] w-0.5 bg-zinc-600"></div>
          <ul className="flex gap-2 text-gray-300 md:gap-4">
            <li>
              <Link
                href={"/"}
                className="cursor-pointer duration-200 ease-in-out hover:text-white"
              >
                Home
              </Link>
            </li>
            <li>
              <span className="cursor-pointer duration-200 ease-in-out hover:text-white">
                Genre
              </span>
            </li>
          </ul>
        </div>
        <div className="cursor-pointer px-4 text-2xl text-gray-300 duration-200 ease-in-out hover:text-white md:text-4xl">
          <MdAccountCircle />
        </div>
      </nav>
      <div className="sticky inset-0 w-full bg-zinc-900 px-4 py-5 text-white">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="rounded-full bg-zinc-800 p-2 opacity-80 outline-none duration-200 ease-in-out focus:opacity-100 md:p-3"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 md:right-4">
              <CiSearch />
            </div>
          </div>
          <div>
            <Link
              href={"/discover"}
              className="cursor-pointer text-gray-300 duration-200 ease-in-out hover:text-white"
            >
              Discover
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
