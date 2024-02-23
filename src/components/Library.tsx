import { useEffect, useState } from "react";
import Item from "./Item";

export type ItemData = {
  name: string;
  image: string;
  genre: string[];
};

export default function Library() {
  const [data, setData] = useState<ItemData[]>([
    { name: "", image: "", genre: [] },
  ]);

  async function fetchData() {
    const response = await fetch("http://localhost:8080/");
    const data = await response.json();
    setData(data);
  }

  useEffect(() => {
    fetchData();
  });

  return (
    <div className="min-h-screen w-screen bg-zinc-700 py-12">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 place-items-center gap-12 px-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data.map((item, index) => (
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
