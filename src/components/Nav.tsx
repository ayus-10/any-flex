import { MdAccountCircle, MdCancel } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";

type NavProps = {
  genres?: string[];
  showNavigationAndSearch: boolean;
};

type AnimeSearchData = {
  mal_id: number;
  title: string;
  title_english: string;
  images: {
    webp: {
      image_url: string;
    };
  };
}[];

export default function Nav(props: NavProps) {
  const { genres, showNavigationAndSearch } = props;

  const { data: session } = useSession();

  const [showProfile, setShowProfile] = useState(false);

  const [showDropdown, setShowDropdown] = useState(false);

  const [search, setSearch] = useState("");

  const searchBarRef = useRef<HTMLInputElement>(null);

  const searchBar = searchBarRef.current;

  const [searchData, setSearchData] = useState<AnimeSearchData>();

  useEffect(() => {
    if (search !== "") {
      let timeOut = setTimeout(() => fetchSearchData(), 1000);
      return () => clearTimeout(timeOut);
    }
  }, [search]);

  async function fetchSearchData() {
    const animeSearchDataRaw = await fetch(
      "https://api.jikan.moe/v4/anime?q=" + search,
    );
    const animeSearchData: { data: AnimeSearchData } =
      await animeSearchDataRaw.json();
    const topSearchData = animeSearchData.data.splice(0, 4);
    setSearchData(topSearchData);
  }

  return (
    <>
      <nav className="relative z-40 flex w-full items-center justify-between bg-zinc-800 px-2 text-white md:px-4">
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
              className={`absolute left-1/2 top-[2.5rem] z-30 max-h-48 -translate-x-1/2 flex-col gap-2 overflow-y-scroll rounded-lg border-[1px] border-zinc-700 bg-zinc-800 p-3 md:max-h-72 ${showDropdown ? "flex" : "hidden"}`}
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
        {session ? (
          session.user?.image && (
            <div>
              <Image
                onClick={() => setShowProfile(true)}
                height={0}
                width={0}
                className="h-[36px] w-[36px] cursor-pointer rounded-full"
                sizes="100vw"
                alt="Profile picture"
                src={session.user.image}
              ></Image>
              <div
                className={`fixed inset-0 z-50 h-full w-full animate-fade-in place-content-center bg-black-rgba backdrop-blur-lg duration-300 ${showProfile ? "grid" : "hidden"}`}
              >
                <div className="relative inset-0 flex min-w-[250px] flex-col items-center justify-between gap-4 rounded-md bg-zinc-900 p-4 md:min-w-[400px] md:max-w-[500px] md:flex-row">
                  <Image
                    height={100}
                    width={100}
                    className="max-h-[100px] max-w-[100px] shrink-0 rounded-full"
                    sizes="100vw"
                    alt="Profile picture"
                    src={session.user.image}
                  ></Image>
                  <div className="flex h-full w-full flex-col justify-center gap-4">
                    <div className="flex flex-col text-center text-xl font-semibold md:text-start md:text-2xl">
                      <span>Logged in as</span>
                      <span className="break-all">
                        {`@${session.user.name}`}
                      </span>
                    </div>
                    <button
                      onClick={() => signOut()}
                      className="rounded-sm bg-zinc-700 px-2 py-1 text-xl duration-200 ease-in-out hover:bg-zinc-800"
                    >
                      Sign Out
                    </button>
                  </div>
                  <MdCancel
                    onClick={() => setShowProfile(false)}
                    className="absolute -right-2 -top-2 cursor-pointer text-2xl duration-200 ease-in-out hover:text-zinc-400 md:text-3xl"
                  />
                </div>
              </div>
            </div>
          )
        ) : (
          <button
            onClick={() => signIn("discord")}
            className="cursor-pointer px-4 text-2xl text-gray-300 duration-200 ease-in-out hover:text-white md:text-4xl"
          >
            <MdAccountCircle />
          </button>
        )}
      </nav>
      <div
        className={`sticky inset-0 z-20 h-[5.05rem] w-full border-b-[1px] border-zinc-600 bg-zinc-900 px-4 py-5 text-white md:h-[5.55rem] ${showNavigationAndSearch ? "flex md:block" : "hidden"}`}
      >
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
        <div
          className={`absolute left-1/2 top-[100%] w-full max-w-[900px] -translate-x-1/2 animate-fade-in duration-300 ease-out ${search ? "block" : "hidden"}`}
        >
          <div
            className={`w-full grid-cols-1 place-content-center gap-3 rounded-b-lg border-x-[1px] border-b-[1px] border-zinc-600 bg-zinc-900 p-3 md:grid-cols-2 ${search ? "grid" : "hidden"}`}
          >
            {searchData ? (
              searchData.map((data, index) => (
                <Link
                  href={`/anime/${data.mal_id}`}
                  key={index}
                  className="inline-flex max-h-[75px] w-full items-center gap-2 rounded-sm bg-zinc-800 duration-200 ease-in-out hover:bg-zinc-700"
                >
                  <Image
                    priority={true}
                    height={75}
                    className="h-[75px] w-[50px] rounded-sm"
                    width={50}
                    src={data.images.webp.image_url}
                    alt={`Image for ${data.title_english || data.title}`}
                  ></Image>
                  <p className="max-h-full w-full truncate text-ellipsis break-words font-semibold md:text-lg">
                    {data.title_english || data.title}
                  </p>
                </Link>
              ))
            ) : (
              <p>Loading results, please wait</p>
            )}
            {searchData?.length === 0 ? (
              <p>{"Couldn't find any matches for your search"}</p>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
