/* eslint-disable react-hooks/exhaustive-deps */
import { useUser } from "@clerk/nextjs";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { api } from "~/utils/api";

import CreatePost from "~/components/CreatePost";
import Post from "~/components/Post";
import Spinner from "~/components/Spinner";
import LayoutContainer from "~/components/LayoutContainer";

const Home = () => {
    const user = useUser();
    const router = useRouter();
    const { data, isLoading } = api.posts.getAll.useQuery();

    useEffect(() => {
        if (!user.isSignedIn) {
            router.push("/").catch((err) => {
                console.error(err);
            });
        }
    }, []);

    if (!user.isLoaded) {
        return (
            <div className="flex h-screen w-screen items-center justify-center">
                <Spinner></Spinner>
            </div>
        );
    }
    return (
        <div>
            <Head>
                <title>Paperplane | Homepage</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <LayoutContainer>
                <div className="mt-8">
                    <CreatePost></CreatePost>
                </div>
                <div className="my-4 h-[2px] w-full bg-zinc-300"></div>
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
        </div>
    );
};

export default Home;