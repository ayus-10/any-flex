import Nav from "@/components/Nav";
import axios from "axios";
import type { GetServerSideProps } from "next";
import type { FormEvent } from "react";
import { useRef, useState } from "react";
import { FaStar, FaAngleDown } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import {
  TbFaceIdError,
  TbMoodKid,
  TbRating12Plus,
  TbRating18Plus,
} from "react-icons/tb";
import Image from "next/image";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { BarLoader } from "react-spinners";

type AnimeData = {
  data: {
    mal_id: number;
    images: {
      webp: {
        image_url: string;
      };
    };
    trailer: {
      embed_url: string;
    };
    title: string;
    title_english: string;
    episodes: number;
    status: string;
    aired: {
      from: string;
      to: string;
    };
    duration: string;
    rating: string;
    score: number;
    synopsis: string;
    genres: {
      name: string;
    }[];
  };
  status: number;
};

export const getServerSideProps = (async ({ params }) => {
  const animeDataRaw = await fetch(
    "https://api.jikan.moe/v4/anime/" + params?.slug,
  );
  const animeData: AnimeData = await animeDataRaw.json();

  if (animeData.status === 404) {
    return {
      notFound: true,
    };
  }

  return { props: { animeData } };
}) satisfies GetServerSideProps<{ animeData: AnimeData }>;

export default function Anime({ animeData }: { animeData: AnimeData }) {
  const { data: session, status } = useSession();

  const [expandDescription, setExpandDescription] = useState(false);

  const [showAddToLibrary, setShowAddToLibrary] = useState(false);

  const [loading, setLoading] = useState(false); // Used to display loading bar during backend data processing

  const episodesInputRef = useRef<HTMLInputElement>(null); // Used to get the value of input field on form submission

  // Used to parse input field value on form submission
  function getEpisodesCompleted(text: string) {
    const number = parseInt(text);
    if (isNaN(number)) {
      return 0;
    }
    return number;
  }

  function handleAddToLibrary(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Get input field value and parse it to number
    const episodesInputValue = episodesInputRef.current?.value;
    const episodesCompleted = getEpisodesCompleted(episodesInputValue || "");

    if (episodesCompleted < 1 || episodesCompleted > animeData.data.episodes) {
      alert("Please enter a valid number of episodes watched");
      return;
    }
    if (status !== "authenticated" || !session.user?.name) {
      alert("Please login first by clicking the user icon in the navigation");
      return;
    }

    // Prepare JSON data to be sent to the backend API
    const animeLibraryElement = {
      animeId: animeData.data.mal_id,
      animeName: animeData.data.title_english || animeData.data.title,
      imageURL: animeData.data.images.webp.image_url,
      totalEpisodes: animeData.data.episodes,
      episodesCompleted: episodesCompleted,
    };
    const userData = {
      username: session.user.name,
      animeLibrary: [animeLibraryElement],
    };

    setLoading(true);

    axios
      .post("/api/addToLibrary", userData)
      .then((res) => alert(res.data))
      .catch((err) => {
        alert("Internal server error");
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
        if (episodesInputRef.current) {
          episodesInputRef.current.value = ""; // Clear the input field after form submission
        }
      });
  }

  // This function returns an icon component based on the rating text provided
  function ratingIcon(text: string) {
    const rating = text.split(" ")[0];
    switch (rating) {
      case "G":
      case "PG":
        return <TbMoodKid className="text-green-500" />;
      case "PG-13":
        return <TbRating12Plus className="text-yellow-500" />;
      case "R":
        return <TbRating18Plus className="text-yellow-500" />;
      case "R+":
      case "Rx":
        return <TbRating18Plus className="text-red-500" />;
    }
  }

  return (
    <>
      <Head>
        <title>
          {animeData.data.title_english || animeData.data.title} - AnyFlex
        </title>
      </Head>
      <Nav showNavigationAndSearch={false} />
      <main className="max-w-screen flex min-h-screen flex-col bg-zinc-700 text-white">
        <div className="mx-4 my-6 flex flex-col gap-4 rounded-lg bg-zinc-900 px-4 py-6 md:px-16 md:py-12">
          <div className="flex w-full flex-col gap-4 md:flex-row md:justify-between">
            <div className="flex flex-col items-center gap-2 md:flex-row md:items-start">
              <Image
                priority={true}
                src={animeData.data.images.webp.image_url}
                width={100}
                height={150}
                className="h-[150px] w-[100px] rounded-sm"
                alt={`Image for ${animeData.data.title_english || animeData.data.title}`}
              ></Image>
              <div className="flex flex-col gap-1">
                <h1 className="text-center text-2xl font-bold md:text-left md:text-3xl">
                  {animeData.data.title_english || animeData.data.title}
                </h1>
                {animeData.data.title_english &&
                  animeData.data.title !== animeData.data.title_english && (
                    <h2 className="text-center text-lg font-semibold md:text-left md:text-xl">
                      {animeData.data.title}
                    </h2>
                  )}
                <div className="flex flex-col items-center justify-center text-lg md:flex-row md:justify-start md:gap-1 md:text-xl">
                  <FaStar className="shrink-0 text-yellow-500" />
                  <span>Score {animeData.data.score}</span>
                </div>
                <div className="flex flex-col items-center justify-center text-lg md:flex-row md:justify-start md:gap-1 md:text-xl">
                  <div className="shrink-0 text-2xl">
                    {ratingIcon(animeData.data.rating)}
                  </div>
                  <span>{animeData.data.rating}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col items-center gap-1 md:items-end md:gap-2">
                <h2 className="text-lg font-semibold md:text-left md:text-xl">
                  Genres
                </h2>
                <ul className="flex flex-wrap justify-center gap-2 md:max-w-[300px] md:justify-end">
                  {animeData.data.genres.map((item, index) => (
                    <li
                      className="rounded-sm bg-zinc-700 px-2 text-gray-300"
                      key={index}
                    >
                      {item.name}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-center md:justify-end">
                {!showAddToLibrary ? (
                  <button
                    className="flex items-center gap-2 rounded-lg border-[1px] border-zinc-700 bg-zinc-800 px-3 py-2 text-lg duration-200 ease-in-out hover:bg-zinc-700 md:text-xl"
                    onClick={() => setShowAddToLibrary((prev) => !prev)}
                  >
                    <IoIosAddCircle className="shrink-0 text-xl md:text-2xl" />
                    <span>Library</span>
                  </button>
                ) : (
                  <form
                    className="flex justify-end"
                    onSubmit={handleAddToLibrary}
                  >
                    <input
                      ref={episodesInputRef}
                      className="rounded-l-lg border-[1px] border-zinc-700 bg-zinc-800 p-2 text-sm outline-none duration-200 ease-in-out hover:bg-zinc-700 focus:bg-zinc-700 sm:text-base md:text-lg"
                      type="text"
                      placeholder={`Episodes watched out of ${animeData.data.episodes}`}
                    />
                    <button
                      type={loading ? "button" : "submit"}
                      className="rounded-r-lg border-[1px] border-zinc-700 bg-zinc-800 p-2 duration-200 ease-in-out hover:bg-zinc-700 sm:text-lg md:text-xl"
                    >
                      {loading ? (
                        <BarLoader
                          color="#fff"
                          width={44}
                          className="rounded-full"
                        />
                      ) : (
                        "Done"
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 md:grid md:grid-cols-2">
            {animeData.data.trailer.embed_url ? (
              <iframe
                src={animeData.data.trailer.embed_url}
                className="mx-auto aspect-video w-full max-w-[640px] rounded-lg outline-none md:mx-0"
              ></iframe>
            ) : (
              <div className="hidden h-[360px] flex-col items-center justify-center rounded-lg bg-zinc-800 p-4 md:flex">
                <TbFaceIdError className="text-9xl" />
                <span className="text-center text-4xl">
                  {"Can't find the trailer"}
                </span>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <ul className="rounded-lg bg-zinc-800 p-4">
                <li className="flex w-full justify-between gap-4">
                  <span>Episodes</span>
                  <span>
                    {animeData.data.episodes || animeData.data.status}
                  </span>
                </li>
                <li className="flex w-full justify-between gap-4">
                  <span>Status</span>
                  <span>{animeData.data.status}</span>
                </li>
                <li className="flex w-full justify-between gap-4">
                  <span>Aired from</span>
                  <span>
                    {new Date(animeData.data.aired.from).toDateString()}
                  </span>
                </li>
                <li className="flex w-full justify-between gap-4">
                  <span>Aired to</span>
                  <span>
                    {new Date(animeData.data.aired.to).toDateString()}
                  </span>
                </li>
                <li className="flex w-full justify-between gap-4">
                  <span>Duration</span>
                  <span>{animeData.data.duration}</span>
                </li>
              </ul>
              <div
                className={`relative flex flex-col overflow-clip rounded-lg bg-zinc-800 duration-300 ease-in-out ${expandDescription ? "h-full" : "h-[200px]"}`}
              >
                <p className="grow p-4">{animeData.data.synopsis}</p>
                <div
                  className={`bottom-0 left-1/2 flex w-full -translate-x-1/2 cursor-pointer justify-center bg-zinc-600 duration-300 ease-in-out hover:bg-zinc-700 ${expandDescription ? "relative" : "absolute"}`}
                  onClick={() => setExpandDescription((prev) => !prev)}
                >
                  <FaAngleDown
                    className={`text-2xl duration-300 ease-in-out ${expandDescription ? "rotate-180" : null}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
