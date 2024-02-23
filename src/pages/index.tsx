import Library from "@/components/Library";
import Nav from "@/components/Nav";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>AnyFlex - Flex your favorite anime</title>
        <meta name="description" content="Flex your favorite anime"></meta>
      </Head>
      <Nav />
      <Library />
    </>
  );
}
