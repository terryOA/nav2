// ==================== 书签导航系统 - Cloudflare Worker 版本 ====================
// 修复版：确保所有语法正确，字符串正确闭合

// 主请求处理函数
async function handleRequest(request, env, ctx) {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;
  
  // CORS 头部
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization'
  };
  
  // 处理预检请求
  if (method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // 主页路由
    if (path === '/' || path === '/index.html') {
      return renderHomePage();
    }
    
    // 管理页面
    if (path === '/admin') {
      return renderAdminPage();
    }
    
    // 法律页面
    if (path === '/privacy') {
      return renderPrivacyPage();
    }
    
    if (path === '/terms') {
      return renderTermsPage();
    }
    
    if (path === '/disclaimer') {
      return renderDisclaimerPage();
    }
    
    // 静态资源
    if (path === '/styles.css') {
      return new Response(getStylesCSS(), {
        headers: { 'Content-Type': 'text/css; charset=utf-8' }
      });
    }
    
    if (path === '/i18n.js') {
      return new Response(getI18nJS(), {
        headers: { 'Content-Type': 'application/javascript; charset=utf-8' }
      });
    }
    
    if (path === '/script.js') {
      return new Response(getScriptJS(), {
        headers: { 'Content-Type': 'application/javascript; charset=utf-8' }
      });
    }
    
    // API 路由
    if (path.startsWith('/api/')) {
      return handleApiRequest(request, path);
    }
    
    // 默认404
    return renderNotFoundPage();
    
  } catch (error) {
    console.error('Error:', error);
    return new Response('服务器错误: ' + error.message, { 
      status: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
}

// ==================== 页面渲染函数 ====================

// 主页
function renderHomePage() {
  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>书签导航 - 发现优质网站</title>
    <link rel="stylesheet" href="/styles.css">
    <script src="/i18n.js" defer></script>
    <script src="/script.js" defer></script>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background: #f5f5f7; }
        .navbar { background: white; padding: 1rem; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .nav-container { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 1.5rem; font-weight: bold; color: #007bff; text-decoration: none; }
        .nav-links { display: flex; gap: 1.5rem; }
        .nav-links a { color: #333; text-decoration: none; }
        .container { max-width: 1200px; margin: 2rem auto; padding: 0 1rem; }
        .hero { text-align: center; padding: 3rem 1rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; color: white; margin-bottom: 2rem; }
        .card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; margin: 2rem 0; }
        .card { background: white; border-radius: 8px; padding: 1.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .submit-form { background: white; padding: 2rem; border-radius: 8px; max-width: 500px; margin: 2rem auto; }
        .form-input { width: 100%; padding: 0.75rem; margin-bottom: 1rem; border: 1px solid #ddd; border-radius: 4px; }
        .submit-btn { width: 100%; padding: 1rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
        .footer { text-align: center; padding: 2rem; color: #666; border-top: 1px solid #eee; margin-top: 3rem; }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <a href="/" class="logo">书签导航</a>
            <div class="nav-links">
                <a href="/">首页</a>
                <a href="/privacy">隐私政策</a>
                <a href="/terms">服务条款</a>
                <a href="/disclaimer">免责声明</a>
                <a href="/admin">管理后台</a>
                <select id="language-select" onchange="changeLang(this.value)">
                    <option value="zh">中文</option>
                    <option value="en">English</option>
                </select>
            </div>
        </div>
    </nav>
    
    <main class="container">
        <section class="hero">
            <h1>书签导航</h1>
            <p>发现、分享、收藏优质网站资源</p>
        </section>
        
        <section>
            <h2>热门推荐</h2>
            <div class="card-grid" id="sites-container">
                <div class="card">网站数据加载中...</div>
            </div>
        </section>
        
        <section>
            <h2>提交新网站</h2>
            <div class="submit-form">
                <input type="text" class="form-input" id="site-name" placeholder="网站名称">
                <input type="url" class="form-input" id="site-url" placeholder="https://example.com">
                <textarea class="form-input" id="site-desc" placeholder="网站描述" rows="3"></textarea>
                <select class="form-input" id="site-category">
                    <option value="">选择分类</option>
                    <option value="工具">工具</option>
                    <option value="娱乐">娱乐</option>
                    <option value="学习">学习</option>
                </select>
                <button class="submit-btn" onclick="submitSite()">提交网站</button>
            </div>
        </section>
    </main>
    
    <footer class="footer">
        <p>&copy; 2024 书签导航</p>
        <div>
            <a href="/privacy">隐私政策</a> | 
            <a href="/terms">服务条款</a> | 
            <a href="/disclaimer">免责声明</a>
        </div>
    </footer>
    
    <script>
        async function submitSite() {
            const name = document.getElementById('site-name').value;
            const url = document.getElementById('site-url').value;
            const desc = document.getElementById('site-desc').value;
            const category = document.getElementById('site-category').value;
            
            if (!name || !url || !category) {
                alert('请填写网站名称、网址和分类');
                return;
            }
            
            try {
                const response = await fetch('/api/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, url, desc, category })
                });
                
                const result = await response.json();
                alert(result.message || '提交成功');
                
                // 清空表单
                document.getElementById('site-name').value = '';
                document.getElementById('site-url').value = '';
                document.getElementById('site-desc').value = '';
                document.getElementById('site-category').value = '';
                
            } catch (error) {
                alert('提交失败: ' + error.message);
            }
        }
        
        // 页面加载时初始化
        document.addEventListener('DOMContentLoaded', function() {
            // 如果有多语言脚本，初始化语言
            if (typeof initLanguage === 'function') {
                initLanguage();
            }
            
            // 加载网站数据
            loadSites();
        });
        
        async function loadSites() {
            try {
                const response = await fetch('/api/sites');
                const data = await response.json();
                
                if (data.code === 200) {
                    renderSites(data.data);
                }
            } catch (error) {
                console.log('加载网站数据失败，使用示例数据');
                showExampleSites();
            }
        }
        
        function renderSites(sites) {
            const container = document.getElementById('sites-container');
            container.innerHTML = '';
            
            sites.forEach(site => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = \`
                    <h3>\${site.name}</h3>
                    <p>\${site.desc || '暂无描述'}</p>
                    <a href="\${site.url}" target="_blank">访问网站</a>
                \`;
                container.appendChild(card);
            });
        }
        
        function showExampleSites() {
            const exampleSites = [
                { name: '示例网站1', url: 'https://example.com', desc: '这是一个示例网站' },
                { name: '示例网站2', url: 'https://example.org', desc: '另一个示例网站' }
            ];
            renderSites(exampleSites);
        }
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

// 管理员页面
function renderAdminPage() {
  const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>管理员登录 - 书签导航</title>
    <style>
        body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f5f5f7; }
        .login-box { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); width: 100%; max-width: 400px; }
        h1 { text-align: center; color: #333; margin-bottom: 1.5rem; }
        input { width: 100%; padding: 0.75rem; margin-bottom: 1rem; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
        button { width: 100%; padding: 0.75rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
        .hint { text-align: center; color: #666; font-size: 0.9rem; margin-top: 1rem; }
    </style>
</head>
<body>
    <div class="login-box">
        <h1>管理员登录</h1>
        <input type="text" id="username" placeholder="用户名">
        <input type="password" id="password" placeholder="密码">
        <button onclick="login()">登录</button>
        <p class="hint">默认账号: admin / admin</p>
    </div>
    
    <script>
        function login() {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (username === 'admin' && password === 'admin') {
                alert('登录成功！管理功能正在开发中...');
                // 实际开发中这里会跳转到管理面板
            } else {
                alert('用户名或密码错误');
            }
        }
    </script>
</body>
</html>`;
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

// 隐私政策页面
function renderPrivacyPage() {
  const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>隐私政策 - 书签导航</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; line-height: 1.6; }
        h1 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 0.5rem; }
        h2 { color: #555; margin-top: 2rem; }
        p { color: #666; }
        .back-link { display: inline-block; margin-top: 2rem; color: #007bff; text-decoration: none; }
    </style>
</head>
<body>
    <h1>隐私政策</h1>
    <p>最后更新日期：2024年2月21日</p>
    
    <h2>1. 信息收集</h2>
    <p>我们收集用户提交的网站信息，包括网站名称、URL、描述和分类。</p>
    
    <h2>2. 信息使用</h2>
    <p>收集的信息用于提供和改进书签导航服务。</p>
    
    <h2>3. 数据安全</h2>
    <p>我们采取合理的安全措施保护您的数据。</p>
    
    <h2>4. 联系我们</h2>
    <p>如有疑问，请通过网站反馈功能联系我们。</p>
    
    <a href="/" class="back-link">← 返回首页</a>
</body>
</html>`;
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

// 服务条款页面
function renderTermsPage() {
  const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>服务条款 - 书签导航</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; line-height: 1.6; }
        h1 { color: #333; border-bottom: 2px solid #28a745; padding-bottom: 0.5rem; }
        h2 { color: #555; margin-top: 2rem; }
        p { color: #666; }
        .back-link { display: inline-block; margin-top: 2rem; color: #28a745; text-decoration: none; }
    </style>
</head>
<body>
    <h1>服务条款</h1>
    <p>最后更新日期：2024年2月21日</p>
    
    <h2>1. 接受条款</h2>
    <p>使用本服务即表示您同意这些条款。</p>
    
    <h2>2. 服务说明</h2>
    <p>本服务提供书签导航功能。</p>
    
    <h2>3. 用户责任</h2>
    <p>用户应确保提交的内容合法合规。</p>
    
    <h2>4. 联系我们</h2>
    <p>如有疑问，请通过网站反馈功能联系我们。</p>
    
    <a href="/" class="back-link">← 返回首页</a>
</body>
</html>`;
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

// 免责声明页面
function renderDisclaimerPage() {
  const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>免责声明 - 书签导航</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; line-height: 1.6; }
        h1 { color: #333; border-bottom: 2px solid #dc3545; padding-bottom: 0.5rem; }
        h2 { color: #555; margin-top: 2rem; }
        p { color: #666; }
        .back-link { display: inline-block; margin-top: 2rem; color: #dc3545; text-decoration: none; }
    </style>
</head>
<body>
    <h1>免责声明</h1>
    
    <h2>重要声明</h2>
    <p>本网站仅提供网站链接导航服务。</p>
    
    <h2>第三方链接</h2>
    <p>不对第三方网站的内容负责。</p>
    
    <h2>用户责任</h2>
    <p>用户需自行判断链接风险。</p>
    
    <h2>联系我们</h2>
    <p>如有疑问，请通过网站反馈功能联系我们。</p>
    
    <a href="/" class="back-link">← 返回首页</a>
</body>
</html>`;
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

// 404页面
function renderNotFoundPage() {
  const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>页面未找到 - 书签导航</title>
    <style>
        body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f5f5f7; text-align: center; }
        .error-box { max-width: 600px; padding: 2rem; }
        h1 { font-size: 4rem; color: #dc3545; margin: 0; }
        p { color: #666; margin: 1rem 0 2rem; }
        .back-link { display: inline-block; padding: 0.75rem 1.5rem; background: #007bff; color: white; text-decoration: none; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="error-box">
        <h1>404</h1>
        <p>抱歉，您访问的页面不存在。</p>
        <a href="/" class="back-link">返回首页</a>
    </div>
</body>
</html>`;
  
  return new Response(html, {
    status: 404,
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

// API处理函数
async function handleApiRequest(request, path) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization'
  };
  
  // 获取网站列表
  if (path === '/api/sites' || path === '/api/config') {
    const mockData = [
      {
        id: 1,
        name: '示例网站1',
        url: 'https://example.com',
        desc: '这是一个示例网站',
        category: '工具'
      },
      {
        id: 2,
        name: '示例网站2',
        url: 'https://example.org',
        desc: '另一个示例网站',
        category: '娱乐'
      }
    ];
    
    return new Response(JSON.stringify({
      code: 200,
      message: 'success',
      data: mockData
    }), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        ...corsHeaders
      }
    });
  }
  
  // 提交网站
  if (path === '/api/submit' && request.method === 'POST') {
    try {
      const body = await request.json();
      
      // 验证必要字段
      if (!body.name || !body.url || !body.category) {
        return new Response(JSON.stringify({
          code: 400,
          message: '缺少必要字段'
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            ...corsHeaders
          }
        });
      }
      
      // 模拟成功响应
      return new Response(JSON.stringify({
        code: 201,
        message: '提交成功，等待审核',
        data: {
          id: Date.now(),
          ...body,
          status: 'pending',
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
  
  // 默认API响应
  return new Response(JSON.stringify({
    code: 404,
    message: 'API不存在'
  }), {
    status: 404,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...corsHeaders
    }
  });
}

// 静态资源
function getStylesCSS() {
  return `/* 基础样式 */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f5f5f7;
  color: #333;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.navbar {
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 1rem 0;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #007bff;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-links a {
  color: #333;
  text-decoration: none;
}

.hero {
  text-align: center;
  padding: 3rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
  margin-bottom: 2rem;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.submit-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  margin: 2rem auto;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.footer {
  text-align: center;
  padding: 2rem;
  color: #666;
  border-top: 1px solid #eee;
  margin-top: 3rem;
}

@media (max-width: 768px) {
  .nav-container {
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
  return `// 多语言配置 - 简化版
const translations = {
  zh: {
    nav: {
      home: "首页",
      privacy: "隐私政策",
      disclaimer: "免责声明"
    },
    home: {
      hotRecommend: "热门推荐"
    }
  },
  en: {
    nav: {
      home: "Home",
      privacy: "Privacy Policy",
      disclaimer: "Disclaimer"
    },
    home: {
      hotRecommend: "Hot Recommendations"
    }
  }
};

let currentLang = "zh";

function initLanguage() {
  const savedLang = localStorage.getItem("website_lang");
  if (savedLang && translations[savedLang]) {
    currentLang = savedLang;
  }
  const langSelect = document.getElementById("language-select");
  if (langSelect) {
    langSelect.value = currentLang;
  }
  updateContent();
}

function updateContent() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    const keys = key.split(".");
    let value = translations[currentLang];
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        value = undefined;
        break;
      }
    }
    if (value !== undefined) {
      el.textContent = value;
    }
  });
}

function changeLang(lang) {
  if (!translations[lang]) return;
  localStorage.setItem("website_lang", lang);
  currentLang = lang;
  updateContent();
}

// 页面加载时初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLanguage);
} else {
  initLanguage();
}`;
}

function getScriptJS() {
  return `// 前端脚本
console.log('书签导航脚本加载成功');

// 移动端菜单切换
document.addEventListener('DOMContentLoaded', function() {
  // 这里可以添加移动端菜单切换逻辑
  console.log('页面加载完成');
  
  // 示例：为所有卡片添加点击效果
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('click', function() {
      this.style.transform = 'scale(0.98)';
      setTimeout(() => {
        this.style.transform = 'scale(1)';
      }, 150);
    });
  });
});`;
}

// ==================== Worker 入口点 ====================
// 使用 ES 模块格式导出（推荐）
export default {
  async fetch(request, env, ctx) {
    return handleRequest(request, env, ctx);
  }
};
