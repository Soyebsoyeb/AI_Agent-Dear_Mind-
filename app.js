document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("thoughtForm");
  const formContainer = document.getElementById("formContainer");
  const responseContainer = document.getElementById("responseContainer");
  const responseContent = document.getElementById("responseContent");
  const loadingIndicator = document.getElementById("loadingIndicator");
  const moodOptions = document.querySelectorAll(".mood-option");
  const moodSelect = document.getElementById("mood");
  const newThoughtBtn = document.getElementById("newThoughtBtn");
  const submitBtn = document.getElementById("submitBtn");

  // Mood option selection
  moodOptions.forEach((option) => {
    option.addEventListener("click", function () {
      moodOptions.forEach((opt) => opt.classList.remove("selected"));
      this.classList.add("selected");
      moodSelect.value = this.getAttribute("data-value");
    });
  });

  // Form submission
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Show loading state
    formContainer.style.display = "none";
    loadingIndicator.style.display = "block";
    responseContainer.style.display = "none";

    submitBtn.innerHTML = "<span>Sending...</span>";
    submitBtn.disabled = true;

    try {
      // Prepare form data
      const formData = new FormData(form);
      const data = {
        query: formData.get("query"),
        mood: formData.get("mood"),
      };

      // Send to webhook
      const response = await fetch(
        "https://soyeb18.app.n8n.cloud/webhook/Submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      // Clone the response to read it multiple times if needed
      const responseClone = response.clone();

      // First try to parse as JSON
      try {
        const jsonData = await response.json();
        responseContent.textContent =
          typeof jsonData === "object"
            ? JSON.stringify(jsonData, null, 2)
            : jsonData;
      } catch (jsonError) {
        // If JSON parsing fails, read as text
        const textData = await responseClone.text();
        responseContent.textContent = textData;
      }

      // Show response
      loadingIndicator.style.display = "none";
      responseContainer.style.display = "block";
    } catch (error) {
      console.error("Error:", error);
      responseContent.textContent = `Error: ${error.message}\n\nPlease try again.`;

      loadingIndicator.style.display = "none";
      responseContainer.style.display = "block";
    } finally {
      submitBtn.innerHTML = "<span>Share Thought</span>";
      submitBtn.disabled = false;
    }
  });

  // New thought button
  newThoughtBtn.addEventListener("click", function () {
    form.reset();
    moodOptions.forEach((opt) => opt.classList.remove("selected"));
    responseContainer.style.display = "none";
    formContainer.style.display = "block";
  });
});
