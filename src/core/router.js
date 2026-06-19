import { setSidebarCollapsed } from '../layout/sidebarCollapse.js';
import { initMap, invalidateMapSize } from '../modules/map/mapInit.js';

export function initRouter() {
  document.addEventListener('click', event => {
    const navButton = event.target.closest('[data-view]');
    if (!navButton) return;

    event.preventDefault();
    openView(navButton.dataset.view);
  });

  openView('dashboard');
}

export function openView(viewId) {
  document.querySelectorAll('.view').forEach(view => {
    view.classList.toggle('active', view.id === viewId);
  });

  document.querySelectorAll('[data-view]').forEach(button => {
    button.classList.toggle('active', button.dataset.view === viewId);
  });

  document.body.dataset.currentView = viewId;
  window.dispatchEvent(new CustomEvent('app:view-changed', { detail: { viewId } }));

  // One sidebar behavior for every view: compact by default, expanded by hover/focus.
  setSidebarCollapsed(true);

  if (viewId !== 'dashboard' && typeof window.setDashboardEditMode === 'function') {
    window.setDashboardEditMode(false);
  }

  if (viewId === 'map') {
    setTimeout(() => {
      initMap('legalMap');
      invalidateMapSize();
    }, 80);
  }
}

window.openView = openView;
