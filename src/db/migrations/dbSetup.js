import { prisma } from '@wasp/db';

export const up = async () => {
  // Add any needed database migrations
  console.log('Running migration');
};

export const down = async () => {
  // Add rollback logic if needed
  console.log('Rolling back migration');
};