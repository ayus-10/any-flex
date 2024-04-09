import { AnimeData } from "@/pages";
import Image from "next/image";
import { useRouter } from "next/router";
import { FaEye } from "react-icons/fa";
import ProgressBar from "./ProgressBar";
import { MdDelete, MdEditSquare } from "react-icons/md";
import { Dispatch, FormEvent, SetStateAction, useRef } from "react";
import { useSession } from "next-auth/react";
import { MessageObject } from "@/hooks/useMessage";
import axios from "axios";

type ItemProps = {
  animeData: AnimeData;
  setMessage?: Dispatch<SetStateAction<MessageObject>>;
};

export default function Item(props: ItemProps) {
  const { animeData, setMessage } = props;
  const { id, name, image, genre, episodes } = animeData;

  const router = useRouter();

  const itemRef = useRef<HTMLDivElement>(null);

  const { data: session } = useSession();

  function handleDelete(e: FormEvent, id: number | null) {
    e.preventDefault();

    if (setMessage && session?.user?.name && id) {
      axios
        .post("/api/deleteFromLibrary", {
          username: session.user.name,
          animeId: id,
        })
        .then((res) => {
          itemRef.current?.remove();
          setMessage({ text: res.data, type: "success" });
        })
        .catch((err) => {
          setMessage({ text: "Internal server error", type: "error" });
          console.error(err);
        });
    }
  }

  return (
    <div
      className="flex h-full w-[240px] flex-col rounded-lg bg-zinc-800"
      ref={itemRef}
    >
      <div className="group relative h-[360px] cursor-pointer ease-in-out after:absolute after:inset-0 after:h-full after:w-full after:rounded-t-lg after:bg-white after:opacity-0 after:duration-300 hover:after:opacity-50">
        <Image
          priority={true}
          width={240}
          height={360}
          src={image}
          alt={name}
          className="h-[360px] w-[240px] shrink-0 rounded-t-lg"
        ></Image>
        <div
          onClick={() => {
            router.push(`/anime/${id}`);
          }}
          className="absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 place-content-center rounded-full bg-zinc-900 p-4 text-2xl text-white duration-300 ease-in-out hover:bg-zinc-600 group-hover:grid"
        >
          <FaEye />
        </div>
      </div>
      <div className="flex grow flex-col justify-between">
        <h1 className="p-2 text-lg font-bold text-white md:text-xl">{name}</h1>
        <div className="py-4">
          {genre && (
            <>
              <p className="px-2 font-bold text-white">Genre</p>
              <ul className="flex flex-wrap gap-2 p-2">
                {genre.map((item, index) => (
                  <li
                    className="rounded-sm bg-zinc-700 px-2 text-gray-300"
                    key={index}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </>
          )}
          {episodes && (
            <div className="flex flex-col gap-1 px-2">
              <div className="flex justify-between">
                <p className="font-bold text-white">Completion</p>
                <p className="font-bold text-white">
                  {Math.ceil((episodes.completed / episodes.total) * 100)}%
                </p>
              </div>
              <ProgressBar
                completed={episodes.completed}
                total={episodes.total}
              />
              <form
                className="flex w-full items-center justify-between gap-2 py-1"
                onSubmit={(e) => handleDelete(e, id)}
              >
                <p className="italic">
                  {episodes.completed} out of {episodes.total} <br />
                  episodes watched
                </p>
                <div className="flex justify-center gap-[1px]">
                  <button
                    className="size-6 rounded-l-md bg-zinc-700 p-1 duration-200 ease-in-out hover:bg-zinc-600"
                    type="button"
                    onClick={() => {
                      router.push(`/anime/${id}`);
                    }}
                  >
                    <MdEditSquare />
                  </button>
                  <button
                    type="submit"
                    className="size-6 rounded-r-md bg-zinc-700 p-1 duration-200 ease-in-out hover:bg-zinc-600"
                  >
                    <MdDelete />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
