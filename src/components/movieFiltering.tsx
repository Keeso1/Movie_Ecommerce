"use client";
import { Combobox } from "./ui/combo-box";
import { getGenresType } from "@/actions/movie-actions";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Input } from "./ui/input";
import useDebounce from "@/hooks/debounce";

export default function MovieFilter({
  genres,
  values,
}: {
  genres: getGenresType;
  values:
    | {
        genre?: string | undefined;
        search?: string | undefined;
        sort?: string | undefined;
      }
    | undefined;
}) {
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(values?.search ?? "");
  const debouncedSearchValue = useDebounce(searchValue, 500);

  const genresArr = genres.map((genre) => ({
    value: genre.name,
    label: genre.name,
  }));

  const sortingArr = [
    { value: "expensive", label: "Highest Price" },
    { value: "cheapest", label: "Lowest Price" },
    { value: "oldest", label: "Oldest" },
    { value: "recent", label: "Recent" },
  ];

  const createQueryString = useCallback(
    (name: string, value: string | undefined) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }

      return params.toString();
    },
    [searchParams],
  );

  useEffect(() => {
    if (debouncedSearchValue !== (values?.search ?? "")) {
      router.push(
        path + "?" + createQueryString("search", debouncedSearchValue),
      );
    }
  }, [debouncedSearchValue, values?.search, path, createQueryString, router]);

  return (
    <div className="flex flex-col gap-2 p-10">
      <Input
        type="search"
        placeholder="Search..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <Combobox
        options={genresArr}
        value={values ? values.genre : undefined}
        onValueChangeAction={(newValue) => {
          router.push(path + "?" + createQueryString("genre", newValue));
        }}
        placeholder="Search for a genre.."
      ></Combobox>
      <Combobox
        options={sortingArr}
        value={values ? values.sort : undefined}
        onValueChangeAction={(newValue) => {
          router.push(path + "?" + createQueryString("sort", newValue));
        }}
        placeholder="Search for a filtering option"
      ></Combobox>
    </div>
  );
}
