export const isOlderThanSixteen = (dob: string): string | boolean => {
  const dateRegex = /^\d{4}\/\d{2}\/\d{2}$/;
  if (!dateRegex.test(dob)) {
    return "Invalid date format. Please use yyyy/mm/dd.";
  }

  const [year, month, day] = dob.split('/').map(Number);
  const dateOfBirth = new Date(year, month - 1, day);

  if (isNaN(dateOfBirth.getTime())) {
    return "Invalid date provided";
  }

  const currentDate = new Date();
  const ageDiff = currentDate.getFullYear() - dateOfBirth.getFullYear();

  const isOldEnough =
    ageDiff > 16 ||
    (ageDiff === 16 &&
      (currentDate.getMonth() > dateOfBirth.getMonth() ||
        (currentDate.getMonth() === dateOfBirth.getMonth() &&
          currentDate.getDate() >= dateOfBirth.getDate())));

  return isOldEnough || "Must be at least 16 years old";
};



export const isValidDate = (date: string): string | boolean => {
  const dateRegex = /^\d{4}\/\d{2}\/\d{2}$/;
  if (!dateRegex.test(date)) {
    return "Enter a valid date in the format yyyy/mm/dd";
  }
  const [year, month, day] = date.split('/').map(Number);
  if (!year || !month || !day) {
    return "Enter a valid date";
  }
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return "Enter a valid date";
  }
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day > daysInMonth) {
    return "Enter a valid date";
  }

  return true;
};


// Formats date of birth into yyyy/mm/dd
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

export const formatPhoneNumber = (value: string) => {
  const cleanValue = value.replace(/\D/g, ''); 
  const match = cleanValue.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);

  if (!match) return cleanValue;

  const formatted = [
    match[1],
    match[2] && match[2].length > 0 ? '-' + match[2] : '',
    match[3] && match[3].length > 0 ? '-' + match[3] : '',
  ].join('');
  return formatted;
};

