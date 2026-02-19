// Resume Data - Vismay M. Nayak
const resumeData = {
  profile: {
    name: "Vismay M. Nayak",
    title: "Tech Enthusiast • BCA Student",
    summary: "Passionate about website development, AI tools, and creative digital content. Beginner-level experience with React, Node.js, TypeScript, MERN stack, automation, Blender animation, and text-to-video tools."
  },
  contact: {
    email: "nayakvismay6@gmail.com",
    phone: "+91 8618370284",
    location: "HIG-3 Akshay Park Gokul Road, Hubli, Karnataka, India, 580030"
  },
  skills: {
    programming: ["JavaScript", "TypeScript", "Python", "C++", "HTML/CSS"],
    web: ["React", "Node.js", "Express.js", "MongoDB", "Next.js", "Tailwind CSS"],
    ai: ["Machine Learning", "NLP", "AI Tools", "Automation", "Text-to-Video"],
    design: ["Blender", "Figma", "Canva", "Adobe Creative Suite", "UI/UX Design"]
  },
  projects: [
    {
      title: "Portfolio Website",
      description: "Interactive portfolio website built with modern web technologies featuring 3D animations and smooth transitions.",
      technologies: ["React", "Three.js", "GSAP", "Tailwind CSS"]
    },
    {
      title: "AI Content Generator",
      description: "Automated content creation tool using AI for generating text, images, and video content.",
      technologies: ["Python", "OpenAI API", "Node.js", "React"]
    },
    {
      title: "Blender Animation Suite",
      description: "Collection of 3D animations and visual effects created using Blender for various projects.",
      technologies: ["Blender", "3D Modeling", "Animation", "Visual Effects"]
    },
    {
      title: "MERN Stack Application",
      description: "Full-stack web application demonstrating CRUD operations with modern UI/UX design.",
      technologies: ["MongoDB", "Express.js", "React", "Node.js"]
    }
  ],
  education: [
    {
      period: "2022 - Present",
      school: "BCA Student",
      details: "Bachelor of Computer Applications - Currently pursuing"
    },
    {
      period: "2020 - 2022",
      school: "Higher Secondary Education",
      details: "Completed with focus on Computer Science and Mathematics"
    },
    {
      period: "2018 - 2020",
      school: "Secondary Education",
      details: "Strong foundation in Science and Technology subjects"
    }
  ]
};

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
  console.log('Resume page loaded - initializing...');
  
  // Add smooth scrolling to all navigation links
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Populate skills
  populateSkills();
  
  // Populate projects
  populateProjects();
  
  // Populate education
  populateEducation();
  
  // Add scroll animations
  addScrollAnimations();
  
  // Add navigation background on scroll
  addNavigationEffects();
});

// Populate skills section
function populateSkills() {
  const programmingSkills = document.getElementById('programming-skills');
  const webSkills = document.getElementById('web-skills');
  const aiSkills = document.getElementById('ai-skills');
  const designSkills = document.getElementById('design-skills');
  
  if (!programmingSkills || !webSkills || !aiSkills || !designSkills) {
    console.error('Skills containers not found');
    return;
  }
  
  // Programming Languages
  resumeData.skills.programming.forEach(skill => {
    const tag = document.createElement('span');
    tag.className = 'skill-tag';
    tag.textContent = skill;
    programmingSkills.appendChild(tag);
  });
  
  // Web Technologies
  resumeData.skills.web.forEach(skill => {
    const tag = document.createElement('span');
    tag.className = 'skill-tag';
    tag.textContent = skill;
    webSkills.appendChild(tag);
  });
  
  // AI & Tools
  resumeData.skills.ai.forEach(skill => {
    const tag = document.createElement('span');
    tag.className = 'skill-tag';
    tag.textContent = skill;
    aiSkills.appendChild(tag);
  });
  
  // Design & Creative
  resumeData.skills.design.forEach(skill => {
    const tag = document.createElement('span');
    tag.className = 'skill-tag';
    tag.textContent = skill;
    designSkills.appendChild(tag);
  });
}

// Populate projects section
function populateProjects() {
  const projectsGrid = document.getElementById('projects-grid');
  
  if (!projectsGrid) {
    console.error('Projects grid not found');
    return;
  }
  
  resumeData.projects.forEach(project => {
    const projectCard = document.createElement('div');
    projectCard.className = 'project-card';
    
    projectCard.innerHTML = `
      <h3 class="project-title">${project.title}</h3>
      <p class="project-description">${project.description}</p>
      <div class="project-tech">
        ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
      </div>
    `;
    
    projectsGrid.appendChild(projectCard);
  });
}

// Populate education section
function populateEducation() {
  const educationTimeline = document.getElementById('education-timeline');
  
  if (!educationTimeline) {
    console.error('Education timeline not found');
    return;
  }
  
  resumeData.education.forEach(edu => {
    const educationItem = document.createElement('div');
    educationItem.className = 'education-item';
    
    educationItem.innerHTML = `
      <div class="education-period">${edu.period}</div>
      <div class="education-school">${edu.school}</div>
      <div class="education-details">${edu.details}</div>
    `;
    
    educationTimeline.appendChild(educationItem);
  });
}

// Add scroll animations
function addScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
        entry.target.style.opacity = '1';
      }
    });
  }, observerOptions);
  
  // Observe all sections
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    section.style.opacity = '0';
    observer.observe(section);
  });
  
  // Observe skill categories
  const skillCategories = document.querySelectorAll('.skill-category');
  skillCategories.forEach((category, index) => {
    category.style.opacity = '0';
    category.style.transform = 'translateY(30px)';
    category.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(category);
  });
  
  // Observe project cards
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
  });
  
  // Observe education items
  const educationItems = document.querySelectorAll('.education-item');
  educationItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-30px)';
    item.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(item);
  });
}

// Add navigation background effects
function addNavigationEffects() {
  const nav = document.querySelector('.resume-nav');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      nav.style.background = 'rgba(255, 255, 255, 0.98)';
      nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
      nav.style.background = 'rgba(255, 255, 255, 0.95)';
      nav.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    }
  });
}

// Add interactive hover effects to skill tags
document.addEventListener('DOMContentLoaded', function() {
  // Add click effects to skill tags
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('skill-tag')) {
      // Create ripple effect
      const ripple = document.createElement('span');
      ripple.style.position = 'absolute';
      ripple.style.borderRadius = '50%';
      ripple.style.background = 'rgba(255, 255, 255, 0.6)';
      ripple.style.transform = 'scale(0)';
      ripple.style.animation = 'ripple 0.6s linear';
      ripple.style.left = '50%';
      ripple.style.top = '50%';
      ripple.style.width = '20px';
      ripple.style.height = '20px';
      ripple.style.marginLeft = '-10px';
      ripple.style.marginTop = '-10px';
      
      e.target.style.position = 'relative';
      e.target.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    }
  });
  
  // Add ripple animation to CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const heroVisual = document.querySelector('.hero-visual');
  const rate = scrolled * -0.5;
  
  if (heroVisual) {
    heroVisual.style.transform = `translateY(${rate}px)`;
  }
});

// Add typing effect to hero title (optional enhancement)
function typeWriter(element, text, speed = 50) {
  let i = 0;
  element.innerHTML = '';
  
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// Initialize typing effect on page load
document.addEventListener('DOMContentLoaded', function() {
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const originalText = heroTitle.textContent;
    setTimeout(() => {
      typeWriter(heroTitle, originalText, 100);
    }, 500);
  }
});