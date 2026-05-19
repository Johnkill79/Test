import type { Car } from "@/lib/types";
import { prisma } from "@/lib/prisma";

export async function getCars(): Promise<Car[]> {
  const cars = await prisma.car.findMany({
    orderBy: { createdAt: "desc" }
  });

  return cars.map((c) => ({
    id: c.id,
    name: c.name,
    pricePerDay: c.pricePerDay,
    currency: c.currency,
    seats: c.seats,
    transmission: c.transmission,
    image: c.image ?? undefined,
    featured: c.featured
  })) satisfies Car[];
}

export async function saveCars(nextCars: Car[]) {
  // Bulk upsert to keep current admin flow working.
  await prisma.$transaction(
    nextCars.map((car) =>
      prisma.car.upsert({
        where: { id: car.id },
        create: {
          id: car.id,
          name: car.name,
          pricePerDay: car.pricePerDay,
          currency: car.currency,
          seats: car.seats,
          transmission: car.transmission,
          image: car.image,
          featured: Boolean(car.featured)
        },
        update: {
          name: car.name,
          pricePerDay: car.pricePerDay,
          currency: car.currency,
          seats: car.seats,
          transmission: car.transmission,
          image: car.image,
          featured: Boolean(car.featured)
        }
      })
    )
  );
}

export async function addCar(car: Car) {
  // Ensure newly added cars appear first for the UI.
  await prisma.car.upsert({
    where: { id: car.id },
    create: {
      id: car.id,
      name: car.name,
      pricePerDay: car.pricePerDay,
      currency: car.currency,
      seats: car.seats,
      transmission: car.transmission,
      image: car.image,
      featured: Boolean(car.featured)
    },
    update: {
      name: car.name,
      pricePerDay: car.pricePerDay,
      currency: car.currency,
      seats: car.seats,
      transmission: car.transmission,
      image: car.image,
      featured: Boolean(car.featured)
    }
  });

  return car;
}

export async function updateCar(id: string, patch: Partial<Car>) {
  const existing = await prisma.car.findUnique({ where: { id } });
  if (!existing) return null;

  const updated = await prisma.car.update({
    where: { id },
    data: {
      name: patch.name ?? existing.name,
      pricePerDay: patch.pricePerDay ?? existing.pricePerDay,
      currency: patch.currency ?? existing.currency,
      seats: patch.seats ?? existing.seats,
      transmission: (patch.transmission ?? existing.transmission) as Car["transmission"],
      image: patch.image ?? existing.image,
      featured: patch.featured ?? existing.featured
    }
  });

  return {
    id: updated.id,
    name: updated.name,
    pricePerDay: updated.pricePerDay,
    currency: updated.currency,
    seats: updated.seats,
    transmission: updated.transmission,
    image: updated.image ?? undefined,
    featured: updated.featured
  } satisfies Car;
}

export async function deleteCar(id: string) {
  try {
    await prisma.car.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

