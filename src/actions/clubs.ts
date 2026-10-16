"use server";

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
} from "./organizations";

export async function getClubByIdAction(id: string) {
  const { getOrganizationByIdAction } = await import("./organizations");
  return getOrganizationByIdAction(id);
}
