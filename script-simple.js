/**
 * Sealgw - 简化版 JavaScript
 * 确保可以直接双击打开 HTML 文件
 */

// ============================================
// 基本配置
// ============================================
const CONFIG = {
    LANGUAGES: { zh: '中文', en: 'EN' },
    DEFAULT_LANGUAGE: 'zh',
    THEMES: { LIGHT: 'light', DARK: 'dark' }
};

// 应用状态
const AppState = {
    currentLanguage: CONFIG.DEFAULT_LANGUAGE,
    currentTheme: CONFIG.THEMES.LIGHT
};

// ============================================
// 内置翻译数据
// ============================================
const translations = {
    zh: {
        page_title: "Sealgw - 云原生高性能 4/7 层网关 (开发中)",
        lang_code: "中文",
        nav: {
            home: "首页", features: "核心特性", architecture: "架构设计",
            performance: "性能指标", lvscare: "LVSCare 监控", demo: "连接演示",
            generator: "配置生成器", status: "项目状态", contact: "联系"
        },
        hero: {
            title: "云原生高性能 4/7 层混合网关",
            subtitle: "Sealgw (开发中) —— 为 Sealos 平台构建，以极致安全和内核级速度，统一您的南北向和东西向流量。",
            stats: { rps: "并发连接", latency: "延迟", uptime: "可用性" },
            docs_btn: "查看开发文档", repo_btn: "GitHub Repo"
        },
        features: {
            title: "核心特性：性能与安全并重",
            subtitle: "企业级网关解决方案，为现代云原生应用提供强大的流量管理能力"
        },
        connection: {
            title: "动态连接流向演示",
            subtitle: "可视化展示请求如何通过 LVS 负载均衡器智能路由到后端服务",
            start_demo: "开始演示", pause: "暂停", speed: "速度",
            waiting_requests: "等待请求...", clients: "客户端",
            load_balancer: "LVS 负载均衡器", backend_servers: "后端服务器"
        }
    },
    en: {
        page_title: "Sealgw - Cloud-Native High-Performance 4/7 Layer Gateway (In Dev)",
        lang_code: "EN",
        nav: {
            home: "Home", features: "Features", architecture: "Architecture",
            performance: "Performance", lvscare: "LVSCare Monitor", demo: "Connection Demo",
            generator: "Config Generator", status: "Project Status", contact: "Contact"
        },
        hero: {
            title: "Cloud-Native High-Performance 4/7 Layer Hybrid Gateway",
            subtitle: "Sealgw (In Development) is built for the Sealos platform, unifying your traffic with extreme security and kernel-level speed.",
            stats: { rps: "Connections", latency: "Latency", uptime: "Uptime" },
            docs_btn: "View Development Docs", repo_btn: "GitHub Repo"
        },
        features: {
            title: "Core Features: Performance and Security",
            subtitle: "Enterprise-grade gateway solution providing powerful traffic management for modern cloud-native applications"
        },
        connection: {
            title: "Dynamic Connection Flow Demo",
            subtitle: "Visualize how requests are intelligently routed through LVS load balancer to backend services",
            start_demo: "Start Demo", pause: "Pause", speed: "Speed",
            waiting_requests: "Waiting for requests...", clients: "Clients",
            load_balancer: "LVS Load Balancer", backend_servers: "Backend Servers"
        }
    }
};

// ============================================
// 简单应用类
// ============================================
class SimpleSealgwApp {
    constructor() {
        this.isInitialized = false;
    }

    async init() {
        console.log('🚀 Initializing Sealgw...');

        try {
            // 1. 初始化语言
            this.initLanguage();

            // 2. 初始化主题
            this.initTheme();

            // 3. 绑定基本事件
            this.bindEvents();

            // 4. 确保页面可见
            document.body.style.opacity = '1';

            this.isInitialized = true;
            console.log('✅ Sealgw initialized successfully');

        } catch (error) {
            console.error('❌ Initialization failed:', error);
            // 确保页面仍然可见
            document.body.style.opacity = '1';
        }
    }

    initLanguage() {
        // 检测用户语言偏好
        let savedLang = null;
        try {
            savedLang = localStorage.getItem('sealgw-language');
        } catch (e) {
            console.log('localStorage not available');
        }

        const browserLang = navigator.language.substring(0, 2);
        const preferredLang = savedLang || browserLang || CONFIG.DEFAULT_LANGUAGE;

        AppState.currentLanguage = preferredLang;
        this.applyTranslations();
        this.updateLanguageToggle();
    }

    initTheme() {
        // 检测用户主题偏好
        let savedTheme = null;
        try {
            savedTheme = localStorage.getItem('sealgw-theme');
        } catch (e) {
            console.log('localStorage not available for theme');
        }

        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = savedTheme || (prefersDark ? CONFIG.THEMES.DARK : CONFIG.THEMES.LIGHT);

        this.setTheme(theme);
    }

    setTheme(theme) {
        AppState.currentTheme = theme;
        document.body.setAttribute('data-theme', theme);
        this.updateThemeToggle();

        try {
            localStorage.setItem('sealgw-theme', theme);
        } catch (e) {
            console.log('localStorage not available');
        }
    }

    toggleTheme() {
        const nextTheme = AppState.currentTheme === CONFIG.THEMES.LIGHT ? CONFIG.THEMES.DARK : CONFIG.THEMES.LIGHT;
        this.setTheme(nextTheme);
    }

    toggleLanguage() {
        const nextLang = AppState.currentLanguage === 'zh' ? 'en' : 'zh';
        AppState.currentLanguage = nextLang;
        this.applyTranslations();
        this.updateLanguageToggle();

        try {
            localStorage.setItem('sealgw-language', nextLang);
        } catch (e) {
            console.log('localStorage not available');
        }
    }

    applyTranslations() {
        const lang = AppState.currentLanguage;
        const langData = translations[lang] || translations[CONFIG.DEFAULT_LANGUAGE];

        // 更新页面标题
        const title = document.querySelector('title');
        if (title && langData.page_title) {
            title.textContent = langData.page_title;
        }

        // 更新所有带有 data-i18n 属性的元素
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const value = this.getNestedValue(langData, key);
            if (value) {
                element.textContent = value;
            }
        });

        // 更新 HTML lang 属性
        document.documentElement.setAttribute('lang', lang);
    }

    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : null;
        }, obj);
    }

    updateLanguageToggle() {
        const langToggle = document.getElementById('lang-toggle');
        if (langToggle) {
            langToggle.textContent = CONFIG.LANGUAGES[AppState.currentLanguage];
        }
    }

    updateThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.textContent = AppState.currentTheme === CONFIG.THEMES.DARK ? '☀️' : '🌙';
        }
    }

    bindEvents() {
        // 主题切换
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // 语言切换
        const langToggle = document.getElementById('lang-toggle');
        if (langToggle) {
            langToggle.addEventListener('click', () => this.toggleLanguage());
        }

        // 导航链接平滑滚动
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // 移动端菜单切换
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mainNav = document.querySelector('.main-nav');

        if (mobileMenuBtn && mainNav) {
            mobileMenuBtn.addEventListener('click', () => {
                mainNav.classList.toggle('active');
                mobileMenuBtn.classList.toggle('active');
            });
        }

        // 初始化连接流向演示
        this.initConnectionDemo();

        // 初始化配置生成器
        this.initConfigGenerator();

        // 基本按钮交互效果
        document.querySelectorAll('button, .btn').forEach(button => {
            button.addEventListener('click', function(e) {
                // 添加点击效果
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        });
    }

    initConnectionDemo() {
        this.demoRunning = false;
        this.demoInterval = null;
        this.currentAlgorithm = 'rr';
        this.serverConnections = { 1: 0, 2: 0, 3: 0 };
        this.requestCounter = 0;
        this.successRequests = 0;
        this.failedRequests = 0;
        this.demoSpeed = 5;

        // 真实模拟系统
        this.activeRequests = new Map(); // 存储活跃请求
        this.requestQueue = []; // 请求队列
        this.serverStatus = {
            1: { online: true, load: 0, responseTime: Math.random() * 10 + 5, weight: 3 },
            2: { online: true, load: 0, responseTime: Math.random() * 10 + 5, weight: 2 },
            3: { online: true, load: 0, responseTime: Math.random() * 10 + 5, weight: 1 }
        };
        this.connectionPaths = []; // 存储连接路径动画

        // 获取演示元素
        this.startBtn = document.getElementById('start-flow');
        this.pauseBtn = document.getElementById('pause-flow');
        this.speedSlider = document.getElementById('flow-speed');
        this.algorithmSelect = document.getElementById('algorithm-select-demo');
        this.clearLogBtn = document.getElementById('clear-log');

        // 绑定事件
        if (this.startBtn) {
            this.startBtn.addEventListener('click', () => this.startDemo());
        }
        if (this.pauseBtn) {
            this.pauseBtn.addEventListener('click', () => this.pauseDemo());
        }
        if (this.speedSlider) {
            this.speedSlider.addEventListener('input', (e) => {
                this.demoSpeed = parseInt(e.target.value);
                if (this.demoRunning) {
                    this.restartDemo();
                }
            });
        }
        if (this.algorithmSelect) {
            this.algorithmSelect.addEventListener('change', (e) => {
                this.currentAlgorithm = e.target.value;
                this.updateAlgorithmDisplay();
                this.resetConnections();
            });
        }
        if (this.clearLogBtn) {
            this.clearLogBtn.addEventListener('click', () => this.clearLog());
        }

        // 初始化服务器状态显示
        this.updateServerStatusDisplay();

        // 初始化显示
        this.updateAlgorithmDisplay();

        // 启动服务器状态更新
        this.startServerStatusUpdate();
    }

    startDemo() {
        if (this.demoRunning) return;

        this.demoRunning = true;
        if (this.startBtn) this.startBtn.textContent = '运行中...';
        if (this.pauseBtn) this.pauseBtn.textContent = '暂停';

        // 显示负载均衡器状态
        this.updateLoadBalancerStatus(true);

        // 开始生成连接
        this.demoInterval = setInterval(() => {
            this.generateConnection();
        }, 2000 / this.demoSpeed);

        this.addLogEntry('🚀 演示开始 - 负载均衡器已启动', 'success');
    }

  pauseDemo() {
        if (!this.demoRunning) return;

        this.demoRunning = false;
        if (this.startBtn) this.startBtn.textContent = '开始演示';
        if (this.pauseBtn) this.pauseBtn.textContent = '暂停';

        if (this.demoInterval) {
            clearInterval(this.demoInterval);
            this.demoInterval = null;
        }

        // 更新负载均衡器状态
        this.updateLoadBalancerStatus(false);

        this.addLogEntry('⏸️ 演示暂停 - 负载均衡器已停止接收新请求', 'info');
    }

  updateLoadBalancerStatus(isActive) {
        const lbNode = document.querySelector('.lb-node');
        const lbHealth = document.getElementById('lb-health');

        if (lbNode) {
            if (isActive) {
                lbNode.classList.add('active');
                lbNode.style.animation = 'lbGlow 2s infinite';
            } else {
                lbNode.classList.remove('active');
                lbNode.style.animation = '';
            }
        }

        if (lbHealth) {
            if (isActive) {
                lbHealth.textContent = '运行中';
                lbHealth.className = 'health-indicator online';
            } else {
                lbHealth.textContent = '已停止';
                lbHealth.className = 'health-indicator warning';
            }
        }
    }

    
    restartDemo() {
        this.pauseDemo();
        setTimeout(() => this.startDemo(), 100);
    }

    generateConnection() {
        const clients = document.querySelectorAll('.client-node');
        const servers = document.querySelectorAll('.server-node');

        if (clients.length === 0 || servers.length === 0) return;

        // 创建真实的请求对象
        const request = {
            id: Date.now() + Math.random(),
            clientId: Math.floor(Math.random() * clients.length) + 1,
            clientIP: `10.0.0.${Math.floor(Math.random() * 254) + 1}`,
            method: Math.random() > 0.8 ? 'POST' : 'GET',
            path: this.getRandomPath(),
            dataSize: Math.floor(Math.random() * 1000 + 100),
            connectionType: Math.random() > 0.7 ? 'HTTPS' : 'HTTP',
            userAgent: this.getRandomUserAgent(),
            timestamp: Date.now(),
            status: 'pending'
        };

        // 根据算法选择服务器（考虑服务器状态）
        const selectedServerId = this.selectServerForRequest(request);
        const server = document.querySelector(`[data-server="${selectedServerId}"]`);

        if (!server || !this.serverStatus[selectedServerId].online) {
            this.failedRequests++;
            this.addLogEntry(`❌ ${request.clientIP} → 🖥️ 无可用服务器 (所有服务器繁忙或离线)`, 'error');
            return;
        }

        // 分配请求到服务器
        request.serverId = selectedServerId;
        request.serverIP = server.querySelector('.server-ip').textContent;
        request.assignedAt = Date.now();

        // 添加到活跃请求
        this.activeRequests.set(request.id, request);
        this.requestQueue.push(request);
        this.requestCounter++;

        // 开始真实的请求处理流程
        this.processRequest(request);

        // 创建可视化效果
        const client = document.querySelector(`[data-client="${request.clientId}"]`);
        if (client) {
            this.createRealConnectionAnimation(client, server, request);
        }

        // 更新统计
        this.updateStats();
        this.updateServerLoad(selectedServerId);
    }

  // 处理请求的完整生命周期
  processRequest(request) {
        const server = this.serverStatus[request.serverId];
        const processingTime = server.responseTime + Math.random() * 20;

        // 阶段1: 请求到达负载均衡器
        this.addLogEntry(`📤 ${request.clientIP} → ⚖️ 负载均衡器 (${request.method} ${request.path})`, 'info');

        // 阶段2: 负载均衡器选择服务器
        setTimeout(() => {
            this.addLogEntry(`⚖️ → 🖥️ 分配到服务器 ${request.serverIP} (${this.getAlgorithmName()})`, 'info');
            this.updateServerProcessing(request.serverId, true);
        }, 200);

        // 阶段3: 服务器处理
        setTimeout(() => {
            const serverElement = document.querySelector(`[data-server="${request.serverId}"]`);
            if (serverElement) {
                this.showServerProcessing(serverElement, '处理中...');
            }

            // 模拟处理时间
            const actualProcessingTime = processingTime * (1 + server.load * 0.1);

            setTimeout(() => {
                this.completeRequest(request, actualProcessingTime);
            }, actualProcessingTime);
        }, 400);
    }

  // 完成请求处理
  completeRequest(request, processingTime) {
        const success = Math.random() > 0.05; // 95% 成功率

        if (success) {
            request.status = 'completed';
            request.completedAt = Date.now();
            request.responseTime = Math.round(processingTime);

            this.successRequests++;
            this.serverConnections[request.serverId]++;

            this.addLogEntry(
                `✅ ${request.clientIP} → 🖥️ ${request.serverIP} (${request.method} ${request.path}) ⚡ ${request.responseTime}ms 📦 ${request.dataSize}KB ${request.connectionType}`,
                'success'
            );

            // 显示成功动画
            const serverElement = document.querySelector(`[data-server="${request.serverId}"]`);
            if (serverElement) {
                this.showServerSuccess(serverElement);
            }
        } else {
            request.status = 'failed';
            request.completedAt = Date.now();

            this.failedRequests++;

            this.addLogEntry(
                `❌ ${request.clientIP} → 🖥️ ${request.serverIP} (服务器处理失败 - 超时)`,
                'error'
            );

            // 显示失败动画
            const serverElement = document.querySelector(`[data-server="${request.serverId}"]`);
            if (serverElement) {
                this.showServerError(serverElement);
            }
        }

        // 从活跃请求中移除
        this.activeRequests.delete(request.id);
        this.updateServerLoad(request.serverId);
        this.updateServerProcessing(request.serverId, false);

        // 更新显示
        this.updateServerDisplay(document.querySelector(`[data-server="${request.serverId}"]`), request.serverId);
    }

  // 根据负载均衡算法选择服务器
  selectServerForRequest(request) {
        const availableServers = [];

        // 收集所有在线的服务器
        Object.keys(this.serverStatus).forEach(serverId => {
            const server = this.serverStatus[serverId];
            if (server.online && server.load < 100) {
                availableServers.push({
                    id: serverId,
                    load: server.load,
                    responseTime: server.responseTime,
                    weight: server.weight,
                    connections: this.serverConnections[serverId]
                });
            }
        });

        if (availableServers.length === 0) {
            return null; // 没有可用服务器
        }

        let selectedServer;

        switch (this.currentAlgorithm) {
            case 'rr': // 轮询
                selectedServer = availableServers[this.requestCounter % availableServers.length];
                break;

            case 'wrr': // 加权轮询
                const weightedServers = [];
                availableServers.forEach(server => {
                    for (let i = 0; i < server.weight; i++) {
                        weightedServers.push(server);
                    }
                });
                selectedServer = weightedServers[this.requestCounter % weightedServers.length];
                break;

            case 'lc': // 最少连接
                selectedServer = availableServers.reduce((min, server) => {
                    return server.connections < min.connections ? server : min;
                });
                break;

            case 'wlc': // 加权最少连接
                selectedServer = availableServers.reduce((best, server) => {
                    const ratio = server.connections / server.weight;
                    const bestRatio = best.connections / best.weight;
                    return ratio < bestRatio ? server : best;
                });
                break;

            case 'sh': // 源地址哈希
                const hash = this.simpleHash(request.clientIP);
                selectedServer = availableServers[hash % availableServers.length];
                break;

            default:
                selectedServer = availableServers[Math.floor(Math.random() * availableServers.length)];
        }

        return selectedServer.id;
    }

  // 获取随机请求路径
  getRandomPath() {
        const paths = [
            '/api/users', '/api/products', '/api/orders', '/api/auth/login',
            '/api/data', '/api/search', '/api/upload', '/api/download',
            '/api/dashboard', '/api/reports', '/api/notifications', '/api/messages'
        ];
        return paths[Math.floor(Math.random() * paths.length)];
    }

  // 获取随机User-Agent
  getRandomUserAgent() {
        const agents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
            'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
            'Mozilla/5.0 (Android 12; Mobile; rv:94.0) Gecko/94.0'
        ];
        return agents[Math.floor(Math.random() * agents.length)];
    }

  // 更新服务器负载
  updateServerLoad(serverId) {
        const server = this.serverStatus[serverId];
        const connections = this.serverConnections[serverId];
        server.load = Math.min(100, connections * 5 + Math.random() * 10);
        server.responseTime = 5 + server.load * 0.2 + Math.random() * 5;
    }

  // 更新服务器状态显示
  updateServerStatusDisplay() {
        Object.keys(this.serverStatus).forEach(serverId => {
            const server = this.serverStatus[serverId];
            const serverElement = document.querySelector(`[data-server="${serverId}"]`);

            if (serverElement) {
                const loadElement = serverElement.querySelector('.load-value');
                const healthDot = serverElement.querySelector('.health-dot');
                const healthText = serverElement.querySelector('.health-text');

                if (loadElement) loadElement.textContent = Math.round(server.load);

                if (healthDot && healthText) {
                    if (server.online) {
                        healthDot.className = 'health-dot online';
                        healthText.textContent = '健康';
                    } else {
                        healthDot.className = 'health-dot offline';
                        healthText.textContent = '离线';
                    }
                }
            }
        });
    }

  // 服务器状态更新
  startServerStatusUpdate() {
        setInterval(() => {
            // 模拟服务器状态变化
            Object.keys(this.serverStatus).forEach(serverId => {
                const server = this.serverStatus[serverId];

                // 随机模拟服务器故障和恢复
                if (Math.random() > 0.98) {
                    server.online = false;
                    this.addLogEntry(`⚠️ 服务器 ${server.querySelector('.server-ip')?.textContent || serverId} 离线`, 'warning');
                } else if (!server.online && Math.random() > 0.9) {
                    server.online = true;
                    this.addLogEntry(`✅ 服务器 ${server.querySelector('.server-ip')?.textContent || serverId} 恢复在线`, 'success');
                }
            });

            this.updateServerStatusDisplay();
        }, 3000);
    }

  // 显示服务器处理状态
  updateServerProcessing(serverId, isProcessing) {
        const serverElement = document.querySelector(`[data-server="${serverId}"]`);
        if (serverElement) {
            if (isProcessing) {
                serverElement.classList.add('processing');
            } else {
                serverElement.classList.remove('processing');
            }
        }
    }

  // 显示服务器处理动画
  showServerProcessing(serverElement, message) {
        const statusElement = serverElement.querySelector('.server-health');
        if (statusElement) {
            const originalContent = statusElement.innerHTML;
            statusElement.innerHTML = `<span class="processing-indicator">⚡</span> ${message}`;

            setTimeout(() => {
                statusElement.innerHTML = originalContent;
            }, 2000);
        }
  }

  // 显示服务器成功状态
  showServerSuccess(serverElement) {
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
            font-size: 14px;
            animation: successBounce 0.6s ease-out forwards;
            z-index: 10;
        `;
        serverElement.appendChild(successIndicator);

        setTimeout(() => {
            if (successIndicator.parentNode) {
                successIndicator.remove();
            }
        }, 2000);
  }

  // 显示服务器错误状态
  showServerError(serverElement) {
        const errorIndicator = document.createElement('div');
        errorIndicator.innerHTML = '✗';
        errorIndicator.style.cssText = `
            position: absolute;
            top: -10px;
            right: -10px;
            background: var(--color-error);
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 14px;
            animation: errorShake 0.6s ease-out forwards;
            z-index: 10;
        `;
        serverElement.appendChild(errorIndicator);

        setTimeout(() => {
            if (errorIndicator.parentNode) {
                errorIndicator.remove();
            }
        }, 2000);
  }

    createRealConnectionAnimation(fromClient, toServer, request) {
        // 创建数据包动画
        const fromRect = fromClient.getBoundingClientRect();
        const toRect = toServer.getBoundingClientRect();

        // 创建多个数据包
        const packetCount = Math.ceil(request.dataSize / 100); // 每100KB一个包
        const packets = [];

        for (let i = 0; i < packetCount; i++) {
            setTimeout(() => {
                const packet = this.createDataPacket(fromRect, toRect, request, i, packetCount);
                packets.push(packet);
            }, i * 100); // 每100ms发送一个包
        }

        // 创建连接线
        this.createConnectionLine(fromRect, toRect, request);
    }

  createDataPacket(fromRect, toRect, request, packetIndex, totalPackets) {
        const packet = document.createElement('div');
        packet.className = 'data-packet';
        packet.innerHTML = `
            <div class="packet-content">
                <div class="packet-icon">📦</div>
                <div class="packet-info">
                    <div class="packet-method">${request.method}</div>
                    <div class="packet-size">${Math.min(100, request.dataSize - packetIndex * 100)}KB</div>
                </div>
            </div>
        `;

        packet.style.cssText = `
            position: fixed;
            width: 60px;
            height: 40px;
            background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
            border: 2px solid rgba(255, 255, 255, 0.8);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            pointer-events: none;
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.6);
            transform: translate(-50%, -50%);
        `;

        document.body.appendChild(packet);

        // 获取负载均衡器的实际位置
        const lbNode = document.querySelector('.lb-node');
        const lbRect = lbNode ? lbNode.getBoundingClientRect() : null;

        // 计算准确的路径点
        const startX = fromRect.left + fromRect.width / 2;
        const startY = fromRect.top + fromRect.height / 2;
        const endX = toRect.left + toRect.width / 2;
        const endY = toRect.top + toRect.height / 2;

        // 使用负载均衡器的实际位置，如果找不到则使用估算位置
        let lbX, lbY;
        if (lbRect) {
            lbX = lbRect.left + lbRect.width / 2;
            lbY = lbRect.top + lbRect.height / 2;
        } else {
            // 回退到计算负载均衡器位置
            const flowDiagram = document.querySelector('.flow-diagram');
            if (flowDiagram) {
                const diagramRect = flowDiagram.getBoundingClientRect();
                lbX = diagramRect.left + diagramRect.width / 2;
                lbY = diagramRect.top + diagramRect.height / 2;
            } else {
                lbX = window.innerWidth / 2;
                lbY = startY - 150;
            }
        }

        const duration = 1500;
        const startTime = performance.now();

        const animatePacket = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // 使用贝塞尔曲线创建平滑的三阶段路径
            let x, y;

            if (progress < 0.35) {
                // 阶段1: 客户端到负载均衡器 (35%的时间)
                const t = progress / 0.35;
                x = startX + (lbX - startX) * t;
                y = startY + (lbY - startY) * t - Math.sin(t * Math.PI) * 30; // 添加弧形效果
            } else if (progress < 0.5) {
                // 阶段2: 在负载均衡器处理 (15%的时间)
                const t = (progress - 0.35) / 0.15;
                x = lbX;
                y = lbY;
                packet.style.transform = `translate(-50%, -50%) scale(${1 + t * 0.3})`; // 在负载均衡器处放大
            } else {
                // 阶段3: 负载均衡器到服务器 (50%的时间)
                const t = (progress - 0.5) / 0.5;
                x = lbX + (endX - lbX) * t;
                y = lbY + (endY - lbY) * t + Math.sin(t * Math.PI) * 20; // 添加弧形效果
                packet.style.transform = `translate(-50%, -50%) scale(${1.3 - t * 0.3})`; // 恢复大小
            }

            packet.style.left = x + 'px';
            packet.style.top = y + 'px';

            // 添加旋转效果
            const rotation = progress * 360;
            packet.style.transform += ` rotate(${rotation}deg)`;

            // 渐隐效果
            if (progress > 0.9) {
                packet.style.opacity = (1 - progress) / 0.1;
            }

            if (progress < 1) {
                requestAnimationFrame(animatePacket);
            } else {
                if (packet.parentNode) {
                    document.body.removeChild(packet);
                }
            }
        };

        requestAnimationFrame(animatePacket);

        return packet;
    }

  createConnectionLine(fromRect, toRect, request) {
        const svg = document.getElementById('flow-connections');
        if (!svg) return;

        // 获取SVG容器的位置，用于坐标转换
        const svgRect = svg.getBoundingClientRect();

        // 获取准确的坐标点（转换为SVG相对坐标）
        const startX = fromRect.left + fromRect.width / 2 - svgRect.left;
        const startY = fromRect.top + fromRect.height / 2 - svgRect.top;
        const endX = toRect.left + toRect.width / 2 - svgRect.left;
        const endY = toRect.top + toRect.height / 2 - svgRect.top;

        // 获取负载均衡器的实际位置
        const lbNode = document.querySelector('.lb-node');
        let lbX, lbY;

        if (lbNode) {
            const lbRect = lbNode.getBoundingClientRect();
            lbX = lbRect.left + lbRect.width / 2 - svgRect.left;
            lbY = lbRect.top + lbRect.height / 2 - svgRect.top;
        } else {
            // 回退到计算位置
            const flowDiagram = document.querySelector('.flow-diagram');
            if (flowDiagram) {
                const diagramRect = flowDiagram.getBoundingClientRect();
                lbX = diagramRect.left + diagramRect.width / 2 - svgRect.left;
                lbY = diagramRect.top + diagramRect.height / 2 - svgRect.top;
            } else {
                lbX = svgRect.width / 2;
                lbY = startY - 150;
            }
        }

        // 创建两段式连接线：客户端 -> 负载均衡器 -> 服务器
        const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');

        // 第一段：客户端到负载均衡器（使用二次贝塞尔曲线）
        const control1X = (startX + lbX) / 2;
        const control1Y = Math.min(startY, lbY) - 30;
        const d1 = `M ${startX} ${startY} Q ${control1X} ${control1Y} ${lbX} ${lbY}`;

        // 第二段：负载均衡器到服务器
        const control2X = (lbX + endX) / 2;
        const control2Y = Math.min(lbY, endY) - 25;
        const d2 = `M ${lbX} ${lbY} Q ${control2X} ${control2Y} ${endX} ${endY}`;

        // 设置第一条路径属性
        path1.setAttribute('d', d1);
        path1.setAttribute('stroke', request.connectionType === 'HTTPS' ? '#10b981' : '#3b82f6');
        path1.setAttribute('stroke-width', '2');
        path1.setAttribute('fill', 'none');
        path1.setAttribute('stroke-dasharray', '6,3');
        path1.setAttribute('opacity', '0.6');

        // 设置第二条路径属性
        path2.setAttribute('d', d2);
        path2.setAttribute('stroke', request.connectionType === 'HTTPS' ? '#10b981' : '#3b82f6');
        path2.setAttribute('stroke-width', '2');
        path2.setAttribute('fill', 'none');
        path2.setAttribute('stroke-dasharray', '6,3');
        path2.setAttribute('opacity', '0.6');

        svg.appendChild(path1);
        svg.appendChild(path2);

        // 添加负载均衡器位置标记
        const lbMarker = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        lbMarker.setAttribute('cx', lbX);
        lbMarker.setAttribute('cy', lbY);
        lbMarker.setAttribute('r', '5');
        lbMarker.setAttribute('fill', request.connectionType === 'HTTPS' ? '#10b981' : '#3b82f6');
        lbMarker.setAttribute('opacity', '0.8');
        lbMarker.setAttribute('stroke', 'white');
        lbMarker.setAttribute('stroke-width', '2');
        svg.appendChild(lbMarker);

        // 添加动画效果
        path1.innerHTML = `<animate attributeName="stroke-dashoffset" from="9" to="0" dur="1s" repeatCount="indefinite"/>`;
        path2.innerHTML = `<animate attributeName="stroke-dashoffset" from="9" to="0" dur="1s" begin="0.5s" repeatCount="indefinite"/>`;

        // 3秒后移除连接线
        setTimeout(() => {
            [path1, path2, lbMarker].forEach(element => {
                if (element.parentNode) {
                    element.remove();
                }
            });
        }, 3000);
    }

    createTrail(startX, startY, endX, endY) {
        const trailCount = 5;
        for (let i = 0; i < trailCount; i++) {
            setTimeout(() => {
                const trail = document.createElement('div');
                trail.style.cssText = `
                    position: fixed;
                    width: 4px;
                    height: 4px;
                    background: var(--color-primary);
                    border-radius: 50%;
                    z-index: 999;
                    pointer-events: none;
                `;

                document.body.appendChild(trail);

                const delay = i * 100;
                const duration = 400;

                setTimeout(() => {
                    let progress = 0;
                    const trailStart = performance.now();

                    const animateTrail = () => {
                        progress += 16 / duration;
                        if (progress <= 1) {
                            const t = progress;
                            const controlX = (startX + endX) / 2;
                            const controlY = Math.min(startY, endY) - 50;

                            const x = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * controlX + t * t * endX;
                            const y = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * controlY + t * t * endY;

                            trail.style.left = x - 2 + 'px';
                            trail.style.top = y - 2 + 'px';
                            trail.style.opacity = 1 - progress;

                            requestAnimationFrame(animateTrail);
                        } else {
                            document.body.removeChild(trail);
                        }
                    };

                    requestAnimationFrame(animateTrail);
                }, delay);
            }, i * 50);
        }
    }

    selectServer(clientId) {
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
    }

    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    }

    getAlgorithmName() {
        const names = {
            'rr': '轮询',
            'wrr': '加权轮询',
            'lc': '最少连接',
            'wlc': '加权最少连接',
            'sh': '源地址哈希'
        };
        return names[this.currentAlgorithm] || '未知';
    }

    updateAlgorithmDisplay() {
        const algorithmDisplay = document.getElementById('current-algorithm');
        if (algorithmDisplay) {
            algorithmDisplay.textContent = this.getAlgorithmName();
        }
    }

    updateStats() {
        // 更新总请求数 - 使用动画效果
        const totalRequests = document.getElementById('total-requests');
        if (totalRequests) {
            this.animateValue(totalRequests, this.requestCounter);
        }

        // 更新每秒请求数（基于实际速度）
        const requestsPerSec = document.getElementById('requests-per-sec');
        if (requestsPerSec) {
            const actualRPS = this.demoRunning ? this.demoSpeed : 0;
            this.animateValue(requestsPerSec, actualRPS, 'requests/sec');
        }

        // 更新活跃连接数（基于真实活跃请求）
        const activeConnections = document.getElementById('active-connections');
        if (activeConnections) {
            const activeCount = this.activeRequests.size;
            this.animateValue(activeConnections, activeCount, 'connections');
        }

        // 计算真实平均响应时间
        const avgResponseTime = document.getElementById('avg-response-time');
        if (avgResponseTime && this.requestCounter > 0) {
            const completedRequests = this.successRequests + this.failedRequests;
            if (completedRequests > 0) {
                // 基于服务器负载计算平均响应时间
                let totalResponseTime = 0;
                let serverCount = 0;
                Object.keys(this.serverStatus).forEach(serverId => {
                    const server = this.serverStatus[serverId];
                    if (server.online) {
                        totalResponseTime += server.responseTime * (1 + server.load * 0.1);
                        serverCount++;
                    }
                });

                const avgTime = serverCount > 0 ? Math.round(totalResponseTime / serverCount) : 0;
                avgResponseTime.textContent = avgTime + 'ms';
            }
        }

        // 更新成功率（基于真实成功/失败统计）
        const successRate = document.getElementById('success-rate');
        if (successRate && this.requestCounter > 0) {
            const totalCompleted = this.successRequests + this.failedRequests;
            const rate = totalCompleted > 0 ? Math.round((this.successRequests / totalCompleted) * 100) : 100;
            successRate.textContent = rate + '%';

            // 根据成功率改变颜色
            if (rate >= 95) {
                successRate.style.color = 'var(--color-success)';
            } else if (rate >= 90) {
                successRate.style.color = 'var(--color-warning)';
            } else {
                successRate.style.color = 'var(--color-error)';
            }
        }

        // 更新负载数据传输统计
        this.updateTransferStats();
    }

  updateTransferStats() {
        // 更新数据传输量（如果存在相关元素）
        const dataTransferred = document.getElementById('data-transferred');
        if (dataTransferred) {
            const totalData = Object.values(this.activeRequests).reduce((sum, request) => {
                return sum + (request.dataSize || 0);
            }, 0);
            dataTransferred.textContent = this.formatDataSize(totalData);
        }
    }

  formatDataSize(bytes) {
        if (bytes < 1024) return bytes + 'B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'KB';
        return (bytes / (1024 * 1024)).toFixed(1) + 'MB';
    }

    animateValue(element, targetValue) {
        const currentValue = parseInt(element.textContent) || 0;
        const difference = targetValue - currentValue;
        const duration = 300;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // 使用 easeOutQuart 缓动函数
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValueAnimated = currentValue + (difference * easeOutQuart);

            element.textContent = Math.floor(currentValueAnimated);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    updateServerDisplay(server, serverId) {
        // 更新连接数
        const connectionCount = server.querySelector('.connection-count');
        if (connectionCount) {
            connectionCount.textContent = this.serverConnections[serverId];
        }

        // 更新负载
        const loadValue = server.querySelector('.load-value');
        if (loadValue) {
            const load = Math.min(100, this.serverConnections[serverId] * 10);
            loadValue.textContent = load;
        }
    }

    resetConnections() {
        // 清理所有活跃请求
        this.activeRequests.clear();
        this.requestQueue = [];

        // 重置连接计数
        this.serverConnections = { 1: 0, 2: 0, 3: 0 };
        this.requestCounter = 0;
        this.successRequests = 0;
        this.failedRequests = 0;

        // 重置服务器状态
        Object.keys(this.serverStatus).forEach(serverId => {
            this.serverStatus[serverId] = {
                online: true,
                load: 0,
                responseTime: Math.random() * 10 + 5,
                weight: this.serverStatus[serverId].weight
            };
        });

        // 清理所有动画元素
        document.querySelectorAll('.data-packet').forEach(el => el.remove());
        const svg = document.getElementById('flow-connections');
        if (svg) {
            svg.innerHTML = '';
        }

        // 重置所有服务器显示
        document.querySelectorAll('.server-node').forEach(server => {
            server.classList.remove('processing', 'selected');
            const connectionCount = server.querySelector('.connection-count');
            const loadValue = server.querySelector('.load-value');
            if (connectionCount) connectionCount.textContent = '0';
            if (loadValue) loadValue.textContent = '0';
        });

        // 重置统计显示
        const totalRequests = document.getElementById('total-requests');
        const requestsPerSec = document.getElementById('requests-per-sec');
        const avgResponseTime = document.getElementById('avg-response-time');
        const successRate = document.getElementById('success-rate');
        const activeConnections = document.getElementById('active-connections');

        if (totalRequests) totalRequests.textContent = '0';
        if (requestsPerSec) requestsPerSec.textContent = '0';
        if (avgResponseTime) avgResponseTime.textContent = '0ms';
        if (successRate) {
            successRate.textContent = '100%';
            successRate.style.color = 'var(--color-success)';
        }
        if (activeConnections) activeConnections.textContent = '0';

        this.updateServerStatusDisplay();

        // 添加重置日志
        this.addLogEntry('🔄 系统已重置，准备开始新的演示', 'info');
    }

    addLogEntry(message, type = 'info') {
        const logContainer = document.getElementById('request-log-container');
        if (!logContainer) return;

        // 移除占位符
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
        const maxLogs = 20;
        const logs = logContainer.querySelectorAll('.log-entry');
        if (logs.length > maxLogs) {
            logs[0].remove();
        }

        // 自动滚动到底部
        logContainer.scrollTop = logContainer.scrollHeight;
    }

    clearLog() {
        const logContainer = document.getElementById('request-log-container');
        if (logContainer) {
            logContainer.innerHTML = `
                <div class="log-entry placeholder">
                    <span class="log-time">--:--:--</span>
                    <span class="log-message">等待请求...</span>
                </div>
            `;
        }
    }

    initConfigGenerator() {
        this.generateBtn = document.getElementById('generate-config');
        this.downloadBtn = document.getElementById('download-config');
        this.copyBtn = document.getElementById('copy-config');
        this.addServerBtn = document.getElementById('add-backend-server');
        this.currentConfigFormat = 'yaml';
        this.configText = '';

        // 绑定事件
        if (this.generateBtn) {
            this.generateBtn.addEventListener('click', () => this.generateConfig());
        }
        if (this.downloadBtn) {
            this.downloadBtn.addEventListener('click', () => this.downloadConfig());
        }
        if (this.copyBtn) {
            this.copyBtn.addEventListener('click', () => this.copyConfig());
        }
        if (this.addServerBtn) {
            this.addServerBtn.addEventListener('click', () => this.addServerInput());
        }

        // 格式切换
        const formatTabs = document.querySelectorAll('.format-tab');
        formatTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchConfigFormat(e.target.dataset.format);
            });
        });
    }

    generateConfig() {
        const config = {
            vip: document.getElementById('vip-input')?.value || '192.168.1.100',
            port: parseInt(document.getElementById('port-input')?.value) || 80,
            algorithm: document.getElementById('algorithm-select')?.value || 'rr',
            healthCheck: {
                interval: parseInt(document.getElementById('check-interval')?.value) || 5,
                timeout: parseInt(document.getElementById('check-timeout')?.value) || 3,
                retries: parseInt(document.getElementById('retries')?.value) || 3
            },
            backendServers: []
        };

        // 收集后端服务器信息
        const serverGroups = document.querySelectorAll('.server-input-group');
        serverGroups.forEach(group => {
            const ip = group.querySelector('.server-ip')?.value;
            const port = parseInt(group.querySelector('.server-port')?.value) || 80;
            const weight = parseInt(group.querySelector('.server-weight')?.value) || 100;

            if (ip) {
                config.backendServers.push({ ip, port, weight });
            }
        });

        // 生成配置文本
        this.configText = this.formatConfig(config);
        this.displayConfig(this.configText);

        this.showNotification('配置生成成功', '已生成 LVSCare 配置文件', 'success');
    }

    formatConfig(config) {
        switch (this.currentConfigFormat) {
            case 'yaml':
                return this.formatToYaml(config);
            case 'json':
                return this.formatToJSON(config);
            case 'shell':
                return this.formatToShell(config);
            default:
                return this.formatToYaml(config);
        }
    }

    formatToYaml(config) {
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
    }

    formatToJSON(config) {
        return JSON.stringify(config, null, 2);
    }

    formatToShell(config) {
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
    }

    displayConfig(configText) {
        const preview = document.getElementById('config-preview');
        if (preview) {
            preview.textContent = configText;
        }
    }

    downloadConfig() {
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
    }

    copyConfig() {
        if (!this.configText) {
            this.showNotification('错误', '请先生成配置', 'error');
            return;
        }

        navigator.clipboard.writeText(this.configText).then(() => {
            this.showNotification('复制成功', '配置已复制到剪贴板', 'success');
        }).catch(() => {
            this.showNotification('复制失败', '无法复制到剪贴板', 'error');
        });
    }

    addServerInput() {
        const container = document.getElementById('backend-servers');
        if (!container) return;

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
    }

    updateServerInputButtons() {
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
    }

    switchConfigFormat(format) {
        this.currentConfigFormat = format;

        // 更新标签状态
        document.querySelectorAll('.format-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-format="${format}"]`).classList.add('active');

        // 重新生成配置
        if (this.configText) {
            const config = {
                vip: document.getElementById('vip-input')?.value || '192.168.1.100',
                port: parseInt(document.getElementById('port-input')?.value) || 80,
                algorithm: document.getElementById('algorithm-select')?.value || 'rr',
                healthCheck: {
                    interval: parseInt(document.getElementById('check-interval')?.value) || 5,
                    timeout: parseInt(document.getElementById('check-timeout')?.value) || 3,
                    retries: parseInt(document.getElementById('retries')?.value) || 3
                },
                backendServers: []
            };

            const serverGroups = document.querySelectorAll('.server-input-group');
            serverGroups.forEach(group => {
                const ip = group.querySelector('.server-ip')?.value;
                const port = parseInt(group.querySelector('.server-port')?.value) || 80;
                const weight = parseInt(group.querySelector('.server-weight')?.value) || 100;

                if (ip) {
                    config.backendServers.push({ ip, port, weight });
                }
            });

            this.configText = this.formatConfig(config);
            this.displayConfig(this.configText);
        }
    }

    showNotification(title, message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' :
                        type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 16px;
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
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
    }
}

// ============================================
// 全局初始化
// ============================================
let app;

// DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🌟 DOM Content Loaded');

    try {
        app = new SimpleSealgwApp();
        await app.init();

        // 显示加载完成提示
        console.log('🎉 Sealgw ready!');

    } catch (error) {
        console.error('❌ Failed to initialize app:', error);

        // 确保页面内容可见
        document.body.style.opacity = '1';

        // 显示简单的错误信息
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #ef4444;
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 10000;
        `;
        errorDiv.textContent = '部分功能可能无法正常工作';
        document.body.appendChild(errorDiv);

        // 3秒后移除
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 3000);
    }
});

// 导出给全局使用
window.SealgwApp = app;