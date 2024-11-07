// Validates a user is over 16
const dateCheckGreaterThanSixteen = (date: Date) => {
    const currentDate = new Date();
    const ageDiff = currentDate.getFullYear() - date.getFullYear();
   
    const isOldEnough =
        ageDiff > 16 ||
        (ageDiff === 16 &&
          (currentDate.getMonth() > date.getMonth() ||
            (currentDate.getMonth() === date.getMonth() &&
              currentDate.getDate() >= date.getDate())));
    
    return isOldEnough || "Must be at least 16 years old";

}

export default dateCheckGreaterThanSixteen;