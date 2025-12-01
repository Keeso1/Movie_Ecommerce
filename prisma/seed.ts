import prisma from "@/lib/prisma";
async function main() {
  console.log("Start seeding...");

  await prisma.$connect();
  // Create a Genre
  const genre1 = await prisma.genre.create({
    data: {
      id: "genre-1",
      name: "Action",
      description: "Action-packed movies",
    },
  });
  console.log(`Created genre with id: ${genre1.id}`);

  // Create a MoviePerson
  const moviePerson1 = await prisma.moviePerson.create({
    data: {
      id: "person-1",
      name: "John Doe",
      role: "Director",
    },
  });
  console.log(`Created movie person with id: ${moviePerson1.id}`);

  // Create a Movie
  const movie1 = await prisma.movie.create({
    data: {
      id: "movie-1",
      title: "Action Movie Title",
      description: "A thrilling action movie.",
      price: 19.99,
      releaseDate: new Date("2023-01-01T00:00:00Z"),
      imageUrl: "http://example.com/action-movie.jpg",
      runtime: 120,
      genres: {
        connect: { id: genre1.id },
      },
      moviePersons: {
        connect: { id: moviePerson1.id },
      },
    },
  });
  console.log(`Created movie with id: ${movie1.id}`);

  // Create an Address
  const address1 = await prisma.address.create({
    data: {
      id: "address-1",
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
      createdAt: new Date(),
      updatedAt: new Date(),
      address: {
        connect: { id: address1.id },
      },
    },
  });
  console.log(`Created user with id: ${user1.id}`);

  // Create an Order
  const order1 = await prisma.order.create({
    data: {
      id: "order-1",
      status: "Pending",
      userId: user1.id,
      shippingAddressId: address1.id,
      createdAt: new Date(),
      updatedAt: new Date(),
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
