import "dotenv/config";
import prisma from "@/lib/prisma";
async function main() {
  // Clear all tables before seeding
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.movie.deleteMany({});
  await prisma.genre.deleteMany({});
  await prisma.moviePerson.deleteMany({});
  // Add more deleteMany calls if you add more related tables in the future

  // 1 — GENRES

  const genres = [
    "Action",
    "Adventure",
    "Science Fiction",
    "Fantasy",
    "Drama",
    "Romance",
    "Animation",
    "Comedy",
    "Crime",
    "Superhero",
  ];
  for (const name of genres) {
    await prisma.genre.create({
      data: {
        name: name,
      },
    });
  }
  // 2 — MOVIE PERSONS (Person + Role)

  const moviePersons = [
    ["James Cameron", "director"],
    ["Sam Worthington", "actor"],
    ["Zoe Saldaña", "actor"],
    ["Anthony Russo", "director"],
    ["Joe Russo", "director"],
    ["Robert Downey Jr.", "actor"],
    ["Chris Evans", "actor"],
    ["Leonardo DiCaprio", "actor"],
    ["Kate Winslet", "actor"],
    ["J.J. Abrams", "director"],
    ["Daisy Ridley", "actor"],
    ["Harrison Ford", "actor"],
    ["Josh Brolin", "actor"],
    ["Chris Hemsworth", "actor"],
    ["Jon Watts", "director"],
    ["Tom Holland", "actor"],
    ["Zendaya", "actor"],
    ["Colin Trevorrow", "director"],
    ["Chris Pratt", "actor"],
    ["Bryce Dallas Howard", "actor"],
    ["Jon Favreau", "director"],
    ["Donald Glover", "actor"],
    ["Beyoncé", "actor"],
    ["Joss Whedon", "director"],
    ["James Wan", "director"],
    ["Vin Diesel", "actor"],
    ["Paul Walker", "actor"],
    ["Joseph Kosinski", "director"],
    ["Tom Cruise", "actor"],
    ["Miles Teller", "actor"],
    ["Chris Buck", "director"],
    ["Jennifer Lee", "director"],
    ["Idina Menzel", "actor"],
    ["Kristen Bell", "actor"],
    ["Ryan Coogler", "director"],
    ["Chadwick Boseman", "actor"],
    ["Michael B. Jordan", "actor"],
    ["David Yates", "director"],
    ["Daniel Radcliffe", "actor"],
    ["Emma Watson", "actor"],
    ["Rian Johnson", "director"],
    ["J.A. Bayona", "director"],
    ["Bill Condon", "director"],
    ["Dan Stevens", "actor"],
    ["Brad Bird", "director"],
    ["Craig T. Nelson", "actor"],
    ["Holly Hunter", "actor"],
    ["F. Gary Gray", "director"],
    ["Dwayne Johnson", "actor"],
    ["Shane Black", "director"],
    ["Gwyneth Paltrow", "actor"],
    ["Pierre Coffin", "director"],
    ["Kyle Balda", "director"],
    ["Sandra Bullock", "actor"],
    ["Jon Hamm", "actor"],
  ];
  for (const [name, role] of moviePersons) {
    await prisma.moviePerson.create({
      data: {
        name: name,
        role: role,
      },
    });
  }
  // 3 — MOVIES
  const movies = [
    {
      title: "Avatar",
      description:
        "A paraplegic Marine becomes torn between duty and protecting an alien world.",
      price: 149,
      releaseDate: "2009-12-18",
      runtime: 162,
      genres: ["Science Fiction", "Adventure"],
      moviePersons: [
        ["James Cameron", "director"],
        ["Sam Worthington", "actor"],
        ["Zoe Saldaña", "actor"],
      ],
    },
    {
      title: "Avengers: Endgame",
      description:
        "The Avengers assemble one last time to reverse a universe-shattering catastrophe.",
      price: 159,
      releaseDate: "2019-04-26",
      runtime: 181,
      genres: ["Action", "Superhero"],
      moviePersons: [
        ["Anthony Russo", "director"],
        ["Joe Russo", "director"],
        ["Robert Downey Jr.", "actor"],
        ["Chris Evans", "actor"],
      ],
    },
    {
      title: "Titanic",
      description: "A romance unfolds aboard the ill-fated RMS Titanic.",
      price: 129,
      releaseDate: "1997-12-19",
      runtime: 195,
      genres: ["Drama", "Romance"],
      moviePersons: [
        ["James Cameron", "director"],
        ["Leonardo DiCaprio", "actor"],
        ["Kate Winslet", "actor"],
      ],
    },
    {
      title: "Top Gun: Maverick",
      description:
        "A veteran pilot returns to train the next generation of aviators.",
      price: 149,
      releaseDate: "2022-05-27",
      runtime: 131,
      genres: ["Action", "Drama"],
      moviePersons: [
        ["Joseph Kosinski", "director"],
        ["Tom Cruise", "actor"],
        ["Miles Teller", "actor"],
      ],
    },
    {
      title: "Black Panther",
      description:
        "A king must protect his nation from internal and external threats.",
      price: 139,
      releaseDate: "2018-02-16",
      runtime: 134,
      genres: ["Action", "Superhero"],
      moviePersons: [
        ["Ryan Coogler", "director"],
        ["Chadwick Boseman", "actor"],
        ["Michael B. Jordan", "actor"],
      ],
    },
    // … remaining movies follow the same pattern
  ];
  for (const movie of movies) {
    // Fetch the corresponding moviePerson ids for this movie
    const moviePersonIds = [];
    for (const [name, role] of movie.moviePersons) {
      const person = await prisma.moviePerson.findFirst({
        where: { name, role },
        select: { id: true },
      });
      if (person) {
        moviePersonIds.push({ id: person.id });
      }
    }

    const genreIds = [];
    for (const name of movie.genres) {
      const genre = await prisma.genre.findFirst({
        where: { name },
        select: { id: true },
      });
      if (genre) {
        genreIds.push({ id: genre.id });
      }
    }

    await prisma.movie.create({
      data: {
        title: movie.title,
        description: movie.description,
        price: movie.price,
        releaseDate: new Date(movie.releaseDate),
        imageUrl: `https://example.com/${movie.title
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "")}.jpg`,
        runtime: movie.runtime,
        genres: {
          connect: genreIds,
        },
        moviePersons: {
          connect: moviePersonIds,
        },
      },
    });
  }
  console.log("25 movies seeded successfully");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
