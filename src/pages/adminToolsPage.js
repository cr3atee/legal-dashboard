import {
  ADMIN_USERS_TOOL_PERMISSIONS,
  PERMISSIONS,
  hasAnyPermission,
} from '../core/permissions.js';

export function renderAdminToolsPage(session = null) {
  const canOpenUsers = hasAnyPermission(ADMIN_USERS_TOOL_PERMISSIONS, session);
  const canOpenDictionaries = hasAnyPermission([PERMISSIONS.DICTIONARIES_MANAGE], session);
  const cards = [];

  if (canOpenUsers) {
    cards.push(`
      <button class="panel admin-tool-card" data-view="adminUsers" type="button">
        <span class="admin-tool-card-icon" aria-hidden="true">${iconUsers()}</span>
        <span class="admin-tool-card-body">
          <strong>Пользователи и доступы</strong>
          <small>Управление пользователями, ролями и индивидуальными правами доступа.</small>
        </span>
      </button>
    `);
  }

  if (canOpenDictionaries) {
    cards.push(`
      <button class="panel admin-tool-card" data-view="adminDictionaries" type="button">
        <span class="admin-tool-card-icon" aria-hidden="true">${iconBook()}</span>
        <span class="admin-tool-card-body">
          <strong>Справочники</strong>
          <small>Управление значениями и системными справочниками приложения.</small>
        </span>
      </button>
    `);
  }

  return `
    <section class="view admin-tools-view" id="admin">
      <div class="page-head">
        <h2>Панель инструментов</h2>
        <p>Управление пользователями, доступами и системными справочниками.</p>
      </div>

      <div class="admin-tools-grid">
        ${cards.length ? cards.join('') : `
          <article class="panel">
            <p>Нет доступных административных инструментов.</p>
          </article>
        `}
      </div>
    </section>
  `;
}

function iconUsers() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"></path><circle cx="9.5" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`;
}

function iconBook() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 0-3-3z"></path><path d="M5 4v16"></path><path d="M8 8h7M8 12h6"></path></svg>`;
}
