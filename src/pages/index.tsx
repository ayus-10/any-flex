import Library from "@/components/Library";
import Nav from "@/components/Nav";
import Head from "next/head";

export type ItemData = {
  name: string;
  image: string;
  genre: string[];
};

type ResponseData = {
  title: string;
  images: {
    jpg: {
      large_image_url: string;
    };
  };
  genres: {
    name: string;
  }[];
};

export async function getStaticProps() {
  const response = await fetch("https://api.jikan.moe/v4/top/anime");
  const parsedResponse = await response.json();
  const responseData = parsedResponse.data;

  const dataArray: ItemData[] = [];

  responseData.forEach((data: ResponseData) => {
    const dataObject: ItemData = { name: "", image: "", genre: [] };
    dataObject.name = data.title;
    dataObject.image = data.images.jpg.large_image_url;
    data.genres.forEach((genre) => {
      dataObject.genre.push(genre.name);
    });
    dataArray.push(dataObject);
  });

  return {
    props: { LibraryData: dataArray },
  };
}

export default function Home({ LibraryData }: { LibraryData: ItemData[] }) {
  return (
    <>
      <Head>
        <title>AnyFlex - Flex your favorite anime</title>
        <meta name="description" content="Flex your favorite anime"></meta>
      </Head>
      <Nav />
      <Library content={LibraryData} />
    </>
  );
}
