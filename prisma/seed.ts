import "dotenv/config";
import prisma from "@/lib/prisma";
import { getPosterUrl } from "@/app/api/get_movie_poster";
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
    ["Mark Hamill", "actor"],
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
    {
      title: "Avatar: The Way of Water",
      description:
        "Jake Sully and his family face a new threat in the oceans of Pandora.",
      price: 159,
      releaseDate: "2022-12-16",
      runtime: 192,
      genres: ["Science Fiction", "Adventure"],
      moviePersons: [
        ["James Cameron", "director"],
        ["Sam Worthington", "actor"],
        ["Zoe Saldaña", "actor"],
      ],
    },
    {
      title: "Star Wars: The Force Awakens",
      description:
        "A new generation rises as the dark side returns to the galaxy.",
      price: 149,
      releaseDate: "2015-12-18",
      runtime: 138,
      genres: ["Science Fiction", "Fantasy"],
      moviePersons: [
        ["J.J. Abrams", "director"],
        ["Daisy Ridley", "actor"],
        ["Harrison Ford", "actor"],
      ],
    },
    {
      title: "Avengers: Infinity War",
      description:
        "The Avengers confront Thanos in a battle for the fate of the universe.",
      price: 149,
      releaseDate: "2018-04-27",
      runtime: 149,
      genres: ["Action", "Superhero"],
      moviePersons: [
        ["Anthony Russo", "director"],
        ["Joe Russo", "director"],
        ["Josh Brolin", "actor"],
        ["Chris Hemsworth", "actor"],
      ],
    },
    {
      title: "Spider-Man: No Way Home",
      description:
        "Peter Parker faces multiversal consequences after his identity is revealed.",
      price: 149,
      releaseDate: "2021-12-17",
      runtime: 148,
      genres: ["Action", "Superhero"],
      moviePersons: [
        ["Jon Watts", "director"],
        ["Tom Holland", "actor"],
        ["Zendaya", "actor"],
      ],
    },
    {
      title: "Jurassic World",
      description: "A fully operational dinosaur park descends into chaos.",
      price: 139,
      releaseDate: "2015-06-12",
      runtime: 124,
      genres: ["Adventure", "Science Fiction"],
      moviePersons: [
        ["Colin Trevorrow", "director"],
        ["Chris Pratt", "actor"],
        ["Bryce Dallas Howard", "actor"],
      ],
    },
    {
      title: "The Lion King",
      description:
        "A young lion prince flees his kingdom after the murder of his father.",
      price: 139,
      releaseDate: "2019-07-19",
      runtime: 118,
      genres: ["Animation", "Drama"],
      moviePersons: [
        ["Jon Favreau", "director"],
        ["Donald Glover", "actor"],
        ["Beyoncé", "actor"],
      ],
    },
    {
      title: "The Avengers",
      description: "Earth’s mightiest heroes unite to stop an alien invasion.",
      price: 139,
      releaseDate: "2012-05-04",
      runtime: 143,
      genres: ["Action", "Superhero"],
      moviePersons: [
        ["Joss Whedon", "director"],
        ["Robert Downey Jr.", "actor"],
        ["Chris Evans", "actor"],
      ],
    },
    {
      title: "Furious 7",
      description:
        "The crew faces their most personal and dangerous enemy yet.",
      price: 129,
      releaseDate: "2015-04-03",
      runtime: 137,
      genres: ["Action", "Crime"],
      moviePersons: [
        ["James Wan", "director"],
        ["Vin Diesel", "actor"],
        ["Paul Walker", "actor"],
      ],
    },
    {
      title: "Frozen II",
      description:
        "Elsa journeys beyond Arendelle to discover the origin of her powers.",
      price: 129,
      releaseDate: "2019-11-22",
      runtime: 103,
      genres: ["Animation", "Fantasy"],
      moviePersons: [
        ["Chris Buck", "director"],
        ["Jennifer Lee", "director"],
        ["Idina Menzel", "actor"],
        ["Kristen Bell", "actor"],
      ],
    },
    {
      title: "Avengers: Age of Ultron",
      description:
        "The Avengers battle an artificial intelligence bent on human extinction.",
      price: 139,
      releaseDate: "2015-05-01",
      runtime: 141,
      genres: ["Action", "Superhero"],
      moviePersons: [
        ["Joss Whedon", "director"],
        ["Robert Downey Jr.", "actor"],
        ["Chris Evans", "actor"],
      ],
    },
    {
      title: "Harry Potter and the Deathly Hallows – Part 2",
      description:
        "The final confrontation between Harry Potter and Lord Voldemort unfolds.",
      price: 129,
      releaseDate: "2011-07-15",
      runtime: 130,
      genres: ["Fantasy", "Adventure"],
      moviePersons: [
        ["David Yates", "director"],
        ["Daniel Radcliffe", "actor"],
        ["Emma Watson", "actor"],
      ],
    },
    {
      title: "Star Wars: The Last Jedi",
      description:
        "The Resistance struggles to survive as the Force takes on new meaning.",
      price: 139,
      releaseDate: "2017-12-15",
      runtime: 152,
      genres: ["Science Fiction", "Fantasy"],
      moviePersons: [
        ["Rian Johnson", "director"],
        ["Mark Hamill", "actor"],
        ["Daisy Ridley", "actor"],
      ],
    },
    {
      title: "Jurassic World: Fallen Kingdom",
      description:
        "Dinosaurs face extinction again as humanity struggles to control nature.",
      price: 129,
      releaseDate: "2018-06-22",
      runtime: 128,
      genres: ["Adventure", "Science Fiction"],
      moviePersons: [
        ["J.A. Bayona", "director"],
        ["Chris Pratt", "actor"],
        ["Bryce Dallas Howard", "actor"],
      ],
    },
    {
      title: "Frozen",
      description:
        "Two royal sisters set out on a journey to end an eternal winter.",
      price: 119,
      releaseDate: "2013-11-27",
      runtime: 102,
      genres: ["Animation", "Fantasy"],
      moviePersons: [
        ["Chris Buck", "director"],
        ["Jennifer Lee", "director"],
        ["Kristen Bell", "actor"],
        ["Idina Menzel", "actor"],
      ],
    },
    {
      title: "Beauty and the Beast",
      description:
        "A young woman discovers compassion and love beneath a cursed exterior.",
      price: 129,
      releaseDate: "2017-03-17",
      runtime: 129,
      genres: ["Fantasy", "Romance"],
      moviePersons: [
        ["Bill Condon", "director"],
        ["Emma Watson", "actor"],
        ["Dan Stevens", "actor"],
      ],
    },
    {
      title: "Incredibles 2",
      description:
        "The Parr family returns to action as superheroes while balancing family life.",
      price: 129,
      releaseDate: "2018-06-15",
      runtime: 118,
      genres: ["Animation", "Action"],
      moviePersons: [
        ["Brad Bird", "director"],
        ["Craig T. Nelson", "actor"],
        ["Holly Hunter", "actor"],
      ],
    },
    {
      title: "The Fate of the Furious",
      description:
        "Family is tested when Dom is forced to betray those closest to him.",
      price: 129,
      releaseDate: "2017-04-14",
      runtime: 136,
      genres: ["Action", "Crime"],
      moviePersons: [
        ["F. Gary Gray", "director"],
        ["Vin Diesel", "actor"],
        ["Dwayne Johnson", "actor"],
      ],
    },
    {
      title: "Iron Man 3",
      description:
        "Tony Stark faces a powerful enemy that challenges his identity and resolve.",
      price: 129,
      releaseDate: "2013-05-03",
      runtime: 130,
      genres: ["Action", "Superhero"],
      moviePersons: [
        ["Shane Black", "director"],
        ["Robert Downey Jr.", "actor"],
        ["Gwyneth Paltrow", "actor"],
      ],
    },
    {
      title: "Minions",
      description:
        "The Minions embark on a mission to serve the world’s first female supervillain.",
      price: 119,
      releaseDate: "2015-07-10",
      runtime: 91,
      genres: ["Animation", "Comedy"],
      moviePersons: [
        ["Pierre Coffin", "director"],
        ["Kyle Balda", "director"],
        ["Sandra Bullock", "actor"],
        ["Jon Hamm", "actor"],
      ],
    },
    {
      title: "Captain America: Civil War",
      description:
        "The Avengers fracture over political oversight and personal loyalties.",
      price: 139,
      releaseDate: "2016-05-06",
      runtime: 147,
      genres: ["Action", "Superhero"],
      moviePersons: [
        ["Anthony Russo", "director"],
        ["Joe Russo", "director"],
        ["Chris Evans", "actor"],
        ["Robert Downey Jr.", "actor"],
      ],
    },
  ];

  for (const movie of movies) {
    // Fetch the corresponding moviePerson ids for this movie
    const moviePersonIds = [];
    if (movie.moviePersons) {
      for (const [name, role] of movie.moviePersons) {
        const person = await prisma.moviePerson.findFirst({
          where: { name, role },
          select: { id: true },
        });
        if (person) {
          moviePersonIds.push({ id: person.id });
        }
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
        imageUrl: await getPosterUrl(movie.title),
        runtime: movie.runtime,
        genres: {
          connect: genreIds,
        },
        moviePersons: {
          connect: moviePersonIds,
        },
      },
    });
    console.log(`Seeded: ${movie.title}`);
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
