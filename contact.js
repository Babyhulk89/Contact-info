// contact.js - Module for Contact class
import { Dob } from "./dob.js";

export class Contact {
  #email;
  #phone;
  #zip;
  #dob;

  constructor(email, phone, zip, dobString) {
    this.#email = email;
    this.#phone = phone;
    this.#zip = zip;
    this.#dob = new Dob(dobString);
  }

  // --- Static validators ---

  static validateEmail(email) {
    if (!email || email.trim() === "") {
      return "Email is required.";
    }
    // Standard email regex
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email.trim())) {
      return "Email must be a valid email address (e.g. user@example.com).";
    }
    return "";
  }

  static validatePhone(phone) {
    if (!phone || phone.trim() === "") {
      return "Phone number is required.";
    }
    // Accept formats: 1234567890, 123-456-7890, (123) 456-7890, +1 123-456-7890
    const re = /^\+?1?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    if (!re.test(phone.trim())) {
      return "Phone must be a valid 10-digit US number (e.g. 555-867-5309).";
    }
    return "";
  }

  static validateZip(zip) {
    if (!zip || zip.trim() === "") {
      return "ZIP code is required.";
    }
    // 5-digit or ZIP+4
    const re = /^\d{5}(-\d{4})?$/;
    if (!re.test(zip.trim())) {
      return "ZIP code must be 5 digits (e.g. 90210) or ZIP+4 (e.g. 90210-1234).";
    }
    return "";
  }

  static validateDob(dobString) {
    return Dob.validate(dobString);
  }

  // Validate all fields; returns an object { field: errorMessage }
  static validateAll(email, phone, zip, dobString) {
    const errors = {};
    const emailErr = Contact.validateEmail(email);
    const phoneErr = Contact.validatePhone(phone);
    const zipErr   = Contact.validateZip(zip);
    const dobErr   = Contact.validateDob(dobString);

    if (emailErr) errors.email = emailErr;
    if (phoneErr) errors.phone = phoneErr;
    if (zipErr)   errors.zip   = zipErr;
    if (dobErr)   errors.dob   = dobErr;

    return errors;
  }

  // --- Getters ---

  get email() { return this.#email; }
  get phone() { return this.#phone; }
  get zip()   { return this.#zip; }
  get dob()   { return this.#dob; }

  // Return a plain object safe for JSON serialisation (e.g. sessionStorage)
  toJSON() {
    return {
      email: this.#email,
      phone: this.#phone,
      zip:   this.#zip,
      dob:   this.#dob.toISOString(),
    };
  }

  // Rebuild a Contact from the plain object stored in sessionStorage
  static fromJSON(obj) {
    return new Contact(obj.email, obj.phone, obj.zip, obj.dob);
  }
}
