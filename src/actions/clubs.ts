"use server";

import { createOrganizationAction, getOrganizationByIdAction } from "./organizations";

export {
  getAllOrganizationsAction,
  getOrganizationByIdAction,
  getOrganizationUnitsAction,
  getInitiativesAction,
  getInstitutionalMetricsAction,
  getAllClubsAction,
  getTopLevelClubsAction,
  getSocietySubClubsAction,
  getCollegeMetricsAction,
  getSocietyMetricsAction,
  createOrganizationAction,
} from "./organizations";

export const createClubAction = createOrganizationAction;

export async function getClubByIdAction(id: string) {
  return getOrganizationByIdAction(id);
}
