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
    | { genre?: string | undefined; search?: string | undefined }
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

  console.log("genre", values ? values.genre : undefined);
  return (
    <div className="flex flex-col flex-wrap">
      <Input
        type="search"
        placeholder="Search..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <Combobox
        options={genresArr}
        value={values ? values.genre : undefined}
        onValueChange={(newValue) => {
          router.push(path + "?" + createQueryString("genre", newValue));
        }}
      ></Combobox>
    </div>
  );
}
