import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  for (const { people: _people, ...movie } of movies) {
    await prisma.movie.create({ data: movie });
  }
}

type MovieSeed = Prisma.MovieCreateInput & { people?: unknown };

export const movies: MovieSeed[] = [
  //  Movie nr. 1  //

  {
    title: "Inception",
    description:
      "A mind-bending thriller that dives into shared dream infiltration.",
    price: 159.9,
    releaseDate: new Date("2010-07-16"),
    imageUrl: "https://example.com/inception.jpg",
    runtime: 148,
    genres: {
      connectOrCreate: [
        { where: { id: "Sci-Fi" }, create: { name: "Sci-Fi" } },
        { where: { id: "Thriller" }, create: { name: "Thriller" } },
      ],
    },
    people: {
      connectOrCreate: [
        {
          where: { name: "Christopher Nolan" },
          create: { name: "Christopher Nolan" },
        },
        {
          where: { name: "Leonardo DiCaprio" },
          create: { name: "Leonardo DiCaprio" },
        },
      ],
    },
  },

  //  Movie nr. 2  //

  {
    title: "The Shawshank Redemption",
    description:
      "Two imprisoned men bond over several years, finding solace and eventual redemption through acts of common decency and resilience within a harsh prison system.",
    price: 13990,
    releaseDate: new Date("1994-09-23"),
    imageUrl: "https://example.com/shawshank_redemption.jpg",
    runtime: 142,
    genres: {
      connectOrCreate: [
        { where: { id: "drama-id" }, create: { name: "Drama" } },
        { where: { id: "Crime" }, create: { name: "Crime" } },
      ],
    },
    people: {
      connectOrCreate: [
        {
          where: { name: "Frank Darabont" },
          create: { name: "Frank Darabont" },
        },
        { where: { name: "Tim Robbins" }, create: { name: "Tim Robbins" } },
      ],
    },
  },

  //  Movie nr. 3  //

  {
    title: "The Dark Knight",
    description:
      "Batman faces his greatest psychological and moral challenge when the Joker emerges, forcing Gotham to confront chaos, fear, and ethical compromise.",
    price: 119.9,
    releaseDate: new Date("2008-07-18"),
    imageUrl: "https://example.com/the_dark_knight.jpg",
    runtime: 152,
    genres: {
      connectOrCreate: [
        { where: { id: "Action" }, create: { name: "Action" } },
        { where: { name: "Crime" }, create: { name: "Crime" } },
      ],
    },
    people: {
      connectOrCreate: [
        {
          where: { name: "Christopher Nolan" },
          create: { name: "Christopher Nolan" },
        },
        { where: { name: "Heath Ledger" }, create: { name: "Heath Ledger" } },
      ],
    },
  },

  //  Movie nr. 4  //

  {
    title: "Schindler’s List",
    description:
      "A German industrialist saves more than a thousand Jewish refugees during the Holocaust, confronting the moral cost of war and human indifference.",
    price: 10990,
    releaseDate: new Date("1993-12-15"),
    imageUrl: "https://example.com/schindlers_list.jpg",
    runtime: 195,
    genres: {
      connectOrCreate: [
        { where: { id: "Drama" }, create: { name: "Drama" } },
        { where: { name: "History" }, create: { name: "History" } },
      ],
    },
    people: {
      connectOrCreate: [
        {
          where: { name: "Steven Spielberg" },
          create: { name: "Steven Spielberg" },
        },
        { where: { name: "Liam Neeson" }, create: { name: "Liam Neeson" } },
      ],
    },
  },

  //  Movie nr. 5  //

  {
    title: "The Lord of the Rings: The Return of the King",
    description:
      "The final confrontation for Middle-earth unfolds as alliances are tested and sacrifice determines the fate of an entire world.",
    price: 12990,
    releaseDate: new Date("2003-12-17"),
    imageUrl: "https://example.com/return_of_the_king.jpg",
    runtime: 201,
    genres: {
      connectOrCreate: [
        { where: { id: "Fantasy" }, create: { name: "Fantasy" } },
        { where: { name: "Adventure" }, create: { name: "Adventure" } },
      ],
    },
    people: {
      connectOrCreate: [
        { where: { name: "Peter Jackson" }, create: { name: "Peter Jackson" } },
        { where: { name: "Elijah Wood" }, create: { name: "Elijah Wood" } },
      ],
    },
  },

  //  Movie nr. 6  //

  {
    title: "One Flew Over the Cuckoo’s Nest",
    description:
      "A rebellious patient challenges the oppressive authority of a mental institution, exposing the fragile boundary between sanity and control.",
    price: 9990,
    releaseDate: new Date("1975-11-19"),
    imageUrl: "https://example.com/one_flew_over_the_cuckoos_nest.jpg",
    runtime: 133,
    genres: {
      connectOrCreate: [
        { where: { id: "Drama" }, create: { name: "Drama" } },
        { where: { name: "Psychological" }, create: { name: "Psychological" } },
      ],
    },
    people: {
      connectOrCreate: [
        { where: { name: "Miloš Forman" }, create: { name: "Miloš Forman" } },
        {
          where: { name: "Jack Nicholson" },
          create: { name: "Jack Nicholson" },
        },
      ],
    },
  },

  //  Movie nr. 7  //

  {
    title: "Titanic",
    description:
      "A fictional romance unfolds aboard the ill-fated RMS Titanic, juxtaposing human intimacy against one of history’s greatest maritime disasters.",
    price: 12590,
    releaseDate: new Date("1997-12-19"),
    imageUrl: "https://example.com/titanic.jpg",
    runtime: 195,
    genres: {
      connectOrCreate: [
        // Replace with the correct unique identifier, e.g. id
        // { where: { id: "romance-id" }, create: { name: "Romance" } },
        // If you don't have the id, you must ensure 'name' is unique in your schema or update the schema to allow 'name' as unique
        { where: { id: "romance-id" }, create: { name: "Romance" } },
        { where: { name: "Drama" }, create: { name: "Drama" } },
      ],
    },
    people: {
      connectOrCreate: [
        { where: { name: "James Cameron" }, create: { name: "James Cameron" } },
        {
          where: { name: "Leonardo DiCaprio" },
          create: { name: "Leonardo DiCaprio" },
        },
      ],
    },
  },

  //  Movie nr. 8 //

  {
    title: "No Country for Old Men",
    description:
      "A chance encounter with drug money ignites a relentless pursuit, exploring fate, violence, and moral decay in the modern American West.",
    price: 11490,
    releaseDate: new Date("2007-11-21"),
    imageUrl: "https://example.com/no_country_for_old_men.jpg",
    runtime: 122,
    genres: {
      connectOrCreate: [
        { where: { name: "Crime" }, create: { name: "Crime" } },
        { where: { name: "Thriller" }, create: { name: "Thriller" } },
      ],
    },
    people: {
      connectOrCreate: [
        { where: { name: "Joel Coen" }, create: { name: "Joel Coen" } },
        { where: { name: "Ethan Coen" }, create: { name: "Ethan Coen" } },
      ],
    },
  },

  //  Movie nr. 9  //

  {
    title: "Parasite",
    description:
      "A poor family infiltrates a wealthy household, triggering a darkly comic and tragic collision of class, ambition, and survival.",
    price: 11990,
    releaseDate: new Date("2019-05-30"),
    imageUrl: "https://example.com/parasite.jpg",
    runtime: 132,
    genres: {
      connectOrCreate: [
        { where: { name: "Thriller" }, create: { name: "Thriller" } },
        { where: { name: "Drama" }, create: { name: "Drama" } },
      ],
    },
    people: {
      connectOrCreate: [
        { where: { name: "Bong Joon-ho" }, create: { name: "Bong Joon-ho" } },
        { where: { name: "Song Kang-ho" }, create: { name: "Song Kang-ho" } },
      ],
    },
  },

  //  Movie nr. 9  //

  {
    title: "Dancer in the Dark",
    description:
      "A factory worker with a passion for musicals retreats into fantasy as her eyesight deteriorates, confronting injustice through sacrifice and imagination.",
    price: 9790,
    releaseDate: new Date("2000-05-17"),
    imageUrl: "https://example.com/dancer_in_the_dark.jpg",
    runtime: 140,
    genres: {
      connectOrCreate: [
        { where: { name: "Musical" }, create: { name: "Musical" } },
        { where: { name: "Drama" }, create: { name: "Drama" } },
      ],
    },
    people: {
      connectOrCreate: [
        {
          where: { name: "Lars von Trier" },
          create: { name: "Lars von Trier" },
        },
        { where: { name: "Björk" }, create: { name: "Björk" } },
      ],
    },
  },

  //  Movie nr. 10  //

  {
    title: "The Pianist",
    description:
      "A Jewish pianist struggles to survive the destruction of the Warsaw Ghetto, bearing witness to war through endurance and isolation.",
    price: 10990,
    releaseDate: new Date("2002-05-24"),
    imageUrl: "https://example.com/the_pianist.jpg",
    runtime: 150,
    genres: {
      connectOrCreate: [
        { where: { name: "War" }, create: { name: "War" } },
        { where: { name: "Biography" }, create: { name: "Biography" } },
      ],
    },
    people: {
      connectOrCreate: [
        {
          where: { name: "Roman Polanski" },
          create: { name: "Roman Polanski" },
        },
        { where: { name: "Adrien Brody" }, create: { name: "Adrien Brody" } },
      ],
    },
  },

  //  Movie nr. 11  //

  {
    title: "Fahrenheit 9/11",
    description:
      "A polemical documentary examining U.S. foreign policy, media influence, and political power in the aftermath of the September 11 attacks.",
    price: 8990,
    releaseDate: new Date("2004-05-17"),
    imageUrl: "https://example.com/fahrenheit_9_11.jpg",
    runtime: 122,
    genres: {
      connectOrCreate: [
        { where: { name: "Documentary" }, create: { name: "Documentary" } },
        { where: { name: "Political" }, create: { name: "Political" } },
      ],
    },
    people: {
      connectOrCreate: [
        { where: { name: "Michael Moore" }, create: { name: "Michael Moore" } },
      ],
    },
  },

  //  Movie nr. 12  //

  {
    title: "Uncle Boonmee Who Can Recall His Past Lives",
    description:
      "As death approaches, a man reflects on reincarnation and memory, blending folklore, spirituality, and the natural world.",
    price: 11490,
    releaseDate: new Date("2010-05-16"),
    imageUrl: "https://example.com/uncle_boonmee.jpg",
    runtime: 114,
    genres: {
      connectOrCreate: [
        { where: { name: "Fantasy" }, create: { name: "Fantasy" } },
        { where: { name: "Art House" }, create: { name: "Art House" } },
      ],
    },
    people: {
      connectOrCreate: [
        {
          where: { name: "Apichatpong Weerasethakul" },
          create: { name: "Apichatpong Weerasethakul" },
        },
      ],
    },
  },

  //  Movie nr. 13  //

  {
    title: "Blue Is the Warmest Color",
    description:
      "An intense coming-of-age romance explores identity, desire, and emotional vulnerability through a transformative love affair.",
    price: 10490,
    releaseDate: new Date("2013-05-23"),
    imageUrl: "https://example.com/blue_is_the_warmest_color.jpg",
    runtime: 180,
    genres: {
      connectOrCreate: [
        { where: { name: "Romance" }, create: { name: "Romance" } },
        { where: { name: "Coming-of-Age" }, create: { name: "Coming-of-Age" } },
      ],
    },
    people: {
      connectOrCreate: [
        {
          where: { name: "Abdellatif Kechiche" },
          create: { name: "Abdellatif Kechiche" },
        },
        {
          where: { name: "Adèle Exarchopoulos" },
          create: { name: "Adèle Exarchopoulos" },
        },
      ],
    },
  },

  //  Movie nr. 14  //

  {
    title: "Parasite",
    description:
      "A poor family infiltrates a wealthy household, setting off a genre-defying chain of events driven by class tension and social inequality.",
    price: 11990,
    releaseDate: new Date("2019-05-30"),
    imageUrl: "https://example.com/parasite.jpg",
    runtime: 132,
    genres: {
      connectOrCreate: [
        { where: { name: "Thriller" }, create: { name: "Thriller" } },
        { where: { name: "Satire" }, create: { name: "Satire" } },
      ],
    },
    people: {
      connectOrCreate: [
        { where: { name: "Bong Joon-ho" }, create: { name: "Bong Joon-ho" } },
        { where: { name: "Song Kang-ho" }, create: { name: "Song Kang-ho" } },
      ],
    },
  },

  //   Movie nr. 15  //

  {
    title: "The Girl with the Dragon Tattoo",
    description:
      "A journalist and a brilliant but troubled hacker investigate a decades-old disappearance, uncovering corruption, violence, and political intrigue.",
    price: 9990,
    releaseDate: new Date("2009-02-27"),
    imageUrl: "https://example.com/the_girl_with_the_dragon_tattoo.jpg",
    runtime: 152,
    genres: {
      connectOrCreate: [
        { where: { name: "Drama" }, create: { name: "Drama" } },
        { where: { name: "Thriller" }, create: { name: "Thriller" } },
      ],
    },
    people: {
      connectOrCreate: [
        {
          where: { name: "Niels Arden Oplev" },
          create: { name: "Niels Arden Oplev" },
        },
        { where: { name: "Noomi Rapace" }, create: { name: "Noomi Rapace" } },
      ],
    },
  },

  //  Movie nr. 16  //

  {
    title: "The Black Power Mixtape 1967–1975",
    description:
      "Archival footage and contemporary commentary examine the Black Power movement, media representation, and global political solidarity.",
    price: 8490,
    releaseDate: new Date("2011-01-28"),
    imageUrl: "https://example.com/the_black_power_mixtape.jpg",
    runtime: 100,
    genres: {
      connectOrCreate: [
        { where: { name: "Documentary" }, create: { name: "Documentary" } },
        { where: { name: "Political" }, create: { name: "Political" } },
      ],
    },
    people: {
      connectOrCreate: [
        {
          where: { name: "Göran Hugo Olsson" },
          create: { name: "Göran Hugo Olsson" },
        },
      ],
    },
  },

  //  Movie nr. 17  //

  {
    title: "Let the Right One In",
    description:
      "A lonely boy befriends a mysterious girl who is not what she seems, blending innocence, horror, and an unconventional love story.",
    price: 10990,
    releaseDate: new Date("2008-10-24"),
    imageUrl: "https://example.com/let_the_right_one_in.jpg",
    runtime: 114,
    genres: {
      connectOrCreate: [
        { where: { name: "Romance" }, create: { name: "Romance" } },
        { where: { name: "Fantasy" }, create: { name: "Fantasy" } },
      ],
    },
    people: {
      connectOrCreate: [
        {
          where: { name: "Tomas Alfredson" },
          create: { name: "Tomas Alfredson" },
        },
        {
          where: { name: "Lina Leandersson" },
          create: { name: "Lina Leandersson" },
        },
      ],
    },
  },

  //  Movie nr. 18  //

  {
    title: "The Phantom of the Opera",
    description:
      "A disfigured musical genius haunts the Paris Opera House, guiding and obsessing over a young soprano while love, jealousy, and tragedy unfold.",
    price: 12990,
    releaseDate: new Date("1988-01-26"),
    imageUrl: "https://example.com/phantom_of_the_opera.jpg",
    runtime: 160,
    genres: {
      connectOrCreate: [
        { where: { name: "Musical" }, create: { name: "Musical" } },
        { where: { name: "Romance" }, create: { name: "Romance" } },
      ],
    },
    people: {
      connectOrCreate: [
        {
          where: { name: "Andrew Lloyd Webber" },
          create: { name: "Andrew Lloyd Webber" },
        },
        { where: { name: "Harold Prince" }, create: { name: "Harold Prince" } },
      ],
    },
  },

  //  Movie nr. 19  //

  {
    title: "Les Misérables",
    description:
      "Former convict Jean Valjean seeks redemption while revolution brews in 19th-century France, exploring justice, mercy, and moral transformation.",
    price: 13990,
    releaseDate: new Date("1987-03-12"),
    imageUrl: "https://example.com/les_miserables.jpg",
    runtime: 175,
    genres: {
      connectOrCreate: [
        { where: { name: "Musical" }, create: { name: "Musical" } },
        { where: { name: "Historical" }, create: { name: "Historical" } },
      ],
    },
    people: {
      connectOrCreate: [
        {
          where: { name: "Claude-Michel Schönberg" },
          create: { name: "Claude-Michel Schönberg" },
        },
        {
          where: { name: "Cameron Mackintosh" },
          create: { name: "Cameron Mackintosh" },
        },
      ],
    },
  },

  //  Movie nr. 20  //

  {
    title: "Hamilton",
    description:
      "The story of American Founding Father Alexander Hamilton is retold through hip-hop, R&B, and traditional musical theatre forms.",
    price: 14990,
    releaseDate: new Date("2015-08-06"),
    imageUrl: "https://example.com/hamilton.jpg",
    runtime: 165,
    genres: {
      connectOrCreate: [
        { where: { name: "Musical" }, create: { name: "Musical" } },
        { where: { name: "Biography" }, create: { name: "Biography" } },
      ],
    },
    people: {
      connectOrCreate: [
        {
          where: { name: "Lin-Manuel Miranda" },
          create: { name: "Lin-Manuel Miranda" },
        },
        { where: { name: "Thomas Kail" }, create: { name: "Thomas Kail" } },
      ],
    },
  },

  //  Movie nr. 21  //

  {
    title: "Jesus Christ Superstar",
    description:
      "A rock opera depicting the final days of Jesus Christ, told through the perspectives of Judas and other central figures, blending biblical narrative with modern music.",
    price: 12490,
    releaseDate: new Date("1971-10-12"),
    imageUrl: "https://example.com/jesus_christ_superstar.jpg",
    runtime: 105,
    genres: {
      connectOrCreate: [
        { where: { name: "Musical" }, create: { name: "Musical" } },
        { where: { name: "Rock Opera" }, create: { name: "Rock Opera" } },
      ],
    },
    people: {
      connectOrCreate: [
        {
          where: { name: "Andrew Lloyd Webber" },
          create: { name: "Andrew Lloyd Webber" },
        },
        { where: { name: "Tim Rice" }, create: { name: "Tim Rice" } },
      ],
    },
  },

  //  Movie nr. 22  //

  {
    title: "Cats",
    description:
      "A group of felines gathers for the annual Jellicle Ball, where one cat will be chosen for rebirth, told through music, dance, and poetic vignettes.",
    price: 14990,
    releaseDate: new Date("1982-10-07"),
    imageUrl: "https://example.com/cats.jpg",
    runtime: 140,
    genres: {
      connectOrCreate: [
        { where: { name: "Musical" }, create: { name: "Musical" } },
        { where: { name: "Fantasy" }, create: { name: "Fantasy" } },
      ],
    },
    people: {
      connectOrCreate: [
        {
          where: { name: "Andrew Lloyd Webber" },
          create: { name: "Andrew Lloyd Webber" },
        },
        { where: { name: "T. S. Eliot" }, create: { name: "T. S. Eliot" } },
      ],
    },
  },

  //  Movie nr. 23  //

  {
    title: "Gandhi",
    description:
      "An epic biographical portrait of Mahatma Gandhi, chronicling his journey from lawyer to leader of India’s nonviolent independence movement.",
    price: 9990,
    releaseDate: new Date("1982-12-03"),
    imageUrl: "https://example.com/gandhi.jpg",
    runtime: 191,
    genres: {
      connectOrCreate: [
        { where: { name: "Biography" }, create: { name: "Biography" } },
        { where: { name: "Historical" }, create: { name: "Historical" } },
      ],
    },
    people: {
      connectOrCreate: [
        {
          where: { name: "Richard Attenborough" },
          create: { name: "Richard Attenborough" },
        },
        { where: { name: "Ben Kingsley" }, create: { name: "Ben Kingsley" } },
      ],
    },
  },

  //  Movie nr. 24  //

  {
    title: "Margin Call",
    description:
      "Over a tense 24-hour period, executives at an investment bank confront the moral and financial consequences of an impending economic collapse.",
    price: 11990,
    releaseDate: new Date("2011-10-21"),
    imageUrl: "https://example.com/margin_call.jpg",
    runtime: 107,
    genres: {
      connectOrCreate: [
        { where: { name: "Drama" }, create: { name: "Drama" } },
        {
          where: { name: "Financial Thriller" },
          create: { name: "Financial Thriller" },
        },
      ],
    },
    people: {
      connectOrCreate: [
        { where: { name: "J. C. Chandor" }, create: { name: "J. C. Chandor" } },
        { where: { name: "Kevin Spacey" }, create: { name: "Kevin Spacey" } },
      ],
    },
  },

  //  Movie nr. 25  //

  {
    title: "Dances with Wolves",
    description:
      "A U.S. Army officer forms a profound bond with a Lakota Sioux tribe, challenging cultural assumptions and redefining his sense of belonging.",
    price: 13900,
    releaseDate: new Date("1990-11-09"),
    imageUrl: "https://example.com/dances_with_wolves.jpg",
    runtime: 181,
    genres: {
      connectOrCreate: [
        { where: { name: "Western" }, create: { name: "Western" } },
        { where: { name: "Drama" }, create: { name: "Drama" } },
      ],
    },
    people: {
      connectOrCreate: [
        { where: { name: "Kevin Costner" }, create: { name: "Kevin Costner" } },
        {
          where: { name: "Mary McDonnell" },
          create: { name: "Mary McDonnell" },
        },
      ],
    },
  },
];

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
