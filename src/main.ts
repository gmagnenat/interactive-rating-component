interface RatingElements {
  form: HTMLFormElement;
  formContainer: HTMLElement;
  thankyouContainer: HTMLElement;
  thankyouTitle: HTMLElement;
  selectedRating: HTMLElement;
  validationMessage: HTMLElement;
  ratingInputs: HTMLElement;
}

const CSS_CLASSES = {
  ACTIVE: "--active",
  ERROR: ".validation-message",
  FORM: ".form",
  RATING_STATE: ".rating-state",
  THANKYOU_STATE: ".thank-you-state",
  THANKYOU_TITLE: ".thank-you__heading",
  SELECTED_RATING: ".selected-value",
  RATING_INPUTS: ".rating__inputs",
} as const;

// get all the required DOM elements and throw an error if any of them are missing
function getDOMElements(): RatingElements {
  const form = document.querySelector(CSS_CLASSES.FORM);
  const formContainer = document.querySelector(CSS_CLASSES.RATING_STATE);
  const thankyouContainer = document.querySelector(CSS_CLASSES.THANKYOU_STATE);
  const thankyouTitle = document.querySelector(CSS_CLASSES.THANKYOU_TITLE);
  const selectedRating = document.querySelector(CSS_CLASSES.SELECTED_RATING);
  const validationMessage = document.querySelector(CSS_CLASSES.ERROR);
  const ratingInputs = document.querySelector(CSS_CLASSES.RATING_INPUTS);

  if (
    !form ||
    !formContainer ||
    !thankyouContainer ||
    !thankyouTitle ||
    !selectedRating ||
    !validationMessage ||
    !ratingInputs
  ) {
    throw new Error("Required DOM elements not found");
  }

  return {
    form: form as HTMLFormElement,
    formContainer: formContainer as HTMLElement,
    thankyouContainer: thankyouContainer as HTMLElement,
    thankyouTitle: thankyouTitle as HTMLElement,
    selectedRating: selectedRating as HTMLElement,
    validationMessage: validationMessage as HTMLElement,
    ratingInputs: ratingInputs as HTMLElement,
  };
}

/**
 * Handle form submission and display thank you message
 * @param event Submit event from form
 * @param elements DOM elements needed for the rating component
 */
function handleSubmit(event: SubmitEvent, elements: RatingElements): void {
  event.preventDefault();
  const formData = new FormData(elements.form);
  const rating = formData.get("rating") as string;

  if (!rating) {
    elements.validationMessage.classList.add(CSS_CLASSES.ACTIVE);
    elements.validationMessage.innerHTML = `<p>Please select a rating</p>`;
    throw new Error("No rating selected");
  }

  elements.validationMessage.classList.remove(CSS_CLASSES.ACTIVE);
  renderThankyouMessage(rating, elements);
}

/**
 * Display thank you message with selected rating
 * @param rating Selected rating value
 * @param elements DOM elements needed for the rating component
 */
function renderThankyouMessage(rating: string, elements: RatingElements): void {
  elements.formContainer.classList.remove(CSS_CLASSES.ACTIVE);
  elements.thankyouContainer.classList.add(CSS_CLASSES.ACTIVE);
  elements.selectedRating.textContent = rating;
  elements.thankyouTitle.focus();

  // Update URL without page reload
  const thankYouUrl = `${window.location.origin}/thank-you`;
  window.history.pushState({ rating }, "", thankYouUrl);
}

/**
 * Initialize the rating form and add event listeners to the inputs
 * @param elements DOM elements needed for the rating component
 */
function initializeRatingForm(elements: RatingElements): void {
  const ratingInputs = elements.form.querySelectorAll('input[name="rating"]');

  ratingInputs.forEach((input) => {
    input.addEventListener("change", () => {
      elements.validationMessage.innerHTML = "";
    });
  });
}

function checkPageUrl(): void {
  const currentPath = window.location.pathname;

  if (currentPath.includes("thank-you")) {
    window.history.replaceState(null, "", "/");
    const elements = getDOMElements();
    elements.form.reset();
  }
}

// Handle browser back button and make sure to reset the form in case of redirection issue.
// This is a workaround for the issue where the form is not reset when the back button is clicked.
window.addEventListener("popstate", () => {
  const elements = getDOMElements();
  elements.form.reset();
  window.location.href = "/";
});

// Initialize the rating component
try {
  const elements = getDOMElements();
  elements.form.addEventListener("submit", (event: SubmitEvent) =>
    handleSubmit(event, elements)
  );
  initializeRatingForm(elements);
  checkPageUrl();
} catch (error) {
  console.error("Failed to initialize rating component:", error);
}
