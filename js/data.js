/**
 * Estela Logistics B2B - Dataset Operativo
 * Base de datos en memoria para guías de remisión, telemetría y trazabilidad multimodal.
 */

const INITIAL_SHIPMENTS = [
  {
    id: 'EST-8942',
    recipient: 'Aceros Arequipa S.A.',
    city: 'Arequipa',
    address: 'Parque Industrial Mz. B Lt. 4',
    status: 'EN_RUTA',
    carrier: 'Ransa Logística',
    plate: 'B7X-912',
    driver: 'Carlos Mendoza',
    eta: 'Hoy 16:30 hrs',
    weight: '14,200 kg',
    steps: [
      { time: '06:00 AM', text: 'Salida de Centro de Distribución Callao', completed: true },
      { time: '11:15 AM', text: 'Paso por estación de control Ica (Pesaje OK)', completed: true },
      { time: '02:40 PM', text: 'En tránsito por corredor Panamericana Sur', completed: true },
      { time: 'Estimado', text: 'Llegada y descarga en plataforma Arequipa', completed: false }
    ]
  },
  {
    id: 'EST-7714',
    recipient: 'Distribuidora Química del Norte',
    city: 'Trujillo',
    address: 'Av. América Sur 1842',
    status: 'EN_RUTA',
    carrier: 'Olva Cargo B2B',
    plate: 'T4M-201',
    driver: 'Raúl Morales',
    eta: 'Hoy 18:00 hrs',
    weight: '4,500 kg',
    steps: [
      { time: '07:30 AM', text: 'Carga verificada y precintos colocados', completed: true },
      { time: '12:00 PM', text: 'En ruta por Panamericana Norte (Chimbote)', completed: true },
      { time: 'Estimado', text: 'Entrega final a planta Trujillo', completed: false }
    ]
  },
  {
    id: 'EST-1024',
    recipient: 'Farmacéutica Farmindustria',
    city: 'Lima',
    address: 'Av. Industrial 520, Ate',
    status: 'ENTREGADO',
    carrier: 'Transel SAC',
    plate: 'A1B-883',
    driver: 'Jorge Huamán',
    eta: 'Hoy 10:15 hrs',
    weight: '820 kg',
    steps: [
      { time: '08:00 AM', text: 'Despacho con cadena de frío garantizada', completed: true },
      { time: '09:20 AM', text: 'Llegada a rampa de descarga', completed: true },
      { time: '10:15 AM', text: 'Guía electrónica firmada y recepcionada', completed: true }
    ]
  },
  {
    id: 'EST-4920',
    recipient: 'Minera Chinalco Perú',
    city: 'Huancayo',
    address: 'Campamento Toromocho, Junín',
    status: 'INCIDENCIA',
    carrier: 'Cruz del Sur Cargo',
    plate: 'W2C-441',
    driver: 'Edgar Quispe',
    eta: 'Reprogramado',
    weight: '22,000 kg',
    steps: [
      { time: '05:00 AM', text: 'Salida de almacén repuestos mineros', completed: true },
      { time: '09:45 AM', text: 'Cierre de Carretera Central por clima adverso', completed: true, isIncident: true },
      { time: 'Pendiente', text: 'Ruta alterna autorizada por centro de control', completed: false }
    ]
  },
  {
    id: 'EST-3301',
    recipient: 'Retail Falabella Almacenes',
    city: 'Lima',
    address: 'Centro Logístico Villa El Salvador',
    status: 'ENTREGADO',
    carrier: 'Scharff Logística',
    plate: 'C9K-114',
    driver: 'Luis Alberto Paz',
    eta: 'Hoy 11:30 hrs',
    weight: '6,100 kg',
    steps: [
      { time: '07:00 AM', text: 'Consolidación de mercadería en muelle', completed: true },
      { time: '10:00 AM', text: 'Llegada y escaneo de bultos', completed: true },
      { time: '11:30 AM', text: 'Ingreso confirmado en sistema WMS', completed: true }
    ]
  },
  {
    id: 'EST-6150',
    recipient: 'Tecnológica Nexus SAC',
    city: 'Cusco',
    address: 'Av. La Cultura 890',
    status: 'EN_RUTA',
    carrier: 'Ransa Logística',
    plate: 'X3F-778',
    driver: 'Marcos Benítez',
    eta: 'Mañana 09:00 hrs',
    weight: '1,200 kg',
    steps: [
      { time: 'Ayer 20:00', text: 'Salida de convoy nocturno desde Lima', completed: true },
      { time: '08:30 AM', text: 'Control de tránsito en Abancay', completed: true },
      { time: 'Estimado', text: 'Arribo a terminal de distribución Cusco', completed: false }
    ]
  },
  {
    id: 'EST-9023',
    recipient: 'Alimentos Gloria S.A.',
    city: 'Arequipa',
    address: 'Planta Majes Km 98',
    status: 'ENTREGADO',
    carrier: 'Transel SAC',
    plate: 'V5P-332',
    driver: 'David Valdivia',
    eta: 'Hoy 13:00 hrs',
    weight: '18,900 kg',
    steps: [
      { time: '06:30 AM', text: 'Salida con cisterna grado alimenticio', completed: true },
      { time: '11:00 AM', text: 'Recepción y análisis de laboratorio', completed: true },
      { time: '01:00 PM', text: 'Descarga finalizada en silos', completed: true }
    ]
  },
  {
    id: 'EST-1550',
    recipient: 'Ferreyros Maquinarias',
    city: 'Chiclayo',
    address: 'Carretera Panamericana Km 775',
    status: 'EN_RUTA',
    carrier: 'Cruz del Sur Cargo',
    plate: 'H8L-904',
    driver: 'Segundo Cerna',
    eta: 'Hoy 20:15 hrs',
    weight: '9,400 kg',
    steps: [
      { time: '09:00 AM', text: 'Carga pesada inspeccionada en Callao', completed: true },
      { time: '02:30 PM', text: 'Tránsito fluido por Huarmey', completed: true },
      { time: 'Estimado', text: 'Entrega en taller central Chiclayo', completed: false }
    ]
  },
  {
    id: 'EST-4432',
    recipient: 'Textil San Cristóbal',
    city: 'Piura',
    address: 'Av. Grau 1400',
    status: 'ENTREGADO',
    carrier: 'Olva Cargo B2B',
    plate: 'M8Y-662',
    driver: 'Víctor Flores',
    eta: 'Hoy 12:45 hrs',
    weight: '8,900 kg',
    steps: [
      { time: '06:00 AM', text: 'Despacho de Hub Regional Piura', completed: true },
      { time: '11:00 AM', text: 'Llegada a plataforma de recepción', completed: true },
      { time: '12:45 PM', text: 'Conformidad sellada sin observaciones', completed: true }
    ]
  },
  {
    id: 'EST-2204',
    recipient: 'Textiles del Valle S.A.',
    city: 'Chincha',
    address: 'Panamericana Sur Km 198',
    status: 'EN_PREPARACION',
    carrier: 'Transel SAC',
    plate: 'P2Z-550',
    driver: 'Ángel Cabrera',
    eta: 'Hoy 19:00 hrs',
    weight: '3,400 kg',
    steps: [
      { time: '13:00 PM', text: 'Picking y paletizado en proceso', completed: true },
      { time: 'Pendiente', text: 'Carga en camión y precintado', completed: false },
      { time: 'Pendiente', text: 'Emisión de guía de remisión', completed: false }
    ]
  },
  {
    id: 'EST-5541',
    recipient: 'Cervecería San Juan',
    city: 'Pucallpa',
    address: 'Carretera Federico Basadre Km 8.5',
    status: 'INCIDENCIA',
    carrier: 'Amazonas Cargo',
    plate: 'U1N-990',
    driver: 'Manuel Rojas',
    eta: 'En Revisión',
    weight: '18,500 kg',
    steps: [
      { time: 'Ayer 14:00', text: 'Inicio de ruta multimodal selva', completed: true },
      { time: '07:15 AM', text: 'Fallo mecánico en eje de tracto (Auxilio en camino)', completed: true, isIncident: true },
      { time: 'Pendiente', text: 'Reanudación de recorrido', completed: false }
    ]
  },
  {
    id: 'EST-8802',
    recipient: 'Cementos Pacasmayo',
    city: 'Piura',
    address: 'Zona Industrial Mz. A',
    status: 'ENTREGADO',
    carrier: 'Ransa Logística',
    plate: 'P7K-331',
    driver: 'Hernán Silva',
    eta: 'Hoy 08:30 hrs',
    weight: '28,000 kg',
    steps: [
      { time: 'Ayer 18:00', text: 'Salida de planta granelera', completed: true },
      { time: '08:30 AM', text: 'Tolva descargada en silos de cliente', completed: true }
    ]
  }
];
