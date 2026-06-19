export function initSidebarCollapse() {
  localStorage.removeItem('legal-dashboard-sidebar-collapsed');
  setSidebarCollapsed(true);
}

export function setSidebarCollapsed(collapsed) {
  document.body.classList.toggle('sidebar-collapsed', collapsed);
}
