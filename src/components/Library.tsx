import { useState } from "react";
import Item from "./Item";
import { ItemData } from "@/pages";

export default function Library({ content }: { content: ItemData[] }) {
  const [data, setData] = useState<ItemData[]>(content);

  return (
    <div className="min-h-screen w-screen bg-zinc-700 py-12">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 place-items-center gap-12 px-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data &&
          data.map((item, index) => (
            <Item
              key={index}
              name={item.name}
              image={item.image}
              genre={item.genre}
            />
          ))}
      </div>
    </div>
  );
}
