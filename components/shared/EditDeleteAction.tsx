"use client";
import { deleteAnswer } from "@/lib/actions/answer.action";
import { deleteQuestion } from "@/lib/actions/question.action";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

type EditDeleteActionProps = {
  type: string;
  itemId: string;
};

const EditDeleteAction = ({ type, itemId }: EditDeleteActionProps) => {
  const pathName = usePathname();
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/question/edit/${itemId}`);
  };
  const handleDelete = async () => {
    if (type === "Question") {
      await deleteQuestion({ questionId: itemId, path: pathName });
    } else if (type === "Answer") {
      // delte answer
      await deleteAnswer({
        answerId: itemId,
        path: pathName,
      });
    }
  };

  return (
    <div className="flex items-center justify-end gap-3 max-sm:w-full">
      {type === "Question" && (
        <Image
          src="/assets/icons/edit.svg"
          alt="Edit"
          width={14}
          height={14}
          className="cursor-pointer object-contain"
          onClick={handleEdit}
        />
      )}
      <Image
        src="/assets/icons/trash.svg"
        alt="Edit"
        width={14}
        height={14}
        className="cursor-pointer object-contain"
        onClick={handleDelete}
      />
    </div>
  );
};

export default EditDeleteAction;
