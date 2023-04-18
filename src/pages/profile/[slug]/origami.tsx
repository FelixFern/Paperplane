import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { BiArrowBack } from "react-icons/bi";
import UserCard from "~/components/Profile/UserCard";
import ViewSwitcher from "~/components/Profile/ViewSwitcher";
import Spinner from "~/components/Spinner";
import { api } from "~/utils/api";

const Origami = () => {
    const router = useRouter();
    const { slug } = router.query;

    // TRPC Query
    const { data: profileData } = api.profile.getProfileByUsername.useQuery({
        username: slug?.toString() ?? "",
    });

    const { data: followerData } = api.follow.getFollowerList.useQuery({
        followed: profileData?.user.id.toString() ?? "",
    });

    if (!followerData && !profileData) {
        return (
            <div className="flex h-screen w-screen justify-center">
                <Spinner></Spinner>
            </div>
        );
    }
    return (
        <>
            <Head>
                <title>@{slug} Origamis</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="flex items-center gap-4 py-4 md:py-2">
                <div
                    className="text-xl transition-transform duration-200 hover:translate-x-[-2px] hover:opacity-75"
                    role="button"
                    onClick={() => {
                        router
                            .push(`/profile/${slug?.toString() ?? ""}`)
                            .catch((err) => {
                                console.log(err);
                            });
                    }}
                >
                    <BiArrowBack></BiArrowBack>
                </div>
                <div className="">
                    <h1 className="text-lg font-bold">
                        {[
                            profileData?.user.firstName,
                            profileData?.user.lastName,
                        ].join(" ")}
                    </h1>
                    <h2 className="mt-[-4px] text-gray-400">@{slug}</h2>
                </div>
            </div>
            <ViewSwitcher
                slug={slug?.toString() ?? ""}
                view="origamis"
            ></ViewSwitcher>
            <div>
                {followerData?.follower_list?.map((follower) => (
                    <div key={follower?.id}>
                        <UserCard userData={follower}></UserCard>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Origami;
