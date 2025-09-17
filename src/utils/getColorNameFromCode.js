import colorGroups from "../constants/colorGroups";
export default function getColorNameFromCode(code) {
  if (!code) return "";
  const norm = String(code).trim().toLowerCase();

  for (const groupName of Object.keys(colorGroups)) {
    const arr = colorGroups[groupName] || [];
    const found = arr.find(c => String(c.code).trim().toLowerCase() === norm);
    if (found) return found.name;
  }
  return code; // fallback
}
