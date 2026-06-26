import { dbApi } from '../../api/dbApi.js';
import { CLOSED_SECTION_GRANTS, ROLE_NAMES } from '../../core/permissions.js';

const state = {
  users: [],
};

export function initAdminUsersPage() {
  const form = document.querySelector('[data-admin-user-form]');
  if (!form || form.dataset.initialized) return;
  form.dataset.initialized = '1';

  form.addEventListener('submit', event => {
    event.preventDefault();
    saveUser(form);
  });
  document.querySelector('[data-admin-user-reset]')?.addEventListener('click', () => resetForm(form));
  document.querySelector('[data-admin-users-body]')?.addEventListener('click', event => {
    const editButton = event.target.closest('[data-admin-user-edit]');
    const blockButton = event.target.closest('[data-admin-user-block]');
    if (editButton) fillForm(form, Number(editButton.dataset.adminUserEdit));
    if (blockButton) toggleBlocked(Number(blockButton.dataset.adminUserBlock));
  });

  window.addEventListener('app:view-changed', event => {
    if (event.detail?.viewId === 'adminUsers') loadUsers();
  });
  loadUsers();
}

async function loadUsers() {
  const body = document.querySelector('[data-admin-users-body]');
  if (!body) return;
  body.innerHTML = '<tr><td colspan="5">Загрузка...</td></tr>';
  try {
    state.users = await dbApi.getAdminUsers();
    renderUsers();
    setStatus('');
  } catch (error) {
    body.innerHTML = `<tr><td colspan="5">${escapeHtml(error.message || 'Ошибка загрузки')}</td></tr>`;
  }
}

function renderUsers() {
  const body = document.querySelector('[data-admin-users-body]');
  if (!body) return;
  if (!state.users.length) {
    body.innerHTML = '<tr><td colspan="5">Пользователи не найдены</td></tr>';
    return;
  }
  body.innerHTML = state.users.map(user => {
    const grants = (user.individual_permissions || [])
      .map(permission => CLOSED_SECTION_GRANTS.find(grant => grant.permission === permission)?.label || permission)
      .join(', ');
    return `
      <tr>
        <td>${escapeHtml(user.full_name)}</td>
        <td>${escapeHtml(user.role_name || ROLE_NAMES[user.role_level] || '')}</td>
        <td>${user.is_active ? 'Активен' : 'Заблокирован'}</td>
        <td>${escapeHtml(grants || '—')}</td>
        <td class="admin-users-row-actions">
          <button class="btn tiny" data-admin-user-edit="${user.id}" type="button">Изменить</button>
          <button class="btn tiny ${user.is_active ? 'danger' : ''}" data-admin-user-block="${user.id}" type="button">
            ${user.is_active ? 'Блокировать' : 'Активировать'}
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

async function saveUser(form) {
  const data = formToPayload(form);
  if (!data.full_name) {
    setStatus('Заполните ФИО.');
    return;
  }
  if (!data.id && !data.password) {
    setStatus('Для нового пользователя нужен пароль.');
    return;
  }
  try {
    if (data.id) {
      await dbApi.updateAdminUser(data.id, data);
      setStatus('Пользователь обновлен.');
    } else {
      await dbApi.createAdminUser(data);
      setStatus('Пользователь создан.');
    }
    resetForm(form);
    await loadUsers();
  } catch (error) {
    setStatus(error.message || 'Ошибка сохранения.');
  }
}

async function toggleBlocked(id) {
  const user = state.users.find(item => Number(item.id) === Number(id));
  if (!user) return;
  try {
    await dbApi.updateAdminUser(id, {
      full_name: user.full_name,
      role_level: user.role_level,
      is_active: user.is_active ? 0 : 1,
      individual_permissions: user.individual_permissions || [],
    });
    await loadUsers();
  } catch (error) {
    setStatus(error.message || 'Ошибка смены статуса.');
  }
}

function fillForm(form, id) {
  const user = state.users.find(item => Number(item.id) === Number(id));
  if (!user) return;
  form.elements.id.value = user.id;
  form.elements.full_name.value = user.full_name || '';
  form.elements.password.value = '';
  form.elements.role_level.value = String(user.role_level || 1);
  form.elements.is_active.checked = Boolean(user.is_active);
  const permissions = new Set(user.individual_permissions || []);
  form.querySelectorAll('input[name="individual_permissions"]').forEach(input => {
    input.checked = permissions.has(input.value);
  });
}

function resetForm(form) {
  form.reset();
  form.elements.id.value = '';
  form.elements.role_level.value = '1';
  form.elements.is_active.checked = true;
  setStatus('');
}

function formToPayload(form) {
  return {
    id: Number(form.elements.id.value || 0) || null,
    full_name: form.elements.full_name.value.trim(),
    password: form.elements.password.value.trim(),
    role_level: Number(form.elements.role_level.value || 1),
    is_active: form.elements.is_active.checked ? 1 : 0,
    individual_permissions: [...form.querySelectorAll('input[name="individual_permissions"]:checked')].map(input => input.value),
  };
}

function setStatus(message) {
  const node = document.querySelector('[data-admin-users-status]');
  if (node) node.textContent = message;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
