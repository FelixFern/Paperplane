import { useUser } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/dist/api";
import { clerkClient } from "@clerk/nextjs/server";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import LayoutContainer from "~/components/LayoutContainer";
import Post from "~/components/Post";
import Spinner from "~/components/Spinner";
import { api } from "~/utils/api";

const Profile = () => {
    const user = useUser();
    const router = useRouter();
    const { slug } = router.query;
    const { data, isLoading } = api.posts.getPostById.useQuery({
        authorId: slug?.toString() ?? "",
    });
    const [profile, setProfile] = useState<User>();

    useEffect(() => {
        if (!user.isSignedIn) {
            router.push("/").catch((err) => {
                console.error(err);
            });
        }
        // clerkClient.users
        //     .getUser(slug?.toString() ?? "")
        //     .then((res) => {
        //         setProfile(res);
        //     })
        //     .catch((err) => {
        //         console.error(err);
        //     });
    }, []);

    if (!user.isLoaded) {
        return (
            <div className="flex h-screen w-screen items-center justify-center">
                <Spinner></Spinner>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Paperplane | Homepage</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <LayoutContainer>
                <div>
                    {/* <Image
                        src={profile.profileImageUrl ?? ""}
                        alt="profile-image"
                        width={100}
                        height={100}
                        className="rounded-xl"
                    ></Image> */}
                    <div>
                        <h1>{user?.user?.fullName}</h1>
                    </div>
                </div>
                {isLoading ? (
                    <div className="flex w-full justify-center">
                        <Spinner></Spinner>
                    </div>
                ) : (
                    <div className="flex h-[62.5vh] flex-col gap-4 overflow-y-auto">
                        {data?.map(({ post, author }) => (
                            <Post
                                key={post.id}
                                post={post}
                                author={author}
                            ></Post>
                        ))}
                    </div>
                )}
            </LayoutContainer>
        </>
    );
};

export default Profile;
