import Item from "./Item";
import { AnimeData } from "@/pages";

export default function ItemsGrid({ content }: { content: AnimeData[] }) {
  return (
    <main className="max-w-screen min-h-screen bg-zinc-700">
      <h1 className="p-4 text-center text-3xl font-bold text-white md:p-6 md:text-4xl">
        Most Popular
      </h1>
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 place-items-center gap-12 px-4 py-4 sm:grid-cols-2 md:grid-cols-3 md:py-6 lg:grid-cols-4">
        {content &&
          content.map((item, index) => (
            <Item
              key={index}
              id={item.id}
              name={item.name}
              image={item.image}
              genre={item.genre}
            />
          ))}
      </div>
    </main>
  );
}
