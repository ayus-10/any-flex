import type { ItemData } from "./Library";
import Image from "next/image";

export default function Item({ name, image, genre }: ItemData) {
  return (
    <div className="h-full max-w-[240px] rounded-lg bg-zinc-800">
      <div className="relative h-[360px] cursor-pointer ease-in-out after:absolute after:inset-0 after:h-full after:w-full after:rounded-t-lg after:bg-white after:opacity-0 after:duration-300 hover:after:opacity-50">
        <Image
          priority={true}
          width={240}
          height={360}
          src={image}
          alt={name}
          className="h-full w-full rounded-t-lg"
        ></Image>
      </div>
      <h1 className="p-2 text-lg font-bold text-white md:text-xl">{name}</h1>
      <p className="px-2 font-bold text-white">Genre</p>
      <ul className="flex flex-wrap gap-2 p-2">
        {genre.map((item, index) => (
          <li className="rounded-sm bg-zinc-700 p-1 text-gray-300" key={index}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
