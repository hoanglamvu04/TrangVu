import colorGroups from "../constants/colorGroups";

const getColorNameFromCode = (code) => {
  for (const group of Object.values(colorGroups)) {
    const found = group.find((c) => c.code.toLowerCase() === code.toLowerCase());
    if (found) return found.name;
  }
  return code;
};

export default getColorNameFromCode;
