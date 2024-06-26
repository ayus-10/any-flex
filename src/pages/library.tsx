import Nav from "@/components/Nav";
import Head from "next/head";
import { GetServerSideProps } from "next";
import axios from "axios";
import { AnimeLibrary, UserModel } from "./api/addToLibrary";
import { TbFaceIdError } from "react-icons/tb";
import Item from "@/components/Item";
import SearchBar from "@/components/SearchBar";
import { useEffect, useState } from "react";
import useMessage from "@/hooks/useMessage";
import ToastNotification from "@/components/ToastNotification";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { v4 as uuid } from "uuid";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (session?.user?.name) {
      const username = session.user.name;
      const response = await axios.post(
        `${process.env.BASE_URL}api/retrieveLibrary`,
        { username },
      );
      const libraryData: UserModel = response.data.data;
      return {
        props: { libraryData },
      };
    }
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } catch {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
};

export default function Library({ libraryData }: { libraryData: UserModel }) {
  // Create an empty state to store fetched data
  const [animeLibrary, setAnimeLibrary] = useState<AnimeLibrary[]>();

  // Store fetched data into state, on page load
  useEffect(() => {
    setAnimeLibrary(libraryData.animeLibrary);
  }, [libraryData.animeLibrary]);

  const maxIndex = libraryData.animeLibrary.length;
  const paginationFactor = 8; // Number of items displayed per page
  const numberOfPages = Math.ceil(maxIndex / paginationFactor); // Total number of pages needed for pagination

  const [startIndex, setStartIndex] = useState(0); // Starting index of the current page data
  const [endIndex, setEndIndex] = useState(paginationFactor); // Ending index of the current page data
  const [currentIndex, setCurrentIndex] = useState(0); // Number of page user is currently at

  const [paginatedLibrary, setPaginatedLibrary] = useState<AnimeLibrary[]>();

  useEffect(() => {
    if (animeLibrary) {
      setPaginatedLibrary(animeLibrary.slice(startIndex, endIndex));
    }
  }, [animeLibrary, startIndex, endIndex, currentIndex]);

  const [search, setSearch] = useState(""); // Used to store value of search input field

  useEffect(() => {
    // Filter the library data based on the search value
    const updatedAnimeLibrary = libraryData.animeLibrary.filter((anime) => {
      return anime.animeName
        .toLocaleLowerCase()
        .includes(search.toLocaleLowerCase());
    });

    handlePageChange(0); // Switch to first page while searching

    setAnimeLibrary(updatedAnimeLibrary);
  }, [search]);

  const [message, setMessage] = useMessage();

  function handlePageChange(index: number) {
    if (currentIndex > index) {
      const difference = currentIndex - index;
      setCurrentIndex((prev) => prev - difference);
      previousPage(difference);
    } else if (currentIndex < index) {
      const difference = index - currentIndex;
      setCurrentIndex((prev) => prev + difference);
      nextPage(difference);
    }
  }

  function nextPage(difference: number) {
    if (endIndex < maxIndex) {
      setStartIndex((prev) => prev + paginationFactor * difference);
      setEndIndex((prev) => prev + paginationFactor * difference);
    }
  }

  function previousPage(difference: number) {
    if (startIndex > 0) {
      setStartIndex((prev) => prev - paginationFactor * difference);
      setEndIndex((prev) => prev - paginationFactor * difference);
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
        {message.text && message.type && (
          <ToastNotification message={message} />
        )}
        {paginatedLibrary && paginatedLibrary.length > 0 ? (
          <>
            <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 place-items-center gap-4 py-4 sm:grid-cols-2 md:grid-cols-3 md:py-8 lg:grid-cols-4">
              {paginatedLibrary.map((anime) => (
                <Item
                  key={anime.animeId}
                  animeData={{
                    name: anime.animeName,
                    id: anime.animeId,
                    image: anime.imageURL,
                    episodes: {
                      total: anime.totalEpisodes,
                      completed: anime.episodesCompleted,
                    },
                  }}
                  setMessage={setMessage}
                />
              ))}
            </div>
            <div className="flex w-full justify-center gap-1 p-12">
              {Array.from({ length: numberOfPages }).map((_, index) => (
                <button
                  onClick={() => handlePageChange(index)}
                  key={uuid()}
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
                  ? `Can't locate '${search}' in your library`
                  : "Your library seems to be empty"}
              </h1>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
