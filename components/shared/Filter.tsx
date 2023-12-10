"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

type FilterProps = {
  filters: { name: string; value: string }[];
  otherClasses?: string;
  containerClasses?: string;
};

const Filter = ({ filters, otherClasses, containerClasses }: FilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("filter");

  const handleUpdateParams = (value: string) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "filter",
      value: value.toLowerCase(),
    });
    router.push(newUrl, { scroll: false });
  };

  return (
    <div className={`relative font-inter ${containerClasses}`}>
      <Select
        onValueChange={(value) => handleUpdateParams(value)}
        defaultValue={query || ""}
      >
        <SelectTrigger
          className={`${otherClasses} body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5`}
        >
          <div className="line-clamp-1 flex-1 text-left">
            <SelectValue placeholder="Select a Filter" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {filters.map((filter, index) => (
            <SelectItem key={index} value={filter.value}>
              {filter.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filter;
