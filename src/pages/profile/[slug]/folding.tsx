import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { BiArrowBack } from "react-icons/bi";
import { api } from "~/utils/api";
import Spinner from "~/components/Spinner";
import ViewSwitcher from "~/components/Profile/ViewSwitcher";
import UserCard from "~/components/Profile/UserCard";

const Folding = () => {
    const router = useRouter();
    const { slug } = router.query;

    const { data: profileData } = api.profile.getProfileByUsername.useQuery({
        username: slug?.toString() ?? "",
    });

    const { data: followingData } = api.follow.getFollowingList.useQuery({
        follower: profileData?.user.id.toString() ?? "",
    });

    if (!followingData && !profileData) {
        return (
            <div className="flex h-screen w-screen justify-center">
                <Spinner></Spinner>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>@{slug} Foldings</title>
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
                view="foldings"
            ></ViewSwitcher>
            <div>
                {followingData?.following_list?.map((following) => (
                    <div key={following?.id}>
                        <UserCard userData={following}></UserCard>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Folding;
