import Nav from "@/components/Nav";
import type { GetServerSideProps } from "next";
import { useState } from "react";
import { FaStar, FaAngleDown } from "react-icons/fa";
import {
  TbFaceIdError,
  TbMoodKid,
  TbRating12Plus,
  TbRating18Plus,
} from "react-icons/tb";
import Image from "next/image";

type AnimeData = {
  data: {
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
    background: string;
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
  const [expandDescription, setExpandDescription] = useState(false);

  function ratingIcon(text: string) {
    const rating = text.split(" ")[0];
    switch (rating) {
      case "G":
        return <TbMoodKid className="text-2xl text-green-500" />;
      case "PG":
        return <TbMoodKid className="text-2xl text-green-500" />;
      case "PG-13":
        return <TbRating12Plus className="text-2xl text-yellow-500" />;
      case "R":
        return <TbRating18Plus className="text-2xl text-yellow-500" />;
      case "R+":
        return <TbRating18Plus className="text-2xl text-red-500" />;
      case "Rx":
        return <TbRating18Plus className="text-2xl text-red-500" />;
    }
  }

  return (
    <>
      <Nav showNavigationAndSearch={false} />
      <main className="flex min-h-screen w-screen flex-col bg-zinc-700 text-white">
        <div className="mx-4 my-6 rounded-lg bg-zinc-900 px-4 py-6 md:px-16 md:py-12">
          <div className="flex flex-col items-center gap-2 md:flex-row">
            <Image
              priority={true}
              src={animeData.data.images.webp.image_url}
              width={100}
              height={150}
              className="h-[150px] w-[100px] rounded-sm"
              alt={`Image for ${animeData.data.title}`}
            ></Image>
            <div className="flex flex-col gap-1">
              <h1 className="text-center text-2xl font-bold md:text-left md:text-3xl">
                {animeData.data.title}
              </h1>
              {animeData.data.title !== animeData.data.title_english && (
                <h2 className="text-center text-lg font-semibold md:text-left md:text-xl">
                  {animeData.data.title_english}
                </h2>
              )}
              <div className="flex items-center justify-center gap-1 text-lg md:justify-start md:text-xl">
                <FaStar className="text-yellow-500" />
                <span>Score</span>
                <span>{animeData.data.score}</span>
              </div>
              <div className="flex items-center justify-center gap-1 text-lg md:justify-start md:text-xl">
                {ratingIcon(animeData.data.rating)}
                <span>{animeData.data.rating}</span>
              </div>
            </div>
          </div>
          <p className="my-2 text-center italic text-zinc-400 md:text-start">
            {animeData.data.background}
          </p>
          <div className="my-4 flex flex-col gap-2 md:grid md:grid-cols-2">
            {animeData.data.trailer.embed_url ? (
              <iframe
                src={animeData.data.trailer.embed_url}
                className="mx-auto aspect-video w-full max-w-[640px] rounded-lg outline-none md:mx-0"
              ></iframe>
            ) : (
              <div className="hidden flex-col items-center justify-center rounded-lg bg-zinc-800 p-4 md:flex">
                <TbFaceIdError className="text-9xl" />
                <span className="text-center text-4xl">
                  Can't find the trailer
                </span>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <ul className="rounded-lg bg-zinc-800 p-4">
                <li className="flex w-full justify-between gap-4">
                  <span>Episodes</span>
                  <span>{animeData.data.episodes}</span>
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
                    className={`text-2xl duration-300 ease-in-out ${expandDescription ? "rotate-180" : ""}`}
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
