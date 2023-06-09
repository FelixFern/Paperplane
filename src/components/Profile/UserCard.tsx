import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";
import Spinner from "../Spinner/Spinner";
import { useUserCard } from "./useUserCard";

export type UserType = {
    id?: string;
    username?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    profileImageUrl?: string;
};

const UserCard = ({ userData }: { userData: UserType }) => {
    const router = useRouter();
    const {
        followingData,
        isTryFollowing,
        isFollowing,
        user,
        isSelf,
        handleFollow,
    } = useUserCard({
        userData: userData,
    });

    if (!followingData) {
        return (
            <div className="flex justify-center w-screen h-screen">
                <Spinner></Spinner>
            </div>
        );
    }

    return (
        <div
            className="flex items-center gap-4 px-8 py-4 duration-250 hover:bg-zinc-100"
            role="button"
            onClick={() => {
                router
                    .push(`/profile/${userData?.username ?? ""}`)
                    .catch((err) => {
                        console.error(err);
                    });
            }}
        >
            <Image
                src={userData?.profileImageUrl ?? ""}
                alt="profile-image"
                width={50}
                height={50}
                className="transition-opacity rounded-xl "
            ></Image>
            <div className="flex items-center justify-between w-full">
                <div>
                    <h1 className="font-bold">
                        {[userData.firstName, userData.lastName].join(" ")}
                    </h1>
                    <p className="text-md mt-[-4px] text-gray-400">
                        {userData?.username
                            ? `@${userData?.username}`
                            : "@user"}
                    </p>
                </div>
                {user && !isSelf ? (
                    <>
                        {isFollowing ? (
                            <button
                                className="px-4 py-1 mt-1 text-sm font-medium text-black transition-colors border-2 rounded-md duration-250 border-zinc-900 hover:bg-zinc-700 hover:text-white disabled:border-zinc-500 disabled:bg-zinc-400"
                                onClick={() => {
                                    handleFollow();
                                }}
                                disabled={isTryFollowing}
                            >
                                Folded
                            </button>
                        ) : (
                            <button
                                className="px-4 py-1 mt-1 text-sm font-medium text-white transition-colors border-2 rounded-md duration-250 border-zinc-600 bg-zinc-900 hover:bg-zinc-700 disabled:border-zinc-500 disabled:bg-zinc-400"
                                onClick={() => {
                                    handleFollow();
                                }}
                                disabled={isTryFollowing}
                            >
                                Fold
                            </button>
                        )}
                    </>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
};

export default UserCard;
