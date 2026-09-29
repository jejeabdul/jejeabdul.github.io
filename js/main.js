(() => {
  const root = document.documentElement;
  const header = document.querySelector('.site-header');
  const themeToggle = document.getElementById('themeToggle');
  const menuButton = document.getElementById('menuButton');
  const navLinks = document.getElementById('navLinks');
  const filters = document.querySelectorAll('.filter');
  const projects = document.querySelectorAll('.project-card');
  const modal = document.getElementById('projectModal');
  const modalClose = document.getElementById('modalClose');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalDescription = document.getElementById('modalDescription');

  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme) root.dataset.theme = savedTheme;

  themeToggle?.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    localStorage.setItem('portfolio-theme', next);
  });

  const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  menuButton?.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuButton.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
  });

  navLinks?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuButton?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  }));

  filters.forEach(button => {
    button.addEventListener('click', () => {
      filters.forEach(item => item.classList.remove('active'));
      button.classList.add('active');
      const filter = button.dataset.filter;
      projects.forEach(project => {
        const categories = project.dataset.category.split(' ');
        project.classList.toggle('hidden', filter !== 'all' && !categories.includes(filter));
      });
    });
  });

  const openProject = (project) => {
    modalImage.src = project.dataset.image;
    modalImage.alt = project.dataset.title;
    modalTitle.textContent = project.dataset.title;
    modalDescription.textContent = project.dataset.description;
    modal.showModal();
    document.body.classList.add('modal-open');
  };

  projects.forEach(project => {
    project.querySelector('.project-open')?.addEventListener('click', () => openProject(project));
    project.querySelector('.project-media')?.addEventListener('click', () => openProject(project));
    project.querySelector('.project-media')?.style.setProperty('cursor', 'pointer');
  });

  const closeProject = () => {
    if (modal.open) modal.close();
    document.body.classList.remove('modal-open');
  };
  modalClose?.addEventListener('click', closeProject);
  modal?.addEventListener('click', (event) => {
    const rect = modal.getBoundingClientRect();
    const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    if (outside) closeProject();
  });
  modal?.addEventListener('close', () => document.body.classList.remove('modal-open'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();
