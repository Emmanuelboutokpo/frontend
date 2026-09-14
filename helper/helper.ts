export const getDepartmentArticle = (nomDep: string | string[]) => {
  const feminineDepartments = ['Atlantique', 'Alibori', 'Atacora', 'Donga', 'Ouémé'];
  const pluralDepartments = ['Collines'];

  // Si c'est un tableau, on prend par exemple le premier élément
  const dep = Array.isArray(nomDep) ? nomDep[0] : nomDep;

  if (pluralDepartments.includes(dep)) {
    return 'les ';
  }
  if (feminineDepartments.includes(dep)) {
    return "l'";
  }
  return 'le ';
};
