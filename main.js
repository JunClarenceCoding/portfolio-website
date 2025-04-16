// Initialize AOS
function initializeAOS() {
  AOS.init({
      once: true, // optional
      duration: 800,
  });
}

const loader = document.getElementById('loading-screen');

// Instantly show loader (no fade-in)
loader.style.opacity = '1';
loader.style.transition = 'none'; // no animation when showing

window.addEventListener('load', () => {
  // Keep loader visible for at least 1.5 seconds
  setTimeout(() => {
    loader.style.transition = 'opacity 0.5s ease'; // enable fade-out
    loader.style.opacity = '0';
    setTimeout(() => loader.style.display = 'none', 500); // remove from DOM after fade
  }, 1500);
});


window.addEventListener('load', () => {
  // Keep loader visible for at least 1.5 seconds
  setTimeout(() => {
    loader.style.opacity = '0';
    loader.style.transition = 'opacity 0.5s ease';
    setTimeout(() => loader.style.display = 'none', 500); // remove from DOM
  }, 1500);
});



// Load page content dynamically
function loadPage(page) {
  fetch(`${page}.html`)
      .then(res => res.text())
      .then(html => {
          document.getElementById('content').innerHTML = html;
          setActive(page); // update nav style
          initializeAOS(); // Re-init AOS after content load

          if (page === 'home') {
              startTypewriter(); // Only for home page
          }

              // FORM HANDLING: Only run when contact page is loaded
          if (page === 'contact') {
            setupContactForm();
          }

          // Update the URL with the new page
          window.history.pushState({ page: page }, page, `#${page}`);
      })
      .catch(err => {
          document.getElementById('content').innerHTML = "<p class='text-center mt-10'>Page not found.</p>";
      });
}

const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

let isOpen = false;

menuBtn.addEventListener('click', () => {
  isOpen = !isOpen;
  mobileMenu.classList.toggle('-translate-y-full');
});

function closeMenu() {
  isOpen = false;
  mobileMenu.classList.add('-translate-y-full');
}

// Highlight active nav
function setActive(section) {
  const spans = document.querySelectorAll("ul li span");
  spans.forEach(span => span.classList.remove("text-blue-400"));
  const active = document.querySelector(`#${section}-link span`);
  if (active) active.classList.add("text-blue-400");
}

// Typewriter effect
function startTypewriter() {
  const typewriterElement = document.getElementById("typewriter");
  if (!typewriterElement) return;

  const titles = ["Web Developer", "Game Developer"];
  let titleIndex = 0;
  let charIndex = 0;
  let typing = true;

  function type() {
      const currentTitle = titles[titleIndex];
      if (typing) {
          if (charIndex < currentTitle.length) {
              typewriterElement.textContent += currentTitle.charAt(charIndex);
              charIndex++;
              setTimeout(type, 100);
          } else {
              typing = false;
              setTimeout(type, 1000);
          }
      } else {
          if (charIndex > 0) {
              typewriterElement.textContent = currentTitle.substring(0, charIndex - 1);
              charIndex--;
              setTimeout(type, 50);
          } else {
              typing = true;
              titleIndex = (titleIndex + 1) % titles.length;
              setTimeout(type, 500);
          }
      }
  }

  setTimeout(() => type(), 1000);
}

// On DOM load
document.addEventListener("DOMContentLoaded", () => {
  initializeAOS();
  loadPage("home");

  document.querySelectorAll("a[href^='#']").forEach(link => {
      link.addEventListener("click", e => {
          e.preventDefault();
          const id = link.getAttribute("href").substring(1);
          loadPage(id);
          closeMenu(); 
      });
  });

  // Load the page from the URL hash if it exists
  const initialPage = window.location.hash ? window.location.hash.substring(1) : "home";
  loadPage(initialPage);
});


function setupContactForm() {
  const form = document.querySelector("#contact form");
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toast-message");
  const toastClose = document.getElementById("toast-close");

  if (form && toast && toastMessage && toastClose) {
    // Form submit
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(form);

      try {
        const res = await fetch(form.action, {
          method: "POST",
          headers: { 'Accept': 'application/json' },
          body: formData,
        });

        if (res.ok) {
          showToast("Message sent successfully!");
          form.reset();
        } else {
          showToast("Oops! Something went wrong.");
        }
      } catch (err) {
        showToast("Network error. Try again.");
      }
    });

    // Toast close button
    toastClose.addEventListener("click", () => {
      hideToast();
    });

    // Show toast (fade-in)
    function showToast(message) {
      toastMessage.textContent = message;
      toast.classList.remove("hidden", "opacity-0");
      toast.classList.add("opacity-100");

      // Automatically hide the toast after 3 seconds
      setTimeout(() => {
        hideToast();
      }, 3000); // Adjust duration as needed
    }

    // Hide toast (fade-out)
    function hideToast() {
      toast.classList.remove("opacity-100");
      toast.classList.add("opacity-0");

      // Hide after fade-out transition
      setTimeout(() => {
        toast.classList.add("hidden");
      }, 300); // Match your transition duration
    }
  }
}




