// index.js - Main application logic
import { Contact } from "./contact.js";
import { Dob } from "./dob.js";

// ── DOM refs ──────────────────────────────────────────────────────────────────
const form        = document.getElementById("contact-form");
const emailInput  = document.getElementById("email");
const phoneInput  = document.getElementById("phone");
const zipInput    = document.getElementById("zip");
const dobInput    = document.getElementById("dob");
const saveBtn     = document.getElementById("save-btn");
const clearBtn    = document.getElementById("clear-btn");
const display     = document.getElementById("display");

// ── Helpers ───────────────────────────────────────────────────────────────────

function showError(inputEl, message) {
  const wrapper = inputEl.closest(".field");
  const errEl   = wrapper.querySelector(".error");
  inputEl.classList.toggle("invalid", !!message);
  errEl.textContent = message;
}

function clearErrors() {
  document.querySelectorAll(".error").forEach(el => (el.textContent = ""));
  document.querySelectorAll(".invalid").forEach(el => el.classList.remove("invalid"));
}

function loadFromStorage() {
  const raw = sessionStorage.getItem("contact");
  if (!raw) return null;
  try {
    return Contact.fromJSON(JSON.parse(raw));
  } catch {
    return null;
  }
}

function renderContact(contact) {
  if (!contact) {
    display.innerHTML = `<p class="empty">No contact saved yet.</p>`;
    return;
  }

  const dob = contact.dob;
  display.innerHTML = `
    <h2>Saved Contact</h2>
    <table>
      <tr><th>Email</th>       <td>${contact.email}</td></tr>
      <tr><th>Phone</th>       <td>${contact.phone}</td></tr>
      <tr><th>ZIP</th>         <td>${contact.zip}</td></tr>
      <tr><th>Date of Birth</th><td>${dob.getFormatted()} (age ${dob.getAge()})</td></tr>
    </table>
  `;
}

function populateForm(contact) {
  if (!contact) return;
  emailInput.value = contact.email;
  phoneInput.value = contact.phone;
  zipInput.value   = contact.zip;
  // Convert ISO string back to YYYY-MM-DD for <input type="date">
  dobInput.value   = contact.dob.toISOString().split("T")[0];
}

// ── Event listeners ───────────────────────────────────────────────────────────

saveBtn.addEventListener("click", () => {
  clearErrors();

  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();
  const zip   = zipInput.value.trim();
  const dob   = dobInput.value;

  const errors = Contact.validateAll(email, phone, zip, dob);

  // Display any errors
  if (errors.email) showError(emailInput, errors.email);
  if (errors.phone) showError(phoneInput, errors.phone);
  if (errors.zip)   showError(zipInput,   errors.zip);
  if (errors.dob)   showError(dobInput,   errors.dob);

  if (Object.keys(errors).length > 0) return; // Stop if any error

  const contact = new Contact(email, phone, zip, dob);
  sessionStorage.setItem("contact", JSON.stringify(contact.toJSON()));
  renderContact(contact);

  // Brief confirmation flash
  saveBtn.textContent = "Saved ✓";
  setTimeout(() => (saveBtn.textContent = "Save"), 1500);
});

clearBtn.addEventListener("click", () => {
  sessionStorage.removeItem("contact");
  form.reset();
  clearErrors();
  renderContact(null);
});

// ── Initialise on page load ───────────────────────────────────────────────────
const saved = loadFromStorage();
populateForm(saved);
renderContact(saved);
