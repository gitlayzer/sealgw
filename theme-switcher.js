/**
 * Sealgw 多主题切换器
 * 独立于原有主题系统的实现
 */

// 主题配置
const THEME_CONFIG = {
    THEMES: {
        REDBLACK: 'redblack',
        DEEPBLUE: 'deepblue',
        GREENBLUE: 'greenblue',
        PURPLEGOLD: 'purplegold'
    },
    MODES: {
        LIGHT: 'light',
        DARK: 'dark'
    }
};

// 独立的主题状态管理
let currentTheme = THEME_CONFIG.THEMES.REDBLACK;
let currentThemeMode = THEME_CONFIG.MODES.LIGHT;

class ThemeSwitcher {
    constructor() {
        this.themes = THEME_CONFIG.THEMES;
        this.modes = THEME_CONFIG.MODES;

        // 从独立localStorage加载保存的主题
        this.loadSavedTheme();

        // 初始化
        this.init();
    }

    /**
     * 加载保存的主题设置 - 使用独立的localStorage键
     */
    loadSavedTheme() {
        try {
            const savedTheme = localStorage.getItem('sealgw-multi-theme');
            const savedMode = localStorage.getItem('sealgw-multi-theme-mode');

            console.log('📦 从localStorage加载主题:', { theme: savedTheme, mode: savedMode });

            if (Object.values(this.themes).includes(savedTheme)) {
                currentTheme = savedTheme;
            }

            if (Object.values(this.modes).includes(savedMode)) {
                currentThemeMode = savedMode;
            }

            // 检测系统主题偏好
            if (!savedMode && window.matchMedia) {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                currentThemeMode = prefersDark ? this.modes.DARK : this.modes.LIGHT;
            }
        } catch (error) {
            console.log('无法加载保存的主题设置:', error);
        }
    }

    /**
     * 设置主题 - 使用独立的属性管理
     */
    setTheme(theme, mode = currentThemeMode) {
        if (!Object.values(this.themes).includes(theme)) {
            console.warn(`无效主题: ${theme}`);
            return;
        }

        if (!Object.values(this.modes).includes(mode)) {
            console.warn(`无效主题模式: ${mode}`);
            return;
        }

        currentTheme = theme;
        currentThemeMode = mode;

        console.log(`🎨 应用主题: ${theme} (${mode})`);

        // 应用到独立的data属性
        document.body.setAttribute('data-multi-theme', theme);
        document.body.setAttribute('data-multi-theme-mode', mode);

        // 强制CSS重新计算
        this.forceStyleRefresh();

        // 更新主题选择器UI
        this.updateThemeSelector();

        // 保存到独立的localStorage
        try {
            localStorage.setItem('sealgw-multi-theme', theme);
            localStorage.setItem('sealgw-multi-theme-mode', mode);
            console.log('✅ 主题已保存到localStorage:', { theme, mode });
        } catch (error) {
            console.log('无法保存主题设置:', error);
        }

        // 触发主题变更事件
        document.dispatchEvent(new CustomEvent('multi-themechange', {
            detail: { theme, mode }
        }));
    }

    /**
     * 切换主题模式
     */
    toggleThemeMode() {
        const nextMode = currentThemeMode === this.modes.LIGHT
            ? this.modes.DARK
            : this.modes.LIGHT;
        this.setTheme(currentTheme, nextMode);
    }

    /**
     * 更新主题选择器UI
     */
    updateThemeSelector() {
        const themeOptions = document.querySelectorAll('.theme-option');
        themeOptions.forEach(option => {
            const optionTheme = option.getAttribute('data-theme');
            if (optionTheme === currentTheme) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }

    /**
     * 设置主题选择器可见性
     */
    setThemeSelectorVisible(visible) {
        const selector = document.getElementById('theme-selector');
        if (selector) {
            if (visible) {
                selector.classList.add('show');
            } else {
                selector.classList.remove('show');
            }
        }
    }

    /**
     * 强制样式刷新
     */
    forceStyleRefresh() {
        // 暂时移除再添加class来触发布局重排
        document.body.style.display = 'none';
        document.body.offsetHeight; // 强制重排
        document.body.style.display = '';
    }

    /**
     * 初始化
     */
    init() {
        console.log('🎨 初始化多主题切换器...');

        // 应用初始主题
        this.setTheme(currentTheme, currentThemeMode);

        // 绑定事件
        this.bindEvents();

        // 同步现有主题切换按钮
        this.updateExistingThemeToggle();
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        const switcherBtn = document.getElementById('theme-switcher-btn');
        const selector = document.getElementById('theme-selector');

        // 主题切换器按钮点击事件
        if (switcherBtn) {
            switcherBtn.addEventListener('click', () => {
                const isVisible = selector && selector.classList.contains('show');
                this.setThemeSelectorVisible(!isVisible);
            });
        }

        // 主题选项点击事件
        const themeOptions = document.querySelectorAll('.theme-option');
        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.getAttribute('data-theme');
                console.log(`🎯 选择主题: ${theme}`);
                this.setTheme(theme, currentThemeMode);
                this.setThemeSelectorVisible(false);
            });
        });

        // 添加主题模式切换按钮事件（如果有现有的按钮）
        const existingThemeToggle = document.getElementById('theme-toggle');
        if (existingThemeToggle) {
            existingThemeToggle.addEventListener('click', () => {
                console.log(`🌓 切换主题模式 (当前: ${currentThemeMode})`);
                this.toggleThemeMode();
                this.setThemeSelectorVisible(false);
            });

            // 更新按钮图标
            this.updateExistingThemeToggle();
        }

        // 点击外部关闭主题选择器
        document.addEventListener('click', (e) => {
            if (selector && selector.classList.contains('show')) {
                const isClickInsideSwitcher = e.target.closest('.theme-switcher');
                if (!isClickInsideSwitcher) {
                    this.setThemeSelectorVisible(false);
                }
            }
        });

        // ESC键关闭主题选择器
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.setThemeSelectorVisible(false);
            }
        });

        console.log('✅ 多主题切换器事件绑定完成');
    }

    /**
     * 更新现有主题切换按钮图标
     */
    updateExistingThemeToggle() {
        const existingThemeToggle = document.getElementById('theme-toggle');
        if (existingThemeToggle) {
            // 同步两个主题系统的模式
            const isMultiModeDark = currentThemeMode === this.modes.DARK;
            existingThemeToggle.textContent = isMultiModeDark ? '☀️' : '🌙';

            // 同步到原有系统
            const originalBody = document.body.getAttribute('data-theme');
            if (originalBody === 'dark') {
                document.body.setAttribute('data-theme', isMultiModeDark ? 'dark' : 'light');
            }
        }
    }
}

// 添加CSS支持多主题系统
const multiThemeCSS = `
/* 多主题系统 - 独立选择器 */
[data-multi-theme="redblack"][data-multi-theme-mode="light"],
[data-multi-theme="redblack"]:not([data-multi-theme-mode]) {
  --color-primary: #9b2c2c;
  --color-primary-hover: #7c2525;
  --color-secondary: #b91c1c;
  --color-accent: #c53030;
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f8fafc;
  --color-bg-glass: rgba(248, 250, 252, 0.8);
  --color-bg-overlay: rgba(0, 0, 0, 0.02);
  --color-text-primary: #1a202c;
  --color-text-secondary: #4a5568;
  --color-text-muted: #718096;
  --color-border: rgba(203, 213, 224, 0.5);
  --color-border-hover: rgba(203, 213, 224, 0.7);
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #b91c1c;
  --color-info: #9b2c2c;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.25), 0 10px 10px -5px rgba(0, 0, 0, 0.12);
  --shadow-glass: 0 8px 32px 0 rgba(31, 38, 135, 0.12);
}

[data-multi-theme="redblack"][data-multi-theme-mode="dark"] {
  --color-primary: #b91c1c;
  --color-primary-hover: #9b2c2c;
  --color-secondary: #dc2626;
  --color-accent: #e05252;
  --color-bg-primary: #0a0a0a;
  --color-bg-secondary: #1a1a1a;
  --color-bg-glass: rgba(10, 10, 10, 0.8);
  --color-bg-overlay: rgba(255, 255, 255, 0.08);
  --color-text-primary: #ffffff;
  --color-text-secondary: #e5e7eb;
  --color-text-muted: #9ca3af;
  --color-border: rgba(107, 114, 128, 0.4);
  --color-border-hover: rgba(107, 114, 128, 0.6);
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #dc2626;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.6);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.7), 0 2px 4px -1px rgba(0, 0, 0, 0.5);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.8), 0 4px 6px -2px rgba(0, 0, 0, 0.6);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.9), 0 10px 10px -5px rgba(0, 0, 0, 0.7);
  --shadow-glass: 0 8px 32px 0 rgba(155, 44, 44, 0.08);
}

[data-multi-theme="deepblue"][data-multi-theme-mode="light"],
[data-multi-theme="deepblue"]:not([data-multi-theme-mode]) {
  --color-primary: #3b82f6;
  --color-primary-hover: #2563eb;
  --color-secondary: #8b5cf6;
  --color-accent: #10b981;
  --color-bg-primary: #f8fafc;
  --color-bg-secondary: #f1f5f9;
  --color-bg-glass: rgba(248, 250, 252, 0.9);
  --color-bg-overlay: rgba(59, 130, 246, 0.05);
  --color-text-primary: #1e293b;
  --color-text-secondary: #475569;
  --color-text-muted: #64748b;
  --color-border: rgba(148, 163, 184, 0.3);
  --color-border-hover: rgba(148, 163, 184, 0.5);
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.4);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -2px rgba(0, 0, 0, 0.5);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.7), 0 10px 10px -5px rgba(0, 0, 0, 0.6);
  --shadow-glass: 0 8px 32px 0 rgba(59, 130, 246, 0.1);
}

[data-multi-theme="deepblue"][data-multi-theme-mode="dark"] {
  --color-primary: #60a5fa;
  --color-primary-hover: #3b82f6;
  --color-secondary: #a78bfa;
  --color-accent: #34d399;
  --color-bg-primary: #0f172a;
  --color-bg-secondary: #1e293b;
  --color-bg-glass: rgba(15, 23, 42, 0.8);
  --color-bg-overlay: rgba(96, 165, 250, 0.1);
  --color-text-primary: #f1f5f9;
  --color-text-secondary: #cbd5e1;
  --color-text-muted: #94a3b8;
  --color-border: rgba(71, 85, 105, 0.4);
  --color-border-hover: rgba(71, 85, 105, 0.6);
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #60a5fa;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.4);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -2px rgba(0, 0, 0, 0.5);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.7), 0 10px 10px -5px rgba(0, 0, 0, 0.6);
  --shadow-glass: 0 8px 32px 0 rgba(59, 130, 246, 0.1);
}

[data-multi-theme="greenblue"][data-multi-theme-mode="light"],
[data-multi-theme="greenblue"]:not([data-multi-theme-mode]) {
  --color-primary: #059669;
  --color-primary-hover: #047857;
  --color-secondary: #0891b2;
  --color-accent: #ea580c;
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f8fafc;
  --color-bg-glass: rgba(248, 250, 252, 0.8);
  --color-bg-overlay: rgba(5, 150, 105, 0.05);
  --color-text-primary: #1a202c;
  --color-text-secondary: #4a5568;
  --color-text-muted: #718096;
  --color-border: rgba(203, 213, 224, 0.4);
  --color-border-hover: rgba(203, 213, 224, 0.6);
  --color-success: #059669;
  --color-warning: #ea580c;
  --color-error: #dc2626;
  --color-info: #0891b2;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.4);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -2px rgba(0, 0, 0, 0.5);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.7), 0 10px 10px -5px rgba(0, 0, 0, 0.6);
  --shadow-glass: 0 8px 32px 0 rgba(5, 150, 105, 0.1);
}

[data-multi-theme="greenblue"][data-multi-theme-mode="dark"] {
  --color-primary: #10b981;
  --color-primary-hover: #059669;
  --color-secondary: #06b6d4;
  --color-accent: #f97316;
  --color-bg-primary: #0f172a;
  --color-bg-secondary: #1e293b;
  --color-bg-glass: rgba(15, 23, 42, 0.8);
  --color-bg-overlay: rgba(16, 185, 129, 0.1);
  --color-text-primary: #f1f5f9;
  --color-text-secondary: #cbd5e1;
  --color-text-muted: #94a3b8;
  --color-border: rgba(71, 85, 105, 0.4);
  --color-border-hover: rgba(71, 85, 105, 0.6);
  --color-success: #059669;
  --color-warning: #ea580c;
  --color-error: #dc2626;
  --color-info: #06b6d4;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.4);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -2px rgba(0, 0, 0, 0.5);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.7), 0 10px 10px -5px rgba(0, 0, 0, 0.6);
  --shadow-glass: 0 8px 32px 0 rgba(5, 150, 105, 0.1);
}

[data-multi-theme="purplegold"][data-multi-theme-mode="light"],
[data-multi-theme="purplegold"]:not([data-multi-theme-mode]) {
  --color-primary: #6d28d9;
  --color-primary-hover: #5b21b6;
  --color-secondary: #d97706;
  --color-accent: #dc2626;
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f9fafb;
  --color-bg-glass: rgba(249, 250, 251, 0.8);
  --color-bg-overlay: rgba(109, 40, 217, 0.05);
  --color-text-primary: #1a202c;
  --color-text-secondary: #4a5568;
  --color-text-muted: #718096;
  --color-border: rgba(203, 213, 224, 0.4);
  --color-border-hover: rgba(203, 213, 224, 0.6);
  --color-success: #059669;
  --color-warning: #d97706;
  --color-error: #dc2626;
  --color-info: #6d28d9;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.4);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -2px rgba(0, 0, 0, 0.5);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.7), 0 10px 10px -5px rgba(0, 0, 0, 0.6);
  --shadow-glass: 0 8px 32px 0 rgba(139, 92, 246, 0.12);
}

[data-multi-theme="purplegold"][data-multi-theme-mode="dark"] {
  --color-primary: #8b5cf6;
  --color-primary-hover: #6d28d9;
  --color-secondary: #f59e0b;
  --color-accent: #ef4444;
  --color-bg-primary: #1f2937;
  --color-bg-secondary: #374151;
  --color-bg-glass: rgba(31, 41, 55, 0.8);
  --color-bg-overlay: rgba(139, 92, 246, 0.1);
  --color-text-primary: #f9fafb;
  --color-text-secondary: #e5e7eb;
  --color-text-muted: #9ca3af;
  --color-border: rgba(107, 114, 128, 0.4);
  --color-border-hover: rgba(107, 114, 128, 0.6);
  --color-success: #059669;
  --color-warning: #d97706;
  --color-error: #dc2626;
  --color-info: #6d28d9;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.5);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.6), 0 2px 4px -1px rgba(0, 0, 0, 0.5);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.7), 0 4px 6px -2px rgba(0, 0, 0, 0.6);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.8), 0 10px 10px -5px rgba(0, 0, 0, 0.7);
  --shadow-glass: 0 8px 32px 0 rgba(139, 92, 246, 0.12);
}
`;

// 动态插入CSS
function injectMultiThemeCSS() {
    const styleElement = document.createElement('style');
    styleElement.textContent = multiThemeCSS;
    styleElement.id = 'multi-theme-styles';
    document.head.appendChild(styleElement);
    console.log('🎨 多主题CSS已注入');
}

// 测试函数
window.testMultiTheme = () => {
    console.log('测试多主题系统...');
    console.log('当前主题:', currentTheme, currentThemeMode);
    console.log('DOM属性:', {
        'data-multi-theme': document.body.getAttribute('data-multi-theme'),
        'data-multi-theme-mode': document.body.getAttribute('data-multi-theme-mode')
    });
};

// 当DOM加载完成后初始化主题切换器
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌟 DOM加载完成，启动多主题切换器...');

    // 立即注入多主题CSS
    injectMultiThemeCSS();

    // 延迟一点时间确保所有元素都加载完成
    setTimeout(() => {
        // 确保主题切换器元素存在
        const themeSwitcher = document.querySelector('.theme-switcher');
        const switcherBtn = document.getElementById('theme-switcher-btn');
        const selector = document.getElementById('theme-selector');

        console.log('多主题切换器元素检查:');
        console.log('- 容器:', !!themeSwitcher);
        console.log('- 按钮:', !!switcherBtn);
        console.log('- 面板:', !!selector);

        if (themeSwitcher && switcherBtn && selector) {
            console.log('所有元素都找到了，创建多主题切换器实例...');

            try {
                window.multiThemeSwitcher = new ThemeSwitcher();
                console.log('🎉 多主题切换器初始化成功！');
            } catch (error) {
                console.error('❌ 多主题切换器初始化失败:', error);
            }
        } else {
            console.warn('⚠️ 多主题切换器元素不完整');
        }
    }, 100);
});

// 导出给全局使用
window.ThemeSwitcher = ThemeSwitcher;
window.currentMultiTheme = () => currentTheme;
window.currentMultiThemeMode = () => currentThemeMode;