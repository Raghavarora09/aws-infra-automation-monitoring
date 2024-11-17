// Theme Toggling
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;
let isDarkMode = false;

themeToggle.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    themeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
});

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    isDarkMode = savedTheme === 'dark';
    body.setAttribute('data-theme', savedTheme);
    themeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Back to Top Button
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTop.style.display = 'flex';
    } else {
        backToTop.style.display = 'none';
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Modal Functionality
const modal = document.getElementById('toolModal');
const closeModal = document.querySelector('.close-modal');
const toolCards = document.querySelectorAll('.tool-card');

const toolInfo = {
    git: {
        icon: 'fab fa-git-alt',
        title: 'Git',
        description: `Git is a distributed version control system that tracks changes in source code during software development.
        Key features include:
        • Branching and merging
        • Local repository
        • Collaborative development
        • Complete history tracking
        • Speed and efficiency`
    },
    github: {
        icon: 'fab fa-github',
        title: 'GitHub',
        description: `GitHub is a web-based hosting service for version control using Git that provides:
        • Code hosting
        • Pull requests
        • Issue tracking
        • Project management
        • CI/CD integration
        • Team collaboration tools`
    },
    ansible: {
        icon: 'fas fa-robot',
        title: 'Ansible',
        description: `Ansible is an open-source automation tool that provides:
        • Agentless architecture
        • YAML-based playbooks
        • SSH-based connectivity
        • Multi-platform support
        • Extensive module library
        • Role-based configuration`
    },
    puppet: {
        icon: 'fas fa-boxes',
        title: 'Puppet',
        description: `Puppet is a configuration management tool that offers:
        • Declarative language
        • Model-driven solution
        • Cross-platform support
        • Compliance automation
        • Enterprise features
        • Extensive module forge`
    },
    prometheus: {
        icon: 'fas fa-fire',
        title: 'Prometheus',
        description: `Prometheus is a monitoring and alerting toolkit featuring:
        • Time-series database
        • PromQL query language
        • Alert management
        • Visualization support
        • Service discovery
        • Multi-dimensional data model`
    },
    grafana: {
        icon: 'fas fa-chart-pie',
        title: 'Grafana',
        description: `Grafana is a visualization and analytics platform offering:
        • Interactive dashboards
        • Multiple data sources
        • Alert system
        • Template variables
        • Plugin architecture
        • Team collaboration`
    }
};

toolCards.forEach(card => {
    const button = card.querySelector('.learn-more');
    button.addEventListener('click', () => {
        const tool = card.dataset.tool;
        const info = toolInfo[tool];
        
        modal.querySelector('.tool-icon').className = `tool-icon ${info.icon}`;
        modal.querySelector('.modal-header h2').textContent = info.title;
        modal.querySelector('.modal-body').innerHTML = info.description;
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Navbar Animation
let lastScroll = 0;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > lastScroll && currentScroll > 100) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
});

// Add loading animation to cards
window.addEventListener('load', () => {
    toolCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
});