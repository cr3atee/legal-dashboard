import { renderSidebar } from './sidebar.js';
import { renderTopbar } from './topbar.js';
import { renderFloatingEditMenu } from './floatingEditMenu.js';
import { renderUtilityPanels } from './utilityPanels.js';
import { renderDashboardPage } from '../pages/dashboardPage.js';
import { renderCasesPage } from '../pages/casesPage.js';
import { renderControlledCasesPage } from '../pages/controlledCasesPage.js';
import { renderEnforcementPage } from '../pages/enforcementPage.js';
import { renderCalendarPage } from '../pages/calendarPage.js';
import { renderSchedulePage } from '../pages/schedulePage.js';
import { renderMapPage } from '../pages/mapPage.js';
import { renderEmergencyFundPage } from '../pages/emergencyFundPage.js';
import { renderMunicipalRegistryPage } from '../pages/municipalRegistryPage.js';
import { renderMeetingsPage } from '../pages/meetingsPage.js';
import { renderSettingsPage } from '../pages/settingsPage.js';
import { renderReportsPage } from '../pages/reportsPage.js';
import { renderAdminToolsPage } from '../pages/adminToolsPage.js';
import { renderAdminUsersPage } from '../pages/adminUsersPage.js';
import { renderAdminDictionariesPage } from '../pages/adminDictionariesPage.js';

export function renderAppLayout(session = null) {
  return `
    <div class="app">
      ${renderSidebar()}

      <main class="main">
        ${renderTopbar(session)}

        <div class="content">
          ${renderDashboardPage()}
          ${renderCasesPage()}
          ${renderControlledCasesPage()}
          ${renderReportsPage()}
          ${renderEnforcementPage()}
          ${renderCalendarPage()}
          ${renderSchedulePage()}
          ${renderMapPage()}
          ${renderEmergencyFundPage()}
          ${renderMunicipalRegistryPage()}
          ${renderMeetingsPage()}
          ${renderAdminToolsPage(session)}
          ${renderAdminUsersPage()}
          ${renderAdminDictionariesPage()}
          ${renderSettingsPage()}
        </div>
      </main>

      ${renderFloatingEditMenu()}
      ${renderUtilityPanels()}
    </div>
  `;
}
