/**
 * Estela Logistics B2B - Controlador Principal de Aplicación
 * Vanilla JavaScript puro sin dependencias externas ni empaquetadores.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Estado reactivo en memoria
  let shipments = [...INITIAL_SHIPMENTS];
  let currentFilter = 'ALL';
  let searchQuery = '';
  let sortColumn = 'id';
  let sortDirection = 'asc';
  let currentActiveShipment = null;

  // Elementos DOM principales
  const tableBody = document.getElementById('table-body');
  const displayedCount = document.getElementById('displayed-count');
  const totalCount = document.getElementById('total-count');
  const searchInput = document.getElementById('table-search-input');
  const liveClockEl = document.getElementById('header-live-clock');

  // Panel lateral Slide-Over
  const slideOverBackdrop = document.getElementById('slide-over-backdrop');
  const slideOverDrawer = document.getElementById('slide-over');
  const soTrackingId = document.getElementById('so-tracking-id');
  const soStatusBadge = document.getElementById('so-status-badge');
  const soRecipient = document.getElementById('so-recipient');
  const soOrigin = document.getElementById('so-origin');
  const soDestination = document.getElementById('so-destination');
  const soCarrier = document.getElementById('so-carrier');
  const soWeight = document.getElementById('so-weight');
  const soStepperSteps = document.getElementById('so-stepper-steps');
  const btnSoDeliver = document.getElementById('btn-so-deliver');

  // Vistas SPA
  const viewShipments = document.getElementById('view-shipments');
  const viewTracking = document.getElementById('view-tracking');
  const tabNavShipments = document.getElementById('tab-nav-shipments');
  const tabNavTracking = document.getElementById('tab-nav-tracking');

  // Input de rastreo público
  const trackingSearchCode = document.getElementById('tracking-search-code');
  const trackingResultContainer = document.getElementById('tracking-result-container');

  /**
   * Obtiene la lista de envíos filtrada y ordenada según los criterios activos
   */
  function getFilteredShipments() {
    return shipments
      .filter(item => {
        if (currentFilter !== 'ALL' && item.status !== currentFilter) {
          return false;
        }

        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const matchId = item.id.toLowerCase().includes(q);
          const matchRecipient = item.recipient.toLowerCase().includes(q);
          const matchCity = item.city.toLowerCase().includes(q);
          const matchCarrier = item.carrier.toLowerCase().includes(q);
          if (!matchId && !matchRecipient && !matchCity && !matchCarrier) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        let valA = a[sortColumn];
        let valB = b[sortColumn];

        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }

  /**
   * Renderiza la tabla de datos de alta densidad (7 columnas, sin checkboxes)
   */
  function renderTable() {
    const data = getFilteredShipments();
    if (displayedCount) displayedCount.textContent = data.length;
    if (totalCount) totalCount.textContent = shipments.length;

    if (data.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center py-12 text-slate-400 font-sans">
            No se encontraron guías que coincidan con la búsqueda.
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = data
      .map(item => {
        const statusBadge = getStatusBadge(item.status);

        return `
          <tr class="hover:bg-indigo-50/40 transition-colors group">
            <td class="py-3.5 px-4 font-mono-custom font-extrabold text-indigo-950 hover:text-indigo-700 cursor-pointer" data-id="${item.id}">
              ${item.id}
            </td>
            <td class="py-3.5 px-4 font-semibold text-slate-900">
              ${item.recipient}
            </td>
            <td class="py-3.5 px-4 text-slate-600">
              ${item.city}
            </td>
            <td class="py-3.5 px-4">
              ${statusBadge}
            </td>
            <td class="py-3.5 px-4 text-slate-500">
              ${item.carrier}
            </td>
            <td class="py-3.5 px-4 font-mono-custom text-slate-700">
              ${item.eta}
            </td>
            <td class="py-3.5 px-4 text-right">
              <button data-action="open-slideover" data-id="${item.id}" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs bg-indigo-50 border border-indigo-200/90 text-indigo-950 hover:bg-indigo-950 hover:text-white hover:border-indigo-950 transition-all shadow-2xs active:scale-95 group/btn">
                <svg class="w-3.5 h-3.5 text-indigo-600 group-hover/btn:text-amber-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <span>Ver Ruta</span>
              </button>
            </td>
          </tr>
        `;
      })
      .join('');

    updateCounters();
  }

  /**
   * Genera el badge HTML para el estado operativo del envío
   */
  function getStatusBadge(status) {
    if (status === 'EN_RUTA') {
      return `<span class="bg-amber-50 border border-amber-200 text-amber-700 px-2.5 py-0.5 rounded-full text-xs font-mono-custom font-semibold">EN RUTA</span>`;
    }
    if (status === 'ENTREGADO') {
      return `<span class="bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-0.5 rounded-full text-xs font-mono-custom font-semibold">ENTREGADO</span>`;
    }
    if (status === 'INCIDENCIA') {
      return `<span class="bg-rose-50 border border-rose-200 text-rose-700 px-2.5 py-0.5 rounded-full text-xs font-mono-custom font-semibold">INCIDENCIA</span>`;
    }
    return `<span class="bg-slate-100 border border-slate-200 text-slate-600 px-2.5 py-0.5 rounded-full text-xs font-mono-custom font-semibold">EN PREP.</span>`;
  }

  /**
   * Actualiza los contadores de KPIs y badges de filtro
   */
  function updateCounters() {
    const total = shipments.length;
    const inTransit = shipments.filter(s => s.status === 'EN_RUTA').length;
    const delivered = shipments.filter(s => s.status === 'ENTREGADO').length;
    const incidents = shipments.filter(s => s.status === 'INCIDENCIA').length;

    const elTotal = document.getElementById('kpi-total-shipments');
    const elInTransit = document.getElementById('kpi-in-transit');
    const elDelivered = document.getElementById('kpi-delivered');
    const elIncidents = document.getElementById('kpi-incidents');

    if (elTotal) elTotal.textContent = total;
    if (elInTransit) elInTransit.textContent = inTransit;
    if (elDelivered) elDelivered.textContent = delivered;
    if (elIncidents) elIncidents.textContent = incidents;

    const bAll = document.getElementById('badge-count-all');
    const bInTransit = document.getElementById('badge-count-in-transit');
    const bDelivered = document.getElementById('badge-count-delivered');
    const bIncidents = document.getElementById('badge-count-incidents');

    if (bAll) bAll.textContent = `(${total})`;
    if (bInTransit) bInTransit.textContent = `(${inTransit})`;
    if (bDelivered) bDelivered.textContent = `(${delivered})`;
    if (bIncidents) bIncidents.textContent = `(${incidents})`;
  }

  /**
   * Aplica un filtro de estado operativo
   */
  function applyFilter(filter) {
    currentFilter = filter;
    document.querySelectorAll('.filter-tab').forEach(btn => {
      btn.className =
        'filter-tab text-xs font-semibold px-3.5 py-2 rounded-xl transition-all text-slate-600 hover:text-slate-900 hover:bg-slate-100';
    });
    const activeBtn = document.getElementById(`filter-btn-${filter}`);
    if (activeBtn) {
      activeBtn.className =
        'filter-tab text-xs font-bold px-3.5 py-2 rounded-xl transition-all bg-indigo-950 text-white shadow-xs';
    }
    renderTable();
  }

  /**
   * Ordena por la columna indicada
   */
  function handleSort(col) {
    if (sortColumn === col) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortColumn = col;
      sortDirection = 'asc';
    }

    document.querySelectorAll('[id^="sort-icon-"]').forEach(el => (el.textContent = '↕'));
    const activeIcon = document.getElementById(`sort-icon-${col}`);
    if (activeIcon) {
      activeIcon.textContent = sortDirection === 'asc' ? '↑' : '↓';
    }

    renderTable();
  }

  /**
   * Renderiza dinámicamente el mapa de telemetría SVG según el estado del envío
   */
  function renderTelemetryMap(item) {
    const container = document.getElementById('so-map-container');
    if (!container) return;

    const city = item.city.toUpperCase();
    let midName = 'ICA';
    if (['TRUJILLO', 'CHICLAYO', 'PIURA'].includes(city)) {
      midName = 'CHIMBOTE';
    } else if (['HUANCAYO', 'PUCALLPA'].includes(city)) {
      midName = 'TICLIO';
    } else if (city === 'LIMA') {
      midName = 'PANAMERICANA';
    }

    let headerDot = 'bg-emerald-400 animate-pulse';
    let headerStatusText = 'Telemetría en Tiempo Real';
    let distanceInfo = 'En Tránsito • Telemetría activa';
    let svgContent = '';

    if (item.status === 'ENTREGADO') {
      headerDot = 'bg-emerald-400';
      headerStatusText = 'Trayecto Completado';
      distanceInfo = 'Arribo a Destino • 100% Finalizado';

      svgContent = `
        <svg class="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
          <path d="M 35,50 Q 150,15 250,75 T 365,40" fill="none" stroke="#1e293b" stroke-width="3" stroke-linecap="round" />
          <path d="M 35,50 Q 150,15 250,75 T 365,40" fill="none" stroke="#10b981" stroke-width="3.5" stroke-linecap="round" />
          
          <circle cx="35" cy="50" r="5" fill="#10b981" />
          <text x="35" y="70" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">CALLAO</text>

          <circle cx="180" cy="40" r="4.5" fill="#10b981" />
          <text x="180" y="25" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">${midName}</text>

          <circle cx="365" cy="40" r="10" fill="#10b981" opacity="0.3" class="radar-pulse" />
          <circle cx="365" cy="40" r="6" fill="#10b981" />
          <text x="365" y="65" fill="#10b981" font-size="9" font-weight="bold" font-family="monospace" text-anchor="middle">${city}</text>
          <text x="365" y="78" fill="#34d399" font-size="8" font-weight="bold" font-family="monospace" text-anchor="middle">ENTREGADO ✓</text>
        </svg>
      `;
    } else if (item.status === 'INCIDENCIA') {
      headerDot = 'bg-rose-500 animate-pulse';
      headerStatusText = 'Alerta de Custodia';
      distanceInfo = 'Unidad Detenida • Auxilio Despachado';

      svgContent = `
        <svg class="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
          <path d="M 35,50 Q 150,15 250,75 T 365,40" fill="none" stroke="#334155" stroke-width="3" stroke-linecap="round" />
          <path d="M 35,50 Q 150,15 220,60" fill="none" stroke="#f43f5e" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="5 3" />
          <path d="M 220,60 Q 250,75 T 365,40" fill="none" stroke="#475569" stroke-width="2" stroke-dasharray="2 4" />
          
          <circle cx="35" cy="50" r="5" fill="#10b981" />
          <text x="35" y="70" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">CALLAO</text>

          <circle cx="150" cy="30" r="4" fill="#fbbf24" />
          <text x="150" y="20" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">${midName}</text>

          <circle cx="220" cy="60" r="11" fill="#f43f5e" opacity="0.4" class="radar-pulse" />
          <circle cx="220" cy="60" r="6" fill="#f43f5e" />
          <text x="220" y="80" fill="#f43f5e" font-size="9" font-weight="bold" font-family="monospace" text-anchor="middle">INCIDENCIA !</text>

          <circle cx="365" cy="40" r="4" fill="#64748b" />
          <text x="365" y="25" fill="#64748b" font-size="9" font-family="monospace" text-anchor="middle">${city}</text>
        </svg>
      `;
    } else if (item.status === 'EN_PREPARACION') {
      headerDot = 'bg-sky-400 animate-pulse';
      headerStatusText = 'En Andén de Carga';
      distanceInfo = '0 km • Verificación de Precintos';

      svgContent = `
        <svg class="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
          <path d="M 35,50 Q 150,15 250,75 T 365,40" fill="none" stroke="#334155" stroke-width="3" stroke-linecap="round" stroke-dasharray="4 4" />
          
          <circle cx="35" cy="50" r="9" fill="#38bdf8" opacity="0.3" class="radar-pulse" />
          <circle cx="35" cy="50" r="5.5" fill="#38bdf8" />
          <text x="35" y="72" fill="#38bdf8" font-size="9" font-weight="bold" font-family="monospace" text-anchor="middle">ANDÉN CALLAO</text>

          <circle cx="180" cy="40" r="4" fill="#475569" />
          <text x="180" y="25" fill="#64748b" font-size="9" font-family="monospace" text-anchor="middle">${midName}</text>

          <circle cx="365" cy="40" r="4" fill="#475569" />
          <text x="365" y="25" fill="#64748b" font-size="9" font-family="monospace" text-anchor="middle">${city}</text>
        </svg>
      `;
    } else {
      headerDot = 'bg-emerald-400 animate-pulse';
      headerStatusText = 'Telemetría en Vivo';
      distanceInfo = 'En Tránsito • 72% completado';

      svgContent = `
        <svg class="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
          <path d="M 35,50 Q 150,15 250,75 T 365,40" fill="none" stroke="#334155" stroke-width="3" stroke-linecap="round" />
          <path d="M 35,50 Q 150,15 250,75 T 285,55" fill="none" stroke="#6366f1" stroke-width="3" stroke-linecap="round" class="route-animated-line" />
          
          <circle cx="35" cy="50" r="5" fill="#10b981" />
          <text x="35" y="70" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">CALLAO</text>

          <circle cx="180" cy="40" r="4" fill="#6366f1" />
          <text x="180" y="25" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">${midName}</text>

          <circle cx="285" cy="55" r="9" fill="#f59e0b" opacity="0.3" class="radar-pulse" />
          <circle cx="285" cy="55" r="5" fill="#f59e0b" />
          <text x="285" y="78" fill="#f59e0b" font-size="9" font-weight="bold" font-family="monospace" text-anchor="middle">UNIDAD GPS</text>

          <circle cx="365" cy="40" r="4" fill="#64748b" />
          <text x="365" y="25" fill="#94a3b8" font-size="9" font-family="monospace" text-anchor="middle">${city}</text>
        </svg>
      `;
    }

    container.innerHTML = `
      <div class="flex items-center justify-between mb-3 text-xs font-mono-custom text-slate-300">
        <span class="flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full ${headerDot}"></span>
          ${headerStatusText}
        </span>
        <span class="text-amber-400 font-bold">${distanceInfo}</span>
      </div>
      <div class="h-28 w-full relative">
        ${svgContent}
      </div>
    `;
  }

  /**
   * Abre el panel lateral con la telemetría y el stepper de custodia
   */
  function openSlideOver(id) {
    const item = shipments.find(s => s.id === id);
    if (!item) return;

    currentActiveShipment = item;

    soTrackingId.textContent = item.id;
    soStatusBadge.innerHTML = getStatusBadge(item.status);
    soRecipient.textContent = item.recipient;
    soDestination.textContent = item.city;
    soCarrier.textContent = `${item.carrier} • ${item.plate}`;
    soWeight.textContent = item.weight;

    // Renderizar gráfico dinámico de telemetría reactivo al estado
    renderTelemetryMap(item);

    soStepperSteps.innerHTML = item.steps
      .map((step, idx) => {
        let dotColor = 'bg-slate-300';
        let ringColor = '';
        let textColor = 'text-slate-500';

        if (step.isIncident) {
          dotColor = 'bg-rose-500';
          ringColor = 'ring-4 ring-rose-100';
          textColor = 'text-rose-700 font-semibold';
        } else if (step.completed) {
          dotColor = 'bg-emerald-500';
          textColor = 'text-slate-900 font-medium';
        }

        return `
          <div class="relative flex items-start gap-3 group">
            <div class="w-5 h-5 rounded-full ${dotColor} ${ringColor} flex items-center justify-center shrink-0 z-10 text-white text-[10px]">
              ${step.completed && !step.isIncident ? '✓' : ''}
              ${step.isIncident ? '!' : ''}
            </div>
            <div class="space-y-0.5 flex-1">
              <span class="text-[11px] font-mono-custom text-slate-400 block">${step.time}</span>
              <p class="text-xs ${textColor}">${step.text}</p>
            </div>
          </div>
        `;
      })
      .join('');

    if (item.status === 'ENTREGADO') {
      btnSoDeliver.classList.add('hidden');
    } else {
      btnSoDeliver.classList.remove('hidden');
    }

    slideOverBackdrop.classList.remove('hidden');
    slideOverDrawer.classList.remove('translate-x-full');
    document.body.classList.add('overflow-hidden');
  }

  /**
   * Cierra el panel lateral
   */
  function closeSlideOver() {
    slideOverDrawer.classList.add('translate-x-full');
    slideOverBackdrop.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }

  /**
   * Confirma la entrega y actualiza el estado del envío en memoria
   */
  function markShipmentDelivered() {
    if (!currentActiveShipment) return;

    currentActiveShipment.status = 'ENTREGADO';
    currentActiveShipment.steps.push({
      time: 'Recién confirmado',
      text: 'Conformidad de entrega firmada en plataforma',
      completed: true
    });

    renderTable();
    openSlideOver(currentActiveShipment.id);
  }

  /**
   * Alterna entre vistas SPA: 'shipments' y 'tracking'
   */
  function switchView(viewName) {
    if (viewName === 'shipments') {
      viewShipments.classList.remove('hidden');
      viewTracking.classList.add('hidden');

      tabNavShipments.className =
        'text-xs font-bold px-4 py-2 rounded-xl transition-all bg-white text-indigo-950 shadow-sm';
      tabNavTracking.className =
        'text-xs font-medium px-4 py-2 rounded-xl transition-all text-indigo-200 hover:text-white hover:bg-indigo-800/50';
    } else {
      viewShipments.classList.add('hidden');
      viewTracking.classList.remove('hidden');

      tabNavShipments.className =
        'text-xs font-medium px-4 py-2 rounded-xl transition-all text-indigo-200 hover:text-white hover:bg-indigo-800/50';
      tabNavTracking.className =
        'text-xs font-bold px-4 py-2 rounded-xl transition-all bg-white text-indigo-950 shadow-sm';

      lookupTrackingCode();
    }
  }

  /**
   * Consulta pública de guía de rastreo
   */
  function lookupTrackingCode() {
    const code = trackingSearchCode.value.trim().toUpperCase();
    const item = shipments.find(s => s.id === code);

    if (!item) {
      trackingResultContainer.innerHTML = `
        <div class="text-center py-8 text-slate-400">
          <p class="font-medium text-slate-600">No se encontró información para la guía "${code}".</p>
          <p class="text-xs mt-1">Prueba ingresando códigos activos como <strong>EST-8942</strong> o <strong>EST-7714</strong>.</p>
        </div>
      `;
      return;
    }

    const completedSteps = item.steps.filter(s => s.completed).length;
    const progressPercent = Math.round((completedSteps / item.steps.length) * 100);

    trackingResultContainer.innerHTML = `
      <div class="bg-slate-50/80 border border-slate-200 rounded-2xl p-6 space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-sm font-mono-custom font-extrabold text-indigo-950">${item.id}</span>
              ${getStatusBadge(item.status)}
            </div>
            <h3 class="text-base font-bold text-slate-900 mt-1">${item.recipient}</h3>
            <p class="text-xs text-slate-500">${item.address}, ${item.city}</p>
          </div>
          <div class="text-right">
            <span class="text-xs text-slate-400 block font-mono-custom">Estimado de Entrega</span>
            <span class="text-sm font-bold text-indigo-950 font-mono-custom">${item.eta}</span>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between text-xs mb-2 font-mono-custom">
            <span class="text-slate-500">Progreso de Custodia</span>
            <span class="font-bold text-indigo-950">${progressPercent}%</span>
          </div>
          <div class="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
            <div class="bg-indigo-950 h-2.5 rounded-full transition-all duration-500" style="width: ${progressPercent}%"></div>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 font-mono-custom text-xs">
          <div>
            <span class="text-slate-400 block">Transportista</span>
            <span class="text-slate-800 font-semibold">${item.carrier}</span>
          </div>
          <div>
            <span class="text-slate-400 block">Conductor & Unidad</span>
            <span class="text-slate-800 font-semibold">${item.driver} (${item.plate})</span>
          </div>
          <div>
            <span class="text-slate-400 block">Peso de Carga</span>
            <span class="text-indigo-950 font-bold">${item.weight}</span>
          </div>
        </div>

        <div class="space-y-4 pt-4 border-t border-slate-200">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono-custom">Hitos de la Ruta</h4>
          <div class="space-y-4 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            ${item.steps
              .map(step => `
                <div class="relative flex items-start gap-3">
                  <div class="w-5 h-5 rounded-full ${
                    step.isIncident
                      ? 'bg-rose-500 ring-4 ring-rose-100'
                      : step.completed
                      ? 'bg-emerald-500'
                      : 'bg-slate-300'
                  } flex items-center justify-center shrink-0 z-10 text-white text-[10px]">
                    ${step.completed && !step.isIncident ? '✓' : ''}
                    ${step.isIncident ? '!' : ''}
                  </div>
                  <div>
                    <span class="text-[11px] font-mono-custom text-slate-400 block">${step.time}</span>
                    <p class="text-xs ${
                      step.isIncident
                        ? 'text-rose-700 font-semibold'
                        : step.completed
                        ? 'text-slate-900 font-medium'
                        : 'text-slate-500'
                    }">${step.text}</p>
                  </div>
                </div>
              `)
              .join('')}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Actualiza el reloj en tiempo real del encabezado
   */
  function updateLiveClock() {
    if (liveClockEl) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('es-PE', { hour12: false }) + ' PET';
      liveClockEl.textContent = timeStr;
    }
  }

  // Delegación de eventos e inicializaciones
  if (searchInput) {
    searchInput.addEventListener('input', e => {
      searchQuery = e.target.value;
      renderTable();
    });
  }

  // Pestañas de filtros
  document.querySelectorAll('.filter-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter') || btn.id.replace('filter-btn-', '');
      applyFilter(filter);
    });
  });

  // Cabeceras ordenables
  document.querySelectorAll('th[data-sort]').forEach(th => {
    th.addEventListener('click', () => {
      const col = th.getAttribute('data-sort');
      handleSort(col);
    });
  });

  // Acciones en la tabla
  if (tableBody) {
    tableBody.addEventListener('click', e => {
      const targetBtn = e.target.closest('[data-action="open-slideover"]');
      if (targetBtn) {
        const id = targetBtn.getAttribute('data-id');
        openSlideOver(id);
        return;
      }

      const idCell = e.target.closest('td[data-id]');
      if (idCell) {
        const id = idCell.getAttribute('data-id');
        openSlideOver(id);
      }
    });
  }

  // Botón confirmar entrega
  if (btnSoDeliver) {
    btnSoDeliver.addEventListener('click', markShipmentDelivered);
  }

  // Botón cerrar drawer
  document.querySelectorAll('[data-action="close-slideover"]').forEach(btn => {
    btn.addEventListener('click', closeSlideOver);
  });
  if (slideOverBackdrop) {
    slideOverBackdrop.addEventListener('click', closeSlideOver);
  }

  // Selector de navegación de vistas
  const brandLink = document.getElementById('brand-link');
  if (brandLink) {
    brandLink.addEventListener('click', () => switchView('shipments'));
  }
  if (tabNavShipments) {
    tabNavShipments.addEventListener('click', () => switchView('shipments'));
  }
  if (tabNavTracking) {
    tabNavTracking.addEventListener('click', () => switchView('tracking'));
  }

  // Rastreador público
  const btnLookup = document.getElementById('btn-lookup-tracking');
  if (btnLookup) {
    btnLookup.addEventListener('click', lookupTrackingCode);
  }
  if (trackingSearchCode) {
    trackingSearchCode.addEventListener('keyup', e => {
      if (e.key === 'Enter') lookupTrackingCode();
    });
  }

  // Inicio de reloj y tabla
  setInterval(updateLiveClock, 1000);
  updateLiveClock();
  renderTable();
});
