import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Start seeding database...");

  // 1. Create Genres
  const action = await prisma.genre.upsert({
    where: { id: "genre-action" },
    update: {},
    create: {
      id: "genre-action",
      name: "Action",
      description: "Fast-paced and exciting movies",
    },
  });

  const comedy = await prisma.genre.upsert({
    where: { id: "genre-comedy" },
    update: {},
    create: {
      id: "genre-comedy",
      name: "Comedy",
      description: "Movies that make you laugh",
    },
  });

  const drama = await prisma.genre.upsert({
    where: { id: "genre-drama" },
    update: {},
    create: {
      id: "genre-drama",
      name: "Drama",
      description: "Serious and plot-driven movies",
    },
  });

  // 2. Create People (Directors/Actors)
  const nolan = await prisma.moviePerson.create({
    data: {
      name: "Christopher Nolan",
      role: "Director",
    },
  });

  const dicaprio = await prisma.moviePerson.create({
    data: {
      name: "Leonardo DiCaprio",
      role: "Actor",
    },
  });

  // 3. Create Movies
  await prisma.movie.create({
    data: {
      title: "Inception",
      description:
        "A thief who steals corporate secrets through the use of dream-sharing technology...",
      price: 149,
      releaseDate: new Date("2010-07-16"),
      imageUrl:
        "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
      runtime: 148,
      stock: 10,
      genres: {
        connect: [{ id: action.id }, { id: drama.id }],
      },
      moviePersons: {
        connect: [{ id: nolan.id }, { id: dicaprio.id }],
      },
    },
  });

  await prisma.movie.create({
    data: {
      title: "The Dark Knight",
      description:
        "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham...",
      price: 129,
      releaseDate: new Date("2008-07-18"),
      imageUrl:
        "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      runtime: 152,
      stock: 5,
      genres: {
        connect: [{ id: action.id }, { id: drama.id }],
      },
      moviePersons: {
        connect: [{ id: nolan.id }],
      },
    },
  });

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
