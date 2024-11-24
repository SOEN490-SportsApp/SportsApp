// Validates a user is over 16
export const isOlderThanSixteen = (dob: string) => {
  const date = new Date(dob.replaceAll('/', '-'))
  console.log(date)
  const currentDate = new Date();
  const ageDiff = currentDate.getFullYear() - date.getFullYear();

  const isOldEnough =
    ageDiff > 16 ||
    (ageDiff === 16 &&
      (currentDate.getMonth() > date.getMonth() ||
        (currentDate.getMonth() === date.getMonth() &&
          currentDate.getDate() >= date.getDate())));

  return isOldEnough || "Must be at least 16 years old";
};

export const isValidDate = (date: string) => {
  console.log(date)
  const parts = date.split("/");
  console.log(parts)
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    if (month < 1 || month > 12) {
      return "Enter a valid date";
    }

    if (day < 1 || day > 31) {
      return "Enter a valid date";
    }

    const daysInMonth = new Date(year, month, 0).getDate();
    if (day > daysInMonth) {
      return "Enter a valid date";
    }
    return true;
  }
  return "Enter a valid date";
};

export const formatBirthday = (text: string) => {
  let cleaned = text.replace(/\D/g, "");
  if (cleaned.length <= 4) {
    return cleaned;
  } else if (cleaned.length <= 6) {
    return `${cleaned.slice(0, 4)}/${cleaned.slice(4)}`; // yyyy/mm
  } else if (cleaned.length <= 8) {
    return `${cleaned.slice(0, 4)}/${cleaned.slice(4, 6)}/${cleaned.slice(6)}`; // yyyy/mm/dd
  }
  return `${cleaned.slice(0, 4)}/${cleaned.slice(4, 6)}/${cleaned.slice(6, 8)}`;
};
