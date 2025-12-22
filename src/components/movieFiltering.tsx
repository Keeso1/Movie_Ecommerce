"use client";
import { Combobox } from "./ui/combo-box";
import { getGenresType } from "@/actions/movie-actions";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export default function MovieFilter({
  genres,
  value,
}: {
  genres: getGenresType;
  value: string | undefined;
}) {
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();

  const genresArr = genres.map((genre) => ({
    value: genre.name,
    label: genre.name,
  }));

  const createQueryString = useCallback(
    (name: string, value: string | undefined) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      }

      return params.toString();
    },
    [searchParams],
  );

  console.log("searchParams", searchParams);
  console.log("value", value);
  return (
    <div className="flex flex-col flex-wrap">
      <Combobox
        options={genresArr}
        value={value}
        onValueChange={(newValue) => {
          router.push(path + "?" + createQueryString("genre", newValue));
        }}
      ></Combobox>
    </div>
  );
}
