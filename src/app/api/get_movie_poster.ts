import "dotenv/config";

const apiKey = process.env.TMDB_API_KEY2;

export async function getPosterUrl(query: string) {
  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
      query
    )}`
  );
  const data = await res.json();
  if (data.results && data.results.length > 0) {
    const posterPath = data.results[0].poster_path;
    const posterUrl = `https://image.tmdb.org/t/p/w500${posterPath}`;
    console.log("Poster URL:", posterUrl);
    return posterUrl;
  } else {
    console.log("No results found.");
    return null;
  }
}
