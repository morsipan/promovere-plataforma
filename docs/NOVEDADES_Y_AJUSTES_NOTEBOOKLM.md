# Plataforma Promovêre — Resumen de Novedades, Mejoras y Ajustes Funcionales

> **Documento optimizado para lectura y análisis en NotebookLM.**
> **Última actualización:** 20 de noviembre de 2026
> **Alcance:** Sitio Web Público, Comunidad Trade B2B (`/comunidad`) y Panel de Administración CMS (`/admin`).

---

## 1. Resumen Ejecutivo

La plataforma **Promovêre** evolucionó hacia un ecosistema digital integral compuesto por tres pilares totalmente administrables desde **Payload CMS** (sin necesidad de programar ni tocar código):

1. **Sitio Web Público y Landings Dinámicas:** Páginas modulares con constructor de bloques, estilos globales por página y vista previa en vivo (*Live Preview*).
2. **Comunidad Trade B2B (`/comunidad` y `/comunidad/dashboard`):** Portal privado para agencias minoristas y operadores mayoristas de turismo con herramientas comerciales, herramientas inteligentes, catálogo de representaciones, promociones con vencimiento automático, agenda interactiva de eventos/Fam Tours, webinars con página dedicada, notas de blog y perfil personalizable.
3. **Panel de Administración Minimalista (`/admin`):** Interfaz renovada, más limpia y ordenada por áreas de negocio, con gestión multimedia mejorada y vista previa en tiempo real.

---

## 2. Novedades de la Comunidad Trade (Portal Privado)

### 2.1 Gestión CMS de Contenidos y Marcas (Etapa 1 y Etapa 2)
Se migró y centralizó toda la operación de la Comunidad dentro del panel de administración:
- **Marcas y Representaciones (`Representations`):** Catálogo administrable de cadenas hoteleras, DMCs y destinos representados oficialmente por Promovêre, con fichas, materiales descargables y clasificación.
- **Contenidos Privados de Comunidad (`CommunityContent`):** Gestión de recursos exclusivos para el trade, manuales, tarifas, capacitaciones y notas de blog destacadas.
- **Promociones e Incentivos (`CommunityPromotions`):** Módulo de beneficios comerciales con **fecha de vencimiento automática** para que las campañas caducadas dejen de mostrarse sin intervención manual.
- **Eventos y Capacitaciones (`CommunityEvents`):** Gestión integral de Fam Tours, desayunos comerciales, workshops y webinars.

### 2.2 Agenda Interactiva de Eventos y Fam Tours
El apartado de eventos y Fam Tours en el dashboard de Comunidad se reorganizó en un diseño de dos columnas orientado a la acción:
- **Columna izquierda — Calendario interactivo:** Permite alternar fácilmente entre **vista mensual**, **vista semanal** y **lista de próximos eventos**, facilitando la planificación comercial de las agencias.
- **Columna derecha — Eventos destacados:** Listado curado con los eventos y Fam Tours prioritarios cargados desde el CMS.

### 2.3 Webinars con Página Dedicada y Recomendaciones
Cada webinar dentro de la Comunidad ahora cuenta con su propia página dedicada (`/comunidad/dashboard/webinars/[id]`):
- Reproductor principal para ver la capacitación directamente en la plataforma.
- Columna complementaria con los detalles clave del webinar (descripción, marca/destino, duración, recursos).
- Sección final **"Sugerencias para continuar viendo"** que muestra automáticamente **3 webinars relacionados** para fomentar el recorrido continuo del usuario.

### 2.4 Herramientas Comerciales, Inteligentes e Importantes
El dashboard privado organiza la propuesta de valor en bloques claros:
- **Herramientas Comerciales:** Accesos operativos de uso diario para el agente de viajes (requisitos migratorios, seguimiento de vuelos, etc.).
- **Herramientas Inteligentes:** Suite de innovación y asistencia comercial (generador de itinerarios y soporte comercial con IA).
- **Herramientas Importantes (Notas de Blog):** Sección editorial dedicada a novedades clave del sector, comunicados y artículos informativos relevantes para la venta.

### 2.5 Perfil del Usuario y Orden Personalizable del Dashboard
Los miembros de la Comunidad disponen ahora de un espacio propio de configuración de perfil (`/comunidad/dashboard/perfil`):
- Edición de datos personales y comerciales.
- **Carga de foto de perfil (avatar)** integrada con almacenamiento en la plataforma.
- **Personalización del orden del panel de bienvenida:** Cada usuario puede elegir en qué orden prefiere visualizar los módulos de su dashboard según su forma de trabajar.

---

## 3. Personalización Visual, Banners Publicitarios y Vista Previa en Vivo

### 3.1 Configuración Visual de Comunidad (`CommunitySettings`)
Desde **Comunidad → Configuración Comunidad** en el panel admin, el equipo puede controlar la apariencia completa del portal privado:
- **Personalización Visual de Elementos:** Selección de colores de fondo, acentos, **colores de textos** y **color del título principal de bienvenida** (se corrigió el estilo base global que forzaba el gris en encabezados `h1/h2` para que el color elegido siempre se respete).
- **Vista Previa en Vivo (*Live Preview*):** Mientras el administrador ajusta colores, textos o banners en `/admin`, puede observar los cambios en tiempo real antes de guardar.

### 3.2 Espacios para Banners Publicitarios (3 Slots Configurables)
La Comunidad incorpora **3 espacios publicitarios** administrables para campañas internas o de marcas representadas:
- Compatibles con los módulos ya creados: **Banner de Imagen Ancho Completo (*Full-Width Banner*)** y **Banner de Impacto (*Impact Banner*)**.
- **Altura 100% natural de la imagen:** Si se sube un banner con proporciones específicas (por ejemplo, `1200 × 150 px`), existe la opción de respetar esa altura máxima y escalar proporcionalmente la imagen para que se vea completa sin recortes.
- **Control del efecto hover:** Se puede activar o desactivar el efecto visual al pasar el cursor según preferencia del anunciante.
- **CTA dual en Banners de Impacto:** Soporte para botón principal y **botón secundario opcional** cuando una campaña requiere dos llamadas a la acción distintas.

---

## 4. Landing Page de Comunidad Modularizada y Estilos Globales por Página

### 4.1 Landing de Comunidad (`/comunidad`) en 6 Bloques Independientes
Anteriormente, la landing pública de captación de Comunidad era un bloque único. Ahora fue desglosada en **6 bloques independientes, editables y reordenables**, cada uno con su propio panel de estilos (fondo, contraste light/dark, imagen de fondo, filtro/overlay, color de acento, botón y badge):
1. **Comunidad — 1. Hero de Bienvenida** (`communityHero`)
2. **Comunidad — 2. Herramientas Comerciales** (`communityCommercialTools`)
3. **Comunidad — 3. Promociones, Eventos y Fam Tours** (`communityPromotionsPreview`)
4. **Comunidad — 4. Herramientas Inteligentes (IA)** (`communitySmartTools`)
5. **Comunidad — 5. Productos Destacados y Destinos** (`communityFeaturedProducts`)
6. **Comunidad — 6. Franja de WhatsApp** (`communityWhatsApp`)

La página existente `/comunidad` ya fue migrada automáticamente a estos 6 bloques conservando sus textos originales, y ahora cuenta con **Live Preview en tiempo real** desde el administrador.

### 4.2 Estilos Generales Disponibles en Todas las Páginas y Landings
Se incorporó el grupo **Estilos Generales de la Página / Landing (`pageStyles`)** directamente en la colección `Pages`. Esto garantiza que **cada página o landing actual y futura** cuente siempre con controles visuales consistentes:
- **Color de Fondo de la Página** (Blanco Humo, Blanco Puro, Gris Antracita, Azul Brillante, Verde Corporativo).
- **Color Base de Títulos** (actualiza dinámicamente la variable corporativa de encabezados de la página).
- **Color Base de Textos**.
- **Color de Acento Principal** (Azul o Verde corporativo).

---

## 5. Nuevos Bloques de Marketing para el Sitio Web Público

Además de los bloques institucionales existentes, el constructor de páginas suma módulos avanzados de diseño sin código:
- **Banner de Impacto (`impactBanner`):** Soporta estilos de fondo (degradado, color sólido o imagen), alturas configurables, animaciones fluidas, gráfico secundario y doble CTA (principal + secundario opcional).
- **Imagen Ancho Completo (`fullWidthImage`):** Permite configurar el enlace tanto como botón CTA o haciendo clicable todo el banner completo.
- **Carrusel de Partners (`partnersMarquee`):** Banda de logos con desplazamiento infinito, transición por lotes (*batch-fade*) y efecto escala de grises a color al pasar el mouse.
- **Banner con Formulario Tally (`TallyBanner`):** Integración directa con popups de Tally.so para captación rápida de leads o inscripciones.

---

## 6. Rediseño Minimalista del Panel de Administración (`/admin`)

Se realizaron ajustes enfocados en usabilidad, claridad visual y consistencia de marca:

### 6.1 Nueva Arquitectura del Sidebar
El menú lateral fue renombrado y reordenado para reflejar el flujo real de trabajo del equipo:
- **Sitios** (antes *Web pública*)
  - Páginas
  - Header (encabezado y navegación)
  - Ajustes generales
- **Comunidad** (antes *Comunidad Trade*)
  - Marcas y reps (antes *Marcas y Representaciones*)
  - Contenidos privados (antes *Contenidos Privados de Comunidad*)
  - Promos e incentivos (antes *Promociones e Incentivos*)
  - Fams & Caps (antes *Eventos y Capacitaciones*)
  - Configuración Comunidad
- **Gestión** (usuarios y permisos)
- **Biblioteca multimedia**

### 6.2 Tarjeta de Usuario Minimalista y Topbar Limpio
- La tarjeta de credencial del usuario se trasladó a la **parte inferior del sidebar** con un diseño **minimalista sin colores llamativos**.
- Se eliminó el botón duplicado de cierre de sesión del sidebar (ya integrado dentro de la tarjeta del usuario).
- Se retiró el ícono de cuenta del topbar junto al breadcrumb para mantener la cabecera limpia y centrada en la navegación.

### 6.3 Biblioteca Multimedia con Conmutador de Vistas
- Se incorporó un **conmutador de vista Cuadrícula / Lista** en la Biblioteca Multimedia para agilizar la búsqueda visual de banners e imágenes o la revisión detallada de metadatos.

### 6.4 Branding de Acceso y "Recordar Cuenta"
- El login del Panel Admin incorpora el **isotipo/logo oficial de Promovêre** y un ícono de dashboard limpio sin recortes.
- El login de la Comunidad presenta un diseño de tarjeta lateral con degradado de marca.
- Ambas pantallas de acceso (Comunidad y Admin) incluyen la opción **"Recordar cuenta"** para agilizar ingresos frecuentes.

---

## 7. Experiencia de Carga y Rendimiento Visual

Para reforzar la percepción de velocidad y pulido profesional en toda la plataforma (sin añadir peso de librerías externas):
- **Barra de Progreso Superior (`TopProgressBar`):** Barra fija de 3px con degradado corporativo (`#1b87c7` a `#3cac59`) y badge flotante discreto con el **porcentaje en vivo** (tipografía *Baloo Da 2* con dígitos tabulares) al navegar entre páginas públicas y dentro del dashboard de Comunidad.
- **Pantalla de Carga de Marca (`BrandedLoader`):** Actualizada con contador animado de porcentaje (`0%` a `95%`) y barra horizontal en degradado corporativo debajo del isotipo de Promovêre.

---

## 8. Estabilidad Técnica y Base de Datos

- **Compatibilidad con PostgreSQL (Supabase):** Se estandarizaron nombres cortos de `enum` en Payload CMS para evitar el límite de 63 caracteres de identificadores en PostgreSQL, permitiendo escalar bloques complejos sin errores de esquema.
- **Migraciones aplicadas:** Todas las tablas de bloques nuevos, columnas de estilos de página, avatares de usuarios, eventos, promociones y configuración visual de Comunidad fueron migradas y verificadas en producción.
- **Validación continua:** Compilación TypeScript estricta (`tsc --noEmit`), generación automática de tipos (`payload-types.ts`) y build de producción Next.js 15 verificados sin errores.

---

## 9. Guía Rápida de Referencia (FAQ para el Equipo)

- **¿Cómo edito por separado cada sección de la landing de Comunidad?**
  Ingresar a `/admin` → **Sitios → Páginas** → abrir *Comunidad Promovêre*. Allí figuran los 6 bloques por separado; se pueden editar textos, ajustar la pestaña de **Personalización Visual** de cada bloque, arrastrarlos para cambiar su orden o agregar nuevos bloques (como *ImpactBanner* o *PartnersMarquee*), viendo los cambios en tiempo real con **Live Preview**.
- **¿Cómo cambio los colores generales de cualquier página nueva?**
  Al crear o editar cualquier documento en **Sitios → Páginas**, utilizar el bloque superior **Estilos Generales de la Página / Landing** para definir fondo, color base de títulos, textos y acento.
- **¿Cómo subo un banner publicitario de 1200×150 sin que se recorte en Comunidad?**
  En **Comunidad → Configuración Comunidad**, cargar el banner en uno de los 3 espacios disponibles, seleccionar la opción de **altura 100% natural de la imagen** y elegir si se desea activar o desactivar el efecto *hover*.
- **¿Dónde configuran los usuarios de la Comunidad su foto y el orden de su inicio?**
  Ingresando a su panel en `/comunidad/dashboard` y accediendo a **Mi Perfil** (`/comunidad/dashboard/perfil`).
