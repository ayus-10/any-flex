import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import Image from "next/image";
import Link from "next/link";

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

export default function AnimeSearch() {
  // Used to store value of search input field
  const [search, setSearch] = useState("");

  // Used to store data fetched from API
  const [searchData, setSearchData] = useState<AnimeSearchData>();

  useEffect(() => {
    if (search !== "") {
      // Fetch data once every second while search keywords are being typed
      let timeOut = setTimeout(() => fetchSearchData(), 1000);
      return () => clearTimeout(timeOut);
    }

    async function fetchSearchData() {
      const animeSearchDataRaw = await fetch(
        "https://api.jikan.moe/v4/anime?q=" + search,
      );
      const animeSearchData: { data: AnimeSearchData } =
        await animeSearchDataRaw.json();

      // Select and save only first four result
      const topSearchData = animeSearchData.data.splice(0, 4);
      setSearchData(topSearchData);
    }
  }, [search]);

  return (
    <div className="sticky inset-0 z-20 flex h-[5.05rem] w-full border-b-[1px] border-zinc-600 bg-zinc-900 px-4 py-5 text-white md:block md:h-[5.55rem]">
      <SearchBar search={search} setSearch={setSearch} />
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
  );
}
