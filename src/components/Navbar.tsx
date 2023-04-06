import { useClerk, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { BiPaperPlane } from "react-icons/bi";

const Navbar = () => {
    const [toggleMenu, setToggleMenu] = useState<boolean>(false);
    const user = useUser();
    const { signOut } = useClerk();
    const router = useRouter();

    const handleSignOut = () => {
        signOut()
            .then(() => {
                router.push("/").catch((err) => {
                    console.error(err);
                });
            })
            .catch((err) => {
                console.error(err);
            });
    };

    return (
        <>
            <div
                className={`${
                    toggleMenu ? "hidden md:block" : "hidden"
                } absolute left-0 top-0 h-screen w-screen bg-white opacity-80`}
            ></div>
            <div className="flex w-full flex-col items-center justify-between gap-4 pt-6 md:flex-row md:py-6">
                <div
                    className="flex gap-2"
                    role="button"
                    onClick={() => {
                        router.push("/home").catch((err) => {
                            console.error(err);
                        });
                    }}
                >
                    <div className="text-3xl">
                        <BiPaperPlane></BiPaperPlane>
                    </div>
                    <h1 className="text-2xl font-bold">Paperplane.</h1>
                </div>
                <div className="relative flex w-full items-start gap-2 md:w-fit md:items-end">
                    <div className="z-50 flex flex-row-reverse items-center gap-4 md:flex-row">
                        <div className="flex flex-col items-start md:items-end">
                            <p className="text-md mb-[-4px]">Hello,</p>
                            <h1 className="text-xl font-bold">
                                {user.user?.fullName}
                            </h1>
                        </div>
                        <Image
                            src={user.user?.profileImageUrl ?? ""}
                            alt="profile-image"
                            width={45}
                            height={45}
                            className="rounded-xl"
                            role="button"
                            onClick={() => setToggleMenu(!toggleMenu)}
                        ></Image>
                    </div>
                    <div
                        className={`absolute right-0 top-0 mt-2 flex w-fit gap-2 transition-transform duration-500 md:top-full md:mt-4 md:flex-col ${
                            toggleMenu
                                ? "md:translate-x-[0]"
                                : "md:translate-x-[500%]"
                        }`}
                    >
                        <button
                            className="duration-250 rounded-md border-2 border-zinc-900 px-4 py-1 text-sm font-medium text-black transition-colors hover:bg-zinc-700 hover:text-white"
                            onClick={() => {
                                router.push("/edit-profile").catch((err) => {
                                    console.error(err);
                                });
                            }}
                        >
                            Edit Profile
                        </button>
                        <button
                            className="duration-250 rounded-md border-2 border-zinc-600 bg-zinc-900 px-4 py-1 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
                            onClick={() => handleSignOut()}
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;