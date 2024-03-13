import { MdAccountCircle, MdCancel } from "react-icons/md";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";

type NavProps = {
  genres?: string[];
};

export default function Nav({ genres }: NavProps) {
  const { data: session, status } = useSession();

  // Used to show/hide user account modal, on clicking profile picture
  const [showProfile, setShowProfile] = useState(false);

  // Used to show/hide genres list, on hovering genres on the nav
  const [showDropdown, setShowDropdown] = useState(false);

  // Used to conditionally render either Home or Library button in the nav
  const { pathname } = useRouter();

  return (
    <>
      <nav className="relative z-40 flex w-full items-center justify-between bg-zinc-800 px-2 text-white md:px-4">
        <div className="relative flex items-center gap-2 px-4 py-3 md:gap-4">
          <h1 className="cursor-pointer text-xl font-bold md:px-2 md:text-3xl">
            AnyFlex
          </h1>
          <div className="h-[2rem] w-0.5 bg-zinc-600"></div>
          <Link
            href={pathname === "/" ? "/library/" : "/"}
            className="cursor-pointer text-gray-300 duration-200 ease-in-out hover:text-white"
          >
            {pathname === "/" ? "Library" : "Home"}
          </Link>
          <div className={`relative h-full ${genres ? "block" : "hidden"}`}>
            <span
              className="relative z-20 cursor-pointer py-[100%] text-gray-300 duration-200 ease-in-out hover:text-white"
              onMouseOver={() => setShowDropdown(true)}
              onMouseOut={() => setShowDropdown(false)}
            >
              Genre
            </span>
            <ul
              className={`absolute left-1/2 top-[2.5rem] z-30 max-h-48 -translate-x-1/2 flex-col gap-2 overflow-y-scroll rounded-lg border-[1px] border-zinc-700 bg-zinc-800 p-3 md:max-h-72 ${showDropdown ? "flex" : "hidden"}`}
              onMouseOver={() => setShowDropdown(true)}
              onMouseOut={() => setShowDropdown(false)}
            >
              {genres?.map((genre, index) => (
                <li key={index}>
                  <button className="w-full rounded-lg bg-transparent px-3 py-1 text-left duration-200 ease-in-out hover:bg-zinc-700">
                    {genre}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {status === "authenticated" ? (
          session?.user?.image && (
            <>
              <Image
                onClick={() => setShowProfile(true)}
                height={0}
                width={0}
                className="h-[36px] w-[36px] cursor-pointer rounded-full"
                sizes="100vw"
                alt="Profile picture"
                src={session.user.image}
              ></Image>
              <div
                className={`fixed inset-0 z-50 h-full w-full animate-fade-in place-content-center bg-black-rgba backdrop-blur-lg duration-300 ${showProfile ? "grid" : "hidden"}`}
              >
                <div className="relative inset-0 flex min-w-[250px] flex-col items-center justify-between gap-4 rounded-md bg-zinc-900 p-4 md:min-w-[400px] md:max-w-[500px] md:flex-row">
                  <Image
                    height={100}
                    width={100}
                    className="max-h-[100px] max-w-[100px] shrink-0 rounded-full"
                    sizes="100vw"
                    alt="Profile picture"
                    src={session.user.image}
                  ></Image>
                  <div className="flex h-full w-full flex-col justify-center gap-4">
                    <div className="flex flex-col text-center text-xl font-semibold md:text-start md:text-2xl">
                      <span>Logged in as</span>
                      <span className="break-all">
                        {`@${session.user.name}`}
                      </span>
                    </div>
                    <button
                      onClick={() => signOut()}
                      className="rounded-sm bg-zinc-700 px-2 py-1 text-xl duration-200 ease-in-out hover:bg-zinc-800"
                    >
                      Log Out
                    </button>
                  </div>
                  <MdCancel
                    onClick={() => setShowProfile(false)}
                    className="absolute -right-2 -top-2 cursor-pointer text-2xl duration-200 ease-in-out hover:text-zinc-400 md:text-3xl"
                  />
                </div>
              </div>
            </>
          )
        ) : (
          <button
            onClick={() => signIn("discord")}
            className="cursor-pointer px-4 text-2xl text-gray-300 duration-200 ease-in-out hover:text-white md:text-4xl"
          >
            <MdAccountCircle />
          </button>
        )}
      </nav>
    </>
  );
}
