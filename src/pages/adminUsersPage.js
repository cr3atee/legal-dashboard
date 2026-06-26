import { CLOSED_SECTION_GRANTS, ROLE_NAMES } from '../core/permissions.js';

export function renderAdminUsersPage() {
  return `
    <section class="view admin-users-view" id="adminUsers">
      <div class="page-head admin-page-head">
        <div>
          <h2>Пользователи и доступы</h2>
          <p>Роли, блокировка пользователей и индивидуальные доступы к закрытым разделам.</p>
        </div>
        <button class="btn primary admin-back-btn" data-view="admin" type="button">Назад</button>
      </div>

      <div class="admin-users-layout">
        <form class="panel admin-users-form" data-admin-user-form>
          <input type="hidden" name="id">
          <label>
            <span>ФИО</span>
            <input name="full_name" required autocomplete="off">
          </label>
          <label>
            <span>Пароль</span>
            <input name="password" type="password" autocomplete="new-password" placeholder="Заполнить для нового или смены пароля">
          </label>
          <label>
            <span>Роль</span>
            <select name="role_level">
              ${Object.entries(ROLE_NAMES).map(([level, label]) => `<option value="${level}">${label}</option>`).join('')}
            </select>
          </label>
          <label class="admin-users-active">
            <input name="is_active" type="checkbox" checked>
            <span>Пользователь активен</span>
          </label>
          <fieldset>
            <legend>Индивидуальный доступ к закрытым разделам</legend>
            ${CLOSED_SECTION_GRANTS.map(grant => `
              <label class="admin-users-grant">
                <input type="checkbox" name="individual_permissions" value="${grant.permission}">
                <span>${grant.label}</span>
              </label>
            `).join('')}
          </fieldset>
          <div class="admin-users-actions">
            <button class="btn primary" type="submit">Сохранить</button>
            <button class="btn" data-admin-user-reset type="button">Новый пользователь</button>
          </div>
          <p class="admin-users-status" data-admin-users-status></p>
        </form>

        <article class="panel admin-users-list-panel">
          <div class="case-card-head">
            <h3>Список пользователей</h3>
          </div>
          <div class="table-wrap">
            <table class="admin-users-table">
              <thead>
                <tr>
                  <th>ФИО</th>
                  <th>Роль</th>
                  <th>Статус</th>
                  <th>Доступы</th>
                  <th></th>
                </tr>
              </thead>
              <tbody data-admin-users-body>
                <tr><td colspan="5">Загрузка...</td></tr>
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </section>
  `;
}
