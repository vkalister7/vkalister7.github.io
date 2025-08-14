class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem("theme") || "light"
    this.init()
  }

  init() {
    this.applyTheme()
    this.bindEvents()
  }

  applyTheme() {
    document.documentElement.setAttribute("data-theme", this.theme)
    this.updateThemeIcon()
  }

  updateThemeIcon() {
    const themeToggle = document.getElementById("theme-toggle")
    const icon = themeToggle.querySelector("i")

    if (this.theme === "dark") {
      icon.className = "fas fa-sun"
    } else {
      icon.className = "fas fa-moon"
    }
  }

  toggleTheme() {
    this.theme = this.theme === "light" ? "dark" : "light"
    localStorage.setItem("theme", this.theme)
    this.applyTheme()
  }

  bindEvents() {
    const themeToggle = document.getElementById("theme-toggle")
    themeToggle.addEventListener("click", () => this.toggleTheme())
  }
}

class NavigationManager {
  constructor() {
    this.init()
  }

  init() {
    this.bindEvents()
    this.handleScroll()
  }

  bindEvents() {
    const hamburger = document.getElementById("hamburger")
    const navMenu = document.querySelector(".nav-menu")

    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active")
      navMenu.classList.toggle("active")
    })

    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active")
        navMenu.classList.remove("active")
      })
    })

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault()
        const target = document.querySelector(anchor.getAttribute("href"))
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
      })
    })

    window.addEventListener("scroll", () => this.handleScroll())
  }

  handleScroll() {
    const sections = document.querySelectorAll(".section")
    const navLinks = document.querySelectorAll(".nav-link")

    let current = ""
    sections.forEach((section) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.clientHeight
      if (window.pageYOffset >= sectionTop - 200) {
        current = section.getAttribute("id")
      }
    })

    navLinks.forEach((link) => {
      link.classList.remove("active")
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active")
      }
    })
  }
}

class GitHubManager {
  constructor() {
    this.username = "vkalister7"
    this.init()
  }

  init() {
    this.bindEvents()
  }

  bindEvents() {
    const loadButton = document.getElementById("load-github-repos")
    if (loadButton) {
      loadButton.addEventListener("click", () => this.loadRepositories())
    }
  }

  async loadRepositories() {
    const button = document.getElementById("load-github-repos")
    const projectsGrid = document.getElementById("projects-grid")

    try {
      button.classList.add("loading")
      button.textContent = "Loading..."

      const response = await fetch(`https://api.github.com/users/${this.username}/repos?sort=updated&per_page=6`)

      if (!response.ok) {
        throw new Error("Failed to fetch repositories")
      }

      const repos = await response.json()
      this.renderRepositories(repos, projectsGrid)

      button.style.display = "none"
    } catch (error) {
      console.error("Error loading repositories:", error)
      button.textContent = "Failed to load repositories"
      button.classList.remove("loading")
    }
  }

  renderRepositories(repos, container) {
    repos.forEach((repo) => {
      if (!repo.fork) {
        const projectCard = this.createProjectCard(repo)
        container.appendChild(projectCard)
      }
    })
  }

  createProjectCard(repo) {
    const card = document.createElement("div")
    card.className = "project-card fade-in-up"

    const language = repo.language || "Unknown"
    const description = repo.description || "No description available"

    card.innerHTML = `
            <div class="project-header">
                <h3 class="project-title">${repo.name}</h3>
                <div class="project-language">${language}</div>
            </div>
            <p class="project-description">${description}</p>
            <div class="project-tech">
                <span class="tech-tag">${language}</span>
                ${
                  repo.topics
                    ? repo.topics
                        .slice(0, 3)
                        .map((topic) => `<span class="tech-tag">${topic}</span>`)
                        .join("")
                    : ""
                }
            </div>
            <div class="project-links">
                <a href="${repo.html_url}" class="project-link" target="_blank" rel="noopener">
                    <i class="fab fa-github"></i> Code
                </a>
                ${
                  repo.homepage
                    ? `
                    <a href="${repo.homepage}" class="project-link" target="_blank" rel="noopener">
                        <i class="fas fa-external-link-alt"></i> Demo
                    </a>
                `
                    : ""
                }
            </div>
        `

    return card
  }
}

class ContactManager {
  constructor() {
    this.init()
  }

  init() {
    window.emailjs.init("iKVYxVyQ-234BN3mr")
    this.bindEvents()
  }

  bindEvents() {
    const form = document.getElementById("contact-form")
    if (form) {
      form.addEventListener("submit", (e) => this.handleSubmit(e))
    }
  }

  async handleSubmit(e) {
    e.preventDefault()

    const form = e.target
    const formData = new FormData(form)
    const submitButton = form.querySelector('button[type="submit"]')

    const templateParams = {
      from_name: formData.get("name"),
      from_email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
      to_name: "Vikram Kalister",
    }

    try {
      submitButton.textContent = "Sending..."
      submitButton.disabled = true

      const response = await window.emailjs.send("service_v0zzgtg", "template_q76ggyn", templateParams)

      console.log("Email sent successfully:", response)
      this.showSuccess("Message sent successfully! I'll get back to you soon.")
      form.reset()
    } catch (error) {
      console.error("Error sending message:", error)
      this.showError("Failed to send message. Please try again or contact me directly.")
    } finally {
      submitButton.textContent = "Send Message"
      submitButton.disabled = false
    }
  }

  showSuccess(message) {
    this.showNotification(message, "success")
  }

  showError(message) {
    this.showNotification(message, "error")
  }

  showNotification(message, type) {
    const notification = document.createElement("div")
    notification.className = `notification notification-${type}`
    notification.textContent = message

    Object.assign(notification.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      padding: "1rem 1.5rem",
      borderRadius: "0.5rem",
      color: "white",
      backgroundColor: type === "success" ? "#10b981" : "#ef4444",
      zIndex: "9999",
      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
      transform: "translateX(100%)",
      transition: "transform 0.3s ease",
    })

    document.body.appendChild(notification)

    setTimeout(() => {
      notification.style.transform = "translateX(0)"
    }, 100)

    setTimeout(() => {
      notification.style.transform = "translateX(100%)"
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 300)
    }, 5000)
  }
}

class AnimationManager {
  constructor() {
    this.init()
  }

  init() {
    this.observeElements()
  }

  observeElements() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in-up")
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    )

    const elementsToAnimate = document.querySelectorAll(".project-card, .cert-card, .stat-card, .resume-section")

    elementsToAnimate.forEach((el) => observer.observe(el))
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new ThemeManager()
  new NavigationManager()
  new GitHubManager()
  new ContactManager()
  new AnimationManager()
})

document.addEventListener("DOMContentLoaded", () => {
  const subtitle = document.querySelector(".hero-subtitle")
  if (subtitle) {
    const text = subtitle.textContent
    subtitle.textContent = ""

    let i = 0
    const typeWriter = () => {
      if (i < text.length) {
        subtitle.textContent += text.charAt(i)
        i++
        setTimeout(typeWriter, 100)
      }
    }

    setTimeout(typeWriter, 1000)
  }

  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-8px) scale(1.02)"
    })

    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0) scale(1)"
    })
  })
})
