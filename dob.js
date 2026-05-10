// dob.js - Module for Date of Birth class

export class Dob extends Date {
  constructor(dateString) {
    super(dateString);
  }

  // Validate that the date is a real date and person is 0-120 years old
  static validate(dateString) {
    if (!dateString || dateString.trim() === "") {
      return "Date of birth is required.";
    }

    const dob = new Dob(dateString);

    // Check if the date is valid
    if (isNaN(dob.getTime())) {
      return "Date of birth must be a valid date.";
    }

    const today = new Date();

    // Date can't be in the future
    if (dob > today) {
      return "Date of birth cannot be in the future.";
    }

    // Age must be reasonable (0-120 years)
    const age = today.getFullYear() - dob.getFullYear();
    if (age > 120) {
      return "Date of birth is too far in the past.";
    }

    return ""; // No error
  }

  // Return formatted date string MM/DD/YYYY
  getFormatted() {
    const month = String(this.getMonth() + 1).padStart(2, "0");
    const day = String(this.getDate()).padStart(2, "0");
    const year = this.getFullYear();
    return `${month}/${day}/${year}`;
  }

  // Calculate and return age
  getAge() {
    const today = new Date();
    let age = today.getFullYear() - this.getFullYear();
    const monthDiff = today.getMonth() - this.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < this.getDate())) {
      age--;
    }
    return age;
  }
}
