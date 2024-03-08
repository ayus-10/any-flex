import { useSession, signIn } from "next-auth/react";
import { FaDiscord } from "react-icons/fa";
import Nav from "@/components/Nav";
import Head from "next/head";
import Image from "next/image";
import { GetServerSideProps } from "next";
import axios from "axios";
import { UserModel } from "../api/addToLibrary";
import ProgressBar from "@/components/ProgressBar";
import { TbFaceIdError } from "react-icons/tb";

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

  const { animeLibrary } = libraryData;

  return (
    <>
      <Head>
        <title>My Library - AnyFlex</title>
      </Head>
      <Nav showNavigationAndSearch={false} />
      <main className="min-h-screen w-full bg-zinc-700 text-white">
        {status === "authenticated" && (
          <div className="flex w-full flex-col items-center gap-4 py-4 md:py-8">
            {animeLibrary.length > 0 ? (
              animeLibrary.map((anime, index) => (
                <div
                  key={index}
                  className="flex w-full justify-between border-y-[1px] border-zinc-500 bg-zinc-900 md:w-[90%] lg:w-[75%]"
                >
                  <div className="relative min-h-[150px] min-w-[100px] md:min-h-[200px] md:min-w-[150px]">
                    <Image
                      fill
                      className="object-cover"
                      src={anime.imageURL}
                      alt={`Image for ${anime.animeName}`}
                    ></Image>
                  </div>
                  <div className="flex grow flex-col justify-evenly px-4 py-2 md:py-0">
                    <h2 className="text-right text-lg font-semibold md:text-2xl md:font-bold">
                      {anime.animeName}
                    </h2>
                    <div className="text-lg italic text-neutral-400 md:text-xl">
                      <ProgressBar
                        total={anime.totalEpisodes}
                        completed={anime.episodesCompleted}
                      />
                      <p className="text-right font-medium">
                        Completed {anime.episodesCompleted} out of{" "}
                        {anime.totalEpisodes} episodes
                      </p>
                    </div>
                    <button className="ml-auto rounded-sm border-2 border-[#29D] bg-[#29D] px-2 text-lg font-bold duration-200 ease-in-out hover:bg-transparent md:px-3 md:py-1">
                      Edit
                    </button>
                  </div>
                </div>
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
