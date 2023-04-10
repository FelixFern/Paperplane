import { useUser } from "@clerk/nextjs";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import LayoutContainer from "~/components/LayoutContainer";
import Post from "~/components/Post";
import Spinner from "~/components/Spinner";
import { api } from "~/utils/api";

const Profile = () => {
    const router = useRouter();
    const user = useUser();
    const ctx = api.useContext();
    const { slug } = router.query;
    const [numOfFollower, setNumOfFollower] = useState(0);
    const [numOfFollowing, setNumOfFollowing] = useState(0);

    const [isFollowing, setIsFollowing] = useState(false);

    // TRPC Query
    const { data: profileData } = api.profile.getProfileByUsername.useQuery({
        username: slug?.toString() ?? "",
    });

    const { mutate, isLoading: isTryFollowing } = api.follow.follow.useMutation(
        {
            onSuccess: () => {
                void ctx.follow.getFollowerList.invalidate();
            },
        }
    );

    const { data: followerData } = api.follow.getFollowerList.useQuery({
        followed: profileData?.user.id.toString() ?? "",
    });

    const { data: followingData } = api.follow.getFollowingList.useQuery({
        follower: profileData?.user.id.toString() ?? "",
    });

    const handleFollow = () => {
        mutate({
            followed: profileData?.user.id.toString() ?? "",
            follower: user.user?.id.toString() ?? "",
        });
        return;
    };

    useEffect(() => {
        setNumOfFollower(followerData?.length ?? 0);
        setNumOfFollowing(followingData?.length ?? 0);

        if (followerData && user.user?.id) {
            setIsFollowing(false);
            followerData?.map((data) => {
                if (data?.follower === user?.user.id) setIsFollowing(true);
                return;
            });
        }
    }, [followerData, followingData]);

    if (!followingData && !followerData && !profileData) {
        return (
            <div className="flex h-screen w-screen justify-center">
                <Spinner></Spinner>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>
                    {[
                        profileData?.user.firstName,
                        profileData?.user.lastName,
                    ].join(" ")}{" "}
                    (@{slug})
                </title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {!profileData ? (
                <div className="flex w-full justify-center">
                    <Spinner></Spinner>
                </div>
            ) : (
                <>
                    <div className="mb-4 flex items-start gap-4 border-b-[1px] border-zinc-200 py-4 md:py-0 md:pb-4 ">
                        <Image
                            src={profileData.user.profileImageUrl ?? ""}
                            alt="profile-image"
                            width={85}
                            height={85}
                            className="rounded-xl"
                        ></Image>
                        <div>
                            <h1 className="text-2xl font-bold">
                                {[
                                    profileData.user.firstName,
                                    profileData.user.lastName,
                                ].join(" ")}
                            </h1>
                            <h2 className="text-gray-400">
                                @{profileData.user.username}
                            </h2>
                            <div className="mt-1 flex gap-4">
                                <div
                                    className="duration-250 flex gap-1 transition-opacity hover:opacity-75"
                                    role="button"
                                    onClick={() => {
                                        router
                                            .push(
                                                `/profile/${
                                                    slug?.toString() ?? ""
                                                }/origami`
                                            )
                                            .catch((err) => console.error(err));
                                    }}
                                >
                                    <p className="font-bold">{numOfFollower}</p>
                                    <p className="font-light text-gray-700">
                                        Origami
                                    </p>
                                </div>
                                <div
                                    className="duration-250 flex gap-1 transition-opacity hover:opacity-75"
                                    role="button"
                                    onClick={() => {
                                        router
                                            .push(
                                                `/profile/${
                                                    slug?.toString() ?? ""
                                                }/folding`
                                            )
                                            .catch((err) => console.error(err));
                                    }}
                                >
                                    <p className="font-bold">
                                        {numOfFollowing}
                                    </p>
                                    <p className="font-light text-gray-700">
                                        Folding
                                    </p>
                                </div>
                            </div>
                            {user.user?.username === slug ? (
                                <button
                                    className="duration-250 mt-1 rounded-md border-2 border-zinc-900 px-4 py-1 text-sm font-medium text-black transition-colors hover:bg-zinc-700 hover:text-white"
                                    onClick={() => {
                                        router
                                            .push("/edit-profile")
                                            .catch((err) => {
                                                console.error(err);
                                            });
                                    }}
                                >
                                    Edit Profile
                                </button>
                            ) : isFollowing ? (
                                <button
                                    className="duration-250 mt-1 rounded-md border-2 border-zinc-900 px-4 py-1 text-sm font-medium text-black transition-colors hover:bg-zinc-700 hover:text-white"
                                    onClick={() => {
                                        handleFollow();
                                    }}
                                    disabled={isTryFollowing}
                                >
                                    Folded
                                </button>
                            ) : (
                                <button
                                    className="duration-250 mt-1 rounded-md border-2 border-zinc-600 bg-zinc-900 px-4 py-1 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:border-zinc-500 disabled:bg-zinc-400"
                                    onClick={() => {
                                        handleFollow();
                                    }}
                                    disabled={isTryFollowing}
                                >
                                    Fold
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="flex h-[70vh] flex-col gap-4 overflow-y-auto">
                        {profileData.posts?.map(({ post, author }) => (
                            <Post
                                key={post.id}
                                post={post}
                                author={author}
                            ></Post>
                        ))}
                    </div>
                </>
            )}
        </>
    );
};

export default Profile;