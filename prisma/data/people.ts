import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Roles (actor, director, etc.) are handled via relations elsewhere.
 */

export async function seedPeople() {
  const people = [
    // Directors

    "Christopher Nolan",
    "Steven Spielberg",
    "Peter Jackson",
    "Frank Darabont",
    "James Cameron",
    "Miloš Forman",
    "Joel Coen",
    "Ethan Coen",
    "Lars von Trier",
    "Roman Polanski",
    "Bong Joon-ho",
    "Abdellatif Kechiche",
    "Apichatpong Weerasethakul",
    "Niels Arden Oplev",
    "Tomas Alfredson",
    "Göran Hugo Olsson",
    "Richard Attenborough",
    "J. C. Chandor",

    // Actors

    "Leonardo DiCaprio",
    "Tim Robbins",
    "Heath Ledger",
    "Liam Neeson",
    "Elijah Wood",
    "Jack Nicholson",
    "Adrien Brody",
    "Song Kang-ho",
    "Björk",
    "Adèle Exarchopoulos",
    "Noomi Rapace",
    "Lina Leandersson",
    "Ben Kingsley",
    "Kevin Spacey",
    "Mary McDonnell",

    // Theatre / music figures

    "Andrew Lloyd Webber",
    "Tim Rice",
    "Harold Prince",
    "Claude-Michel Schönberg",
    "Cameron Mackintosh",
    "Lin-Manuel Miranda",
    "Thomas Kail",
    "T. S. Eliot",
  ];

  await prisma.moviePerson.createMany({
    data: people.map((name) => ({ name, role: "" })),
    skipDuplicates: true,
  });
}

/**
                 * Optional default export for seed runners
                 
                export default seedPeople;

                */
