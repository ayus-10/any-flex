import ItemsGrid from "@/components/ItemsGrid";
import Nav from "@/components/Nav";
import Head from "next/head";

export type AnimeData = {
  id: number | null;
  name: string;
  image: string;
  genre: string[];
};

type FetchedAnimeData = {
  mal_id: number;
  title_english: string;
  images: {
    webp: {
      large_image_url: string;
    };
  };
  genres: {
    name: string;
  }[];
};

type FetchedGenreList = {
  data: { name: string }[];
};

type HomeProps = {
  ItemsGridData: AnimeData[];
  NavData: string[];
};

export const getServerSideProps = async () => {
  // Fetch JSON data to be displayed on ItemsGrid component
  const animeDataRaw = await fetch("https://api.jikan.moe/v4/top/anime");
  const animeDataParsed = await animeDataRaw.json();
  const animeData = animeDataParsed.data;

  // Empty array to store processed anime data
  const animeDataArray: AnimeData[] = [];

  // Process the fetched data and push it to previously created array
  animeData.forEach((data: FetchedAnimeData) => {
    const dataObject: AnimeData = {
      id: null,
      name: "",
      image: "",
      genre: [],
    };
    dataObject.id = data.mal_id;
    dataObject.name = data.title_english;
    dataObject.image = data.images.webp.large_image_url;
    data.genres.forEach((genre) => {
      dataObject.genre.push(genre.name);
    });
    animeDataArray.push(dataObject);
  });

  // Fetch JSON data containing the genre names
  const genreListRaw = await fetch("https://api.jikan.moe/v4/genres/anime");
  const genreListParsed: FetchedGenreList = await genreListRaw.json();

  // Empty array to store processed genre names
  const genreList: string[] = [];

  // Process and store genre names to previously created array
  genreListParsed.data.forEach((genre) => {
    genreList.push(genre.name);
  });

  return {
    props: { ItemsGridData: animeDataArray, NavData: genreList },
  };
};

export default function Home(props: HomeProps) {
  const { ItemsGridData, NavData } = props;

  return (
    <>
      <Head>
        <title>AnyFlex - Flex your favorite anime</title>
        <meta name="description" content="Flex your favorite anime"></meta>
      </Head>
      <Nav genres={NavData} showNavigationAndSearch={true} />
      <ItemsGrid content={ItemsGridData} />
    </>
  );
}
