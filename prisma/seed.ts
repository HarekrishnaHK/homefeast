import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const cuisines = [
  "North Indian",
  "South Indian",
  "Punjabi",
  "Gujarati",
  "Bengali",
  "Maharashtrian",
  "Mughlai",
  "Chettinad",
  "Rajasthani",
  "Continental",
];

const categories = ["Tiffin Service", "Home Chef", "Meal Prep", "Festival Specials", "Diet Meals"];

function slugify(name: string) {
  return name.toLowerCase().trim().replace(/\s+/g, "-");
}

async function main() {
  for (const name of cuisines) {
    await prisma.cuisine.upsert({
      where: { slug: slugify(name) },
      update: {},
      create: { name, slug: slugify(name) },
    });
  }

  for (const name of categories) {
    await prisma.category.upsert({
      where: { slug: slugify(name) },
      update: {},
      create: { name, slug: slugify(name) },
    });
  }

  console.log("Seed complete: cuisines and categories created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
