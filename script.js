// 定义可用的语言和默认语言
const availableLangs = ['zh', 'en'];
const defaultLang = 'zh';

// 存储当前语言，用于切换
let currentLang = defaultLang;

// =========================================
// 国际化核心逻辑
// =========================================
async function loadLanguage(lang) {
    const langCode = availableLangs.includes(lang) ? lang : defaultLang;
    currentLang = langCode;

    try {
        // 确保 i18n 文件夹存在且文件可访问
        const response = await fetch(`i18n/${langCode}.json`);
        if (!response.ok) throw new Error(`Could not load i18n/${langCode}.json`);

        const translations = await response.json();
        applyTranslations(translations);

        // 更新页面的 lang 属性
        document.documentElement.setAttribute('lang', langCode);

    } catch (error) {
        console.error('Error loading translations:', error);
        // 如果加载失败，保持原样（显示 HTML 中的默认文本）
    }
}

function applyTranslations(translations) {
    // 翻译 <title>
    const pageTitle = document.querySelector('title');
    const titleKey = pageTitle.getAttribute('data-i18n');
    if (translations[titleKey]) {
        pageTitle.textContent = translations[titleKey];
    }

    // 翻译所有带 data-i18n 属性的元素
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        // 使用 Key 路径（如 "hero.title"）从 JSON 中查找对应的值
        // 注意：这里使用了一个简单的 reducer 来处理嵌套的 JSON 结构
        const value = key.split('.').reduce((obj, k) => (obj && obj[k] !== undefined) ? obj[k] : null, translations);

        if (value) {
            // 对于主要文本元素 (H1, P, A, LI等)，替换 innerHTML（支持 strong 标签等）
            element.innerHTML = value;
        }
    });

    // 更新语言切换按钮的显示
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        langToggle.textContent = currentLang === 'zh' ? 'EN' : '中文';
    }
}


// =========================================
// DOMContentLoaded 及其交互逻辑
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    // 获取元素
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('nav');
    const themeToggle = document.getElementById('theme-toggle');
    const langToggle = document.getElementById('lang-toggle');
    const body = document.body;
    const header = document.querySelector('header');

    // 1. 初始语言加载
    const userLang = localStorage.getItem('lang') || navigator.language.substring(0, 2) || defaultLang;
    loadLanguage(userLang);

    // 2. 语言切换逻辑
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            const newLang = currentLang === 'zh' ? 'en' : 'zh';
            localStorage.setItem('lang', newLang);
            loadLanguage(newLang);
        });
    }

    // 3. Dark Mode 切换逻辑
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        body.setAttribute('data-theme', newTheme);
        themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        localStorage.setItem('theme', newTheme);
    });

    // 4. 初始主题应用 (从本地存储加载)
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
        body.setAttribute('data-theme', storedTheme);
        themeToggle.textContent = storedTheme === 'dark' ? '☀️' : '🌙';
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // 遵循系统主题偏好
        body.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️';
    }

    // 5. 移动端导航切换
    if (navToggle && nav) {
        navToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }

    // 6. 平滑滚动和移动端菜单关闭
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            // 修正滚动目标位置，考虑到固定的头部
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            const headerHeight = header.offsetHeight;
            const offsetTop = targetElement.offsetTop - headerHeight - 10;

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });

            // 移动端：点击链接后收起菜单
            if (window.innerWidth <= 768 && nav.classList.contains('active')) {
                nav.classList.remove('active');
            }
        });
    });

    // 7. 滚动动画 (Intersection Observer)
    const itemsToAnimate = document.querySelectorAll('.animate-on-scroll');
    const options = {
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, options);

    itemsToAnimate.forEach(item => {
        observer.observe(item);
    });

    // 8. 头部滚动变色效果 (一体化设计)
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});