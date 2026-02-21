// ==================== 书签导航系统 - Cloudflare Worker 版本 ====================
// 完整功能版，包含主页、管理后台、法律页面、API接口和静态资源服务

// 主请求处理函数 - 注意：整个文件中只有一个 handleRequest 函数
async function handleRequest(request, env, ctx) {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;
  
  // 设置 CORS 头部
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };
  
  // 处理预检请求
  if (method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }
  
  // 路由分发
  try {
    // 主页路由
    if (path === '/' || path === '/index.html' || path === '/index') {
      return renderHomePage();
    }
    
    // 管理员页面路由
    if (path === '/admin' || path === '/admin.html') {
      return renderAdminPage();
    }
    
    // 法律页面路由
    if (path === '/privacy' || path === '/privacy.html') {
      return renderPrivacyPage();
    }
    
    if (path === '/terms' || path === '/terms.html') {
      return renderTermsPage();
    }
    
    if (path === '/disclaimer' || path === '/disclaimer.html') {
      return renderDisclaimerPage();
    }
    
    // 静态资源路由
    if (path === '/styles.css') {
      return new Response(getStylesCSS(), {
        headers: { 
          'Content-Type': 'text/css; charset=utf-8',
          ...corsHeaders
        }
      });
    }
    
    if (path === '/i18n.js') {
      return new Response(getI18nJS(), {
        headers: { 
          'Content-Type': 'application/javascript; charset=utf-8',
          ...corsHeaders
        }
      });
    }
    
    if (path === '/script.js') {
      return new Response(getScriptJS(), {
        headers: { 
          'Content-Type': 'application/javascript; charset=utf-8',
          ...corsHeaders
        }
      });
    }
    
    // API 路由
    if (path.startsWith('/api/')) {
      return handleApiRoutes(request, env, ctx, path, method, url);
    }
    
    // 默认返回 404 页面
    return renderNotFoundPage();
    
  } catch (error) {
    console.error('处理请求时出错:', error);
    return renderErrorPage(error.message);
  }
}

// ==================== 页面渲染函数 ====================
function renderHomePage() {
  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>书签导航 - 发现优质网站</title>
    <link rel="stylesheet" href="/styles.css">
    <script src="/i18n.js"></script>
    <script src="/script.js" defer></script>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f5f7;
            color: #1d1d1f;
        }
        
        .navbar {
            background: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .logo {
            font-size: 1.8rem;
            font-weight: bold;
            color: #007bff;
            text-decoration: none;
        }
        
        .nav-links {
            display: flex;
            gap: 2rem;
            align-items: center;
        }
        
        .nav-links a {
            color: #1d1d1f;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s;
        }
        
        .nav-links a:hover {
            color: #007bff;
        }
        
        .lang-select {
            padding: 0.5rem;
            border: 1px solid #ddd;
            border-radius: 6px;
            background: white;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .hero {
            text-align: center;
            padding: 4rem 1rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 20px;
            color: white;
            margin-bottom: 3rem;
        }
        
        .hero h1 {
            font-size: 3.5rem;
            margin-bottom: 1rem;
        }
        
        .hero p {
            font-size: 1.2rem;
            opacity: 0.9;
            max-width: 600px;
            margin: 0 auto 2rem;
        }
        
        .stats {
            display: flex;
            justify-content: center;
            gap: 3rem;
            margin-top: 2rem;
        }
        
        .stat {
            text-align: center;
        }
        
        .stat-number {
            font-size: 2.5rem;
            font-weight: bold;
            display: block;
        }
        
        .stat-label {
            font-size: 0.9rem;
            opacity: 0.8;
        }
        
        .section {
            margin: 4rem 0;
        }
        
        .section-title {
            font-size: 2rem;
            margin-bottom: 2rem;
            color: #1d1d1f;
        }
        
        .card-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }
        
        .card {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 30px rgba(0,0,0,0.15);
        }
        
        .card-image {
            height: 180px;
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 3rem;
        }
        
        .card-content {
            padding: 1.5rem;
        }
        
        .card-title {
            margin: 0 0 0.5rem 0;
            font-size: 1.3rem;
        }
        
        .card-desc {
            color: #666;
            margin: 0 0 1rem 0;
            line-height: 1.5;
        }
        
        .card-actions {
            display: flex;
            gap: 1rem;
        }
        
        .btn {
            padding: 0.5rem 1rem;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s;
            display: inline-block;
        }
        
        .btn-primary {
            background: #007bff;
            color: white;
        }
        
        .btn-primary:hover {
            background: #0056b3;
        }
        
        .btn-secondary {
            background: #f8f9fa;
            color: #1d1d1f;
            border: 1px solid #dee2e6;
        }
        
        .btn-secondary:hover {
            background: #e9ecef;
        }
        
        .submit-form {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            max-width: 600px;
            margin: 0 auto;
        }
        
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        .form-label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
        }
        
        .form-input {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 1rem;
            box-sizing: border-box;
        }
        
        .form-input:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
        }
        
        .submit-btn {
            width: 100%;
            padding: 1rem;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.3s;
        }
        
        .submit-btn:hover {
            background: #0056b3;
        }
        
        .form-hint {
            text-align: center;
            color: #666;
            font-size: 0.9rem;
            margin-top: 1rem;
        }
        
        .footer {
            text-align: center;
            padding: 3rem 1rem;
            color: #666;
            border-top: 1px solid #eee;
            margin-top: 4rem;
        }
        
        .footer-links {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin-bottom: 1.5rem;
        }
        
        .footer-link {
            color: #666;
            text-decoration: none;
            transition: color 0.3s;
        }
        
        .footer-link:hover {
            color: #007bff;
        }
        
        .copyright {
            font-size: 0.9rem;
            opacity: 0.7;
        }
        
        .loading {
            text-align: center;
            padding: 3rem;
            color: #666;
        }
        
        .error {
            color: #dc3545;
            background: #fff5f5;
            padding: 1rem;
            border-radius: 6px;
            margin: 1rem 0;
        }
        
        @media (max-width: 768px) {
            .navbar {
                flex-direction: column;
                gap: 1rem;
            }
            
            .nav-links {
                flex-wrap: wrap;
                justify-content: center;
            }
            
            .hero h1 {
                font-size: 2.5rem;
            }
            
            .stats {
                flex-direction: column;
                gap: 1.5rem;
            }
            
            .card-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <!-- 导航栏 -->
    <nav class="navbar">
        <a href="/" class="logo">书签导航</a>
        <div class="nav-links">
            <a href="/">首页</a>
            <a href="#features">功能</a>
            <a href="#submit">提交</a>
            <a href="/privacy">隐私政策</a>
            <a href="/terms">服务条款</a>
            <a href="/disclaimer">免责声明</a>
            <a href="/admin">管理后台</a>
            <select id="language-select" class="lang-select" onchange="changeLang(this.value)">
                <option value="zh">中文</option>
                <option value="en">English</option>
                <option value="ja">日本語</option>
            </select>
        </div>
    </nav>
    
    <!-- 主内容区 -->
    <main class="container">
        <!-- 英雄区域 -->
        <section class="hero">
            <h1>发现优质网站资源</h1>
            <p>一个由社区驱动的书签导航平台，收录各类优质网站，支持多语言访问。</p>
            <div class="stats">
                <div class="stat">
                    <span class="stat-number" id="total-sites">0</span>
                    <span class="stat-label">收录网站</span>
                </div>
                <div class="stat">
                    <span class="stat-number">6</span>
                    <span class="stat-label">支持语言</span>
                </div>
                <div class="stat">
                    <span class="stat-number">24/7</span>
                    <span class="stat-label">在线服务</span>
                </div>
            </div>
        </section>
        
        <!-- 功能特性 -->
        <section class="section" id="features">
            <h2 class="section-title">平台特性</h2>
            <div class="card-grid">
                <div class="card">
                    <div class="card-image">🌐</div>
                    <div class="card-content">
                        <h3 class="card-title">多语言支持</h3>
                        <p class="card-desc">支持中文、英文、日文等多种语言，全球用户无障碍使用。</p>
                    </div>
                </div>
                <div class="card">
                    <div class="card-image">🚀</div>
                    <div class="card-content">
                        <h3 class="card-title">快速部署</h3>
                        <p class="card-desc">基于Cloudflare Workers，全球CDN加速，访问速度快。</p>
                    </div>
                </div>
                <div class="card">
                    <div class="card-image">🔒</div>
                    <div class="card-content">
                        <h3 class="card-title">安全可靠</h3>
                        <p class="card-desc">所有内容经过人工审核，确保网站安全可靠。</p>
                    </div>
                </div>
                <div class="card">
                    <div class="card-image">📱</div>
                    <div class="card-content">
                        <h3 class="card-title">响应式设计</h3>
                        <p class="card-desc">适配各种设备，手机、平板、电脑都能完美显示。</p>
                    </div>
                </div>
            </div>
        </section>
        
        <!-- 网站展示 -->
        <section class="section">
            <h2 class="section-title">热门推荐</h2>
            <div class="card-grid" id="sites-container">
                <div class="loading">正在加载网站数据...</div>
            </div>
        </section>
        
        <!-- 提交表单 -->
        <section class="section" id="submit">
            <h2 class="section-title">提交新网站</h2>
            <div class="submit-form">
                <div class="form-group">
                    <label class="form-label">网站名称</label>
                    <input type="text" class="form-input" id="site-name" placeholder="请输入网站名称" required>
                </div>
                <div class="form-group">
                    <label class="form-label">网站地址</label>
                    <input type="url" class="form-input" id="site-url" placeholder="https://example.com" required>
                </div>
                <div class="form-group">
                    <label class="form-label">网站描述</label>
                    <textarea class="form-input" id="site-desc" placeholder="请简要描述网站内容" rows="3"></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">分类</label>
                    <select class="form-input" id="site-category" required>
                        <option value="">请选择分类</option>
                        <option value="工具">工具</option>
                        <option value="娱乐">娱乐</option>
                        <option value="学习">学习</option>
                        <option value="资源">资源</option>
                        <option value="其他">其他</option>
                    </select>
                </div>
                <button class="submit-btn" id="submit-btn">提交网站</button>
                <p class="form-hint">提交后需要管理员审核，通过后会显示在网站上</p>
            </div>
        </section>
    </main>
    
    <!-- 页脚 -->
    <footer class="footer">
        <div class="footer-links">
            <a href="/privacy" class="footer-link">隐私政策</a>
            <a href="/terms" class="footer-link">服务条款</a>
            <a href="/disclaimer" class="footer-link">免责声明</a>
            <a href="/admin" class="footer-link">管理后台</a>
        </div>
        <p class="copyright">&copy; 2024 书签导航. 保留所有权利.</p>
        <p class="copyright" id="current-date"></p>
    </footer>
    
    <script>
        // 页面加载完成后执行
        document.addEventListener('DOMContentLoaded', function() {
            // 初始化语言
            if (typeof initLanguage === 'function') {
                initLanguage();
            }
            
            // 设置当前日期
            const now = new Date();
            document.getElementById('current-date').textContent = 
                '最后更新: ' + now.toLocaleDateString('zh-CN');
            
            // 加载网站数据
            loadSites();
            
            // 绑定提交事件
            document.getElementById('submit-btn').addEventListener('click', submitSite);
            
            // 加载提示
            console.log('书签导航系统已加载');
        });
        
        // 加载网站数据
        async function loadSites() {
            try {
                const response = await fetch('/api/config?page=1&pageSize=6');
                const data = await response.json();
                
                if (data.code === 200 && data.data && data.data.length > 0) {
                    renderSites(data.data);
                    document.getElementById('total-sites').textContent = data.total || data.data.length;
                } else {
                    showDefaultSites();
                }
            } catch (error) {
                console.error('加载网站数据失败:', error);
                showDefaultSites();
            }
        }
        
        // 渲染网站卡片
        function renderSites(sites) {
            const container = document.getElementById('sites-container');
            container.innerHTML = '';
            
            sites.forEach(site => {
                const card = document.createElement('div');
                card.className = 'card';
                
                // 生成随机颜色
                const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe'];
                const color = colors[Math.floor(Math.random() * colors.length)];
                
                card.innerHTML = \`
                    <div class="card-image" style="background: \${color}">
                        \${site.logo ? 
                            '<img src="' + site.logo + '" alt="' + site.name + '" style="width: 60px; height: 60px; border-radius: 8px;">' : 
                            '<span style="font-size: 3rem;">' + (site.name.charAt(0) || '🔗') + '</span>'
                        }
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">\${escapeHTML(site.name)}</h3>
                        <p class="card-desc">\${escapeHTML(site.desc || '暂无描述')}</p>
                        <div class="card-actions">
                            <a href="\${escapeHTML(site.url)}" target="_blank" class="btn btn-primary">访问网站</a>
                            <button class="btn btn-secondary" onclick="copyLink('\${escapeHTML(site.url)}')">复制链接</button>
                        </div>
                    </div>
                \`;
                
                container.appendChild(card);
            });
        }
        
        // 显示默认网站（当API不可用时）
        function showDefaultSites() {
            const defaultSites = [
                {
                    name: '示例网站1',
                    url: 'https://example.com',
                    desc: '这是一个示例网站，用于演示功能',
                    logo: null
                },
                {
                    name: '示例网站2',
                    url: 'https://example.org',
                    desc: '另一个示例网站',
                    logo: null
                }
            ];
            
            renderSites(defaultSites);
            document.getElementById('total-sites').textContent = '2';
        }
        
        // 提交新网站
        async function submitSite() {
            const name = document.getElementById('site-name').value.trim();
            const url = document.getElementById('site-url').value.trim();
            const desc = document.getElementById('site-desc').value.trim();
            const category = document.getElementById('site-category').value;
            
            // 验证输入
            if (!name) {
                alert('请输入网站名称');
                return;
            }
            
            if (!url) {
                alert('请输入网站地址');
                return;
            }
            
            if (!category) {
                alert('请选择分类');
                return;
            }
            
            // 验证URL格式
            try {
                new URL(url);
            } catch (error) {
                alert('请输入有效的网址（以 http:// 或 https:// 开头）');
                return;
            }
            
            const siteData = {
                name: name,
                url: url,
                desc: desc || null,
                catelog: category,
                logo: null
            };
            
            const submitBtn = document.getElementById('submit-btn');
            submitBtn.disabled = true;
            submitBtn.textContent = '提交中...';
            
            try {
                const response = await fetch('/api/config/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(siteData)
                });
                
                const result = await response.json();
                
                if (result.code === 201) {
                    alert('提交成功！等待管理员审核。');
                    // 清空表单
                    document.getElementById('site-name').value = '';
                    document.getElementById('site-url').value = '';
                    document.getElementById('site-desc').value = '';
                    document.getElementById('site-category').value = '';
                    
                    // 重新加载网站列表
                    loadSites();
                } else {
                    alert('提交失败: ' + (result.message || '未知错误'));
                }
            } catch (error) {
                console.error('提交失败:', error);
                alert('提交失败，请检查网络连接后重试');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = '提交网站';
            }
        }
        
        // 复制链接到剪贴板
        function copyLink(url) {
            navigator.clipboard.writeText(url).then(() => {
                alert('链接已复制到剪贴板！');
            }).catch(() => {
                // 降级方案
                const textarea = document.createElement('textarea');
                textarea.value = url;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                alert('链接已复制！');
            });
        }
        
        // HTML转义
        function escapeHTML(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
    </script>
</body>
</html>`;
  
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'max-age=3600'
    }
  });
}

// 管理员页面
function renderAdminPage() {
  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>管理员登录 - 书签导航</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .login-container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
            width: 100%;
            max-width: 400px;
        }
        
        .login-header {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white;
            text-align: center;
            padding: 2rem;
        }
        
        .login-header h1 {
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }
        
        .login-header p {
            opacity: 0.9;
        }
        
        .login-form {
            padding: 2rem;
        }
        
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        .form-label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: #333;
        }
        
        .form-input {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            font-size: 1rem;
            transition: border-color 0.3s;
        }
        
        .form-input:focus {
            outline: none;
            border-color: #4facfe;
        }
        
        .login-btn {
            width: 100%;
            padding: 1rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .login-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
        }
        
        .login-btn:active {
            transform: translateY(0);
        }
        
        .login-footer {
            text-align: center;
            padding: 1.5rem;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 0.9rem;
        }
        
        .error-message {
            color: #e74c3c;
            text-align: center;
            margin-top: 1rem;
            font-size: 0.9rem;
            display: none;
        }
        
        .success-message {
            color: #2ecc71;
            text-align: center;
            margin-top: 1rem;
            font-size: 0.9rem;
            display: none;
        }
        
        @media (max-width: 480px) {
            .login-container {
                border-radius: 15px;
            }
            
            .login-header {
                padding: 1.5rem;
            }
            
            .login-header h1 {
                font-size: 1.5rem;
            }
            
            .login-form {
                padding: 1.5rem;
            }
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="login-header">
            <h1>管理员登录</h1>
            <p>书签导航管理系统</p>
        </div>
        
        <form class="login-form" id="loginForm">
            <div class="form-group">
                <label class="form-label">用户名</label>
                <input type="text" class="form-input" id="username" placeholder="请输入用户名" required>
            </div>
            
            <div class="form-group">
                <label class="form-label">密码</label>
                <input type="password" class="form-input" id="password" placeholder="请输入密码" required>
            </div>
            
            <button type="button" class="login-btn" onclick="login()">登录</button>
            
            <div class="error-message" id="errorMessage">
                用户名或密码错误，请重试
            </div>
            
            <div class="success-message" id="successMessage">
                登录成功！正在跳转...
            </div>
        </form>
        
        <div class="login-footer">
            <p>默认账号：admin / admin</p>
            <p>请妥善保管您的登录凭证</p>
        </div>
    </div>
    
    <script>
        function login() {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('errorMessage');
            const successMessage = document.getElementById('successMessage');
            
            // 隐藏所有消息
            errorMessage.style.display = 'none';
            successMessage.style.display = 'none';
            
            // 简单的验证
            if (!username || !password) {
                errorMessage.textContent = '请输入用户名和密码';
                errorMessage.style.display = 'block';
                return;
            }
            
            // 这里应该是实际的API调用
            // 为了演示，我们使用硬编码的凭据
            if (username === 'admin' && password === 'admin') {
                successMessage.style.display = 'block';
                errorMessage.style.display = 'none';
                
                // 模拟登录成功，跳转到管理面板
                setTimeout(() => {
                    alert('登录成功！管理功能正在开发中...');
                    // 在实际应用中，这里应该跳转到管理面板
                    // window.location.href = '/admin/dashboard';
                }, 1000);
            } else {
                errorMessage.textContent = '用户名或密码错误';
                errorMessage.style.display = 'block';
                successMessage.style.display = 'none';
                
                // 清空密码字段
                document.getElementById('password').value = '';
                document.getElementById('password').focus();
            }
        }
        
        // 按Enter键登录
        document.getElementById('password').addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                login();
            }
        });
        
        // 页面加载后自动聚焦用户名输入框
        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('username').focus();
        });
    </script>
</body>
</html>`;
  
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache'
    }
  });
}

// 隐私政策页面
function renderPrivacyPage() {
  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>隐私政策 - 书签导航</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f9f9f9;
        }
        
        .container {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        
        h1 {
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
            margin-bottom: 30px;
        }
        
        h2 {
            color: #34495e;
            margin-top: 30px;
            padding-bottom: 8px;
            border-bottom: 1px solid #eee;
        }
        
        .last-updated {
            color: #7f8c8d;
            font-style: italic;
            margin-bottom: 30px;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 6px;
        }
        
        .back-link {
            display: inline-block;
            margin-top: 30px;
            padding: 10px 20px;
            background: #3498db;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            transition: background 0.3s;
        }
        
        .back-link:hover {
            background: #2980b9;
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 20px;
            }
            
            h1 {
                font-size: 1.8rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>隐私政策</h1>
        
        <div class="last-updated">
            最后更新日期：2024年2月21日
        </div>
        
        <h2>1. 引言</h2>
        <p>欢迎使用书签导航服务。我们高度重视您的隐私保护，本隐私政策旨在说明我们如何收集、使用、存储和保护您的个人信息。</p>
        
        <h2>2. 信息收集范围</h2>
        <p>我们收集的信息包括：</p>
        <ul>
            <li><strong>提交信息：</strong>当您提交网站书签时，我们收集网站名称、URL、描述、分类和可选的Logo链接。</li>
            <li><strong>技术信息：</strong>IP地址、浏览器类型、设备信息、访问时间和页面浏览记录。</li>
            <li><strong>本地存储：</strong>用于保存您的语言偏好设置。</li>
            <li><strong>管理员信息：</strong>如果您是管理员，我们保存您的登录凭证用于身份验证。</li>
        </ul>
        
        <h2>3. 信息使用方式</h2>
        <p>我们使用您的信息用于：</p>
        <ul>
            <li>提供和改进书签导航服务</li>
            <li>审核用户提交的书签内容</li>
            <li>防止滥用和确保平台安全</li>
            <li>分析使用情况以优化用户体验</li>
        </ul>
        
        <h2>4. 数据存储与安全</h2>
        <p>您的数据存储于：</p>
        <ul>
            <li><strong>Cloudflare D1数据库：</strong>存储书签数据和用户提交信息</li>
            <li><strong>Cloudflare KV存储：</strong>存储会话数据和临时信息</li>
            <li><strong>本地浏览器存储：</strong>保存您的个人偏好设置</li>
        </ul>
        <p>我们采取行业标准的安全措施保护您的数据，但无法保证绝对安全。</p>
        
        <h2>5. 数据共享与披露</h2>
        <p>我们不会出售或出租您的个人信息。在以下情况下可能共享信息：</p>
        <ul>
            <li>法律要求或配合执法调查</li>
            <li>保护我们的权利、财产或安全</li>
            <li>服务提供商协助我们运营服务</li>
            <li>用户提交的书签内容会公开显示</li>
        </ul>
        
        <h2>6. 您的权利</h2>
        <p>您有权：</p>
        <ul>
            <li>访问我们持有的您的个人信息</li>
            <li>要求删除您的数据</li>
            <li>选择不接收非必要的通信</li>
            <li>通过反馈功能联系我们行使您的权利</li>
        </ul>
        
        <h2>7. Cookies政策</h2>
        <p>我们使用本地存储技术：</p>
        <ul>
            <li><strong>必要存储：</strong>维护会话状态和用户认证</li>
            <li><strong>偏好存储：</strong>记住您的语言选择和显示设置</li>
        </ul>
        <p>您可以通过浏览器设置管理本地存储，但可能影响部分功能。</p>
        
        <h2>8. 政策更新</h2>
        <p>我们可能不时更新本隐私政策。重大变更将在网站上公告。继续使用服务视为接受更新后的政策。</p>
        
        <h2>9. 联系我们</h2>
        <p>如果您对本隐私政策有任何疑问，请通过网站反馈功能联系我们。</p>
        
        <a href="/" class="back-link">返回首页</a>
    </div>
</body>
</html>`;
  
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'max-age=86400'
    }
  });
}

// 服务条款页面
function renderTermsPage() {
  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>服务条款 - 书签导航</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f9f9f9;
        }
        
        .container {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        
        h1 {
            color: #2c3e50;
            border-bottom: 3px solid #e74c3c;
            padding-bottom: 10px;
            margin-bottom: 30px;
        }
        
        h2 {
            color: #34495e;
            margin-top: 30px;
            padding-bottom: 8px;
            border-bottom: 1px solid #eee;
        }
        
        .last-updated {
            color: #7f8c8d;
            font-style: italic;
            margin-bottom: 30px;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 6px;
        }
        
        .back-link {
            display: inline-block;
            margin-top: 30px;
            padding: 10px 20px;
            background: #e74c3c;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            transition: background 0.3s;
        }
        
        .back-link:hover {
            background: #c0392b;
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 20px;
            }
            
            h1 {
                font-size: 1.8rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>服务条款</h1>
        
        <div class="last-updated">
            最后更新日期：2024年2月21日
        </div>
        
        <h2>1. 接受条款</h2>
        <p>访问或使用"书签导航"服务（以下简称"本服务"），即表示您同意遵守本服务条款的所有内容。如果您不同意这些条款，请勿使用本服务。</p>
        
        <h2>2. 服务描述</h2>
        <p>本服务是一个书签导航平台，允许用户：</p>
        <ul>
            <li>浏览他人分享的优质网站链接</li>
            <li>提交自己发现的优质网站（需管理员审核）</li>
            <li>按分类筛选和搜索感兴趣的内容</li>
            <li>使用多语言界面</li>
        </ul>
        
        <h2>3. 用户账户</h2>
        <p><strong>普通用户：</strong>无需注册即可浏览和提交内容。</p>
        <p><strong>管理员账户：</strong>由平台分配，用于管理内容和审核提交。</p>
        <p><strong>账户安全：</strong>您有责任保管好账户凭证，对账户下的所有活动负责。</p>
        
        <h2>4. 用户行为规范</h2>
        <p>使用本服务时，您同意：</p>
        <ul>
            <li>不提交违法、淫秽、诽谤或侵犯他人权利的内容</li>
            <li>不提交恶意软件、钓鱼网站或有害链接</li>
            <li>不试图破坏服务的安全性、完整性或可用性</li>
            <li>不侵犯他人的知识产权</li>
            <li>不进行任何商业广告宣传</li>
            <li>遵守所有适用的法律和法规</li>
        </ul>
        
        <h2>5. 内容提交与审核</h2>
        <p><strong>审核机制：</strong>所有用户提交的内容都需经过管理员审核。</p>
        <p><strong>审核标准：</strong>基于内容质量、相关性、安全性等因素。</p>
        <p><strong>保留权利：</strong>我们有权拒绝、编辑或删除任何不符合标准的内容。</p>
        <p><strong>内容授权：</strong>提交内容即授权我们在服务中展示、修改、分发。</p>
        
        <h2>6. 知识产权</h2>
        <p><strong>平台内容：</strong>本服务的界面、设计、代码、商标归我们所有。</p>
        <p><strong>用户内容：</strong>您保留对提交内容的版权，但授予我们展示权。</p>
        <p><strong>第三方内容：</strong>我们展示的网站链接指向第三方内容，其知识产权归各自所有者。</p>
        
        <h2>7. 服务可用性与变更</h2>
        <p>我们尽力提供可靠的服务，但：</p>
        <ul>
            <li>可能因维护、升级或其他原因暂时中断服务</li>
            <li>可能更改、暂停或终止部分或全部服务</li>
            <li>不保证服务的连续性或无错误运行</li>
            <li>可能修改服务条款，继续使用视为接受修改</li>
        </ul>
        
        <h2>8. 免责声明</h2>
        <p>本服务按"现状"提供，不作任何明示或暗示的保证，包括但不限于：</p>
        <ul>
            <li>服务的适用性、准确性、可靠性</li>
            <li>通过本服务访问的第三方网站内容</li>
            <li>用户提交内容的真实性、准确性、合法性</li>
            <li>服务不会中断、及时、安全或无错误</li>
        </ul>
        
        <h2>9. 责任限制</h2>
        <p>在任何情况下，我们对以下情况不承担责任：</p>
        <ul>
            <li>间接、附带、特殊、惩罚性或后果性损害</li>
            <li>数据丢失、业务中断或利润损失</li>
            <li>因使用或无法使用服务导致的任何损害</li>
            <li>通过本服务访问的第三方网站造成的任何损害</li>
        </ul>
        
        <h2>10. 终止条款</h2>
        <p>我们有权在以下情况下终止或暂停您的访问：</p>
        <ul>
            <li>违反本服务条款</li>
            <li>法律要求</li>
            <li>长期不活动</li>
            <li>保护服务安全或完整性</li>
        </ul>
        
        <h2>11. 一般条款</h2>
        <p><strong>管辖法律：</strong>受中华人民共和国法律管辖。</p>
        <p><strong>争议解决：</strong>通过友好协商解决，协商不成提交有管辖权的法院。</p>
        <p><strong>条款可分割性：</strong>如某条款无效，不影响其他条款效力。</p>
        <p><strong>联系方式：</strong>如有疑问，请通过网站反馈功能联系管理员。</p>
        
        <a href="/" class="back-link">返回首页</a>
    </div>
</body>
</html>`;
  
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'max-age=86400'
    }
  });
}

// 免责声明页面
function renderDisclaimerPage() {
  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>免责声明 - 书签导航</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f9f9f9;
        }
        
        .container {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        
        h1 {
            color: #2c3e50;
            border-bottom: 3px solid #2ecc71;
            padding-bottom: 10px;
            margin-bottom: 30px;
        }
        
        h2 {
            color: #34495e;
            margin-top: 30px;
            padding-bottom: 8px;
            border-bottom: 1px solid #eee;
        }
        
        .last-updated {
            color: #7f8c8d;
            font-style: italic;
            margin-bottom: 30px;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 6px;
        }
        
        .warning-box {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
        }
        
        .back-link {
            display: inline-block;
            margin-top: 30px;
            padding: 10px 20px;
            background: #2ecc71;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            transition: background 0.3s;
        }
        
        .back-link:hover {
            background: #27ae60;
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 20px;
            }
            
            h1 {
                font-size: 1.8rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>免责声明</h1>
        
        <div class="last-updated">
            最后更新日期：2024年2月21日
        </div>
        
        <h2>重要声明</h2>
        <p>请仔细阅读本免责声明。使用"书签导航"服务即表示您理解并接受本声明的所有内容。</p>
        
        <h2>1. 第三方内容免责</h2>
        <p>本平台仅提供网站链接导航服务：</p>
        <ul>
            <li>所有展示的网站链接指向第三方独立运营的网站</li>
            <li>我们对第三方网站的内容、准确性、合法性、安全性不承担任何责任</li>
            <li>点击外部链接离开本平台时，您需自行评估目标网站的风险</li>
            <li>我们无法控制第三方网站的内容更新、变更或关闭</li>
        </ul>
        
        <h2>2. 用户提交内容免责</h2>
        <p>平台内容来自用户提交：</p>
        <ul>
            <li>我们尽力审核所有提交内容，但无法保证100%准确或安全</li>
            <li>不对用户提交信息的真实性、完整性负责</li>
            <li>如果发现有害或侵权链接，请立即通过管理员渠道举报</li>
            <li>用户对提交的内容承担全部责任</li>
        </ul>
        
        <h2>3. 服务可用性免责</h2>
        <p>关于服务运行：</p>
        <ul>
            <li>我们尽力保持服务稳定，但不对服务中断、延迟或错误负责</li>
            <li>可能因维护、升级或其他不可抗力因素暂停服务</li>
            <li>不保证服务将不间断、及时、安全或无错误</li>
            <li>使用本服务产生的任何技术问题或数据丢失，我们不承担责任</li>
        </ul>
        
        <h2>4. 信息安全免责</h2>
        <p>尽管我们采取安全措施：</p>
        <ul>
            <li>互联网传输不可能100%安全，信息可能被拦截</li>
            <li>我们无法保证数据的绝对安全</li>
            <li>您需自行保护个人信息和账户安全</li>
            <li>因黑客攻击、病毒传播等造成的损失，我们不承担责任</li>
        </ul>
        
        <h2>5. 财务与投资免责</h2>
        <p>本平台不提供财务建议：</p>
        <ul>
            <li>任何金融、投资相关网站链接仅供参考，不作推荐</li>
            <li>不保证这些网站信息的准确性或时效性</li>
            <li>投资决策需自行研究并咨询专业人士</li>
            <li>因投资造成的任何损失，我们不承担责任</li>
        </ul>
        
        <h2>6. 医疗与健康免责</h2>
        <p>本平台不提供医疗建议：</p>
        <ul>
            <li>医疗健康类网站链接仅供参考，不能替代专业医疗建议</li>
            <li>紧急情况请立即联系医疗机构</li>
            <li>因依赖网站信息导致的健康问题，我们不承担责任</li>
        </ul>
        
        <h2>7. 法律责任声明</h2>
        <p>在法律允许的最大范围内：</p>
        <ul>
            <li>我们免除所有明示或暗示的保证和责任</li>
            <li>对直接、间接、偶然、特殊或后果性损害不承担责任</li>
            <li>包括但不限于利润损失、数据丢失、业务中断等</li>
            <li>责任总额不超过您使用本服务支付的金额（通常为零）</li>
        </ul>
        
        <h2>8. 用户责任</h2>
        <p>您同意：</p>
        <ul>
            <li>自行承担使用本服务及相关链接的风险</li>
            <li>对点击链接后的行为承担全部责任</li>
            <li>如因使用本服务造成损失，您放弃对我们追索的权利</li>
            <li>保护我们免于因您使用服务而导致的任何索赔或责任</li>
        </ul>
        
        <div class="warning-box">
            <h3>重要提示</h3>
            <p>使用本服务即表示您理解并同意，点击任何外部链接都需自行判断风险。我们强烈建议您使用最新的安全软件，并谨慎处理个人信息。</p>
        </div>
        
        <a href="/" class="back-link">返回首页</a>
    </div>
</body>
</html>`;
  
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'max-age=86400'
    }
  });
}

// 404 页面
function renderNotFoundPage() {
  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>页面未找到 - 书签导航</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
            padding: 20px;
        }
        
        .container {
            max-width: 600px;
        }
        
        h1 {
            font-size: 6rem;
            margin: 0;
            opacity: 0.9;
        }
        
        h2 {
            font-size: 2rem;
            margin: 20px 0;
        }
        
        p {
            font-size: 1.2rem;
            opacity: 0.8;
            margin-bottom: 30px;
        }
        
        .links {
            display: flex;
            gap: 20px;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .link {
            display: inline-block;
            padding: 12px 24px;
            background: rgba(255,255,255,0.2);
            color: white;
            text-decoration: none;
            border-radius: 50px;
            transition: all 0.3s;
            border: 2px solid rgba(255,255,255,0.3);
        }
        
        .link:hover {
            background: rgba(255,255,255,0.3);
            transform: translateY(-2px);
        }
        
        @media (max-width: 768px) {
            h1 {
                font-size: 4rem;
            }
            
            h2 {
                font-size: 1.5rem;
            }
            
            .links {
                flex-direction: column;
                align-items: center;
            }
            
            .link {
                width: 200px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>404</h1>
        <h2>页面未找到</h2>
        <p>抱歉，您访问的页面不存在或已被移除。</p>
        <div class="links">
            <a href="/" class="link">返回首页</a>
            <a href="/privacy" class="link">隐私政策</a>
            <a href="/admin" class="link">管理后台</a>
        </div>
    </div>
</body>
</html>`;
  
  return new Response(html, {
    status: 404,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache'
    }
  });
}

// 错误页面
function renderErrorPage(errorMessage) {
  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>服务器错误 - 书签导航</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
            color: white;
            text-align: center;
            padding: 20px;
        }
        
        .container {
            max-width: 600px;
            background: rgba(0,0,0,0.2);
            padding: 40px;
            border-radius: 20px;
            backdrop-filter: blur(10px);
        }
        
        h1 {
            font-size: 4rem;
            margin: 0 0 20px 0;
        }
        
        h2 {
            font-size: 2rem;
            margin: 0 0 30px 0;
        }
        
        .error-details {
            background: rgba(255,255,255,0.1);
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            text-align: left;
            font-family: monospace;
            font-size: 0.9rem;
            overflow-x: auto;
        }
        
        .links {
            display: flex;
            gap: 20px;
            justify-content: center;
            flex-wrap: wrap;
            margin-top: 30px;
        }
        
        .link {
            display: inline-block;
            padding: 12px 24px;
            background: rgba(255,255,255,0.3);
            color: white;
            text-decoration: none;
            border-radius: 50px;
            transition: all 0.3s;
        }
        
        .link:hover {
            background: rgba(255,255,255,0.4);
            transform: translateY(-2px);
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 20px;
            }
            
            h1 {
                font-size: 3rem;
            }
            
            h2 {
                font-size: 1.5rem;
            }
            
            .links {
                flex-direction: column;
                align-items: center;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>500</h1>
        <h2>服务器内部错误</h2>
        <p>抱歉，服务器遇到了问题，无法处理您的请求。</p>
        
        <div class="error-details">
            <strong>错误信息：</strong><br>
            ${errorMessage || '未知错误'}
        </div>
        
        <p>请稍后重试，或联系管理员获取帮助。</p>
        
        <div class="links">
            <a href="/" class="link">返回首页</a>
            <a href="javascript:location.reload()" class="link">刷新页面</a>
        </div>
    </div>
</body>
</html>`;
  
  return new Response(html, {
    status: 500,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache'
    }
  });
}

// ==================== API 路由处理函数 ====================
async function handleApiRoutes(request, env, ctx, path, method, url) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };
  
  // 获取网站列表
  if (path === '/api/config' && method === 'GET') {
    try {
      const page = parseInt(url.searchParams.get('page') || '1');
      const pageSize = parseInt(url.searchParams.get('pageSize') || '20');
      const catalog = url.searchParams.get('catalog');
      
      // 这里应该查询数据库，但为了演示返回模拟数据
      const mockData = [
        {
          id: 1,
          name: '示例网站1',
          url: 'https://example.com',
          logo: null,
          desc: '这是一个示例网站，用于演示功能',
          catelog: '工具',
          sort_order: 1,
          create_time: '2024-02-21T00:00:00Z',
          update_time: '2024-02-21T00:00:00Z'
        },
        {
          id: 2,
          name: '示例网站2',
          url: 'https://example.org',
          logo: null,
          desc: '另一个示例网站',
          catelog: '娱乐',
          sort_order: 2,
          create_time: '2024-02-21T00:00:00Z',
          update_time: '2024-02-21T00:00:00Z'
        }
      ];
      
      // 根据分类筛选
      let filteredData = mockData;
      if (catalog) {
        filteredData = mockData.filter(item => item.catelog === catalog);
      }
      
      // 分页
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedData = filteredData.slice(startIndex, endIndex);
      
      return new Response(JSON.stringify({
        code: 200,
        message: 'success',
        data: paginatedData,
        total: filteredData.length,
        page: page,
        pageSize: pageSize,
        totalPages: Math.ceil(filteredData.length / pageSize)
      }), {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          ...corsHeaders
        }
      });
      
    } catch (error) {
      return new Response(JSON.stringify({
        code: 500,
        message: '数据库查询失败: ' + error.message,
        data: []
      }), {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          ...corsHeaders
        }
      });
    }
  }
  
  // 提交新网站
  if (path === '/api/config/submit' && method === 'POST') {
    try {
      const body = await request.json();
      
      // 验证必要字段
      if (!body.name || !body.url || !body.catelog) {
        return new Response(JSON.stringify({
          code: 400,
          message: '缺少必要字段: name, url, catelog'
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            ...corsHeaders
          }
        });
      }
      
      // 验证URL格式
      try {
        new URL(body.url);
      } catch (error) {
        return new Response(JSON.stringify({
          code: 400,
          message: '无效的URL格式'
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            ...corsHeaders
          }
        });
      }
      
      // 在实际应用中，这里应该将数据保存到数据库
      // 为了演示，我们返回成功响应
      
      return new Response(JSON.stringify({
        code: 201,
        message: '提交成功，等待管理员审核',
        data: {
          id: Date.now(), // 模拟生成ID
          name: body.name,
          url: body.url,
          desc: body.desc || null,
          catelog: body.catelog,
          logo: body.logo || null,
          create_time: new Date().toISOString()
        }
      }), {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          ...corsHeaders
        }
      });
      
    } catch (error) {
      return new Response(JSON.stringify({
        code: 500,
        message: '提交失败: ' + error.message
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          ...corsHeaders
        }
      });
    }
  }
  
  // 获取分类列表
  if (path === '/api/categories' && method === 'GET') {
    const categories = ['工具', '娱乐', '学习', '资源', '其他'];
    
    return new Response(JSON.stringify({
      code: 200,
      message: 'success',
      data: categories
    }), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        ...corsHeaders
      }
    });
  }
  
  // 默认API响应
  return new Response(JSON.stringify({
    code: 404,
    message: 'API端点不存在'
  }), {
    status: 404,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...corsHeaders
    }
  });
}

// ==================== 静态资源函数 ====================
function getStylesCSS() {
  return `/* 基础样式 - 内联在HTML中，这里提供备用 */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f5f5f7;
  color: #1d1d1f;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 导航栏样式 */
.navbar {
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.8rem;
  font-weight: bold;
  color: #007bff;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-links a {
  color: #1d1d1f;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-links a:hover {
  color: #007bff;
}

.lang-select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-links {
    flex-wrap: wrap;
    justify-content: center;
  }
}`;
}

function getI18nJS() {
  return `// 多语言配置文件
const translations = {
  zh: {
    nav: {
      home: "首页",
      shortDrama: "短剧",
      tools: "工具",
      entertainment: "娱乐",
      blog: "博客",
      privacy: "隐私政策",
      disclaimer: "免责声明",
      about: "关于我们",
      contact: "联系方式"
    },
    home: {
      hotRecommend: "热门推荐",
      more: "查看更多"
    },
    shortDrama: {
      newDrama: "新剧",
      fantasy: "魔幻",
      urban: "都市",
      action: "动作",
      coolDrama: "爽剧",
      translated: "翻译剧",
      ranking: "热门排行"
    },
    tools: {
      aiTools: "AI 工具",
      efficiency: "效率工具",
      editing: "剪辑工具",
      freeTools: "免费工具",
      shopping: "购物导航"
    },
    entertainment: {
      commentary: "热门解说",
      news: "娱乐资讯",
      science: "科普生活",
      variety: "综艺分享",
      ranking: "热门排行",
      download: "下载 (双线路)"
    },
    blog: {
      article: "文章"
    },
    common: {
      description: "简介",
      view: "查看详情",
      download: "下载"
    }
  },
  en: {
    nav: {
      home: "Home",
      shortDrama: "Short Drama",
      tools: "Tools",
      entertainment: "Entertainment",
      blog: "Blog",
      privacy: "Privacy Policy",
      disclaimer: "Disclaimer",
      about: "About Us",
      contact: "Contact"
    },
    home: {
      hotRecommend: "Hot Recommendations",
      more: "View More"
    },
    shortDrama: {
      newDrama: "New Drama",
      fantasy: "Fantasy",
      urban: "Urban",
      action: "Action",
      coolDrama: "Cool Drama",
      translated: "Translated",
      ranking: "Ranking"
    },
    tools: {
      aiTools: "AI Tools",
      efficiency: "Efficiency Tools",
      editing: "Editing Tools",
      freeTools: "Free Tools",
      shopping: "Shopping Guide"
    },
    entertainment: {
      commentary: "Commentary",
      news: "News",
      science: "Science & Life",
      variety: "Variety Shows",
      ranking: "Ranking",
      download: "Download (Dual Lines)"
    },
    blog: {
      article: "Articles"
    },
    common: {
      description: "Description",
      view: "View Details",
      download: "Download"
    }
  },
  ja: {
    nav: {
      home: "ホーム",
      shortDrama: "ショートドラマ",
      tools: "ツール",
      entertainment: "エンターテインメント",
      blog: "ブログ",
      privacy: "プライバシーポリシー",
      disclaimer: "免責事項",
      about: "私たちについて",
      contact: "お問い合わせ"
    },
    home: {
      hotRecommend: "おすすめ",
      more: "もっと見る"
    },
    shortDrama: {
      newDrama: "新作ドラマ",
      fantasy: "ファンタジー",
      urban:
