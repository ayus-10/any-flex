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
  const { data: session, status } = useSession();

  const [animeLibrary, setAnimeLibrary] = useState<AnimeLibrary[]>();

  useEffect(() => {
    setAnimeLibrary(libraryData.animeLibrary);
  }, []);

  const [search, setSearch] = useState("");

  useEffect(() => {
    let updatedAnimeLibrary = libraryData.animeLibrary.filter((anime) => {
      return anime.animeName
        .toLocaleLowerCase()
        .includes(search.toLocaleLowerCase());
    });

    setAnimeLibrary(updatedAnimeLibrary);
  }, [search]);

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
        animeLibrary &&
        animeLibrary.length > 0 ? (
          <div className="grid w-full grid-cols-1 place-items-center gap-4 py-4 sm:grid-cols-2 md:grid-cols-3 md:py-8 lg:grid-cols-4">
            {animeLibrary.map((anime, index) => (
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
