  // Initial project data
        const initialProjects = [
            {
                id: 1,
                title: "E-Commerce Platform",
                category: "web",
                description: "A modern e-commerce platform with seamless user experience and advanced filtering options.",
                image: "img/E-Commerce Platform.jpeg",
                client: "RetailTech Inc.",
                date: "January 2023",
                technologies: "React, Node.js, MongoDB"
            },
            {
                id: 2,
                title: "Mobile Banking App",
                category: "app",
                description: "A secure and intuitive mobile banking application with biometric authentication.",
                image: "img/Mobile Banking App.jpeg",
                client: "FinSecure Bank",
                date: "February 2023",
                technologies: "React Native, Firebase"
            },
            {
                id: 3,
                title: "Brand Identity Design",
                category: "brand",
                description: "Complete brand identity redesign for a tech startup including logo, color palette, and guidelines.",
                image: "img/Brand Identity Design.jpeg",
                client: "TechStart",
                date: "March 2023",
                technologies: "Illustrator, Photoshop"
            },
            {
                id: 4,
                title: "Corporate Website",
                category: "web",
                description: "Responsive corporate website with custom animations and interactive elements.",
                image: "https://picsum.photos/seed/project4/600/400.jpg",
                client: "Global Corp",
                date: "April 2023",
                technologies: "HTML5, CSS3, JavaScript"
            },
            {
                id: 5,
                title: "Task Management App",
                category: "app",
                description: "Productivity app with team collaboration features and real-time updates.",
                image: "img/Task Management App.jpeg",
                client: "Productivity Plus",
                date: "May 2023",
                technologies: "Flutter, Firebase"
            },
            {
                id: 6,
                title: "Restaurant Branding",
                category: "brand",
                description: "Complete branding package for a new restaurant chain including menu design and signage.",
                image: "img/Restaurant Branding.jpeg",
                client: "Gourmet Chain",
                date: "June 2023",
                technologies: "Illustrator, InDesign"
            }
        ];

        // Load projects from localStorage or use initial data
        let projects = JSON.parse(localStorage.getItem('acs_projects')) || initialProjects;

        // DOM Elements
        const projectsGrid = document.getElementById('projectsGrid');
        const filterBtns = document.querySelectorAll('.filter-btn');
        const modal = document.getElementById('projectModal');
        const modalClose = document.getElementById('modalClose');
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const nav = document.getElementById('nav');
        const navLinks = document.querySelectorAll('.nav-link');
        const contactForm = document.getElementById('contactForm');
        const adminToggle = document.getElementById('adminToggle');
        const adminContent = document.getElementById('adminContent');
        const adminTabs = document.querySelectorAll('.admin-tab');
        const addProjectForm = document.getElementById('addProjectForm');
        const editAboutForm = document.getElementById('editAboutForm');
        const toast = document.getElementById('toast');

        // Initialize the page
        document.addEventListener('DOMContentLoaded', () => {
            renderProjects('all');
            setupEventListeners();
            loadAboutContent();
        });

        // Setup event listeners
        function setupEventListeners() {
            // Filter buttons
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    renderProjects(btn.dataset.filter);
                });
            });

            // Mobile menu toggle
            mobileMenuToggle.addEventListener('click', () => {
                nav.classList.toggle('active');
            });

            // Navigation links
            navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                    
                    const targetId = link.getAttribute('href');
                    const targetSection = document.querySelector(targetId);
                    
                    if (targetSection) {
                        window.scrollTo({
                            top: targetSection.offsetTop - 70,
                            behavior: 'smooth'
                        });
                    }
                    
                    // Close mobile menu if open
                    nav.classList.remove('active');
                });
            });

            // Modal close
            modalClose.addEventListener('click', () => {
                modal.classList.remove('active');
            });

            // Click outside modal to close
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });

            // Contact form
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                showToast('Your message has been sent successfully!');
                contactForm.reset();
            });

            // Admin panel toggle
            adminToggle.addEventListener('click', () => {
                adminContent.classList.toggle('active');
            });

            // Admin tabs
            adminTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    adminTabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    
                    const tabId = tab.dataset.tab;
                    document.querySelectorAll('.admin-tab-content').forEach(content => {
                        content.classList.remove('active');
                    });
                    document.getElementById(`${tabId}Tab`).classList.add('active');
                });
            });

            // Add project form
            addProjectForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const newProject = {
                    id: projects.length + 1,
                    title: document.getElementById('projectTitle').value,
                    category: document.getElementById('projectCategory').value,
                    description: document.getElementById('projectDescription').value,
                    image: document.getElementById('projectImage').value || `https://picsum.photos/seed/project${projects.length + 1}/600/400.jpg`,
                    client: "New Client",
                    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
                    technologies: "HTML, CSS, JavaScript"
                };
                
                projects.push(newProject);
                localStorage.setItem('acs_projects', JSON.stringify(projects));
                renderProjects('all');
                addProjectForm.reset();
                showToast('Project added successfully!');
            });

            // Edit about form
            editAboutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const aboutData = {
                    title: document.getElementById('aboutTitle').value,
                    paragraph1: document.getElementById('aboutParagraph1').value,
                    paragraph2: document.getElementById('aboutParagraph2').value,
                    paragraph3: document.getElementById('aboutParagraph3').value
                };
                
                localStorage.setItem('acs_about', JSON.stringify(aboutData));
                updateAboutContent(aboutData);
                showToast('About section updated successfully!');
            });

            // Header scroll effect
            window.addEventListener('scroll', () => {
                const header = document.getElementById('header');
                if (window.scrollY > 50) {
                    header.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
                } else {
                    header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
                }
            });
        }

        // Render projects
        function renderProjects(filter) {
            projectsGrid.innerHTML = '';
            
            const filteredProjects = filter === 'all' 
                ? projects 
                : projects.filter(project => project.category === filter);
            
            filteredProjects.forEach(project => {
                const projectCard = document.createElement('div');
                projectCard.className = 'project-card';
                projectCard.innerHTML = `
                    <div class="project-image">
                        <img src="${project.image}" alt="${project.title}">
                        <div class="project-overlay">
                            <button class="btn" onclick="openProjectModal(${project.id})">View Details</button>
                        </div>
                    </div>
                    <div class="project-info">
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                        <div class="project-tags">
                            <span class="tag">${getCategoryName(project.category)}</span>
                        </div>
                    </div>
                `;
                projectsGrid.appendChild(projectCard);
            });
        }

        // Get category name
        function getCategoryName(category) {
            const categories = {
                'web': 'Web Design',
                'app': 'App Development',
                'brand': 'Branding'
            };
            return categories[category] || category;
        }

        // Open project modal
        function openProjectModal(projectId) {
            const project = projects.find(p => p.id === projectId);
            if (project) {
                document.getElementById('modalTitle').textContent = project.title;
                document.getElementById('modalImage').src = project.image;
                document.getElementById('modalDescription').textContent = project.description;
                document.getElementById('modalCategory').textContent = getCategoryName(project.category);
                document.getElementById('modalClient').textContent = project.client;
                document.getElementById('modalDate').textContent = project.date;
                document.getElementById('modalTech').textContent = project.technologies;
                
                modal.classList.add('active');
            }
        }

        // Load about content from localStorage
        function loadAboutContent() {
            const aboutData = JSON.parse(localStorage.getItem('acs_about'));
            if (aboutData) {
                updateAboutContent(aboutData);
            }
        }

        // Update about content
        function updateAboutContent(data) {
            document.querySelector('.about-text h2').textContent = data.title;
            const paragraphs = document.querySelectorAll('.about-text p');
            if (paragraphs.length >= 3) {
                paragraphs[0].textContent = data.paragraph1;
                paragraphs[1].textContent = data.paragraph2;
                paragraphs[2].textContent = data.paragraph3;
            }
        }

        // Show toast notification
        function showToast(message) {
            toast.textContent = message;
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }