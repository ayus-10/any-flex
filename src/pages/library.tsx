import Library from "@/components/Library";
import Nav from "@/components/Nav";

export default function library() {
  return (
    <>
      <Nav showNavigationAndSearch={false} />
      <Library />
    </>
  );
}
