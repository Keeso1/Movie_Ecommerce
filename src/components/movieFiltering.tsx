import { Combobox } from "./ui/combo-box";
import { getGenresType } from "@/actions/movie-actions";

export default function MovieFilter({genres, value, setValue} : {genres: getGenresType, value: string | undefined, setValue: (value: string | undefined) => void}){
  const genresArr = genres.map((genre) => ({value : genre.name, label: genre.name}))
  return (
    <div className="flex flex-col flex-wrap">
      <Combobox options={genresArr} value={value} onValueChange={setValue}></Combobox>
    </div>
  );
}
