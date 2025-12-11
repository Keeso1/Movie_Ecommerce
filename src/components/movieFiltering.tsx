import { Combobox } from "./ui/combo-box";
import { Input } from "./ui/input";
import { getGenresType } from "@/actions/movie-actions";

export default function MovieFilter({genres} : {genres: getGenresType}){
    const genresArr = genres.map((genre) => ({value : genre.name, label: genre.name}))
    return (
        <div className="flex flex-col flex-wrap">
            <Input></Input>
            <Combobox options={genresArr}></Combobox>
        </div>
        
    )
}