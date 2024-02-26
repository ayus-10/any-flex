import { AnimeData } from "@/pages";
import Image from "next/image";
import { useRouter } from "next/router";
import { FaEye } from "react-icons/fa";

export default function Item(props: AnimeData) {
  const { id, name, image, genre } = props;

  const router = useRouter();

  return (
    <div className="flex h-full max-w-[240px] flex-col rounded-lg bg-zinc-800">
      <div className="group relative h-[360px] cursor-pointer ease-in-out after:absolute after:inset-0 after:h-full after:w-full after:rounded-t-lg after:bg-white after:opacity-0 after:duration-300 hover:after:opacity-50">
        <Image
          priority={true}
          width={240}
          height={360}
          src={image}
          alt={name}
          className="h-full rounded-t-lg"
        ></Image>
        <div
          onClick={() => {
            router.push("/anime/" + id);
          }}
          className="absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 place-content-center rounded-full bg-zinc-900 p-4 text-2xl text-white duration-300 ease-in-out hover:bg-zinc-600 group-hover:grid"
        >
          <FaEye />
        </div>
      </div>
      <div className="flex grow flex-col justify-between">
        <h1 className="p-2 text-lg font-bold text-white md:text-xl">{name}</h1>
        <div className="pb-8 pt-4">
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
        </div>
      </div>
    </div>
  );
}
