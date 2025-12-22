import prisma from "@/lib/prisma";
async function main() {
  console.log("Start seeding...");

  await prisma.$connect();

  console.log("Clearing existing data...");
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.movie.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.genre.deleteMany({});
  await prisma.moviePerson.deleteMany({});
  await prisma.address.deleteMany({});
  console.log("Existing data cleared.");

  // Create a Genre
  const genre1 = await prisma.genre.create({
    data: {
      name: "Action",
      description: "Action-packed movies",
    },
  });
  console.log(`Created genre with id: ${genre1.id}`);

  const genre2 = await prisma.genre.create({
    data: {
      name: "Thriller",
      description: "Scary",
    },
  });
  console.log(`Created genre with id: ${genre2.id}`);

  // Create a MoviePerson
  const moviePerson1 = await prisma.moviePerson.create({
    data: {
      name: "John Doe",
      role: "director",
    },
  });
  console.log(`Created movie person with id: ${moviePerson1.id}`);

  const moviePerson2 = await prisma.moviePerson.create({
    data: {
      name: "Frodo",
      role: "director",
    },
  });
  console.log(`Created movie person with id: ${moviePerson2.id}`);

  const moviePerson3 = await prisma.moviePerson.create({
    data: {
      name: "Brosef",
      role: "actor",
    },
  });
  console.log(`Created movie person with id: ${moviePerson3.id}`);

  // Create a Movie
  const movie1 = await prisma.movie.create({
    data: {
      title: "A new hope",
      description: "A thrilling action movie.",
      price: 19.99,
      releaseDate: new Date("2023-01-01T00:00:00Z"),
      imageUrl: "/A_new_hope.jpg",
      runtime: 120,
      genres: {
        connect: [{ id: genre1.id }, { id: genre2.id }],
      },
      moviePersons: {
        connect: [
          { id: moviePerson1.id },
          { id: moviePerson2.id },
          { id: moviePerson3.id },
        ],
      },
    },
  });
  console.log(`Created movie with id: ${movie1.id}`);

  const movie2 = await prisma.movie.create({
    data: {
      title: "Action Movie Title",
      description: "A thrilling action movie.",
      price: 19.99,
      releaseDate: new Date("2001-01-01T00:00:00Z"),
      imageUrl: "/A_new_hope.jpg",
      runtime: 120,
      genres: {
        connect: { id: genre1.id },
      },
      moviePersons: {
        connect: { id: moviePerson1.id },
      },
    },
  });
  console.log(`Created movie with id: ${movie2.id}`);

  // Create an Address
  const address1 = await prisma.address.create({
    data: {
      street: "123 Main St",
      postalCode: "12345",
      city: "Anytown",
      country: "USA",
    },
  });
  console.log(`Created address with id: ${address1.id}`);

  // Create a User
  const user1 = await prisma.user.create({
    data: {
      id: "user-1",
      name: "Alice Smith",
      email: "alice.smith@example.com",
      emailVerified: true,
      address: {
        connect: { id: address1.id },
      },
    },
  });
  console.log(`Created user with id: ${user1.id}`);

  // Create an Order
  const order1 = await prisma.order.create({
    data: {
      status: "Pending",
      userId: user1.id,
      shippingAddressId: address1.id,
      items: {
        create: [
          {
            id: "order-item-1",
            movieId: movie1.id,
            quantity: 1,
            priceAtPurchase: movie1.price,
          },
        ],
      },
    },
    include: {
      items: true,
    },
  });
  console.log(`Created order with id: ${order1.id}`);
  console.log(`Created order item with id: ${order1.items[0].id}`);

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
