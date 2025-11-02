// src/main.js
const cssUrl = new URL('./main.css', import.meta.url).toString();

(function boot() {
  // ---- inject CSS so Webflow pages use it ----
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = cssUrl;
  document.head.appendChild(link);
  

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  Promise.all([
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js'),
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js'),
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollToPlugin.min.js')
  ]).then(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    let horizontalScrollResizeTimeout;

    // Theme Management
    class ThemeManager {
      constructor() {
        this.currentTheme = this.getStoredTheme() || 'light';
        this.init();
      }
      init() {
        this.applyTheme(this.currentTheme);
        const toggle = document.querySelector('.light-dark-mode-toggle');
        if (toggle) {
          const newToggle = toggle.cloneNode(true);
          toggle.parentNode.replaceChild(newToggle, toggle);
          newToggle.addEventListener('click', () => this.toggleTheme());
        }
      }
      getStoredTheme() {
        try { return localStorage.getItem('portfolio-theme'); } catch (e) { return null; }
      }
      storeTheme(theme) {
        try { localStorage.setItem('portfolio-theme', theme); } catch (e) {}
      }
      applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        this.storeTheme(theme);
        this.updateToggleIcon(theme);
        document.body.style.filter = '';
      }
      toggleTheme() {
        this.applyTheme(this.currentTheme === 'light' ? 'dark' : 'light');
      }
      updateToggleIcon(theme) {
        const toggle = document.querySelector('.light-dark-mode-toggle img');
        if (!toggle) return;
        const lightIcon = 'data:image/svg+xml;base64,PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KPCEtLSBVcGxvYWRlZCB0bzogU1ZHIFJlcG8sIHd3dy5zdmdyZXBvLmNvbSwgVHJhbnNmb3JtZWQgYnk6IFNWRyBSZXBvIE1peGVyIFRvb2xzIC0tPgo8c3ZnIHdpZHRoPSI4MDBweCIgaGVpZ2h0PSI4MDBweCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHN0cm9rZT0iI2ZmZmZmZiI+Cg08ZyBpZD0iU1ZHUmVwb19iZ0NhcnJpZXIiIHN0cm9rZS13aWR0aD0iMCIvPgoNPGcgaWQ9IlNWR1JlcG9fdHJhY2VyQ2FycmllciIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cg08ZyBpZD0iU1ZHUmVwb19pY29uQ2FycmllciI+IDxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTIgMS4yNUMxMi40MTQyIDEuMjUgMTIuNzUgMS41ODU3OSAxMi43NSAyVjNDMTIuNzUgMy40MTQyMSAxMi40MTQyIDMuNzUgMTIgMy43NUMxMS41ODU4IDMuNzUgMTEuMjUgMy40MTQyMSAxMS4yNSAzVjJDMTEuMjUgMS41ODU3OSAxMS41ODU4IDEuMjUgMTIgMS4yNVpNNC4zOTg2MSA0LjM5ODYxQzQuNjkxNSA0LjEwNTcyIDUuMTY2MzggNC4xMDU3MiA1LjQ1OTI3IDQuMzk4NjFMNS44NTIxMSA0Ljc5MTQ1QzYuMTQ1IDUuMDg0MzQgNi4xNDUgNS41NTkyMSA1Ljg1MjExIDUuODUyMTFDNS41NTkyMSA2LjE0NSA1LjA4NDM0IDYuMTQ1IDQuNzkxNDUgNS44NTIxMUw0LjM5ODYxIDUuNDU5MjdDNC4xMDU3MiA1LjE2NjM4IDQuMTA1NzIgNC42OTE1IDQuMzk4NjEgNC4zOTg2MVpNMTkuNjAxMSA0LjM5ODg3QzE5Ljg5NCA0LjY5MTc2IDE5Ljg5NCA1LjE2NjY0IDE5LjYwMTEgNS40NTk1M0wxOS4yMDgzIDUuODUyMzdDMTguOTE1NCA2LjE0NTI2IDE4LjQ0MDUgNi4xNDUyNiAxOC4xNDc2IDUuODUyMzdDMTcuODU0NyA1LjU1OTQ3IDE3Ljg1NDcgNS4wODQ2IDE4LjE0NzYgNC43OTE3MUwxOC41NDA1IDQuMzk4ODdDMTguODMzNCA0LjEwNTk4IDE5LjMwODIgNC4xMDU5OCAxOS42MDExIDQuMzk4ODdaTTEyIDYuNzVDOS4xMDA1IDYuNzUgNi43NSA5LjEwMDUgNi43NSAxMkM2Ljc1IDE0Ljg5OTUgOS4xMDA1IDE3LjI1IDEyIDE3LjI1QzE0Ljg5OTUgMTcuMjUgMTcuMjUgMTQuODk5NSAxNy4yNSAxMkMxNy4yNSA5LjEwMDUgMTQuODk5NSA2Ljc1IDEyIDYuNzVaTTUuMjUgMTJDNS4yNSA4LjI3MjA4IDguMjcyMDggNS4yNSAxMiA1LjI1QzE1LjcyNzkgNS4yNSAxOC43NSA4LjI3MjA4IDE4Ljc1IDEyQzE4Ljc1IDE1LjcyNzkgMTUuNzI3OSAxOC43NSAxMiAxOC43NUM4LjI3MjA4IDE4Ljc1IDUuMjUgMTUuNzI3OSA1LjI1IDEyWk0xLjI1IDEyQzEuMjUgMTEuNTg1OCAxLjU4NTc5IDExLjI1IDIgMTEuMjVIM0MzLjQxNDIxIDExLjI1IDMuNzUgMTEuNTg1OCAzLjc1IDEyQzMuNzUgMTIuNDE0MiAzLjQxNDIxIDEyLjc1IDMgMTIuNzVIMkMxLjU4NTc5IDEyLjc1IDEuMjUgMTIuNDE0MiAxLjI1IDEyWk0yMC4yNSAxMkMyMC4yNSAxMS41ODU4IDIwLjU4NTggMTEuMjUgMjEgMTEuMjVIMjJDMjIuNDE0MiAxMS4yNSAyMi43NSAxMS41ODU4IDIyLjc1IDEyQzIyLjc1IDEyLjQxNDIgMjIuNDE0MiAxMi43NSAyMiAxMi43NUgyMUMyMC41ODU4IDEyLjc1IDIwLjI1IDEyLjQxNDIgMjAuMjUgMTJaTTE4LjE0NzYgMTguMTQ3NkMxOC40NDA1IDE3Ljg1NDcgMTguOTE1NCAxNy44NTQ3IDE5LjIwODMgMTguMTQ3NkwxOS42MDExIDE4LjU0MDVDMTkuODk0IDE4LjgzMzQgMTkuODk0IDE5LjMwODIgMTkuNjAxMSAxOS42MDExQzE5LjMwODIgMTkuODk0IDE4LjgzMzQgMTkuODk0IDE4LjU0MDUgMTkuNjAxMUwxOC4xNDc2IDE5LjIwODNDMTcuODU0NyAxOC45MTU0IDE3Ljg1NDcgMTguNDQwNSAxOC4xNDc2IDE4LjE0NzZaTTUuODUyMTEgMTguMTQ3OUM2LjE0NSAxOC40NDA4IDYuMTQ1IDE4LjkxNTcgNS44NTIxMSAxOS4yMDg2TDUuNDU5MjcgMTkuNjAxNEM1LjE2NjM4IDE5Ljg5NDMgNC42OTE1IDE5Ljg5NDMgNC4zOTg2MSAxOS42MDE0QzQuMTA1NzIgMTkuMzA4NSA0LjEwNTcyIDE4LjgzMzYgNC4zOTg2MSAxOC41NDA3TDQuNzkxNDUgMTguMTQ3OUM1LjA4NDM0IDE3Ljg1NSA1LjU1OTIxIDE3Ljg1NSA1Ljg1MjExIDE4LjE0NzlaTTEyIDIwLjI1QzEyLjQxNDIgMjAuMjUgMTIuNzUgMjAuNTg1OCAxMi43NSAyMVYyMkMxMi43NSAyMi40MTQyIDEyLjQxNDIgMjIuNzUgMTIgMjIuNzVDMTEuNTg1OCAyMi43NSAxMS4yNSAyMi40MTQyIDExLjI1IDIyVjIxQzExLjI1IDIwLjU4NTggMTEuNTg1OCAyMC4yNSAxMiAyMC4yNVoiIGZpbGw9IiNmZmZmZmYiLz4gPC9nPgoNPC9zdmc+';
        const darkIcon = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIxIDEyLjc5QTkgOSAwIDEgMSAxMS4yMSAzIDcgNyAwIDAgMCAyMSAxMi43OXoiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4=';
        toggle.src = theme === 'dark' ? lightIcon : darkIcon;
      }
    }

    class TextScramble {
      constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
        this.resolve = null;
        this.frameRequest = null;
        this.queue = [];
        this.frame = 0;
      }

      setText(newText) {
        const oldText = this.el.innerText || '';
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => {
          this.resolve = resolve;
        });
        
        this.queue = [];
        for (let i = 0; i < length; i++) {
          const from = oldText[i] || '';
          const to = newText[i] || '';
          const start = Math.floor(Math.random() * 40);
          const end = start + Math.floor(Math.random() * 40);
          this.queue.push({ from, to, start, end, char: '' });
        }
        
        if (this.frameRequest) {
          cancelAnimationFrame(this.frameRequest);
        }
        
        this.frame = 0;
        this.update();
        return promise;
      }

      update() {
        let output = '';
        let complete = 0;
        
        for (let i = 0, n = this.queue.length; i < n; i++) {
          let { from, to, start, end, char } = this.queue[i];
          
          if (this.frame >= end) {
            complete++;
            output += to;
          } else if (this.frame >= start) {
            if (!char || Math.random() < 0.28) {
              char = this.randomChar();
              this.queue[i].char = char;
            }
            output += `<span class="dud">${char}</span>`;
          } else {
            output += from;
          }
        }
        
        this.el.innerHTML = output;
        
        if (complete === this.queue.length) {
          if (this.resolve) {
            this.resolve();
            this.resolve = null;
          }
        } else {
          this.frameRequest = requestAnimationFrame(this.update);
          this.frame++;
        }
      }

      randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
      }

      stop() {
        if (this.frameRequest) {
          cancelAnimationFrame(this.frameRequest);
          this.frameRequest = null;
        }
        if (this.resolve) {
          this.resolve();
          this.resolve = null;
        }
      }
    }

    class ScrambleManager {
      constructor() {
        this.scramblers = new Map();
        this.init();
      }

      init() {
        this.initializeElements();
      }

      initializeElements() {
        const elements = document.querySelectorAll('.section-title, .text-scramble');
        elements.forEach(el => this.createScrambler(el));
      }

      createScrambler(element) {
        if (!this.scramblers.has(element)) {
          const scrambler = new TextScramble(element);
          this.scramblers.set(element, {
            scrambler: scrambler,
            originalText: element.innerText
          });
          element.setAttribute('data-original-text', element.innerText);
        }
      }

      triggerScramble(element) {
        const data = this.scramblers.get(element);
        if (data) {
          data.scrambler.setText(data.originalText);
        }
      }

      scrambleAll() {
        this.scramblers.forEach((data) => {
          data.scrambler.setText(data.originalText);
        });
      }
    }

    window.scrambleManager = new ScrambleManager();

    // Side Menu & Burger Menu System
    class SideMenuManager {
      constructor() {
        this.currentSection = null;
        this.sectionMenus = new Map();
        this.allSections = ['work', 'project', 'systems', 'bio', 'contact'];
        this.sectionLoadStates = new Map();
        this.isMobile = window.innerWidth <= 480;
        this.burgerMenu = null;
        this.burgerOverlay = null;
        this.isBurgerOpen = false;
        this.init();
      }
      
      init() {
        this.checkViewportSize();
        this.setupIntersectionObserver();
        this.setupLoadObservers();
        window.addEventListener('resize', () => this.handleResize());
      }

      checkViewportSize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 480;
        if (wasMobile !== this.isMobile) {
          this.cleanup();
          this.isMobile ? this.createBurgerMenu() : this.createSectionMenus();
        } else if (!this.isMobile && this.sectionMenus.size === 0) {
          this.createSectionMenus();
        } else if (this.isMobile && !this.burgerMenu) {
          this.createBurgerMenu();
        }
      }

      handleResize() { this.checkViewportSize(); }

      cleanup() {
        this.sectionMenus.forEach(menu => menu?.parentNode?.removeChild(menu));
        this.sectionMenus.clear();
        if (this.burgerMenu?.parentNode) this.burgerMenu.parentNode.removeChild(this.burgerMenu);
        if (this.burgerOverlay?.parentNode) this.burgerOverlay.parentNode.removeChild(this.burgerOverlay);
        this.burgerMenu = this.burgerOverlay = null;
        this.isBurgerOpen = false;
      }

      createBurgerMenu() {
        this.burgerMenu = document.createElement('div');
        this.burgerMenu.className = 'mobile-burger-menu';
        this.burgerMenu.innerHTML = `<button class="burger-button"><span class="burger-line"></span><span class="burger-line"></span><span class="burger-line"></span></button>`;
        
        this.burgerOverlay = document.createElement('div');
        this.burgerOverlay.className = 'mobile-menu-overlay';
        const otherSections = this.allSections.filter(s => s !== this.currentSection);
        this.burgerOverlay.innerHTML = `<div class="mobile-menu-content"><button class="mobile-menu-close">&times;</button><ul class="mobile-menu-list">${otherSections.map(s => `<li class="mobile-menu-item" data-section="${s}">${s.toUpperCase()}</li>`).join('')}</ul></div>`;
        
        document.body.append(this.burgerMenu, this.burgerOverlay);
        
        this.burgerMenu.querySelector('.burger-button').onclick = () => this.toggleBurgerMenu();
        this.burgerOverlay.querySelector('.mobile-menu-close').onclick = () => this.closeBurgerMenu();
        this.burgerOverlay.onclick = e => e.target === this.burgerOverlay && this.closeBurgerMenu();
        this.burgerOverlay.querySelectorAll('.mobile-menu-item').forEach(item => {
          if (item.dataset.section === 'contact') {
            item.onclick = () => { window.openContactForm(); this.closeBurgerMenu(); };
          } else {
            item.onclick = () => { this.navigateToSection(item.dataset.section); this.closeBurgerMenu(); };
          }
        });
      }

      toggleBurgerMenu() { this.isBurgerOpen ? this.closeBurgerMenu() : this.openBurgerMenu(); }
      openBurgerMenu() {
        this.isBurgerOpen = true;
        this.burgerMenu.classList.add('active');
        this.burgerOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
      closeBurgerMenu() {
        this.isBurgerOpen = false;
        this.burgerMenu.classList.remove('active');
        this.burgerOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }

      updateBurgerMenuItems() {
        if (!this.isMobile || !this.burgerOverlay) return;
        const menuList = this.burgerOverlay.querySelector('.mobile-menu-list');
        const otherSections = this.allSections.filter(s => s !== this.currentSection);
        menuList.innerHTML = otherSections.map(s => `<li class="mobile-menu-item" data-section="${s}">${s.toUpperCase()}</li>`).join('');
        menuList.querySelectorAll('.mobile-menu-item').forEach(item => {
          if (item.dataset.section === 'contact') {
            item.onclick = () => { window.openContactForm(); this.closeBurgerMenu(); };
          } else {
            item.onclick = () => { this.navigateToSection(item.dataset.section); this.closeBurgerMenu(); };
          }
        });
      }

      createSectionMenus() {
        this.allSections.forEach(sectionName => {
          const sectionFrame = document.querySelector(`section#${sectionName} .section-frame`);
          if (!sectionFrame) return;
          sectionFrame.querySelector('.side-menu')?.remove();
          const sideMenu = this.createSideMenuHTML(sectionName);
          sectionFrame.appendChild(sideMenu);
          this.sectionMenus.set(sectionName, sideMenu);
          gsap.set(sideMenu, { opacity: 0, visibility: 'hidden', x: 40 });
        });
      }

      createSideMenuHTML(currentSection) {
        const otherSections = this.allSections.filter(s => s !== currentSection);
        const sideMenu = document.createElement('div');
        sideMenu.className = 'side-menu';
        sideMenu.setAttribute('data-section', currentSection);
        const menuList = document.createElement('ul');
        menuList.className = 'side-menu-list';
        otherSections.forEach(sectionName => {
          const listItem = document.createElement('li');
          listItem.className = 'side-menu-item';
          listItem.textContent = sectionName.toUpperCase();
          if (sectionName === 'contact') {
            listItem.onclick = () => window.openContactForm();
          } else {
            listItem.onclick = () => this.navigateToSection(sectionName);
          }
          menuList.appendChild(listItem);
        });
        sideMenu.appendChild(menuList);
        return sideMenu;
      }

      setupIntersectionObserver() {
        const observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            const sectionId = entry.target.id;
            if (this.allSections.includes(sectionId)) {
              entry.isIntersecting ? this.handleSectionEnter(sectionId) : this.handleSectionLeave(sectionId);
            }
          });
        }, { threshold: 0.5 });
        this.allSections.forEach(name => {
          const el = document.getElementById(name);
          if (el) observer.observe(el);
        });
      }

      setupLoadObservers() { this.allSections.forEach(name => this.observeSectionContent(name)); }

      observeSectionContent(sectionName) {
        const el = document.getElementById(sectionName);
        if (!el) return;
        new MutationObserver(mutations => {
          if (mutations.some(m => m.type === 'childList' && m.addedNodes.length > 0)) {
            setTimeout(() => this.markSectionAsLoaded(sectionName), 300);
          }
        }).observe(el, { childList: true, subtree: true });
        this.observeImageLoading(sectionName);
      }

      observeImageLoading(sectionName) {
        const el = document.getElementById(sectionName);
        if (!el) return;
        const images = el.querySelectorAll('img');
        let loaded = 0;
        if (!images.length) return this.markSectionAsLoaded(sectionName);
        images.forEach(img => {
          if (img.complete) loaded++;
          else {
            img.onload = img.onerror = () => ++loaded >= images.length && this.markSectionAsLoaded(sectionName);
          }
        });
        if (loaded >= images.length) this.markSectionAsLoaded(sectionName);
      }

      markSectionAsLoaded(sectionName) {
        if (this.sectionLoadStates.get(sectionName)) return;
        this.sectionLoadStates.set(sectionName, true);
        if (this.currentSection === sectionName && !this.isMobile) this.showSideMenu(sectionName);
      }

      handleSectionEnter(sectionName) {
        if (this.currentSection === sectionName) return;
        if (this.currentSection) {
          this.isMobile ? this.updateBurgerMenuItems() : this.hideSideMenu(this.currentSection);
        }
        this.currentSection = sectionName;
        if (this.isMobile) {
          this.updateBurgerMenuItems();
        } else if (this.sectionLoadStates.get(sectionName)) {
          setTimeout(() => this.showSideMenu(sectionName), 500);
        }
      }

      handleSectionLeave(sectionName) {
        if (this.currentSection === sectionName && !this.isMobile) this.hideSideMenu(sectionName);
      }

      showSideMenu(sectionName) {
        const menu = this.sectionMenus.get(sectionName);
        if (!menu) return;
        const items = menu.querySelectorAll('.side-menu-item');
        gsap.to(menu, { opacity: 1, visibility: 'visible', x: 0, duration: 0.6, ease: "power2.out" });
        gsap.fromTo(items, { opacity: 0, x: 30 }, {
          opacity: 1, x: 0, duration: 0.4, stagger: 0.1, delay: 0.2, ease: "power2.out",
          onComplete: () => items.forEach(item => {
            item.onmouseenter = () => gsap.to(item, { x: -60, duration: 0.4, ease: "power2.out" });
            item.onmouseleave = () => gsap.to(item, { x: 0, duration: 0.3, ease: "power2.in" });
          })
        });
      }

      hideSideMenu(sectionName) {
        const menu = this.sectionMenus.get(sectionName);
        if (menu) gsap.to(menu, { opacity: 0, visibility: 'hidden', x: 40, duration: 0.4, ease: "power2.in" });
      }

      navigateToSection(sectionName) {
        const target = document.getElementById(sectionName);
        if (target) gsap.to(window, { duration: 0.8, scrollTo: { y: target, offsetY: 0 }, ease: "power2.inOut" });
      }
    }

    // Content Modal System
    class ContentModalManager {
      constructor() {
        this.modal = null;
        this.isOpen = false;
        this.init();
      }
      
      init() {
        this.createModal();
        this.setupEventListeners();
      }

      createModal() {
        if (document.getElementById('contentModal')) return;
        document.body.insertAdjacentHTML('beforeend', `
          <div class="content-modal-overlay" id="contentModal">
            <div class="content-modal">
              <button class="content-modal-close" id="closeContentModal">&times;</button>
              <div class="content-modal-header">
                <h2 class="content-modal-title" id="contentModalTitle"></h2>
              </div>
              <div class="content-modal-body" id="contentModalBody"></div>
            </div>
          </div>
        `);
        this.modal = document.getElementById('contentModal');
      }

      setupEventListeners() {
        document.getElementById('closeContentModal').onclick = () => this.closeModal();
        this.modal.onclick = e => e.target === this.modal && this.closeModal();
        document.onkeydown = e => e.key === 'Escape' && this.isOpen && this.closeModal();
        
        window.addEventListener('popstate', () => {
          if (this.isOpen) {
            this.closeModal();
          } else {
            this.handleUrlRouting();
          }
        });
      }

      openModal(options = {}) {
        const { title = 'Modal Title', content = '<p>No content provided</p>', type = 'default', width = 'medium' } = options;
        document.getElementById('contentModalTitle').textContent = title;
        document.getElementById('contentModalBody').innerHTML = content;
        this.modal.className = `content-modal-overlay content-modal-${type} content-modal-${width}`;
        this.modal.classList.add('active');
        this.isOpen = true;
        document.body.style.overflow = 'hidden';
      }

      handleUrlRouting() {
        const path = window.location.pathname;
        if (path === '/privacy-policy') {
          this.openPrivacyPolicy();
        } else if (path === '/contact') {
          this.openContactForm();
        }
      }

      updateUrl(path) {
        window.history.pushState({}, '', path);
      }

      closeModal() {
        if (!this.isOpen) return;
        window.history.pushState({}, '', '/');
        this.modal.classList.remove('active');
        this.isOpen = false;
        document.body.style.overflow = '';
        setTimeout(() => {
          if (!this.isOpen) {
            document.getElementById('contentModalBody').innerHTML = '';
            document.getElementById('contentModalTitle').textContent = '';
          }
        }, 400);
      }

      openContactForm() {
        this.updateUrl('/contact');
        const contactModal = document.getElementById('contentModal');
        if (!contactModal) return;
        
        document.getElementById('contentModalTitle').textContent = 'Contact Me';
        this.modal.className = 'content-modal-overlay content-modal-content content-modal-medium';
        
        const contactData = this.getContactFormData();
        if (contactData) {
          this.setupContactForm(contactData);
          contactModal.classList.add('active');
          this.isOpen = true;
          document.body.style.overflow = 'hidden';
        }
      }

      getContactFormData() {
        const formContainer = document.querySelector('.contact-form-container');
        if (!formContainer) return null;
        
        const contactForm = formContainer.querySelector('.contact-form');
        const formBlock = contactForm?.querySelector('.form-block.w-form');
        const webflowForm = formBlock?.querySelector('#wf-form-Contact-Form');
        
        return { formContainer, contactForm, formBlock, webflowForm };
      }

      setupContactForm(data) {
        const modalBody = document.getElementById('contentModalBody');
        if (!modalBody || !data.formBlock) return;

        const formClone = data.formBlock.cloneNode(true);
        formClone.style.setProperty('display', 'block', 'important');

        const form = formClone.querySelector('#wf-form-Contact-Form');
        if (form) {
          const uniqueId = 'modal-contact-form-' + Date.now();
          form.id = uniqueId;

          const inputs = form.querySelectorAll('input, textarea, select');
          inputs.forEach(input => {
            input.removeAttribute('data-name');
            input.removeAttribute('data-wf-user-form-submit');
            input.classList.remove('w--redirected-checked', 'w--redirected-focus');
          });

          const existingMessages = formClone.querySelectorAll('.w-form-done, .w-form-fail');
          existingMessages.forEach(msg => msg.style.display = 'none');
        }

        modalBody.innerHTML = '<div class="contact-intro">Get in touch! I\'d love to hear about your project.</div>';
        modalBody.appendChild(formClone);
        
        const socialLinksDiv = document.createElement('div');
        socialLinksDiv.className = 'contact-social-links';
        socialLinksDiv.innerHTML = `
          <a href="https://www.linkedin.com/in/tyler-a-guitroz-45934b93/" target="_blank" class="social-icon">
            <svg class="icon" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
          <a href="https://github.com/clearPath-Dev" target="_blank" class="social-icon">
            <svg class="icon" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          </a>
        `;

        modalBody.appendChild(socialLinksDiv);
        this.bypassWebflowLinkHandling();
        setTimeout(() => {
          this.addHoneypotValidation();
        }, 100);
      }

      bypassWebflowLinkHandling() {
        const modalBody = document.getElementById('contentModalBody');
        const links = modalBody.querySelectorAll('a[href]');
        links.forEach(link => {
          ['data-wf-page', 'data-w-tab', 'data-wf-link'].forEach(attr => {
            link.removeAttribute(attr);
          });
          link.addEventListener('click', function(e) {
            e.stopImmediatePropagation();
          }, true);
        });
      }

      closeContactModal() {
        const contactModal = document.getElementById('contentModal');
        if (contactModal) {
          contactModal.classList.remove('active');
          this.isOpen = false;
          document.body.style.overflow = '';
        }
      }

      addHoneypotValidation() {
        const form = document.querySelector('#contentModalBody form[id^="modal-contact-form-"]');
        if (form) {
          form.addEventListener('submit', (e) => {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
              if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = 'red';
                field.focus();
              } else {
                field.style.borderColor = '';
              }
            });

            if (!isValid) {
              e.preventDefault();
              return false;
            }
          });

          if (form.querySelector('.honeypot')) return;

          const checkboxes = form.querySelectorAll('.w-checkbox-input');
          checkboxes.forEach(checkbox => {
            const newCheckbox = checkbox.cloneNode(true);
            checkbox.parentNode.replaceChild(newCheckbox, checkbox);
          });
          
          const submitBtn = form.querySelector('input[type="submit"], button[type="submit"], .w-button');
          if (submitBtn) {
            const newSubmitBtn = submitBtn.cloneNode(true);
            submitBtn.parentNode.replaceChild(newSubmitBtn, submitBtn);
            newSubmitBtn.addEventListener('click', (e) => {
              e.preventDefault();

              if (!form.checkValidity()) {
                form.reportValidity();
                return;
              }

              const submitEvent = new Event('submit', {
                bubbles: true,
                cancelable: true
              });

              form.dispatchEvent(submitEvent);
            });
          }

          const honeypot = document.createElement('input');
          honeypot.type = 'text';
          honeypot.name = 'website';
          honeypot.className = 'honeypot';
          honeypot.tabIndex = -1;
          honeypot.autocomplete = 'off';
          honeypot.style.cssText = 'position: absolute; left: -9999px; opacity: 0; pointer-events: none;';

          form.insertBefore(honeypot, form.firstChild);

          form.addEventListener('submit', (e) => {
            if (honeypot.value !== '') {
              e.preventDefault();
              console.log('Bot detected via honeypot');
              return false;
            }
          });
        }
      }

      openPrivacyPolicy() {
        this.updateUrl('/privacy-policy');
        this.openModal({
          title: 'Privacy Policy',
          content: `<div class="privacy-policy-container"><div class="privacy-section"><p><strong>Effective Date:</strong> 01 May 2025</p></div><div class="privacy-section"><h3>Introduction</h3><p>This Privacy Policy explains how I collect, use, and protect personal information when you visit my website or contact me through the contact form. I am committed to respecting your privacy and complying with applicable data protection laws, including the EU General Data Protection Regulation (GDPR) where relevant.</p></div><div class="privacy-section"><h3>Information I Collect</h3><p>The only personal data I collect is what you voluntarily provide through the contact form, which may include:</p><ul><li>Name</li><li>Email address</li><li>Any information you include in your message</li></ul></div><div class="privacy-section"><h3>How I Use Your Information</h3><p>Your personal data is used solely for the purpose of:</p><ul><li>Responding to your inquiry</li><li>Communicating with you regarding services</li></ul><p>I do not use your data for marketing without your consent and I do not sell or share your data with third parties.</p></div><div class="privacy-section"><h3>Cookies and Tracking</h3><p>This website does not use cookies or tracking technologies, other than those strictly necessary for basic site functionality.</p></div><div class="privacy-section"><h3>Legal Basis for Processing</h3><p>If you are located in the European Union, I rely on the following legal bases under GDPR:</p><ul><li><strong>Consent:</strong> when you voluntarily submit your information through the contact form.</li><li><strong>Legitimate Interest:</strong> to respond to and manage inquiries.</li></ul></div><div class="privacy-section"><h3>Data Retention</h3><p>I will keep your personal data only for as long as necessary to respond to your inquiry or as required by law. After that, your data will be securely deleted.</p></div><div class="privacy-section"><h3>Your Rights</h3><p>You have the right to:</p><ul><li>Access the personal data I hold about you</li><li>Request correction or deletion of your data</li><li>Restrict or object to processing</li><li>Request data portability</li><li>Withdraw your consent at any time</li></ul><p>To exercise these rights, please contact me at <a href="mailto:contact@clearpathautomations.tech">contact@clearpathautomations.tech</a>.</p></div><div class="privacy-section"><h3>Security</h3><p>I take reasonable technical and organizational measures to protect your personal data against loss, misuse, or unauthorized access.</p></div><div class="privacy-section"><h3>Contact</h3><p>If you have any questions about this Privacy Policy or how your data is handled, you can contact me at:</p><p><strong>Email:</strong> <a href="mailto:contact@clearpathautomations.tech">contact@clearpathautomations.tech</a></p></div></div>`,
          type: 'privacy',
          width: 'large'
        });
        setTimeout(() => this.bypassWebflowLinkHandling(), 100);
      }
    }

    // Initialize systems
    function initializeEnhancedSideMenu() { window.sideMenuManager = new SideMenuManager(); }

    // Global functions
    window.openContactForm = () => window.contentModalManager?.openContactForm();
    window.openPrivacyPolicy = () => window.contentModalManager?.openPrivacyPolicy();
    window.openContentModal = options => window.contentModalManager?.openModal(options);

    // Performance optimization
    function optimizeWillChange() {
      document.querySelectorAll(".menu-block").forEach(block => {
        const marquee = block.querySelector(".inner-marquee");
        if (marquee) {
          block.onmouseenter = () => marquee.style.willChange = 'transform';
          block.onmouseleave = () => marquee.style.willChange = 'auto';
        }
      });
      const wrappers = document.querySelectorAll(".horizontal-scroll-wrapper");
      ScrollTrigger.addEventListener("scrollStart", () => wrappers.forEach(w => w.style.willChange = 'transform'));
      ScrollTrigger.addEventListener("scrollEnd", () => wrappers.forEach(w => w.style.willChange = 'auto'));
    }

    // Initial animations
    window.onload = () => {
      const items = document.querySelectorAll(".collection-list-wrapper:first-of-type .w-dyn-item");
      gsap.set(items, { opacity: 0, scale: 0.97 });
      gsap.to(items, { opacity: 1, scale: 1, duration: 1.2, ease: "power3.out", stagger: 0.15 });
    };

    // Main initialization
    function startApp() {
      window.themeManager = new ThemeManager();
      initializeEnhancedSideMenu();
      window.contentModalManager = new ContentModalManager();
      optimizeWillChange();
      
      document.querySelectorAll('.contact-trigger').forEach(el => {
        el.addEventListener('click', (e) => {
          e.preventDefault();
          openContactForm();
          window.contentModalManager.handleUrlRouting();
        });
      });
      
      document.querySelectorAll('.privacy-trigger').forEach(el => {
        el.addEventListener('click', (e) => {
          e.preventDefault();
          openPrivacyPolicy();
        });
      });

      // Marquee setup
      document.querySelectorAll(".menu-block").forEach(block => {
        const marquee = block.querySelector(".inner-marquee");
        if (!marquee) return;
        const group = document.createElement('div');
        group.classList.add('marquee-group');
        while (marquee.firstChild) group.appendChild(marquee.firstChild);
        marquee.appendChild(group);
        marquee.appendChild(group.cloneNode(true));
        const loop = gsap.to(marquee, {
          x: `-=${group.offsetWidth || 1}`,
          duration: 20,
          ease: "none",
          repeat: -1,
          modifiers: { x: gsap.utils.unitize(x => parseFloat(x) % (group.offsetWidth || 1)) },
          paused: true
        });
        block.onmouseenter = () => loop.play();
        block.onmouseleave = () => loop.pause();
        
        document.querySelectorAll('.contact-menu-trigger').forEach(trigger => {
          trigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            window.openContactForm();
          });
        });
      });

      // Webflow initialization
      typeof Webflow !== 'undefined' && Webflow.push ? Webflow.push(initializeScrollAndDistribution) :
        setInterval(() => typeof Webflow !== 'undefined' && Webflow.push && (clearInterval(this), Webflow.push(initializeScrollAndDistribution)), 100);
    };

      if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", startApp, { once: true });
  } else {
    startApp();
  }

    // Scroll and distribution system
    function initializeScrollAndDistribution() {
      const configs = [
        { sectionClass: "work-section", listClass: "work-list", columnClasses: ["work-col-1","work-col-2","work-col-3"], imgClasses: { default: "work-default", logo: "work-logo", hover: "work-hover" } },
        { sectionClass: "project-section", listClass: "project-list", columnClasses: ["project-col-1","project-col-2","project-col-3"], imgClasses: { default: "project-default", logo: "project-logo", hover: "project-hover" } },
        { sectionClass: "systems-section", listClass: "systems-list", columnClasses: ["systems-col-1","systems-col-2","systems-col-3"], imgClasses: { default: "systems-default", logo: "systems-logo", hover: "systems-hover" } },
        { sectionClass: "bio-section", listClass: "bio-list", columnClasses: ["bio-col-1","bio-col-2","bio-col-3"], imgClasses: { default: "bio-default", logo: "bio-logo", hover: "bio-hover" } }
      ];

      // Distribute CMS items
      configs.forEach(config => {
        const items = document.querySelectorAll(`.${config.listClass} .w-dyn-item`);
        const cols = config.columnClasses.map(cls => document.querySelector(`.${cls}`)).filter(Boolean);
        
        if (config.sectionClass === 'project-section') {
          items.forEach((item, index) => {
            const columnIndex = index % cols.length;
            const randomOffset = Math.floor(Math.random() * 100);
            const existingTransform = getComputedStyle(item).transform;
            const newTransform = existingTransform === 'none' ?
              `translateY(${randomOffset}px)` :
              `${existingTransform} translateY(${randomOffset}px)`;
            item.style.transform = newTransform;
            cols[columnIndex].appendChild(item);
          });
        } else {
          items.forEach((item, index) => {
            const columnIndex = index % cols.length;
            cols[columnIndex].appendChild(item);
          });
        }
      });

      ScrollTrigger.getAll().forEach(t => t.kill());
      
      setTimeout(() => {
        ScrollTrigger.refresh();
        document.querySelectorAll(".section-frame").forEach(sf => {
          ['position', 'top', 'left', 'zIndex', 'transform'].forEach(prop => sf.style[prop] = '');
          ScrollTrigger.create({
            trigger: sf,
            start: "top 75%",
            end: "bottom 25%",
            toggleActions: "play none none reverse",
            onEnter: () => {
              gsap.to(window, { duration: 0.4, scrollTo: { y: sf, offsetY: 0 }, ease: "power2.out" });
              const titles = sf.querySelectorAll('.section-title, .text-scramble');
              titles.forEach(title => {
                setTimeout(() => window.scrambleManager?.triggerScramble(title), 500);
              });
            }
          });
        });

        setTimeout(() => {
          ScrollTrigger.refresh();
          document.querySelectorAll(".section-frame .horizontal-scroll-container").forEach((container, i) => {
            try {
              const sf = container.closest(".section-frame");
              const wrapper = container.querySelector(".horizontal-scroll-wrapper");
              if (!sf || !wrapper) return;
              
              wrapper.style.display = 'none';
              wrapper.offsetHeight;
              wrapper.style.display = '';
              
              const lastColumn = wrapper.querySelector('.horizontal-scroll-column:last-child');
              const actualContentWidth = lastColumn ? lastColumn.offsetLeft + lastColumn.offsetWidth : wrapper.scrollWidth;
              let scrollDist = actualContentWidth - container.offsetWidth;
              
              if (scrollDist < 75) {
                scrollDist = wrapper.scrollWidth > container.offsetWidth ? wrapper.scrollWidth - container.offsetWidth + 75 : 75;
              }
              
              if (scrollDist > 0) {
                const st = ScrollTrigger.create({
                  trigger: sf,
                  start: "top top",
                  end: "bottom bottom",
                  scrub: 1,
                  animation: gsap.to(wrapper, { x: -scrollDist, ease: "none" }),
                  onUpdate: (self) => {
                    const newScrollLeft = self.progress * scrollDist;
                    if (Math.abs(container.scrollLeft - newScrollLeft) > 5) {
                      container.scrollLeft = newScrollLeft;
                    }
                  }
                });
                
                container.addEventListener('scroll', () => {
                  if (!st.isActive) return;
                  const progress = container.scrollLeft / scrollDist;
                  st.progress(progress);
                });
              }
            } catch (error) {}
          });
          
          setTimeout(() => ScrollTrigger.refresh(), 500);
        }, 500);

        window.addEventListener('resize', () => {
          clearTimeout(horizontalScrollResizeTimeout);
          horizontalScrollResizeTimeout = setTimeout(() => {
            ScrollTrigger.refresh();
          }, 250);
        });
      });
      
      // Bio text system
      const bioSection = document.querySelector('.bio-section');
      if (bioSection) {
        const triggers = bioSection.querySelectorAll('.bio-trigger');
        const paragraphs = bioSection.querySelectorAll('.bio-paragraph');
        const textContainer = bioSection.querySelector('.bio-text-container');
        if (!triggers.length || !paragraphs.length) return;

        const isMobile = window.innerWidth <= 768;
        let currentIndex = 0;

        paragraphs.forEach((p, i) => {
          if (i === 0) {
            gsap.set(p, { opacity: 1, x: 0, display: 'block' });
          } else {
            gsap.set(p, { opacity: 0, x: 100, display: 'none' });
          }
        });
        triggers[0].classList.add('active');

        function switchParagraph(newIndex) {
          if (newIndex === currentIndex) return;

          const currentParagraph = paragraphs[currentIndex];
          const newParagraph = paragraphs[newIndex];
          const currentTrigger = triggers[currentIndex];
          const newTrigger = triggers[newIndex];

          currentTrigger.classList.remove('active');
          newTrigger.classList.add('active');

          const tl = gsap.timeline();
          tl.to(currentParagraph, {
            opacity: 0, x: -100, duration: 0.4, ease: "power2.in",
            onComplete: () => gsap.set(currentParagraph, { display: 'none' })
          });
          tl.set(newParagraph, { display: 'block', opacity: 0, x: 100 });
          tl.to(newParagraph, { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }, "-=0.2");
          if (textContainer) tl.to(textContainer, { scrollTop: 0, duration: 0.3, ease: "power2.out" }, "-=0.3");
          currentIndex = newIndex;
        }

        triggers.forEach((trigger, index) => {
          if (!isMobile) trigger.addEventListener('mouseenter', () => switchParagraph(index));
          trigger.addEventListener('click', (e) => { e.preventDefault(); switchParagraph(index); });
        });

        let resizeTimer;
        window.addEventListener('resize', () => {
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(() => {
            const newIsMobile = window.innerWidth <= 768;
            if (newIsMobile !== isMobile) {
              setTimeout(() => { initializeBioTextSystem(); }, 100);
            }
          }, 250);
        });
      }

      // Portfolio modal system
      if (!document.getElementById('portfolioModal')) {
        document.body.insertAdjacentHTML('beforeend', `
          <div class="portfolio-modal-overlay" id="portfolioModal">
            <div class="portfolio-modal">
              <button class="modal-close-btn" id="closeModal">&times;</button>
              <div class="modal-left">
                <div class="modal-main-image-container">
                  <img class="modal-main-image" id="modalMainImage" src="" alt="" />
                  <div class="image-type-indicator" id="imageTypeIndicator">product</div>
                </div>
                <div class="modal-zoom-controls" id="zoomControls" style="display: none;">
                  <button class="zoom-btn" id="zoomIn">+</button>
                  <button class="zoom-btn" id="zoomOut">-</button>
                  <button class="zoom-btn" id="zoomReset">⌂</button>
                </div>
                <div class="modal-image-thumbnails" id="imageThumbnails"></div>
              </div>
              <div class="modal-right">
                <h2 class="modal-title" id="modalTitle"></h2>
                <div class="modal-description" id="modalDescription1"></div>
                <div class="modal-description" id="modalDescription2"></div>
                <div class="modal-links" id="modalLinks"></div>
              </div>
            </div>
          </div>
        `);
      }

      const modal = document.getElementById('portfolioModal');
      const mainImage = document.getElementById('modalMainImage');
      let currentImages = [], currentImageIndex = 0, zoomLevel = 1, panX = 0, panY = 0, isPanning = false;

      const openModal = (data) => {
        document.getElementById('modalTitle').textContent = data.title || 'Untitled Project';
        document.getElementById('modalDescription1').innerHTML = data.description1 || '<p>No description available.</p>';
        document.getElementById('modalDescription2').innerHTML = data.description2 || '';
        
        currentImages = data.images?.length ? data.images : data.imageUrl ? [{ src: data.imageUrl, type: data.imageType || 'product' }] : [];
        currentImageIndex = 0;
        setupImages();
        setupLinks(data);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      };

      const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        zoomLevel = 1;
        panX = panY = 0;
        mainImage.style.transform = 'scale(1) translate(0, 0)';
      };

      const setupImages = () => {
        if (!currentImages.length) {
          mainImage.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlIEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';
          document.getElementById('imageTypeIndicator').textContent = 'placeholder';
          document.getElementById('imageThumbnails').style.display = 'none';
          return;
        }
        
        const img = currentImages[currentImageIndex];
        mainImage.src = img.src;
        const indicator = document.getElementById('imageTypeIndicator');
        indicator.textContent = img.type || 'product';
        indicator.className = `image-type-indicator image-type-${img.type || 'product'}`;
        document.getElementById('zoomControls').style.display = img.type === 'diagram' ? 'flex' : 'none';
        mainImage.className = img.type === 'diagram' ? 'modal-main-image zoomable' : 'modal-main-image';
        
        const thumbs = document.getElementById('imageThumbnails');
        if (currentImages.length > 1) {
          thumbs.innerHTML = currentImages.map((im, i) => 
            `<img src="${im.src}" class="modal-thumbnail ${i === currentImageIndex ? 'active' : ''}" onclick="switchToImage(${i})">`
          ).join('');
          thumbs.style.display = 'flex';
        } else {
          thumbs.style.display = 'none';
        }
      };

      const setupLinks = (data) => {
        const links = document.getElementById('modalLinks');
        links.innerHTML = '';
        
        const linkData = {
          github: {svg: `<svg class="icon" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`},
          figma: {svg: `<svg class="icon" viewBox="0 0 24 24"><path d="M12 8V0h4a4 4 0 1 1 0 8h-4zm0 0v8h4a4 4 0 0 0 0-8h-4zm0 8v4a4 4 0 1 1-8 0 4 4 0 0 1 8 0zm0-8H8a4 4 0 1 1 0-8h4v8zm0 0H8a4 4 0 0 0 0 8h4V8z"/></svg>`},
          live: {text: 'Visit Site →' }
        };
        
        ['github', 'figma', 'live'].forEach(type => {
          const url = data[`${type}Url`];
          if (url && url !== '' && url !== '#') {
            const a = document.createElement('a');
            a.href = url;
            a.target = '_blank';
            a.className = `modal-links ${type}Url`;
            const content = linkData[type]?.svg || linkData[type]?.text || type.toUpperCase();
            a.innerHTML = content;
            links.appendChild(a);
          }
        });
        
        document.getElementById('modalLinks').querySelectorAll('a[href]').forEach(l => 
          l.addEventListener('click', e => e.stopImmediatePropagation(), true)
        );
      };

      window.switchToImage = (index) => {
        if (index === currentImageIndex) return;
        currentImageIndex = index;
        gsap.to(mainImage, {
          opacity: 0,
          duration: 0.2,
          onComplete: () => {
            setupImages();
            gsap.to(mainImage, { opacity: 1, duration: 0.3 });
          }
        });
      };

      // Event listeners
      document.getElementById('closeModal').onclick = closeModal;
      modal.onclick = e => e.target === modal && closeModal();
      document.getElementById('zoomIn').onclick = () => {
        zoomLevel = Math.min(zoomLevel * 1.5, 4);
        mainImage.style.transform = `scale(${zoomLevel}) translate(${panX}px, ${panY}px)`;
      };
      document.getElementById('zoomOut').onclick = () => {
        zoomLevel = Math.max(zoomLevel / 1.5, 1);
        if (zoomLevel === 1) panX = panY = 0;
        mainImage.style.transform = `scale(${zoomLevel}) translate(${panX}px, ${panY}px)`;
      };
      document.getElementById('zoomReset').onclick = () => {
        zoomLevel = 1;
        panX = panY = 0;
        mainImage.style.transform = 'scale(1) translate(0, 0)';
      };
      
      let startX = 0, startY = 0;
      mainImage.onmousedown = (e) => {
        if (zoomLevel <= 1) return;
        isPanning = true;
        startX = e.clientX - panX;
        startY = e.clientY - panY;
        mainImage.style.cursor = 'grabbing';
        e.preventDefault();
      };
      document.onmousemove = (e) => {
        if (!isPanning) return;
        panX = e.clientX - startX;
        panY = e.clientY - startY;
        mainImage.style.transform = `scale(${zoomLevel}) translate(${panX}px, ${panY}px)`;
      };
      document.onmouseup = () => {
        isPanning = false;
        mainImage.style.cursor = zoomLevel > 1 ? 'grab' : 'default';
      };

      const getModalData = (section, index) => {
        const dataSection = document.querySelector('.modal-data-section');
        const container = dataSection?.querySelector(`[data-section="${section}"]`);
        const item = container?.querySelectorAll('.modal-item')[index];
        if (!item) return null;
        
        const title = item.querySelector('.name')?.textContent?.trim() || 'Untitled Project';
        const description1 = item.querySelector('.modal-description-1')?.innerHTML || '<p>No description available.</p>';
        const description2 = item.querySelector('.modal-description-2')?.innerHTML || '';
        
        let images = [];
        const imageTypesText = item.querySelector('.image-types')?.textContent?.trim();
        const imageTypes = imageTypesText ? imageTypesText.split(',').map(t => t.trim()) : [];
        
        item.querySelectorAll('.modal-images img, .modal-images .systems-hover').forEach((img, i) => {
          if (img.src && !img.src.includes('placeholder')) {
            const typeIndex = parseInt(imageTypes[i] || '2');
            images.push({ src: img.src, type: ['prototype', 'diagram', 'product'][typeIndex] || 'product' });
          }
        });
        
        const getUrl = sel => {
          const el = item.querySelector(sel);
          return el?.href || el?.textContent?.trim() || '';
        };
        
        return {
          title,
          description1,
          description2,
          images,
          githubUrl: getUrl('.github-url .w-inline-block'),
          figmaUrl: getUrl('.figma-url .w-inline-block'),
          liveUrl: getUrl('.live-url .w-inline-block')
        };
      };

      ['work', 'project', 'systems'].forEach(section => {
        const sec = document.getElementById(section);
        if (!sec) return;
        sec.querySelectorAll('.w-dyn-item').forEach((item, i) => {
          const wrapper = item.querySelector('.img-wrapper');
          if (wrapper && !wrapper.hasModalHandler) {
            wrapper.hasModalHandler = true;
            wrapper.style.cursor = 'pointer';
            wrapper.onclick = e => {
              e.preventDefault();
              e.stopPropagation();
              const title = item.querySelector('.name')?.textContent?.trim();
              const modalItems = document.querySelector('.modal-data-section')?.querySelector(`[data-section="${section}"]`)?.querySelectorAll('.modal-item');
              let idx = i;
              if (modalItems && title) {
                modalItems.forEach((m, j) => {
                  if (m.querySelector('.name')?.textContent?.trim() === title) idx = j;
                });
              }
              openModal(getModalData(section, idx) || {
                title: item.querySelector('.name')?.textContent || 'Untitled',
                description1: '<p>Project details coming soon.</p>',
                images: []
              });
            };
          }
        });
      });
      
      document.onkeydown = e => {
        if (!modal.classList.contains('active')) return;
        if (e.key === 'Escape') closeModal();
        else if (e.key === 'ArrowLeft' && currentImages.length > 1) switchToImage((currentImageIndex - 1 + currentImages.length) % currentImages.length);
        else if (e.key === 'ArrowRight' && currentImages.length > 1) switchToImage((currentImageIndex + 1) % currentImages.length);
      };
    }

  }).catch(error => {
    console.error('Failed to load GSAP:', error);
  });

  // ---- leave this check in place ----
  window.__APP_BOOT__ = true;
  console.log("boot complete");
})();