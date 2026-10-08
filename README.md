# Estela Freight Logistics B2B (ShipTrack)

Dashboard de operaciones de transporte, distribución interprovincial y trazabilidad logística B2B de alta densidad de datos.

---

## 1. Descripcion General

Estela Logistics es una Single Page Application (SPA) orientada a la gestion de flotas, monitoreo de carga pesada y auditoria de entregas de ultima milla en tiempo real. 

El proyecto fue concebido como una demostracion de ingenieria web frontend de alto rendimiento sin empaquetadores (Zero Bundlers), aprovechando las capacidades nativas de HTML5, CSS3 y Vanilla JavaScript moderno para ofrecer una experiencia reactiva fluida a 60 FPS, con pipelines de datos en memoria y diseno visual de grado corporativo.

---

## 2. Enfoque de Diseno y Experiencia de Usuario (UI/UX)

* **Diseno Enmarcado por Contraste (Framed Layout):** Encabezado en azul marino indigo profundo (`#0f172a` / `#1e1b4b`), lienzo central claro con malla tecnica blueprint de ingenieria, y pie de pagina en obsidiana oscuro (`#020617`).
* **Glassmorphism y Luz Ambiental:** Tarjetas de metricas (KPIs), barra de filtrado y contenedor principal con acabado de vidrio esmerilado (`backdrop-filter: blur()`), bordes traslucidos y refraccion sobre orbes de iluminacion ambiental difusa.
* **Tabla de Alta Densidad (Data-Dense Table):** Visualizacion compacta y legible de 7 columnas operativas optimizadas para analisis de multiples guias simultaneas sin recarga de pagina.
* **Telemetria Vectorial Animada:** Panel lateral deslizante con trayecto en SVG animado (flujo continuo de linea y pulso radar en tiempo real) y cronograma de custodia interactivo (Stepper).
* **Pie de Pagina de Negocio Corporativo:** Direcciones y telefonos de sedes a nivel nacional, catalogo de soluciones de transporte, canal de Libro de Reclamaciones y mapa interactivo embebido de Google Maps enfocado en el Hub Central Callao.

---

## 3. Caracteristicas Tecnicas y Modulos

### Torre de Control Operativo
* **Pipeline de filtrado en memoria:** Segmentacion instantanea por estado operativo (*Todos*, *En Ruta*, *Entregados*, *Incidencias*) con contadores reactivos.
* **Busqueda predictiva multi-campo:** Coincidencia en tiempo real por numero de guia (`EST-8942`), razon social del cliente corporativo, ciudad de destino y empresa transportista.
* **Ordenamiento bidireccional:** Reordenamiento alfabetico y cronologico ascendente/descendente al interactuar con las cabeceras de columna.
* **Boton de Accion "Ver Ruta":** Despliega el panel lateral de telemetria conservando el contexto de la navegacion.

### Panel Lateral de Trazabilidad (Slide-Over Drawer)
* Representacion esquematica SVG de la ruta interprovincial con hitos de transito (Callao, Ica, Arequipa, Trujillo, etc.).
* Datos de custodia vehicular: transportista asignado, placa de tracto, conductor, peso de carga y centro de origen.
* Historial cronologico de custodia (Timeline Stepper) con identificadores de eventos e incidencias.
* Confirmacion de entrega y firma de conformidad digital integrada en memoria.

### Portal de Rastreo Publico
* Modulo de consulta simplificado para clientes y destinatarios finales.
* Barra de progreso porcentual calculada dinamicamente segun la cantidad de hitos completados.
* Desglose accesible de cada etapa de entrega.

### Reloj Operativo en Vivo
* Sincronizacion por segundo con zona horaria de operaciones (PET).

---

## 4. Stack Tecnologico

* **Lenguaje:** Vanilla JavaScript (ES6+ modular, sin dependencias de compilacion).
* **Estructura:** HTML5 semantico.
* **Estilos:** CSS3 nativo (`styles.css`) con Tailwind CSS CDN para utilidades de maquetacion.
* **Empaquetadores:** Ninguno (Zero Bundler Architecture).
* **Integraciones:** Google Maps Embed API para localizacion geografica de infraestructura.

---

## 5. Estructura del Repositorio

```
shiptrack/
├── .github/
│   └── workflows/
│       └── deploy.yml        # Automatizacion de despliegue en GitHub Pages
├── css/
│   └── styles.css            # Reglas de glassmorphism, animaciones y tipografia
├── js/
│   ├── app.js               # Controlador de estado reactivo, vistas y eventos
│   └── data.js              # Dataset inicial de guias de remision y telemetria
├── .gitignore                # Exclusion de temporales y archivos de sistema
├── index.html                # Interfaz principal de la aplicacion
└── README.md                 # Documentacion tecnica del proyecto
```

---

## 6. Instrucciones de Ejecucion Local

Al ser un proyecto estatico sin herramientas de compilacion, puede ejecutarse inmediatamente mediante cualquiera de los siguientes metodos:

### Metodo 1: Apertura directa
Doble clic sobre el archivo `index.html` en el explorador de archivos para cargarlo directamente en el navegador.

### Metodo 2: Servidor HTTP local con Node.js
```bash
npx serve .
```

### Metodo 3: Servidor HTTP local con Python
```bash
python -m http.server 8000
```
Luego abrir `http://localhost:8000` en el navegador.

---

## 7. Despliegue en Produccion

El repositorio cuenta con un flujo automatizado en GitHub Actions (`.github/workflows/deploy.yml`) configurado para desplegar de forma continua los archivos estaticos en **GitHub Pages** ante cada confirmacion en la rama principal (`main`).
