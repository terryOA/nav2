// 移动端导航菜单切换
function initMobileMenu() {
  const menuBtn = document.getElementById("mobile-menu-btn");
  const navMenu = document.getElementById("nav-menu");
  
  if (menuBtn && navMenu) {
    menuBtn.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      // 切换按钮文字
      menuBtn.textContent = navMenu.classList.contains("active") ? "✕" : "☰";
    });
  }
}

// 图片加载失败时的占位图
function initImageFallback() {
  document.querySelectorAll("img").forEach(img => {
    img.addEventListener("error", () => {
      img.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiByeD0iMTUiIGZpbGw9IiMzMzQxNTUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSJ9Ijk0YTNCOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgYWxpZ25tZW50LWJhc2VsaW5lPSJtaWRkbGUiPkltYWdlIFJlbW90ZTwvdGV4dD48L3N2Zz4=";
      img.alt = "Image placeholder";
    });
  });
}

// 平滑滚动
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === "#") return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
}

// 页面加载完成后初始化所有交互
document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initImageFallback();
  initSmoothScroll();
});