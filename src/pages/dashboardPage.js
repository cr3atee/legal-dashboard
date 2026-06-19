export function renderDashboardPage() {
  return `
    <section class="view active dashboard-modern" id="dashboard">
      <div class="dashboard-edit-hint">
        Перемещай виджеты за верхнюю плашку. Меняй размер за правый нижний угол.
        Gridstack сам не даёт виджетам накладываться друг на друга.
      </div>

      <div class="dashboard-modern-grid-shell">
        <div class="grid-stack" id="dashboardGrid"></div>
      </div>
    </section>
  `;
}
