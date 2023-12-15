import { getTopInteractedTags } from "@/lib/actions/tag.action";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import RenderTag from "../shared/RenderTag";
import { Badge } from "../ui/badge";

type UserCardProps = {
  user: {
    _id: string;
    clerkId: string;
    picture: string;
    name: string;
    username: string;
  };
};

const UserCard = async ({ user }: UserCardProps) => {
  const interactedTags = await getTopInteractedTags({ userId: user._id });

  return (
    <div className="w-full rounded-3xl font-inter shadow dark:shadow-none max-xs:min-w-full xs:w-[260px] ">
      <div className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-3xl   border p-8">
        <Link href={`/profile/${user.clerkId}`}>
          <Image
            src={user.picture}
            alt="user profile picture"
            width={100}
            height={100}
            className="rounded-full"
          />
          <div className="mt-4 text-center">
            <h3 className="h3-bold text-dark200_light900 line-clamp-1">
              {user.name}
            </h3>
            <p className="body-regular text-dark500_light500 mt-2">
              @{user.username}
            </p>
          </div>
        </Link>
        <div className="mt-5">
          {interactedTags!.length > 0 ? (
            <div className="flex items-center gap-4">
              {interactedTags?.map((tag: any) => (
                <RenderTag _id={tag._id} name={tag.name} key={tag._id} />
              ))}
            </div>
          ) : (
            <Badge>No tags yet</Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCard;
