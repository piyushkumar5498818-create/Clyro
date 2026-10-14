"use server";

import { db } from "@/lib/store";
import { Club } from "@/types/database";

export async function getTopLevelClubsAction(): Promise<Club[]> {
  return db.getTopLevelClubs();
}

export async function getAllClubsAction(): Promise<Club[]> {
  return db.getAllClubs();
}

export async function getSocietySubClubsAction(): Promise<Club[]> {
  return db.getSocietySubClubs();
}

export async function getClubByIdAction(id: string): Promise<Club | undefined> {
  return db.getClubById(id);
}

export async function getSocietyMetricsAction() {
  return db.getSocietyConsolidatedMetrics();
}

export async function getCollegeMetricsAction() {
  return db.getCollegeMetrics();
}
