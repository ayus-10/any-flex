import { useSession, signIn } from "next-auth/react";
import Nav from "@/components/Nav";
import Head from "next/head";
import { GetServerSideProps } from "next";
import axios from "axios";
import { AnimeLibrary, UserModel } from "../api/addToLibrary";
import { TbFaceIdError } from "react-icons/tb";
import Item from "@/components/Item";

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

  const { animeLibrary }: { animeLibrary: AnimeLibrary[] } = libraryData;

  return (
    <>
      <Head>
        <title>My Library - AnyFlex</title>
      </Head>
      <Nav showNavigationAndSearch={false} />
      <main className="min-h-screen w-full bg-zinc-700 text-white">
        {status === "authenticated" && (
          <div className="grid w-full grid-cols-1 place-items-center gap-4 py-4 sm:grid-cols-2 md:grid-cols-3 md:py-8 lg:grid-cols-4">
            {animeLibrary.length > 0 ? (
              animeLibrary.map((anime, index) => (
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
              ))
            ) : (
              <div className="grid w-full place-content-center py-8">
                <div className="flex flex-col items-center justify-center px-4">
                  <TbFaceIdError className="text-9xl" />
                  <h1 className="text-center text-2xl font-semibold md:text-4xl">
                    Your library seems to be empty
                  </h1>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}
