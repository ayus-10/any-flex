import Library from "@/components/Library";
import Nav from "@/components/Nav";
import Head from "next/head";

export default function library() {
  return (
    <>
      <Head>
        <title>My Library - AnyFlex</title>
      </Head>
      <Nav showNavigationAndSearch={false} />
      <Library />
    </>
  );
}
