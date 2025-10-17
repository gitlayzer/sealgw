/**
 * Sealgw - Modern Interactive JavaScript
 * 现代化交互逻辑和动画效果
 */

// ============================================
// 全局配置和状态管理
// ============================================
const CONFIG = {
    // 语言配置
    LANGUAGES: {
        zh: '中文',
        en: 'EN'
    },
    DEFAULT_LANGUAGE: 'zh',

    // 动画配置
    ANIMATION: {
        SCROLL_THRESHOLD: 0.15,
        SCROLL_ROOT_MARGIN: '0px',
        DEBOUNCE_DELAY: 100,
        STAGGER_DELAY: 100
    },

    // 主题配置
    THEMES: {
        LIGHT: 'light',
        DARK: 'dark'
    },

    // 性能配置
    PERFORMANCE: {
        ENABLE_REDUCED_MOTION: false,
        ENABLE_PARALLAX: true
    }
};

// 应用状态
const AppState = {
    currentLanguage: CONFIG.DEFAULT_LANGUAGE,
    currentTheme: CONFIG.THEMES.LIGHT,
    isMenuOpen: false,
    scrollY: 0,
    isScrolling: false
};

// ============================================
// 工具函数
// ============================================
const Utils = {
    /**
     * 防抖函数
     */
    debounce(func, delay) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    },

    /**
     * 节流函数
     */
    throttle(func, limit) {
        let inThrottle;
        return (...args) => {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * 检查用户偏好
     */
    getUserPreferences() {
        return {
            prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            prefersDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
            prefersHighContrast: window.matchMedia('(prefers-contrast: high)').matches
        };
    },

    /**
     * 平滑滚动到元素
     */
    smoothScrollTo(element, offset = 0) {
        const targetY = element.offsetTop - offset;
        window.scrollTo({
            top: targetY,
            behavior: 'smooth'
        });
    },

    /**
     * 格式化数字
     */
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M+';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K+';
        }
        return num.toString();
    }
};

// ============================================
// 国际化管理器
// ============================================
class I18nManager {
    constructor() {
        this.translations = {};
        this.currentLanguage = AppState.currentLanguage;
        this.fallbackLanguage = CONFIG.DEFAULT_LANGUAGE;
    }

    /**
     * 加载语言文件
     */
    async loadLanguage(lang) {
        console.log(`Loading language: ${lang}`);

        // 直接使用内置翻译，支持所有环境
        this.loadEmbeddedTranslations(lang);
        this.currentLanguage = lang;
        AppState.currentLanguage = lang;
        this.applyTranslations();
        this.updateLanguageToggle();

        try {
            // 保存用户偏好
            localStorage.setItem('sealgw-language', lang);
        } catch (error) {
            console.log('localStorage not available, skipping save');
        }

        // 更新 HTML lang 属性
        document.documentElement.setAttribute('lang', lang);

        console.log(`Language ${lang} loaded successfully`);
    }

    /**
     * 获取翻译文本
     */
    t(key, fallback = key) {
        const keys = key.split('.');
        let translation = this.translations[this.currentLanguage];

        // 遍历嵌套对象
        for (const k of keys) {
            if (translation && translation[k] !== undefined) {
                translation = translation[k];
            } else {
                // 尝试回退语言
                translation = this.translations[this.fallbackLanguage];
                for (const fallbackKey of keys) {
                    if (translation && translation[fallbackKey] !== undefined) {
                        translation = translation[fallbackKey];
                    } else {
                        return fallback;
                    }
                }
                return translation || fallback;
            }
        }

        return translation || fallback;
    }

    /**
     * 应用翻译到页面
     */
    applyTranslations() {
        // 翻译页面标题
        const pageTitle = document.querySelector('title');
        const titleKey = pageTitle?.getAttribute('data-i18n');
        if (titleKey) {
            const translatedTitle = this.t(titleKey);
            if (translatedTitle) {
                pageTitle.textContent = translatedTitle;
            }
        }

        // 翻译所有带有 data-i18n 属性的元素
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translatedText = this.t(key);

            if (translatedText) {
                // 支持HTML内容（如strong标签）
                element.innerHTML = translatedText;
            }
        });
    }

    /**
     * 更新语言切换按钮
     */
    updateLanguageToggle() {
        const langToggle = document.getElementById('lang-toggle');
        if (langToggle) {
            langToggle.textContent = CONFIG.LANGUAGES[this.currentLanguage];
        }
    }

    /**
     * 切换语言
     */
    async toggleLanguage() {
        const nextLang = this.currentLanguage === 'zh' ? 'en' : 'zh';
        await this.loadLanguage(nextLang);
    }

    /**
     * 加载内置翻译数据
     */
    loadEmbeddedTranslations(lang) {
        const translations = {
            zh: {
                page_title: "Sealgw - 云原生高性能 4/7 层网关 (开发中)",
                lang_code: "中文",
                nav: {
                    home: "首页",
                    features: "核心特性",
                    architecture: "架构设计",
                    performance: "性能指标",
                    lvscare: "LVSCare 监控",
                    demo: "连接演示",
                    generator: "配置生成器",
                    status: "项目状态",
                    contact: "联系"
                },
                hero: {
                    title: "云原生高性能 4/7 层混合网关",
                    subtitle: "Sealgw (开发中) —— 为 Sealos 平台构建，以极致安全和内核级速度，统一您的南北向和东西向流量。",
                    stats: {
                        rps: "并发连接",
                        latency: "延迟",
                        uptime: "可用性"
                    },
                    docs_btn: "查看开发文档",
                    repo_btn: "GitHub Repo"
                },
                features: {
                    title: "核心特性：性能与安全并重",
                    subtitle: "企业级网关解决方案，为现代云原生应用提供强大的流量管理能力"
                },
                connection: {
                    title: "动态连接流向演示",
                    subtitle: "可视化展示请求如何通过 LVS 负载均衡器智能路由到后端服务",
                    start_demo: "开始演示",
                    pause: "暂停",
                    speed: "速度",
                    waiting_requests: "等待请求...",
                    clients: "客户端",
                    load_balancer: "LVS 负载均衡器",
                    backend_servers: "后端服务器"
                },
                perf: {
                    connections: "并发连接数",
                    latency: "处理延迟",
                    throughput: "吞吐量",
                    uptime: "服务可用性"
                }
            },
            en: {
                page_title: "Sealgw - Cloud-Native High-Performance 4/7 Layer Gateway (In Dev)",
                lang_code: "EN",
                nav: {
                    home: "Home",
                    features: "Features",
                    architecture: "Architecture",
                    performance: "Performance",
                    lvscare: "LVSCare Monitor",
                    demo: "Connection Demo",
                    generator: "Config Generator",
                    status: "Project Status",
                    contact: "Contact"
                },
                hero: {
                    title: "Cloud-Native High-Performance 4/7 Layer Hybrid Gateway",
                    subtitle: "Sealgw (In Development) is built for the Sealos platform, unifying your traffic with extreme security and kernel-level speed.",
                    stats: {
                        rps: "Connections",
                        latency: "Latency",
                        uptime: "Uptime"
                    },
                    docs_btn: "View Development Docs",
                    repo_btn: "GitHub Repo"
                },
                features: {
                    title: "Core Features: Performance and Security",
                    subtitle: "Enterprise-grade gateway solution providing powerful traffic management for modern cloud-native applications"
                },
                connection: {
                    title: "Dynamic Connection Flow Demo",
                    subtitle: "Visualize how requests are intelligently routed through LVS load balancer to backend services",
                    start_demo: "Start Demo",
                    pause: "Pause",
                    speed: "Speed",
                    waiting_requests: "Waiting for requests...",
                    clients: "Clients",
                    load_balancer: "LVS Load Balancer",
                    backend_servers: "Backend Servers"
                },
                perf: {
                    connections: "Concurrent Connections",
                    latency: "Processing Latency",
                    throughput: "Throughput",
                    uptime: "Service Availability"
                }
            }
        };

        this.translations[lang] = translations[lang] || translations[CONFIG.DEFAULT_LANGUAGE];
        console.log(`✅ Loaded embedded translations for ${lang}`);
    }

    /**
     * 初始化国际化
     */
    async init() {
        // 检测用户语言偏好
        const savedLang = localStorage.getItem('sealgw-language');
        const browserLang = navigator.language.substring(0, 2);
        const preferredLang = savedLang || browserLang || CONFIG.DEFAULT_LANGUAGE;

        await this.loadLanguage(preferredLang);
    }
}

// ============================================
// 主题管理器
// ============================================
class ThemeManager {
    constructor() {
        this.currentTheme = AppState.currentTheme;
        this.themes = CONFIG.THEMES;
    }

    /**
     * 设置主题
     */
    setTheme(theme) {
        if (!Object.values(this.themes).includes(theme)) {
            console.warn(`Invalid theme: ${theme}`);
            return;
        }

        this.currentTheme = theme;
        AppState.currentTheme = theme;

        // 应用主题到 body
        document.body.setAttribute('data-theme', theme);

        // 更新主题切换按钮
        this.updateThemeToggle();

        // 保存用户偏好（带错误处理）
        try {
            localStorage.setItem('sealgw-theme', theme);
        } catch (error) {
            console.log('localStorage not available, skipping theme save');
        }

        // 触发主题变更事件
        document.dispatchEvent(new CustomEvent('themechange', {
            detail: { theme }
        }));
    }

    /**
     * 切换主题
     */
    toggleTheme() {
        const nextTheme = this.currentTheme === this.themes.LIGHT
            ? this.themes.DARK
            : this.themes.LIGHT;
        this.setTheme(nextTheme);
    }

    /**
     * 更新主题切换按钮
     */
    updateThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.textContent = this.currentTheme === this.themes.DARK ? '☀️' : '🌙';
        }
    }

    /**
     * 初始化主题
     */
    init() {
        const userPrefs = Utils.getUserPreferences();
        let savedTheme = null;

        // 安全地检查保存的主题偏好
        try {
            savedTheme = localStorage.getItem('sealgw-theme');
        } catch (error) {
            console.log('localStorage not available for theme');
        }

        if (savedTheme && Object.values(this.themes).includes(savedTheme)) {
            this.setTheme(savedTheme);
        } else if (userPrefs.prefersDarkMode) {
            this.setTheme(this.themes.DARK);
        } else {
            this.setTheme(this.themes.LIGHT);
        }
    }
}

// ============================================
// 动画管理器
// ============================================
class AnimationManager {
    constructor() {
        this.observer = null;
        this.animatedElements = new Set();
        this.userPrefs = Utils.getUserPreferences();
        CONFIG.PERFORMANCE.ENABLE_REDUCED_MOTION = this.userPrefs.prefersReducedMotion;
    }

    /**
     * 创建滚动观察器
     */
    createScrollObserver() {
        const options = {
            root: null,
            rootMargin: CONFIG.ANIMATION.SCROLL_ROOT_MARGIN,
            threshold: CONFIG.ANIMATION.SCROLL_THRESHOLD
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, options);
    }

    /**
     * 动画元素
     */
    animateElement(element) {
        if (this.animatedElements.has(element)) return;

        this.animatedElements.add(element);

        // 添加延迟以创建交错效果
        const delay = element.dataset.delay || 0;

        setTimeout(() => {
            element.classList.add('visible');

            // 触发自定义事件
            element.dispatchEvent(new CustomEvent('elementAnimated', {
                detail: { element }
            }));
        }, delay);
    }

    /**
     * 观察元素
     */
    observe(elements) {
        if (!this.observer) {
            this.createScrollObserver();
        }

        const elementsArray = Array.isArray(elements) ? elements : [elements];
        elementsArray.forEach(element => {
            if (element instanceof Element) {
                this.observer.observe(element);
            }
        });
    }

    /**
     * 停止观察元素
     */
    unobserve(elements) {
        if (!this.observer) return;

        const elementsArray = Array.isArray(elements) ? elements : [elements];
        elementsArray.forEach(element => {
            if (element instanceof Element) {
                this.observer.unobserve(element);
                this.animatedElements.delete(element);
            }
        });
    }

    /**
     * 数字动画
     */
    animateNumber(element, targetValue, duration = 2000) {
        const startValue = 0;
        const startTime = performance.now();
        const isPercentage = targetValue.toString().includes('%');
        const numericValue = parseFloat(targetValue.toString().replace(/[^\d.]/g, ''));
        const suffix = targetValue.toString().replace(/[\d.]/g, '');

        const updateNumber = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // 使用 easeOutQuart 缓动函数
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = startValue + (numericValue - startValue) * easeOutQuart;

            if (isPercentage) {
                element.textContent = currentValue.toFixed(0) + '%';
            } else {
                element.textContent = Utils.formatNumber(Math.floor(currentValue)) + suffix;
            }

            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        };

        requestAnimationFrame(updateNumber);
    }

    /**
     * 初始化动画
     */
    init() {
        // 观察所有需要动画的元素
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        this.observe(animatedElements);

        // 初始化数字动画
        this.initNumberAnimations();
    }

    /**
     * 初始化数字动画
     */
    initNumberAnimations() {
        const statNumbers = document.querySelectorAll('.stat-number, .perf-value');

        const numberObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const targetValue = element.textContent;

                    // 只有在元素尚未动画时才执行
                    if (!element.dataset.animated) {
                        this.animateNumber(element, targetValue);
                        element.dataset.animated = 'true';
                    }

                    numberObserver.unobserve(element);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(element => numberObserver.observe(element));
    }
}

// ============================================
// 导航管理器
// ============================================
class NavigationManager {
    constructor() {
        this.header = document.querySelector('.modern-header');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        this.mainNav = document.querySelector('.main-nav');
        this.isMenuOpen = AppState.isMenuOpen;
    }

    /**
     * 处理滚动事件
     */
    handleScroll() {
        const currentScrollY = window.scrollY;

        // 添加/移除滚动样式
        if (currentScrollY > 50) {
            this.header?.classList.add('scrolled');
        } else {
            this.header?.classList.remove('scrolled');
        }

        // 更新活动导航链接
        this.updateActiveNavLink();

        AppState.scrollY = currentScrollY;
    }

    /**
     * 更新活动导航链接
     */
    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // 移除所有活动状态
                this.navLinks.forEach(link => link.classList.remove('active'));

                // 添加当前活动状态
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                activeLink?.classList.add('active');
            }
        });
    }

    /**
     * 平滑滚动到锚点
     */
    scrollToAnchor(event) {
        event.preventDefault();

        const targetId = event.currentTarget.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const headerHeight = this.header?.offsetHeight || 0;
            const offset = headerHeight + 20;

            Utils.smoothScrollTo(targetElement, offset);

            // 移动端关闭菜单
            if (window.innerWidth <= 768 && this.isMenuOpen) {
                this.toggleMobileMenu();
            }
        }
    }

    /**
     * 切换移动端菜单
     */
    toggleMobileMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        AppState.isMenuOpen = this.isMenuOpen;

        this.mainNav?.classList.toggle('active');
        this.mobileMenuBtn?.classList.toggle('active');

        // 更新汉堡菜单动画
        this.updateHamburgerAnimation();

        // 防止背景滚动
        document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
    }

    /**
     * 更新汉堡菜单动画
     */
    updateHamburgerAnimation() {
        if (!this.mobileMenuBtn) return;

        const lines = this.mobileMenuBtn.querySelectorAll('.hamburger-line');

        if (this.isMenuOpen) {
            // 转换为 X 形状
            lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            lines[1].style.opacity = '0';
            lines[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            // 恢复汉堡形状
            lines[0].style.transform = '';
            lines[1].style.opacity = '';
            lines[2].style.transform = '';
        }
    }

    /**
     * 初始化导航
     */
    init() {
        // 滚动事件监听
        const throttledScroll = Utils.throttle(() => this.handleScroll(), 16);
        window.addEventListener('scroll', throttledScroll);

        // 导航链接点击事件
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.scrollToAnchor(e));
        });

        // 移动端菜单切换
        this.mobileMenuBtn?.addEventListener('click', () => this.toggleMobileMenu());

        // 点击外部关闭移动端菜单
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen &&
                !this.mainNav?.contains(e.target) &&
                !this.mobileMenuBtn?.contains(e.target)) {
                this.toggleMobileMenu();
            }
        });

        // 响应式处理
        window.addEventListener('resize', Utils.debounce(() => {
            if (window.innerWidth > 768 && this.isMenuOpen) {
                this.toggleMobileMenu();
            }
        }, 250));

        // 初始滚动检查
        this.handleScroll();
    }
}

// ============================================
// 应用初始化
// ============================================
class SealgwApp {
    constructor() {
        this.i18nManager = new I18nManager();
        this.themeManager = new ThemeManager();
        this.animationManager = new AnimationManager();
        this.navigationManager = new NavigationManager();
        this.isInitialized = false;
    }

    /**
     * 初始化应用
     */
    async init() {
        console.log('🚀 Initializing Sealgw app...');

        try {
            // 最简化的初始化流程
            await this.initMinimal();
            console.log('🎉 Sealgw app initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize Sealgw app:', error);

            // 即使初始化失败，也确保页面可以显示
            this.initFallback();
        }
    }

    /**
     * 最小化初始化
     */
    async initMinimal() {
        // 1. 初始化语言
        await this.i18nManager.init();

        // 2. 初始化主题
        this.themeManager.init();

        // 3. 绑定基本事件
        this.bindBasicEvents();

        // 4. 隐藏加载指示器
        this.hideLoadingIndicator();

        this.isInitialized = true;
    }

    /**
     * 回退初始化
     */
    initFallback() {
        console.log('🔄 Running fallback initialization...');

        try {
            // 尝试最基本的设置
            if (this.i18nManager) {
                this.i18nManager.loadEmbeddedTranslations('zh');
                this.i18nManager.applyTranslations();
            }

            if (this.themeManager) {
                this.themeManager.setTheme('light');
            }

            this.hideLoadingIndicator();

            // 显示简单的成功消息
            console.log('✅ Fallback initialization completed');
        } catch (error) {
            console.error('❌ Fallback initialization failed:', error);
        }
    }

    /**
     * 绑定基本事件
     */
    bindBasicEvents() {
        // 主题切换
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.themeManager.toggleTheme();
            });
        }

        // 语言切换
        const langToggle = document.getElementById('lang-toggle');
        if (langToggle) {
            langToggle.addEventListener('click', () => {
                this.i18nManager.toggleLanguage();
            });
        }

        // 导航链接
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    /**
     * 初始化组件
     */
    async initializeComponents() {
        // 初始化工具提示
        this.initializeTooltips();

        // 初始化按钮交互
        this.initializeButtonInteractions();

        // 初始化表单处理
        this.initializeFormHandling();
    }

    /**
     * 初始化工具提示
     */
    initializeTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');

        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = e.target.getAttribute('data-tooltip');
                tooltip.style.cssText = `
                    position: absolute;
                    background: var(--color-bg-secondary);
                    color: var(--color-text-primary);
                    padding: 8px 12px;
                    border-radius: 6px;
                    font-size: 14px;
                    box-shadow: var(--shadow-lg);
                    z-index: 1000;
                    pointer-events: none;
                    opacity: 0;
                    transition: opacity 0.2s ease;
                `;

                document.body.appendChild(tooltip);

                const rect = e.target.getBoundingClientRect();
                tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
                tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';

                // 显示动画
                requestAnimationFrame(() => {
                    tooltip.style.opacity = '1';
                });

                e.target._tooltip = tooltip;
            });

            element.addEventListener('mouseleave', (e) => {
                if (e.target._tooltip) {
                    e.target._tooltip.style.opacity = '0';
                    setTimeout(() => {
                        if (e.target._tooltip) {
                            document.body.removeChild(e.target._tooltip);
                            e.target._tooltip = null;
                        }
                    }, 200);
                }
            });
        });
    }

    /**
     * 初始化按钮交互
     */
    initializeButtonInteractions() {
        // 为所有按钮添加点击效果
        const buttons = document.querySelectorAll('button, .btn');

        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                // 创建涟漪效果
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `;

                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);

                setTimeout(() => {
                    if (ripple.parentNode) {
                        ripple.parentNode.removeChild(ripple);
                    }
                }, 600);
            });
        });

        // 添加涟漪动画样式
        if (!document.querySelector('#ripple-style')) {
            const style = document.createElement('style');
            style.id = 'ripple-style';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * 初始化表单处理
     */
    initializeFormHandling() {
        const forms = document.querySelectorAll('form');

        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit(form);
            });
        });
    }

    /**
     * 处理表单提交
     */
    handleFormSubmit(form) {
        // 这里可以添加表单验证和提交逻辑
        console.log('Form submitted:', form);
    }

    /**
     * 初始化其他功能
     */
    initializeAdditionalFeatures() {
        // 初始化性能监控
        this.initializePerformanceMonitoring();

        // 初始化错误处理
        this.initializeErrorHandling();

        // 初始化键盘快捷键
        this.initializeKeyboardShortcuts();

        // 初始化主题切换按钮
        this.initializeThemeToggle();

  
        // 初始化连接流向演示
        this.initializeConnectionFlow();

        // 初始化配置生成器
        this.initializeConfigGenerator();
    }

    /**
     * 初始化主题切换按钮
     */
    initializeThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.themeManager.toggleTheme();
            });
        }

        // 初始化语言切换按钮
        const langToggle = document.getElementById('lang-toggle');
        if (langToggle) {
            langToggle.addEventListener('click', () => {
                this.i18nManager.toggleLanguage();
            });
        }
    }

    /**
     * 初始化性能监控
     */
    initializePerformanceMonitoring() {
        // 监控页面加载性能
        if ('performance' in window) {
            window.addEventListener('load', () => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page load time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
            });
        }
    }

    /**
     * 初始化错误处理
     */
    initializeErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
        });
    }

    /**
     * 初始化键盘快捷键
     */
    initializeKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K: 快速搜索（如果有的话）
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                console.log('Quick search triggered');
            }

            // ESC: 关闭移动端菜单
            if (e.key === 'Escape' && AppState.isMenuOpen) {
                this.navigationManager.toggleMobileMenu();
            }

            // Ctrl/Cmd + Shift + L: 切换语言
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
                e.preventDefault();
                this.i18nManager.toggleLanguage();
            }
        });
    }

    /**
     * 显示加载指示器
     */
    showLoadingIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'loading-indicator';
        indicator.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: var(--color-bg-primary);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                opacity: 0;
                transition: opacity 0.3s ease;
            ">
                <div style="text-align: center;">
                    <div style="
                        width: 40px;
                        height: 40px;
                        border: 3px solid var(--color-border);
                        border-top: 3px solid var(--color-primary);
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                        margin: 0 auto 16px;
                    "></div>
                    <p style="color: var(--color-text-secondary); font-size: 14px;">
                        Loading Sealgw...
                    </p>
                </div>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
        document.body.appendChild(indicator);

        // 显示动画
        requestAnimationFrame(() => {
            indicator.style.opacity = '1';
        });
    }

    /**
     * 隐藏加载指示器
     */
    hideLoadingIndicator() {
        const indicator = document.getElementById('loading-indicator');
        if (indicator) {
            indicator.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(indicator);
            }, 300);
        }
    }

    /**
     * 显示错误消息
     */
    showErrorMessage() {
        const errorDiv = document.createElement('div');
        errorDiv.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: #ef4444;
                color: white;
                padding: 16px;
                border-radius: 8px;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                z-index: 10000;
                max-width: 300px;
            ">
                <h4 style="margin: 0 0 8px 0;">Initialization Error</h4>
                <p style="margin: 0; font-size: 14px;">
                    Failed to initialize Sealgw. Please refresh the page.
                </p>
            </div>
        `;
        document.body.appendChild(errorDiv);

        setTimeout(() => {
            if (errorDiv.parentNode) {
                document.body.removeChild(errorDiv);
            }
        }, 5000);
    }

    /**
     * 显示基本错误消息（带详细信息）
     */
    showBasicErrorMessage(error) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #fef2f2;
            border: 2px solid #fecaca;
            color: #991b1b;
            padding: 24px;
            border-radius: 12px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            max-width: 500px;
            text-align: center;
        `;

        errorDiv.innerHTML = `
            <h3 style="margin: 0 0 16px 0; color: #dc2626;">⚠️ Sealgw 初始化失败</h3>
            <p style="margin: 0 0 16px 0; line-height: 1.5;">
                页面初始化过程中遇到了问题。这通常是由于直接打开 HTML 文件导致的。
            </p>
            <div style="background: #f8fafc; padding: 12px; border-radius: 8px; margin: 16px 0; text-align: left;">
                <strong>建议解决方案：</strong>
                <ul style="margin: 8px 0; padding-left: 20px;">
                    <li>使用本地服务器运行（推荐）</li>
                    <li>或者尝试刷新页面</li>
                    <li>检查浏览器控制台获取更多信息</li>
                </ul>
            </div>
            <div style="background: #1e293b; color: #e2e8f0; padding: 12px; border-radius: 8px; margin: 16px 0; font-family: monospace; font-size: 12px; text-align: left; max-height: 150px; overflow-y: auto;">
                <strong>错误详情：</strong><br>
                ${error.message || error.toString()}
            </div>
            <button onclick="location.reload()" style="
                background: #dc2626;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                margin-right: 12px;
            ">刷新页面</button>
            <button onclick="this.parentElement.remove()" style="
                background: #6b7280;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
            ">关闭</button>
        `;
        document.body.appendChild(errorDiv);
    }
}

// ============================================
// 全局应用实例
// ============================================
let app;

// DOM 加载完成后初始化应用
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🌟 DOM Content Loaded, starting app initialization...');

    // 隐藏加载指示器（如果存在）
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
    }

    try {
        app = new SealgwApp();
        await app.init();
        console.log('🎉 App initialization completed successfully!');
    } catch (error) {
        console.error('❌ Initialization error:', error);

        // 最基本的回退：确保页面内容可见
        document.body.style.opacity = '1';
        document.body.style.visibility = 'visible';

        // 如果有错误指示器，隐藏它
        const errorIndicator = document.querySelector('[style*="Initialization Error"]');
        if (errorIndicator) {
            errorIndicator.remove();
        }
    }
});

// ============================================
// LVSCare 功能扩展
// ============================================

/**
 * 初始化 LVSCare 监控面板
 */
SealgwApp.prototype.initializeLVSCareMonitor = function() {
    const simulateFailoverBtn = document.getElementById('simulate-failover-simple');
    const addServerBtn = document.getElementById('add-server-simple');
    const refreshBtn = document.getElementById('refresh-monitor-simple');

    // 模拟故障转移
    simulateFailoverBtn?.addEventListener('click', () => {
        this.simulateSimpleFailover();
    });

    // 添加服务器
    addServerBtn?.addEventListener('click', () => {
        this.addSimpleServerToMonitor();
    });

    // 刷新监控
    refreshBtn?.addEventListener('click', () => {
        this.refreshSimpleMonitor();
    });

    // 启动实时数据更新
    this.startSimpleMonitorUpdates();
};

/**
 * 初始化连接流向演示
 */
SealgwApp.prototype.initializeConnectionFlow = function() {
    const algorithmSelect = document.getElementById('algorithm-select-demo');
    const clearLogBtn = document.getElementById('clear-log');
    const speedSlider = document.getElementById('flow-speed');

    // 隐藏开始和暂停按钮，改为自动演示
    const startBtn = document.getElementById('start-flow');
    const pauseBtn = document.getElementById('pause-flow');
    if (startBtn) startBtn.style.display = 'none';
    if (pauseBtn) pauseBtn.style.display = 'none';

    speedSlider?.addEventListener('input', (e) => {
        this.updateDemoSpeed(e.target.value);
    });

    algorithmSelect?.addEventListener('change', (e) => {
        this.updateAlgorithm(e.target.value);
        // 算法改变时重新开始演示
        this.restartAutoDemo();
    });

    clearLog?.addEventListener('click', () => {
        this.clearRequestLog();
    });

    // 初始化负载均衡算法
    this.currentAlgorithm = 'rr';
    this.serverConnections = { 1: 0, 2: 0, 3: 0 };
    this.requestCounter = 0;
    this.successRequests = 0;
    this.isDemoRunning = true;
    this.demoSpeed = 5;

    // 自动开始演示
    this.startAutoDemo();
};

/**
 * 初始化配置生成器
 */
SealgwApp.prototype.initializeConfigGenerator = function() {
    const generateBtn = document.getElementById('generate-config');
    const downloadBtn = document.getElementById('download-config');
    const copyBtn = document.getElementById('copy-config');
    const addServerBtn = document.getElementById('add-backend-server');

    generateBtn?.addEventListener('click', () => {
        this.generateConfig();
    });

    downloadBtn?.addEventListener('click', () => {
        this.downloadConfig();
    });

    copyBtn?.addEventListener('click', () => {
        this.copyConfig();
    });

    addServerBtn?.addEventListener('click', () => {
        this.addServerInput();
    });

    // 格式切换
    const formatTabs = document.querySelectorAll('.format-tab');
    formatTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            this.switchConfigFormat(e.target.dataset.format);
        });
    });

    // 初始化第一个服务器输入的删除按钮
    this.updateServerInputButtons();
};

/**
 * 模拟故障转移
 */
SealgwApp.prototype.simulateFailover = function() {
    const servers = document.querySelectorAll('.rs-item');
    const randomServer = servers[Math.floor(Math.random() * servers.length)];

    randomServer.classList.remove('healthy');
    randomServer.classList.add('offline');
    randomServer.querySelector('.status-indicator').classList.remove('online');
    randomServer.querySelector('.status-indicator').classList.add('offline');

    // 更新健康服务器数量
    const healthyCount = document.querySelectorAll('.rs-item.healthy').length;
    const totalCount = servers.length;
    document.getElementById('healthy-count').textContent = `${healthyCount}/${totalCount}`;

    // 3秒后恢复
    setTimeout(() => {
        randomServer.classList.remove('offline');
        randomServer.classList.add('healthy');
        randomServer.querySelector('.status-indicator').classList.remove('offline');
        randomServer.querySelector('.status-indicator').classList.add('online');
        document.getElementById('healthy-count').textContent = `${totalCount}/${totalCount}`;
    }, 3000);

    // 显示通知
    this.showNotification('模拟故障转移', `服务器 ${randomServer.querySelector('.rs-ip').textContent} 临时下线`, 'warning');
};

/**
 * 添加服务器到监控面板
 */
SealgwApp.prototype.addServerToMonitor = function() {
    const serversContainer = document.querySelector('.real-servers');
    const serverCount = document.querySelectorAll('.rs-item').length + 1;
    const newIP = `192.168.1.${10 + serverCount}`;

    const newServer = document.createElement('div');
    newServer.className = 'rs-item healthy';
    newServer.innerHTML = `
        <div class="rs-status">
            <div class="status-indicator online">
                <span class="status-dot"></span>
            </div>
            <div class="rs-info">
                <div class="rs-ip">${newIP}</div>
                <div class="rs-weight">权重: 100</div>
            </div>
        </div>
        <div class="rs-metrics">
            <div class="metric">
                <span class="metric-label">连接</span>
                <span class="metric-value">0</span>
            </div>
            <div class="metric">
                <span class="metric-label">CPU</span>
                <span class="metric-value">0%</span>
            </div>
            <div class="metric">
                <span class="metric-label">响应</span>
                <span class="metric-value">0ms</span>
            </div>
        </div>
    `;

    serversContainer.appendChild(newServer);

    // 更新健康服务器数量
    const healthyCount = document.querySelectorAll('.rs-item.healthy').length;
    const totalCount = document.querySelectorAll('.rs-item').length;
    document.getElementById('healthy-count').textContent = `${healthyCount}/${totalCount}`;

    this.showNotification('添加服务器', `新服务器 ${newIP} 已添加到监控面板`, 'success');
};

/**
 * 刷新监控数据
 */
SealgwApp.prototype.refreshMonitor = function() {
    // 更新连接数
    const connections = document.querySelectorAll('#vs-connections, #vs-connections-ssl');
    connections.forEach(conn => {
        const currentValue = parseInt(conn.textContent.replace(/,/g, ''));
        const change = Math.floor(Math.random() * 200) - 100;
        conn.textContent = Utils.formatNumber(Math.max(100, currentValue + change));
    });

    // 更新吞吐量
    const throughputElements = document.querySelectorAll('#vs-throughput, #vs-throughput-ssl');
    throughputElements.forEach(throughput => {
        const currentGB = parseFloat(throughput.textContent);
        const change = (Math.random() * 0.4 - 0.2).toFixed(1);
        const newValue = Math.max(0.5, currentGB + parseFloat(change));
        throughput.textContent = `${newValue.toFixed(1)}GB/s`;
    });

    // 更新服务器指标
    document.querySelectorAll('.rs-item.healthy').forEach(server => {
        const metrics = server.querySelectorAll('.metric-value');
        metrics[0].textContent = Math.floor(Math.random() * 500 + 100); // 连接数
        metrics[1].textContent = Math.floor(Math.random() * 80 + 20) + '%'; // CPU
        metrics[2].textContent = Math.floor(Math.random() * 20 + 5) + 'ms'; // 响应时间
    });

    this.showNotification('刷新监控', '监控数据已更新', 'info');
};

/**
 * 启动监控数据更新
 */
SealgwApp.prototype.startMonitorUpdates = function() {
    setInterval(() => {
        this.refreshMonitor();
    }, 5000); // 每5秒更新一次
};

/**
 * 开始自动连接演示
 */
SealgwApp.prototype.startAutoDemo = function() {
    this.isDemoRunning = true;
    this.autoDemoInterval = setInterval(() => {
        if (this.isDemoRunning) {
            this.generateConnectionFlow();
        }
    }, 2000 / this.demoSpeed); // 根据速度调整间隔

    // 添加演示状态指示器
    this.addDemoStatusIndicator();
};

/**
 * 添加演示状态指示器
 */
SealgwApp.prototype.addDemoStatusIndicator = function() {
    // 移除现有指示器
    this.clearDemoStatus();

    const statusIndicator = document.createElement('div');
    statusIndicator.id = 'demo-status-indicator';
    statusIndicator.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, var(--color-success), var(--color-primary));
        color: white;
        padding: 12px 24px;
        border-radius: var(--radius-full);
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-semibold);
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        opacity: 0;
        transform: translateX(-50%) translateY(-20px);
        transition: all var(--transition-normal);
        display: flex;
        align-items: center;
        gap: var(--space-2);
    `;

    // 添加动画圆点
    const dot = document.createElement('div');
    dot.style.cssText = `
        width: 8px;
        height: 8px;
        background: white;
        border-radius: 50%;
        animation: statusPulse 1.5s infinite;
    `;

    statusIndicator.appendChild(dot);
    statusIndicator.appendChild(document.createTextNode('自动演示运行中'));

    // 添加动画样式
    if (!document.querySelector('#status-pulse-style')) {
        const style = document.createElement('style');
        style.id = 'status-pulse-style';
        style.textContent = `
            @keyframes statusPulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.3; transform: scale(0.8); }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(statusIndicator);

    // 显示动画
    requestAnimationFrame(() => {
        statusIndicator.style.opacity = '1';
        statusIndicator.style.transform = 'translateX(-50%) translateY(0)';
    });
};

/**
 * 清理演示状态
 */
SealgwApp.prototype.clearDemoStatus = function() {
    const existingIndicator = document.getElementById('demo-status-indicator');
    if (existingIndicator) {
        existingIndicator.style.opacity = '0';
        existingIndicator.style.transform = 'translateX(-50%) translateY(-20px)';
        setTimeout(() => {
            if (existingIndicator.parentNode) {
                existingIndicator.parentNode.removeChild(existingIndicator);
            }
        }, 300);
    }
};

/**
 * 更新演示速度
 */
SealgwApp.prototype.updateDemoSpeed = function(speed) {
    this.demoSpeed = parseInt(speed);
    if (this.isDemoRunning) {
        // 重启演示以应用新速度
        this.restartAutoDemo();
    }
};

/**
 * 重启自动演示
 */
SealgwApp.prototype.restartAutoDemo = function() {
    // 清理当前状态
    this.clearDemoStatus();

    // 重置连接计数
    this.serverConnections = { 1: 0, 2: 0, 3: 0 };
    this.requestCounter = 0;
    this.successRequests = 0;

    // 清空请求日志
    this.clearRequestLog();

    // 重置服务器状态显示
    document.querySelectorAll('.server-node').forEach(server => {
        server.classList.remove('processing', 'selected');
        const connectionCount = server.querySelector('.connection-count');
        const loadValue = server.querySelector('.load-value');
        if (connectionCount) connectionCount.textContent = '0';
        if (loadValue) loadValue.textContent = '0';
    });

    // 重置统计显示
    document.getElementById('total-requests').textContent = '0';
    document.getElementById('requests-per-sec').textContent = '0';
    document.getElementById('avg-response-time').textContent = '0ms';
    document.getElementById('success-rate').textContent = '100%';
    document.getElementById('active-connections').textContent = '0';

    // 清理 SVG 中的连接线
    const svg = document.getElementById('flow-connections');
    if (svg) {
        svg.innerHTML = '';
    }

    // 重新开始
    if (this.autoDemoInterval) {
        clearInterval(this.autoDemoInterval);
    }
    this.startAutoDemo();
};

/**
 * 停止自动演示
 */
SealgwApp.prototype.stopAutoDemo = function() {
    this.isDemoRunning = false;
    if (this.autoDemoInterval) {
        clearInterval(this.autoDemoInterval);
        this.autoDemoInterval = null;
    }
    this.clearDemoStatus();

    // 清理 SVG 中的连接线
    const svg = document.getElementById('flow-connections');
    if (svg) {
        svg.innerHTML = '';
    }

    // 移除所有处理状态
    document.querySelectorAll('.server-node.processing').forEach(server => {
        server.classList.remove('processing');
    });
};


/**
 * 更新负载均衡算法
 */
SealgwApp.prototype.updateAlgorithm = function(algorithm) {
    this.currentAlgorithm = algorithm;

    const algorithmNames = {
        'rr': '轮询 (RR)',
        'wrr': '加权轮询 (WRR)',
        'lc': '最少连接 (LC)',
        'wlc': '加权最少连接 (WLC)',
        'sh': '源地址哈希 (SH)'
    };

    document.getElementById('current-algorithm').textContent = algorithmNames[algorithm];

    // 重置连接计数
    this.serverConnections = { 1: 0, 2: 0, 3: 0 };

    // 更新所有服务器的连接显示
    document.querySelectorAll('.server-node').forEach(server => {
        const serverId = server.dataset.server;
        server.querySelector('.connection-count').textContent = '0';
    });

    this.addLogEntry(`算法切换到: ${algorithmNames[algorithm]}`, 'info');
};

/**
 * 选择服务器基于负载均衡算法
 */
SealgwApp.prototype.selectServer = function(clientId) {
    const servers = document.querySelectorAll('.server-node');
    let selectedServer;

    switch (this.currentAlgorithm) {
        case 'rr': // 轮询
            selectedServer = servers[(this.requestCounter - 1) % servers.length];
            break;

        case 'wrr': // 加权轮询
            const weights = [];
            servers.forEach(server => {
                const weight = parseInt(server.dataset.weight);
                for (let i = 0; i < weight; i++) {
                    weights.push(server);
                }
            });
            selectedServer = weights[(this.requestCounter - 1) % weights.length];
            break;

        case 'lc': // 最少连接
            selectedServer = servers.reduce((min, server) => {
                const serverId = server.dataset.server;
                return this.serverConnections[serverId] < this.serverConnections[min.dataset.server] ? server : min;
            });
            break;

        case 'wlc': // 加权最少连接
            selectedServer = servers.reduce((best, server) => {
                const serverId = server.dataset.server;
                const weight = parseInt(server.dataset.weight);
                const connections = this.serverConnections[serverId];
                const ratio = connections / weight;

                const bestId = best.dataset.server;
                const bestWeight = parseInt(best.dataset.weight);
                const bestConnections = this.serverConnections[bestId];
                const bestRatio = bestConnections / bestWeight;

                return ratio < bestRatio ? server : best;
            });
            break;

        case 'sh': // 源地址哈希
            const hash = this.simpleHash(clientId);
            selectedServer = servers[hash % servers.length];
            break;

        default:
            selectedServer = servers[Math.floor(Math.random() * servers.length)];
    }

    return selectedServer;
};

/**
 * 简单哈希函数
 */
SealgwApp.prototype.simpleHash = function(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // 转换为32位整数
    }
    return Math.abs(hash);
};

/**
 * 生成连接流向（增强版）
 */
SealgwApp.prototype.generateConnectionFlow = function() {
    const clients = document.querySelectorAll('.client-node');
    const randomClient = clients[Math.floor(Math.random() * clients.length)];
    const clientId = randomClient.dataset.client;

    // 使用负载均衡算法选择服务器
    const selectedServer = this.selectServer(clientId);
    const serverId = selectedServer.dataset.server;

    // 高亮选中的服务器
    document.querySelectorAll('.server-node').forEach(node => {
        node.classList.remove('selected');
    });
    selectedServer.classList.add('selected');

    // 模拟请求处理
    this.requestCounter++;
    this.serverConnections[serverId]++;

    // 更新连接统计（带动画效果）
    this.animateValue('total-requests', this.requestCounter);
    document.getElementById('requests-per-sec').textContent = this.demoSpeed;

    const activeConnections = Math.floor(Math.random() * 30 + 10);
    this.animateValue('active-connections', activeConnections);

    // 计算并更新平均响应时间
    const responseTime = Math.floor(Math.random() * 25 + 5);
    const currentAvgTime = parseInt(document.getElementById('avg-response-time').textContent);
    const newAvgTime = Math.floor((currentAvgTime + responseTime) / 2);
    document.getElementById('avg-response-time').textContent = newAvgTime + 'ms';

    // 更新服务器状态
    selectedServer.classList.add('processing');
    selectedServer.classList.remove('selected');

    const connectionCount = selectedServer.querySelector('.connection-count');
    this.animateValue(connectionCount, this.serverConnections[serverId]);

    const loadElement = selectedServer.querySelector('.load-value');
    const currentLoad = parseInt(loadElement.textContent);
    const newLoad = Math.min(100, currentLoad + Math.floor(Math.random() * 8));
    loadElement.textContent = newLoad;

    // 记录增强日志
    const clientIP = `10.0.0.${clientId}`;
    const serverIP = selectedServer.querySelector('.server-ip').textContent;
    const algorithmName = document.getElementById('current-algorithm').textContent;
    const serverWeight = selectedServer.dataset.weight;

    this.addLogEntry(`📤 [${clientIP}] → 🖥️ ${serverIP} (${algorithmName}, 权重:${serverWeight}) - ⚡ ${responseTime}ms`, 'success');

    // 模拟成功请求
    this.successRequests++;
    const successRate = Math.floor((this.successRequests / this.requestCounter) * 100);
    this.animateValue('success-rate', successRate, '%');

    // 创建增强的连接动画
    this.createConnectionAnimation(randomClient, selectedServer, () => {
        // 请求完成后的回调
        selectedServer.classList.remove('processing');

        // 添加成功指示器
        this.showSuccessIndicator(selectedServer);

        // 随机减少负载
        setTimeout(() => {
            const currentLoadAfter = parseInt(loadElement.textContent);
            const reducedLoad = Math.max(0, currentLoadAfter - Math.floor(Math.random() * 5));
            this.animateValue(loadElement, reducedLoad);
        }, Math.random() * 2000 + 500);
    });
};

/**
 * 显示成功指示器
 */
SealgwApp.prototype.showSuccessIndicator = function(serverNode) {
    const successIndicator = document.createElement('div');
    successIndicator.innerHTML = '✓';
    successIndicator.style.cssText = `
        position: absolute;
        top: -10px;
        right: -10px;
        background: var(--color-success);
        color: white;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        z-index: 100;
        animation: successPop 0.6s ease-out;
    `;

    serverNode.style.position = 'relative';
    serverNode.appendChild(successIndicator);

    // 添加动画样式
    if (!document.querySelector('#success-animation')) {
        const style = document.createElement('style');
        style.id = 'success-animation';
        style.textContent = `
            @keyframes successPop {
                0% {
                    transform: scale(0) rotate(0deg);
                    opacity: 0;
                }
                50% {
                    transform: scale(1.2) rotate(180deg);
                    opacity: 1;
                }
                100% {
                    transform: scale(1) rotate(360deg);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // 自动移除指示器
    setTimeout(() => {
        if (successIndicator.parentNode) {
            successIndicator.style.animation = 'successPop 0.6s ease-out reverse';
            setTimeout(() => {
                if (successIndicator.parentNode) {
                    serverNode.removeChild(successIndicator);
                }
            }, 600);
        }
    }, 1500);
};

/**
 * 数字动画函数
 */
SealgwApp.prototype.animateValue = function(element, targetValue, suffix = '') {
    const elementToAnimate = typeof element === 'string' ? document.getElementById(element) : element;
    if (!elementToAnimate) return;

    const currentValue = parseInt(elementToAnimate.textContent) || 0;
    const difference = targetValue - currentValue;
    const duration = 500;
    const startTime = performance.now();

    const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // 使用 easeOutQuart缓动函数
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValueAnimated = currentValue + (difference * easeOutQuart);

        elementToAnimate.textContent = Math.floor(currentValueAnimated) + suffix;

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    };

    requestAnimationFrame(animate);
};

/**
 * 添加日志条目
 */
SealgwApp.prototype.addLogEntry = function(message, type = 'info') {
    const logContainer = document.getElementById('request-log-container');
    const placeholder = logContainer.querySelector('.placeholder');

    if (placeholder) {
        placeholder.remove();
    }

    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${type}`;

    const now = new Date();
    const timeString = now.toTimeString().split(' ')[0];

    logEntry.innerHTML = `
        <span class="log-time">${timeString}</span>
        <span class="log-message">${message}</span>
    `;

    logContainer.appendChild(logEntry);

    // 保持日志数量限制
    const maxLogs = 50;
    const logs = logContainer.querySelectorAll('.log-entry');
    if (logs.length > maxLogs) {
        logs[0].remove();
    }

    // 自动滚动到底部
    logContainer.scrollTop = logContainer.scrollHeight;
};

/**
 * 清空请求日志
 */
SealgwApp.prototype.clearRequestLog = function() {
    const logContainer = document.getElementById('request-log-container');
    logContainer.innerHTML = `
        <div class="log-entry placeholder">
            <span class="log-time">--:--:--</span>
            <span class="log-message" data-i18n="connection.waiting_requests">等待请求...</span>
        </div>
    `;
};

/**
 * 创建连接动画 - 显示完整的流量路径（增强版）
 */
SealgwApp.prototype.createConnectionAnimation = function(from, to, callback) {
    const svg = document.getElementById('flow-connections');
    if (!svg) return;

    const fromRect = from.getBoundingClientRect();
    const toRect = to.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();

    // 获取负载均衡器的位置
    const lbNode = document.querySelector('.lb-node');
    const lbRect = lbNode.getBoundingClientRect();

    // 计算路径点
    const x1 = fromRect.left + fromRect.width / 2 - svgRect.left;
    const y1 = fromRect.top + fromRect.height / 2 - svgRect.top;
    const lbX = lbRect.left + lbRect.width / 2 - svgRect.left;
    const lbY = lbRect.top + lbRect.height / 2 - svgRect.top;
    const x2 = toRect.left + toRect.width / 2 - svgRect.left;
    const y2 = toRect.top + toRect.height / 2 - svgRect.top;

    // 添加发光效果到源节点
    from.classList.add('active');
    setTimeout(() => from.classList.remove('active'), 500);

    // 创建弯曲路径以获得更好的视觉效果
    const controlOffset = 50;
    const pathData1 = `M ${x1} ${y1} Q ${(x1 + lbX) / 2} ${(y1 + lbY) / 2 - controlOffset} ${lbX} ${lbY}`;
    const pathData2 = `M ${lbX} ${lbY} Q ${(lbX + x2) / 2} ${(lbY + y2) / 2 + controlOffset} ${x2} ${y2}`;

    // 创建路径元素
    const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    // 设置路径属性
    path1.setAttribute('d', pathData1);
    path1.setAttribute('class', 'connection-path stage1');
    path1.style.strokeDasharray = '1000';
    path1.style.strokeDashoffset = '1000';

    path2.setAttribute('d', pathData2);
    path2.setAttribute('class', 'connection-path stage2');
    path2.style.strokeDasharray = '1000';
    path2.style.strokeDashoffset = '1000';

    svg.appendChild(path1);
    svg.appendChild(path2);

    // 动画序列：先绘制第一段路径，然后第二段
    setTimeout(() => {
        path1.style.strokeDashoffset = '0';
    }, 100);

    setTimeout(() => {
        path2.style.strokeDashoffset = '0';
    }, 600);

    // 创建增强的移动数据包效果
    const createDataPacket = (path, delay, color = '#6366f1') => {
        const packet = document.createElementNS('http://www.w3.org/2000/svg', 'g');

        // 外圈
        const outerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        outerCircle.setAttribute('r', '8');
        outerCircle.setAttribute('fill', color);
        outerCircle.setAttribute('opacity', '0.3');

        // 内圈
        const innerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        innerCircle.setAttribute('r', '4');
        innerCircle.setAttribute('fill', '#fff');
        innerCircle.setAttribute('stroke', color);
        innerCircle.setAttribute('stroke-width', '2');
        innerCircle.setAttribute('class', 'connection-dot');

        packet.appendChild(outerCircle);
        packet.appendChild(innerCircle);
        svg.appendChild(packet);

        // 动画数据包沿路径移动
        setTimeout(() => {
            const length = path.getTotalLength();
            let progress = 0;
            const speed = 0.015; // 调整速度

            const animatePacket = () => {
                progress += speed;
                if (progress >= 1) {
                    // 动画完成，创建到达效果
                    this.createArrivalEffect(x2, y2);
                    svg.removeChild(packet);
                    return;
                }

                const point = path.getPointAtLength(progress * length);
                packet.setAttribute('transform', `translate(${point.x}, ${point.y})`);

                // 添加尾迹效果
                const trail = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                trail.setAttribute('r', '2');
                trail.setAttribute('fill', color);
                trail.setAttribute('opacity', '0.3');
                trail.setAttribute('transform', `translate(${point.x}, ${point.y})`);
                svg.appendChild(trail);

                // 淡出尾迹
                setTimeout(() => {
                    trail.style.transition = 'opacity 0.5s ease-out';
                    trail.style.opacity = '0';
                    setTimeout(() => svg.removeChild(trail), 500);
                }, 100);

                requestAnimationFrame(animatePacket);
            };

            animatePacket();
        }, delay);
    };

    // 创建两个数据包，分别沿两段路径移动
    createDataPacket(path1, 150, '#3b82f6');
    createDataPacket(path2, 700, '#8b5cf6');

    // 清理动画
    const cleanup = () => {
        path1.style.animation = 'pathDisappear 0.6s ease-out forwards';
        path2.style.animation = 'pathDisappear 0.6s ease-out forwards';

        setTimeout(() => {
            if (svg.contains(path1)) svg.removeChild(path1);
            if (svg.contains(path2)) svg.removeChild(path2);
            if (callback) callback();
        }, 600);
    };

    setTimeout(cleanup, 2000);
};

/**
 * 创建到达效果
 */
SealgwApp.prototype.createArrivalEffect = function(x, y) {
    const svg = document.getElementById('flow-connections');
    if (!svg) return;

    const ripple = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    ripple.setAttribute('cx', x);
    ripple.setAttribute('cy', y);
    ripple.setAttribute('r', '4');
    ripple.setAttribute('fill', 'none');
    ripple.setAttribute('stroke', '#10b981');
    ripple.setAttribute('stroke-width', '2');
    ripple.setAttribute('opacity', '1');

    svg.appendChild(ripple);

    // 动画涟漪效果
    ripple.style.transition = 'all 0.8s ease-out';
    setTimeout(() => {
        ripple.setAttribute('r', '20');
        ripple.setAttribute('opacity', '0');
    }, 100);

    setTimeout(() => {
        if (svg.contains(ripple)) svg.removeChild(ripple);
    }, 900);
};

/**
 * 生成配置
 */
SealgwApp.prototype.generateConfig = function() {
    const config = {
        vip: document.getElementById('vip-input').value,
        port: parseInt(document.getElementById('port-input').value),
        algorithm: document.getElementById('algorithm-select').value,
        healthCheck: {
            interval: parseInt(document.getElementById('check-interval').value),
            timeout: parseInt(document.getElementById('check-timeout').value),
            retries: parseInt(document.getElementById('retries').value)
        },
        backendServers: []
    };

    // 收集后端服务器信息
    const serverGroups = document.querySelectorAll('.server-input-group');
    serverGroups.forEach(group => {
        const ip = group.querySelector('.server-ip').value;
        const port = parseInt(group.querySelector('.server-port').value);
        const weight = parseInt(group.querySelector('.server-weight').value);

        if (ip) {
            config.backendServers.push({ ip, port, weight });
        }
    });

    // 生成配置文本
    this.configText = this.formatConfig(config);
    this.displayConfig(this.configText);
};

/**
 * 格式化配置
 */
SealgwApp.prototype.formatConfig = function(config) {
    const format = this.currentConfigFormat || 'yaml';

    switch (format) {
        case 'yaml':
            return this.formatToYaml(config);
        case 'json':
            return this.formatToJSON(config);
        case 'shell':
            return this.formatToShell(config);
        default:
            return this.formatToYaml(config);
    }
};

/**
 * 格式化为 YAML
 */
SealgwApp.prototype.formatToYaml = function(config) {
    let yaml = `# LVSCare Configuration Generated by Sealgw
# Generated at: ${new Date().toISOString()}

# Virtual Server Configuration
virtual_server:
  vip: "${config.vip}"
  port: ${config.port}
  algorithm: "${config.algorithm}"

# Health Check Configuration
health_check:
  interval: ${config.healthCheck.interval}s
  timeout: ${config.healthCheck.timeout}s
  retries: ${config.healthCheck.retries}

# Backend Servers
backend_servers:
`;

    config.backendServers.forEach((server, index) => {
        yaml += `  - server_${index + 1}:
      ip: "${server.ip}"
      port: ${server.port}
      weight: ${server.weight}
      check:
        path: "/health"
        expected_status: 200
`;
    });

    return yaml;
};

/**
 * 格式化为 JSON
 */
SealgwApp.prototype.formatToJSON = function(config) {
    return JSON.stringify(config, null, 2);
};

/**
 * 格式化为 Shell 脚本
 */
SealgwApp.prototype.formatToShell = function(config) {
    let shell = `#!/bin/bash
# LVSCare Configuration Script
# Generated by Sealgw at ${new Date().toISOString()}

# Environment Variables
export LVSCARE_VIP="${config.vip}"
export LVSCARE_PORT=${config.port}
export LVSCARE_ALGORITHM="${config.algorithm}"

# Health Check Configuration
export LVSCARE_CHECK_INTERVAL=${config.healthCheck.interval}
export LVSCARE_CHECK_TIMEOUT=${config.healthCheck.timeout}
export LVSCARE_CHECK_RETRIES=${config.healthCheck.retries}

# Backend Servers Configuration
`;

    config.backendServers.forEach((server, index) => {
        shell += `export LVSCARE_SERVER_${index + 1}="${server.ip}:${server.port}:${server.weight}"\n`;
    });

    shell += `
# Start LVSCare
echo "Starting LVSCare with the following configuration:"
echo "VIP: $LVSCARE_VIP:$LVSCARE_PORT"
echo "Algorithm: $LVSCARE_ALGORITHM"
echo "Backend Servers: ${config.backendServers.length} configured"

# Apply configuration
lvscare apply --config /etc/lvscare/config.yaml
`;

    return shell;
};

/**
 * 显示配置
 */
SealgwApp.prototype.displayConfig = function(configText) {
    const preview = document.getElementById('config-preview');
    if (preview) {
        preview.textContent = configText;
    }
};

/**
 * 下载配置文件
 */
SealgwApp.prototype.downloadConfig = function() {
    if (!this.configText) {
        this.showNotification('错误', '请先生成配置', 'error');
        return;
    }

    const format = this.currentConfigFormat || 'yaml';
    const filename = `lvscare-config.${format}`;
    const blob = new Blob([this.configText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.showNotification('下载成功', `配置文件 ${filename} 已下载`, 'success');
};

/**
 * 复制配置
 */
SealgwApp.prototype.copyConfig = function() {
    if (!this.configText) {
        this.showNotification('错误', '请先生成配置', 'error');
        return;
    }

    navigator.clipboard.writeText(this.configText).then(() => {
        this.showNotification('复制成功', '配置已复制到剪贴板', 'success');
    }).catch(() => {
        this.showNotification('复制失败', '无法复制到剪贴板', 'error');
    });
};

/**
 * 添加服务器输入
 */
SealgwApp.prototype.addServerInput = function() {
    const container = document.getElementById('backend-servers');
    const newGroup = document.createElement('div');
    newGroup.className = 'server-input-group';
    newGroup.innerHTML = `
        <input type="text" class="server-ip" placeholder="192.168.1.10">
        <input type="number" class="server-port" placeholder="80" value="80">
        <input type="number" class="server-weight" placeholder="100" value="100">
        <button class="remove-server">✕</button>
    `;

    container.appendChild(newGroup);
    this.updateServerInputButtons();
};

/**
 * 更新服务器输入按钮状态
 */
SealgwApp.prototype.updateServerInputButtons = function() {
    const groups = document.querySelectorAll('.server-input-group');
    groups.forEach((group, index) => {
        const removeBtn = group.querySelector('.remove-server');
        if (removeBtn) {
            removeBtn.style.display = groups.length > 1 ? 'block' : 'none';
            removeBtn.onclick = () => {
                if (groups.length > 1) {
                    group.remove();
                    this.updateServerInputButtons();
                }
            };
        }
    });
};

/**
 * 切换配置格式
 */
SealgwApp.prototype.switchConfigFormat = function(format) {
    this.currentConfigFormat = format;

    // 更新标签状态
    document.querySelectorAll('.format-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-format="${format}"]`).classList.add('active');

    // 重新生成配置
    if (this.configText) {
        const config = {
            vip: document.getElementById('vip-input').value,
            port: parseInt(document.getElementById('port-input').value),
            algorithm: document.getElementById('algorithm-select').value,
            healthCheck: {
                interval: parseInt(document.getElementById('check-interval').value),
                timeout: parseInt(document.getElementById('check-timeout').value),
                retries: parseInt(document.getElementById('retries').value)
            },
            backendServers: []
        };

        const serverGroups = document.querySelectorAll('.server-input-group');
        serverGroups.forEach(group => {
            const ip = group.querySelector('.server-ip').value;
            const port = parseInt(group.querySelector('.server-port').value);
            const weight = parseInt(group.querySelector('.server-weight').value);

            if (ip) {
                config.backendServers.push({ ip, port, weight });
            }
        });

        this.configText = this.formatConfig(config);
        this.displayConfig(this.configText);
    }
};

// ============================================
// 简化版 LVSCare 功能
// ============================================

/**
 * 模拟故障转移 - 简化版
 */
SealgwApp.prototype.simulateSimpleFailover = function() {
    const servers = document.querySelectorAll('.rs-simple-item');
    const randomServer = servers[Math.floor(Math.random() * servers.length)];

    randomServer.classList.remove('healthy');
    randomServer.classList.add('offline');
    const statusDot = randomServer.querySelector('.rs-status-dot');
    statusDot.classList.remove('online');
    statusDot.classList.add('offline');

    // 更新健康服务器数量
    const healthyCount = document.querySelectorAll('.rs-simple-item.healthy').length;
    const totalCount = servers.length;
    document.getElementById('healthy-count-simple').textContent = `${healthyCount}/${totalCount}`;

    // 3秒后恢复
    setTimeout(() => {
        randomServer.classList.remove('offline');
        randomServer.classList.add('healthy');
        statusDot.classList.remove('offline');
        statusDot.classList.add('online');
        document.getElementById('healthy-count-simple').textContent = `${totalCount}/${totalCount}`;
    }, 3000);

    this.showNotification('模拟故障转移', `服务器 ${randomServer.querySelector('.rs-ip').textContent} 临时下线`, 'warning');
};

/**
 * 添加服务器到监控面板 - 简化版
 */
SealgwApp.prototype.addSimpleServerToMonitor = function() {
    const serversContainer = document.querySelector('.rs-grid');
    const serverCount = serversContainer.children.length + 1;
    const newIP = `192.168.1.${10 + serverCount}`;

    const newServer = document.createElement('div');
    newServer.className = 'rs-simple-item healthy';
    newServer.innerHTML = `
        <span class="rs-ip">${newIP}</span>
        <span class="rs-status-dot online"></span>
        <span class="rs-connections">0</span>
    `;

    serversContainer.appendChild(newServer);

    // 更新健康服务器数量
    const healthyCount = document.querySelectorAll('.rs-simple-item.healthy').length;
    const totalCount = document.querySelectorAll('.rs-simple-item').length;
    document.getElementById('healthy-count-simple').textContent = `${healthyCount}/${totalCount}`;

    this.showNotification('添加服务器', `新服务器 ${newIP} 已添加到监控面板`, 'success');
};

/**
 * 刷新监控数据 - 简化版
 */
SealgwApp.prototype.refreshSimpleMonitor = function() {
    // 更新连接数
    const connections = document.querySelectorAll('#vs-connections-simple, #vs-connections-ssl-simple');
    connections.forEach(conn => {
        const currentValue = parseInt(conn.textContent.replace(/[^\d]/g, ''));
        const change = Math.floor(Math.random() * 200) - 100;
        conn.textContent = Math.max(100, currentValue + change) + ' 连接';
    });

    // 更新服务器连接数
    document.querySelectorAll('.rs-simple-item.healthy').forEach(server => {
        const connectionsElement = server.querySelector('.rs-connections');
        const currentConnections = parseInt(connectionsElement.textContent);
        const newConnections = Math.max(0, currentConnections + Math.floor(Math.random() * 20) - 10);
        connectionsElement.textContent = newConnections;
    });

    this.showNotification('刷新监控', '监控数据已更新', 'info');
};

/**
 * 启动监控数据更新 - 简化版
 */
SealgwApp.prototype.startSimpleMonitorUpdates = function() {
    setInterval(() => {
        this.refreshSimpleMonitor();
    }, 8000); // 每8秒更新一次
};

/**
 * 显示通知
 */
SealgwApp.prototype.showNotification = function(title, message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--color-success)' :
                    type === 'error' ? 'var(--color-error)' :
                    type === 'warning' ? 'var(--color-warning)' : 'var(--color-info)'};
        color: white;
        padding: 16px;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        max-width: 300px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;

    notification.innerHTML = `
        <h4 style="margin: 0 0 8px 0; font-size: 16px;">${title}</h4>
        <p style="margin: 0; font-size: 14px;">${message}</p>
    `;

    document.body.appendChild(notification);

    // 显示动画
    requestAnimationFrame(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    });

    // 自动移除
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
};

// 导出应用实例供外部使用
window.SealgwApp = app;

// 添加一些有用的全局函数
window.SealgwUtils = Utils;

// 开发模式下的调试工具
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    window.SealgwDebug = {
        app,
        AppState,
        CONFIG,
        Utils,
        // 添加更多调试功能
        logState: () => console.log('App State:', AppState),
        toggleReducedMotion: () => {
            CONFIG.PERFORMANCE.ENABLE_REDUCED_MOTION = !CONFIG.PERFORMANCE.ENABLE_REDUCED_MOTION;
            console.log('Reduced motion:', CONFIG.PERFORMANCE.ENABLE_REDUCED_MOTION);
        },
        // 测试主题切换
        testThemeToggle: () => {
            if (app && app.themeManager) {
                app.themeManager.toggleTheme();
                console.log('Theme toggled to:', AppState.currentTheme);
            }
        },
        // 测试语言切换
        testLangToggle: () => {
            if (app && app.i18nManager) {
                app.i18nManager.toggleLanguage();
                console.log('Language toggled to:', AppState.currentLanguage);
            }
        }
    };
    console.log('🔧 Debug mode enabled. Access via window.SealgwDebug');
}