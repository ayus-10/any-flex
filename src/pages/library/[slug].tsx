import { useSession } from "next-auth/react";
import Nav from "@/components/Nav";
import Head from "next/head";
import { GetServerSideProps } from "next";
import axios from "axios";
import { AnimeLibrary, UserModel } from "../api/addToLibrary";
import { TbFaceIdError } from "react-icons/tb";
import Item from "@/components/Item";
import SearchBar from "@/components/SearchBar";
import { useEffect, useState } from "react";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const username = params?.slug;
    const response = await axios.post(
      `${process.env.BASE_URL}api/retrieveLibrary`,
      { username },
    );
    const libraryData: UserModel = response.data.data;
    return {
      props: { libraryData },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};

export default function Library({ libraryData }: { libraryData: UserModel }) {
  const { status } = useSession();

  // Create an empty state to store fetched data
  const [animeLibrary, setAnimeLibrary] = useState<AnimeLibrary[]>();

  // Store fetched data into state, on page load
  useEffect(() => {
    setAnimeLibrary(libraryData.animeLibrary);
  }, [libraryData.animeLibrary]);

  const maxIndex = libraryData.animeLibrary.length;
  const paginationFactor = 8;
  const numberOfPages = Math.ceil(maxIndex / paginationFactor);

  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(paginationFactor);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [paginatedLibrary, setPaginatedLibrary] = useState<AnimeLibrary[]>();

  useEffect(() => {
    if (animeLibrary) {
      setPaginatedLibrary(animeLibrary.slice(startIndex, endIndex));
    }
  }, [animeLibrary, startIndex, endIndex]);

  const [search, setSearch] = useState(""); // Used to store value of search input field

  useEffect(() => {
    // Filter the library data based on the search value
    const updatedAnimeLibrary = libraryData.animeLibrary.filter((anime) => {
      return anime.animeName
        .toLocaleLowerCase()
        .includes(search.toLocaleLowerCase());
    });

    setAnimeLibrary(updatedAnimeLibrary);
  }, [search]);

  function handlePageChange(index: number) {
    if (currentIndex > index) {
      setCurrentIndex((prev) => prev - 1);
      previousPage();
    } else if (currentIndex < index) {
      setCurrentIndex((prev) => prev + 1);
      nextPage();
    }
  }

  function nextPage() {
    if (endIndex < maxIndex) {
      setStartIndex((prev) => prev + paginationFactor);
      setEndIndex((prev) => prev + paginationFactor);
    }
  }

  function previousPage() {
    if (startIndex > 0) {
      setStartIndex((prev) => prev - paginationFactor);
      setEndIndex((prev) => prev - paginationFactor);
    }
  }

  return (
    <>
      <Head>
        <title>My Library - AnyFlex</title>
      </Head>
      <Nav />
      <div className="sticky inset-0 z-20 flex h-[5.05rem] w-full border-b-[1px] border-zinc-600 bg-zinc-900 px-4 py-5 text-white md:block md:h-[5.55rem]">
        <SearchBar search={search} setSearch={setSearch} />
      </div>
      <main className="min-h-screen w-full bg-zinc-700 text-white">
        {status === "authenticated" &&
        paginatedLibrary &&
        paginatedLibrary.length > 0 ? (
          <>
            <div className="maxIndex-w-[1280px] mx-auto grid w-full grid-cols-1 place-items-center gap-4 py-4 sm:grid-cols-2 md:grid-cols-3 md:py-8 lg:grid-cols-4">
              {paginatedLibrary.map((anime, index) => (
                <Item
                  key={index}
                  name={anime.animeName}
                  id={anime.animeId}
                  image={anime.imageURL}
                  episodes={{
                    total: anime.totalEpisodes,
                    completed: anime.episodesCompleted,
                  }}
                />
              ))}
            </div>
            <div className="flex w-full justify-center gap-1 p-12">
              {Array.from({ length: numberOfPages }).map((_, index) => (
                <button
                  onClick={() => handlePageChange(index)}
                  key={index}
                  className={`grid h-8 w-8 cursor-pointer place-content-center rounded-[50%] p-2 text-xl font-semibold ${currentIndex === index ? "bg-zinc-800" : "bg-zinc-600"}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="grid w-full place-content-center py-12">
            <div className="flex flex-col items-center justify-center px-4">
              <TbFaceIdError className="text-9xl" />
              <h1 className="text-center text-2xl font-semibold md:text-4xl">
                {libraryData.animeLibrary.length > 0
                  ? `Can't locate "${search}" in your library`
                  : "Your library seems to be empty"}
              </h1>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
