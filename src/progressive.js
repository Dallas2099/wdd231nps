function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function submitForm(event) {
  const form = event.currentTarget;
  const nameInput = form.elements.name;
  const emailInput = form.elements.email;
  const errorEl = document.getElementById("form-error");
  let errorMessage = "";

  const emailValue = emailInput.value.trim();

  if (!emailValue) {
    errorMessage = "Please enter your email address before submitting.";
  } else if (!validateEmail(emailValue)) {
    errorMessage = "Enter a valid email address (example: user@example.com).";
  }

  if (errorMessage) {
    event.preventDefault();
    errorEl.textContent = errorMessage;
    emailInput.setAttribute("aria-invalid", "true");
    emailInput.focus();
    return;
  }

  emailInput.removeAttribute("aria-invalid");
  errorEl.textContent = "";
  console.log(
    `Form submitted for ${nameInput.value.trim() || "anonymous"} with email ${emailValue}`
  );
}

const contactForm = document.getElementById("contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", submitForm);
}
