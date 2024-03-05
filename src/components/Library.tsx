import { useSession } from "next-auth/react";
import { FaDiscord } from "react-icons/fa";
import { signIn } from "next-auth/react";

export default function Library() {
  const { data: session, status } = useSession();

  return (
    <main className="min-h-screen w-screen overflow-x-hidden bg-zinc-700">
      {status === "authenticated" ? (
        <div></div>
      ) : (
        <div className="flex justify-center">
          <div className="flex flex-col items-center gap-4 py-12 text-white">
            <h1 className="text-lg md:text-2xl">
              You must be logged in to access library
            </h1>
            <button
              onClick={() => signIn("discord")}
              className="flex items-center gap-1 rounded-md bg-indigo-500 px-3 py-2 font-semibold duration-200 ease-in-out hover:bg-indigo-600 md:gap-2 md:text-lg"
            >
              <FaDiscord className="text-xl md:text-2xl" />
              <span>Login with Discord</span>
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
