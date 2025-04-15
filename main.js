// Initialize AOS
function initializeAOS() {
    AOS.init({
      once: true, // optional
      duration: 800,
    });
  }
  
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
      
  });
  