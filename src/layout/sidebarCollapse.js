export function initSidebarCollapse() {
  const saved = localStorage.getItem('legal-dashboard-sidebar-collapsed');
  setSidebarCollapsed(saved === '1');

  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;

  sidebar.addEventListener('mouseenter', () => setSidebarHoverExpanded(true));
  sidebar.addEventListener('mouseleave', () => setSidebarHoverExpanded(false));
  sidebar.addEventListener('focusin', () => setSidebarHoverExpanded(true));
  sidebar.addEventListener('focusout', () => {
    window.setTimeout(() => {
      if (!sidebar.contains(document.activeElement)) setSidebarHoverExpanded(false);
    }, 0);
  });
}

export function setSidebarCollapsed(collapsed) {
  document.body.classList.toggle('sidebar-collapsed', collapsed);
}

function setSidebarHoverExpanded(expanded) {
  document.body.classList.toggle(
    'sidebar-hover-expanded',
    expanded && document.body.classList.contains('sidebar-collapsed')
  );
}
