import Image from "next/image";
import Link from "next/link";
import React from "react";

type ProfileLinkProps = {
  title: string;
  href?: string;
  imgUrl: string;
};

const ProfileLink = ({ title, imgUrl, href }: ProfileLinkProps) => {
  return (
    <div className="flex-center gap-1">
      <Image src={imgUrl} alt="icon" width={20} height={20} />
      {href ? (
        <Link
          href={href}
          target="_blank"
          className="paragraph-medium text-accent-blue"
        >
          {title}
        </Link>
      ) : (
        <p className="paragraph-medium text-dark400_light700">{title}</p>
      )}
    </div>
  );
};

export default ProfileLink;
