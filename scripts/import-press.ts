import pg from 'pg';

const { Client } = pg;

interface RawPressLink {
  texto: string;
  href: string;
}

interface CleanedPressArticle {
  url: string;
  canonicalKey: string;
  title: string;
  summary: string;
  mediaOutlet: string;
  publishedDate: string | null;
}

const RAW_PRESS_LINKS: RawPressLink[] = [
  { texto: '', href: 'https://www.promovere.com.ar/inicio' },
  { texto: 'Marketing turístico', href: 'https://www.promovere.com.ar/inicio' },
  { texto: 'Inicio', href: 'https://www.promovere.com.ar/inicio' },
  { texto: 'Representaciones turísticas', href: 'https://www.promovere.com.ar/servicios_1/representaciones-tur%C3%ADsticas' },
  { texto: 'Marketing Turístico', href: 'https://www.promovere.com.ar/servicios_1/marketing-tur%C3%ADstico' },
  { texto: 'Relaciones Públicas', href: 'https://www.promovere.com.ar/servicios_1/relaciones-p%C3%BAblicas' },
  { texto: 'Atelier de Hoteles', href: 'https://www.promovere.com.ar/reps/atelier-de-hoteles' },
  { texto: 'Enjoy Travel Group', href: 'https://www.promovere.com.ar/reps/enjoy-travel-group' },
  { texto: 'Hellenic Travel Network', href: 'https://www.promovere.com.ar/reps/hellenic-travel-network' },
  { texto: 'Hoteles Solaris', href: 'https://www.promovere.com.ar/reps/hoteles-solaris' },
  { texto: 'Islas Caimán', href: 'https://www.promovere.com.ar/reps/islas-caim%C3%A1n' },
  { texto: 'SunVista', href: 'https://www.promovere.com.ar/reps/islas-caim%C3%A1n/sunvista' },
  { texto: 'Xplorer DMC', href: 'https://www.promovere.com.ar/reps/xplorer-dmc' },
  { texto: 'Caribe Mexicano', href: 'https://www.promovere.com.ar/reps/caribe-mexicano' },
  { texto: 'Mais Brasil', href: 'https://www.promovere.com.ar/reps/mais-brasil' },
  { texto: 'Marketing turístico', href: 'https://www.promovere.com.ar/inicio' },
  { texto: 'Inicio', href: 'https://www.promovere.com.ar/inicio' },
  { texto: 'Representaciones turísticas', href: 'https://www.promovere.com.ar/servicios_1/representaciones-tur%C3%ADsticas' },
  { texto: 'Marketing Turístico', href: 'https://www.promovere.com.ar/servicios_1/marketing-tur%C3%ADstico' },
  { texto: 'Relaciones Públicas', href: 'https://www.promovere.com.ar/servicios_1/relaciones-p%C3%BAblicas' },
  { texto: 'Atelier de Hoteles', href: 'https://www.promovere.com.ar/reps/atelier-de-hoteles' },
  { texto: 'Enjoy Travel Group', href: 'https://www.promovere.com.ar/reps/enjoy-travel-group' },
  { texto: 'Hellenic Travel Network', href: 'https://www.promovere.com.ar/reps/hellenic-travel-network' },
  { texto: 'Hoteles Solaris', href: 'https://www.promovere.com.ar/reps/hoteles-solaris' },
  { texto: 'Islas Caimán', href: 'https://www.promovere.com.ar/reps/islas-caim%C3%A1n' },
  { texto: 'SunVista', href: 'https://www.promovere.com.ar/reps/islas-caim%C3%A1n/sunvista' },
  { texto: 'Xplorer DMC', href: 'https://www.promovere.com.ar/reps/xplorer-dmc' },
  { texto: 'Caribe Mexicano', href: 'https://www.promovere.com.ar/reps/caribe-mexicano' },
  { texto: 'Mais Brasil', href: 'https://www.promovere.com.ar/reps/mais-brasil' },
  { texto: 'Inicio', href: 'https://www.promovere.com.ar/inicio' },
  { texto: 'Representaciones turísticas', href: 'https://www.promovere.com.ar/servicios_1/representaciones-tur%C3%ADsticas' },
  { texto: 'Marketing Turístico', href: 'https://www.promovere.com.ar/servicios_1/marketing-tur%C3%ADstico' },
  { texto: 'Relaciones Públicas', href: 'https://www.promovere.com.ar/servicios_1/relaciones-p%C3%BAblicas' },
  { texto: 'Atelier de Hoteles', href: 'https://www.promovere.com.ar/reps/atelier-de-hoteles' },
  { texto: 'Enjoy Travel Group', href: 'https://www.promovere.com.ar/reps/enjoy-travel-group' },
  { texto: 'Hellenic Travel Network', href: 'https://www.promovere.com.ar/reps/hellenic-travel-network' },
  { texto: 'Hoteles Solaris', href: 'https://www.promovere.com.ar/reps/hoteles-solaris' },
  { texto: 'Islas Caimán', href: 'https://www.promovere.com.ar/reps/islas-caim%C3%A1n' },
  { texto: 'SunVista', href: 'https://www.promovere.com.ar/reps/islas-caim%C3%A1n/sunvista' },
  { texto: 'Xplorer DMC', href: 'https://www.promovere.com.ar/reps/xplorer-dmc' },
  { texto: 'Caribe Mexicano', href: 'https://www.promovere.com.ar/reps/caribe-mexicano' },
  { texto: 'Mais Brasil', href: 'https://www.promovere.com.ar/reps/mais-brasil' },
  {
    texto: 'Enjoy Travel Group recibe prestigioso reconocimiento por su labor en la promoción internacional del Camino de Santiago • PDCC Enjoy Travel Group ha sido distinguida con el Premio Anual del Camino de Santiago, un reconocimiento a su contribución a la promoción internacional de las rutas jacobeas y a su labor en el posicionamiento turístico de Galicia, Asturias y el norte de España en mercados internacionales.',
    href: 'https://www.google.com/url?q=https%3A%2F%2Fnewsinamerica.com%2Fpdcc%2Fturismo%2F2026%2Fenjoy-travel-group-recibe-prestigioso-reconocimiento-por-su-labor-en-la-promocion-internacional-del-camino-de-santiago%2F&sa=D&sntz=1&usg=AOvVaw2HlBspJqzYfx_s00ssLTM3',
  },
  {
    texto: '',
    href: 'https://www.google.com/url?q=https%3A%2F%2Fwww.eldiariodeturismo.com.ar%2F2026%2F11%2F17%2Fmas-experiencias-flexibilidad-y-servicios-para-potenciar-la-venta-de-estados-unidos%2F&sa=D&sntz=1&usg=AOvVaw3t3zItGI2VUqfX0G34Blen',
  },
  {
    texto: 'Más experiencias, flexibilidad y servicios para potenciar la venta de Estados Unidos',
    href: 'https://www.eldiariodeturismo.com.ar/2026/11/17/mas-experiencias-flexibilidad-y-servicios-para-potenciar-la-venta-de-estados-unidos/',
  },
  {
    texto: '',
    href: 'https://www.google.com/url?q=https%3A%2F%2Frumboproducciones.ar%2F&sa=D&sntz=1&usg=AOvVaw2NXHUejmkLHzWnWARtsMdH',
  },
  {
    texto: 'Día de Muertos eleva al Caribe Mexicano como destino de cultura y alta gastronomía - MIRADAS NOTICIAS Del 23 de octubre al 3 de noviembre, el Caribe Mexicano combinará la tradición maya del Janal Pixán con 19 restaurantes reconocidos por la Guía MICHELIN México 2026. CANCÚN, MÉXICO. El Día de Muertos se convierte este año en una nueva oportunidad para descubrir el Caribe Mexicano a través de su cultura, gastronomía y tradiciones. […]',
    href: 'https://www.google.com/url?q=https%3A%2F%2Fmiradasnoticias.com%2F2026%2F10%2F22%2Fdia-de-muertos-eleva-al-caribe-mexicano-como-destino-de-cultura-y-alta-gastronomia%2F&sa=D&sntz=1&usg=AOvVaw1gTIAZt6EgjuaVRp4uW6x1',
  },
  {
    texto: 'Hoteles Solaris en Los Cabos y Cancún - Contexto Turístico Hoteles Solaris en Los Cabos y Cancún: propuestas para cada viajero presentadas en FIT 2026. Opciones para adultos, familias y parejas.',
    href: 'https://www.google.com/url?q=https%3A%2F%2Fcontextoturistico.com%2Fhoteles-solaris-en-los-cabos-y-cancun%2F&sa=D&sntz=1&usg=AOvVaw0um8kJ3wkQ_jiR4OP7gWvV',
  },
  {
    texto: '',
    href: 'https://www.google.com/url?q=https%3A%2F%2Fwww.eldiariodeturismo.com.ar%2F2026%2F10%2F01%2Fultimos-meses-para-acceder-a-la-preventa-2027-de-hellenic-travel-network-a-precios-2026%2F&sa=D&sntz=1&usg=AOvVaw2BPGwBDCZ_Lsy8v7vaSdk-',
  },
  {
    texto: 'Últimos meses para acceder a la preventa 2027 de Hellenic Travel Network a precios 2026',
    href: 'https://www.eldiariodeturismo.com.ar/2026/10/01/ultimos-meses-para-acceder-a-la-preventa-2027-de-hellenic-travel-network-a-precios-2026/',
  },
  {
    texto: 'Los Cabos y Cancún: naturaleza, experiencias y propuestas para cada tipo de viajero Hoteles Solaris estuvo presente en FIT 2026 a través de Promovêre, acercando al trade turístico argentino las novedades de la cadena en Los Cabos y Cancún, con una propuesta de experiencias y opciones de alojamiento para diferentes perfiles de viajeros.Los Cabos continúa posicionándose como un destino con gran potencial dentro de la oferta del Pacífico […]',
    href: 'https://www.google.com/url?q=https%3A%2F%2Frumbo.ar%2Fwebsite%2Flos-cabos-y-cancun-naturaleza-experiencias-y-propuestas-para-cada-tipo-de-viajero%2F&sa=D&sntz=1&usg=AOvVaw1ViwMLe69zTmT1HzEcYxAt',
  },
  { texto: '', href: 'https://www.promovere.com.ar/reps/atelier-de-hoteles' },
  {
    texto: 'Grupo Lomas apuesta por el mercado argentino De la mano de Promovêre, la empresa posa sus ojos en Argentina con una propuesta integral en el Caribe Mexicano y presencia en FIT 2026.',
    href: 'https://www.google.com/url?q=https%3A%2F%2Fargentina.ladevi.info%2Fnegocios%2Fgrupo-lomas-apuesta-el-mercado-argentino-n106384&sa=D&sntz=1&usg=AOvVaw2RlA5jybSkk-GoZeWpu7C3',
  },
  {
    texto: 'El nuevo lujo en el Caribe: experiencias, bienestar y diseño redefinen la forma de viajar ATELIER Playa Mujeres estuvo presente en FIT 2026 a través de Promovêre, acercando al trade turístico argentino una propuesta all-inclusive de lujo que responde a las nuevas demandas del viajero premium, con una experiencia basada en el concepto de “lujo descalzo”, bienestar, diseño y conexión con el entorno. El viajero de lujo está cambiando. Ya […]',
    href: 'https://www.google.com/url?q=https%3A%2F%2Frumbo.ar%2Fwebsite%2Fel-nuevo-lujo-en-el-caribe-experiencias-bienestar-y-diseno-redefinen-la-forma-de-viajar%2F&sa=D&sntz=1&usg=AOvVaw0loitQahbgEgg8yzSSPSjx',
  },
  {
    texto: 'Caribe Mexicano fortalece su estrategia comercial con un roadshow por Córdoba y Rosario De la mano de Interluxe Group, el destino llevó su propuesta a más de 140 agentes, en una acción de promoción y capacitación que tendrá su cierre en FIT 2026.',
    href: 'https://www.google.com/url?q=https%3A%2F%2Fargentina.ladevi.info%2Fnegocios%2Fcaribe-mexicano-fortalece-su-estrategia-comercial-un-roadshow-cordoba-y-rosario-n106428&sa=D&sntz=1&usg=AOvVaw0q1TyHfFNf975vyf_X0uhT',
  },
  {
    texto: 'Promovêre amplía su propuesta con nuevas herramientas para agentes de viajes Promovêre lanzó una comunidad para agentes de viajes y amplió sus servicios de representación, eventos y relaciones públicas en Latinoamérica.',
    href: 'https://www.google.com/url?q=https%3A%2F%2Fargentina.ladevi.info%2Fnegocios%2Fpromovere-amplia-su-propuesta-nuevas-herramientas-agentes-viajes-n106562&sa=D&sntz=1&usg=AOvVaw3RwPv1pmkI0fgwW-HX5Kww',
  },
  { texto: '', href: 'https://www.promovere.com.ar/reps/hellenic-travel-network' },
  {
    texto: '',
    href: 'https://www.google.com/url?q=https%3A%2F%2Fwww.eldiariodeturismo.com.ar%2F2026%2F10%2F02%2Fenjoy-travel-group-potencia-enjoypro-con-traslados-a-nivel-mundial-y-amplia-su-propuesta-b2b%2F&sa=D&sntz=1&usg=AOvVaw35tQuRxKf48gPPaoJISuR2',
  },
  {
    texto: '',
    href: 'https://www.google.com/url?q=https%3A%2F%2Fwww.eldiariodeturismo.com.ar%2F2026%2F10%2F02%2Festados-unidos-a-medida-nuevas-propuestas-para-transformar-cada-viaje-en-una-experiencia-personalizada%2F&sa=D&sntz=1&usg=AOvVaw3TS82TqApgU4gIoRcQXH6s',
  },
  {
    texto: 'Enjoy Travel Group potencia EnjoyPRO con traslados a nivel mundial y amplía su propuesta B2B',
    href: 'https://www.eldiariodeturismo.com.ar/2026/10/02/enjoy-travel-group-potencia-enjoypro-con-traslados-a-nivel-mundial-y-amplia-su-propuesta-b2b/',
  },
  {
    texto: 'Santiago y el eje cafetero: tres propuestas de Enjoy Travel Group para ampliar la oferta de viajes en Sudamérica Desde escapadas urbanas hasta experiencias de enoturismo y circuitos que combinan ciudad, naturaleza y playa, Enjoy Travel Group presenta diferentes alternativas para que los agentes de viajes amplíen su portfolio y ofrezcan experiencias en Sudamérica adaptadas a distintos perfiles de pasajeros. Para quienes buscan descubrir, Colombia permite ofrecer un recorrido más completo a través de […]',
    href: 'https://www.google.com/url?q=https%3A%2F%2Frumbo.ar%2Fwebsite%2Fsantiago-y-el-eje-cafetero-tres-propuestas-de-enjoy-travel-group-para-ampliar-la-oferta-de-viajes-en-sudamerica%2F%3Ffbclid%3DPAb21jcAUHl2twZG9mAmV4dG4DYWVtAjExAHNydGMGYXBwX2lkDzU2NzA2NzM0MzM1MjQyNwABp9iKCyEzXUASTfVMBEwR87HrRvfq_MIzBzWyZBCvcefDAJsnfrqrXboD40Gc_aem_i8fXVVQQZRAYjljI1no0Zg&sa=D&sntz=1&usg=AOvVaw3majcSygubFdH8L8jOzfxQ',
  },
  {
    texto: 'Cinco razones para elegir Puerto Plata en tus próximas vacaciones Sol, playas de aguas cálidas, naturaleza, historia y una amplia variedad de experiencias hacen de Puerto Plata un destino ideal para quienes buscan unas vacaciones en el Caribe que combinen descanso, aventura y descubrimiento. Ubicada en la costa norte de República Dominicana, la ciudad ofrece propuestas para disfrutar tanto de unos días de relax como […]',
    href: 'https://www.google.com/url?q=https%3A%2F%2Frumbo.ar%2Fwebsite%2Fcinco-razones-para-elegir-puerto-plata-en-tus-proximas-vacaciones%2F%3Ffbclid%3DPAb21jcAUK9CpwZG9mAmV4dG4DYWVtAjExAHNydGMGYXBwX2lkDzU2NzA2NzM0MzM1MjQyNwABpxIPc4-7XFh_04JoXHwIVMIfn301LoBbXfXd0ODJFPc_ZjAw1UpwG1z8w5wK_aem_n7fYMu0YfBmFz3Q35RzGHw&sa=D&sntz=1&usg=AOvVaw2cHBPPwOioSPkY8hEl2in0',
  },
  {
    texto: '',
    href: 'https://www.google.com/url?q=https%3A%2F%2Fmiradasnoticias.com%2F&sa=D&sntz=1&usg=AOvVaw1iTqDXN8_lO6DaqrFvEJP9',
  },
  {
    texto: 'Hellenic Travel Network presenta su preventa 2027 con tarifas congeladas al valor de 2026',
    href: 'https://dailyweb.com.ar/noticias/val/55335/hellenic-travel-network-presenta-su-preventa-2027--con-tarifas-congeladas-al-valor-de-2026.html',
  },
  {
    texto: 'Dos propuestas, un mismo destino: nuevas oportunidades para vender Estados Unidos.',
    href: 'https://dailyweb.com.ar/noticias/val/55357/dos-propuestas-un-mismo-destino-nuevas-oportunidades-para-vender-estados-unidos.html',
  },
  {
    texto: '',
    href: 'https://www.google.com/url?q=https%3A%2F%2Fdailyweb.com.ar%2Fnoticias%2Fval%2F55289%2Fbacalar-una-invitacion-a-la-calma-entre-siete-tonos-de-azul.html&sa=D&sntz=1&usg=AOvVaw2a1hEBtwmMdzTaM9Lfgzo3',
  },
  {
    texto: 'Experiencias que conectan con la cultura maya: la propuesta del Caribe Mexicano para descubrir su historia Más allá de sus paisajes paradisíacos, el destino invita a descubrir una civilización que sigue viva a través de sitios arqueológicos, comunidades ancestrales, gastronomía, tradiciones y experiencias culturales que enriquecen cada viaje',
    href: 'https://www.google.com/url?q=https%3A%2F%2Felciudadanoweb.com%2Fexperiencias-que-conectan-con-la-cultura-maya-la-propuesta-del-caribe-mexicano-para-descubrir-su-historia%2F&sa=D&sntz=1&usg=AOvVaw3ru464T10B0jbYd1QnXohR',
  },
  {
    texto: 'El Caribe Mexicano se consolida como destino de grandes eventos deportivos internacionales Con su óptima infraestructura hotelera y variadas actividades vinculadas al Mundial, el Caribe Mexicano afirma su posicionamiento como destino turístico.',
    href: 'https://www.google.com/url?q=https%3A%2F%2Fargentina.ladevi.info%2Fnegocios%2Fel-caribe-mexicano-se-consolida-como-destino-grandes-eventos-deportivos-internacionales-n102091&sa=D&sntz=1&usg=AOvVaw0zGReJW7wwQtOrXsoF24EK',
  },
  {
    texto: 'Descubre North Side y la icónica playa Rum Point: una escapada al Caribe como ninguna otra - MIRADAS NOTICIAS Ubicado sobre la tranquila costa norte de Grand Cayman, el distrito de North Side ofrece una auténtica experiencia caribeña, caracterizada por aguas cristalinas, el relajado espíritu isleño y una naturaleza de extraordinaria belleza. GEORGE TOWN, ISLAS CAIMÁN. Hogar de la reconocida Rum Point Beach, el distrito de North Side continúa conquistando a viajeros internacionales que […]',
    href: 'https://www.google.com/url?q=https%3A%2F%2Fmiradasnoticias.com%2F2026%2F07%2F22%2Fdescubre-north-side-y-la-iconica-playa-rum-point-una-escapada-al-caribe-como-ninguna-otra%2F&sa=D&sntz=1&usg=AOvVaw1hqAeU1X7xWKNQgHi5Cogj',
  },
  {
    texto: '',
    href: 'https://www.google.com/url?q=https%3A%2F%2Fonline.anyflip.com%2Fcyto%2Flwfs%2Fmobile%2Findex.html%23p%3D33&sa=D&sntz=1&usg=AOvVaw1d0J2USV52pWesSJKyyx-h',
  },
  {
    texto: 'Hoteles Solaris: Hospitalidad personalizada y experiencias all inclusive en México',
    href: 'https://online.anyflip.com/cyto/lwfs/mobile/index.html#p=33',
  },
  {
    texto: 'Puerto Rico e Islas Caimán lideran la redefición del turismo experiencial en el Caribe',
    href: 'https://www.caribbeannewsdigital.com/es/turismo/puerto-rico-e-islas-caiman-lideran-la-redefinicion-del-turismo-experiencial-en-el-caribe',
  },
  {
    texto: 'Panamá e Islas Caimán: Dos destinos en un viaje único Los viajes multidestino continúan consolidándose entre las principales tendencias del turismo internacional y, en ese contexto, Enjoy Travel Group junto a SunVista presentan una propuesta que combina la conectividad y el perfil cosmopolita de Panamá con el lujo y la exclusividad de Islas Caimán. El programa fue diseñado para viajeros que buscan experiencias más completas, […]',
    href: 'https://www.google.com/url?q=https%3A%2F%2Frumbo.ar%2Fwebsite%2Fpanama-e-islas-caiman-dos-destinos-en-un-viaje-unico%2F&sa=D&sntz=1&usg=AOvVaw1SdwLc6jGhq3oA9KEtOOuA',
  },
  {
    texto: 'Karisma Hotels refuerza su cercanía con las agencias argentinas y presenta novedades de sus marcas De la mano de Promovere, Karisma Hotels profundiza su trabajo con agencias de viajes argentinas, presentando sus propuestas familiares y de lujo.',
    href: 'https://www.google.com/url?q=https%3A%2F%2Fargentina.ladevi.info%2Fnegocios%2Fkarisma-hotels-refuerza-su-cercania-las-agencias-argentinas-y-presenta-novedades-sus-marcas-n100924&sa=D&sntz=1&usg=AOvVaw31gRlGEOC8Pwrv3a1T9b78',
  },
  {
    texto: 'Marketing turístico y diversificación de destinos: el caso del Caribe Mexicano como estrategia de posicionamiento regional Ana Laura Sergio compartió su visión sobre cómo es necesario repensar la estrategia de difusión más segmentada para cada sitio encontrando su valor particular.',
    href: 'https://mensajero-com-ar.cdn.ampproject.org/c/s/mensajero.com.ar/opinion/marketing-turistico-y-diversificacion-de-destinos--el-caso-del-caribe-mexicano-como-estrategia-de-posicionamiento-regional_a6a0ddc58c81a2d7b35a9aacb?output=amp',
  },
  {
    texto: 'Hoteles Solaris presentó su oferta en Cancún y Los Cabos - Report News La cadena mexicana realizó una presentación para operadores y agentes de Buenos Aires, Córdoba y Rosario. El encuentro permitió acercar al trade argentino las novedades de la compañía, con foco en servicio personalizado, producto all inclusive, entretenimiento, gastronomía, wellness y oportunidades comerciales. Hoteles Solaris reforzó su presencia en el mercado argentino con una presentación realizada […]',
    href: 'https://www.google.com/url?q=https%3A%2F%2Freportnews.la%2Fblog%2F2026%2F05%2F18%2Fhoteles-solaris-presento-en-la-argentina-su-oferta-en-cancun-y-los-cabos%2F&sa=D&sntz=1&usg=AOvVaw2QaAhhPlpy2dnAKhiy4SEl',
  },
  {
    texto: 'Vila Galé apuesta al Cono Sur de la mano de Promovêre - Rumbo Trade Promovêre, empresa especializada en marketing turístico, anuncia la incorporación de la cadena hotelera portuguesa Vila Galé a sus propuestas comerciales. Esta alianza estratégica tiene como objetivo potenciar el posicionamiento de la marca en los mercados del Cono Sur, incrementando su visibilidad y desarrollo comercial en la región. Con más de tres décadas de trayectoria, Vila […]',
    href: 'https://www.google.com/url?q=https%3A%2F%2Frumbo.ar%2Fwebsite%2Fvila-gale-apuesta-al-cono-sur-de-la-mano-de-promovere%2F&sa=D&sntz=1&usg=AOvVaw3h_UMOQq8zOxmYDC32Qcn3',
  },
  {
    texto: 'Caimán: Epicentro Culinario del Caribe - MIRADAS NOTICIAS Con más de 300 restaurantes y eventos de talla mundial como el Cayman Cookout, las islas se consolidan como el destino gastronómico definitivo del Caribe en 2026. GRAND CAYMAN. Históricamente famosas por sus playas de ensueño, las Islas Caimán han logrado lo que pocos destinos caribeños: transformar su mesa en su principal atractivo turístico. Hoy, […]',
    href: 'https://www.google.com/url?q=https%3A%2F%2Fmiradasnoticias.com%2F2026%2F04%2F10%2Fcaiman-epicentro-culinario-del-caribe%2F&sa=D&sntz=1&usg=AOvVaw0kZN894q64mlVNFDRs6L94',
  },
  {
    texto: 'Caribe Mexicano: 12 destinos únicos para descubrir el paraíso El Caribe Mexicano es sinónimo de belleza natural, hospitalidad y experiencias inolvidables. Con más de 1.000 kilómetros de costa, esta región reúne',
    href: 'https://www.google.com/url?q=https%3A%2F%2Felciudadanoweb.com%2Fcaribe-mexicano-12-destinos-unicos-para-descubrir-el-paraiso%2F&sa=D&sntz=1&usg=AOvVaw15hSGEdQ0vU1zDY8Iyzwnt',
  },
  {
    texto: 'Azul Mediterráneo: una experiencia para conocer los encantos del sudeste europeo - TURISMO12AR En un contexto donde los viajeros buscan aprovechar al máximo cada experiencia, los viajes multidestino se consolidan como una de',
    href: 'https://www.google.com/url?q=https%3A%2F%2Fturismo12ar.com%2F2026%2F03%2F31%2Fazul-mediterraneo-una-experiencia-para-conocer-los-encantos-del-sudeste-europeo%2F&sa=D&sntz=1&usg=AOvVaw2jvqRh2aBO5QS1oGbWUM2s',
  },
  {
    texto: 'En Cuba, un hotel para descansar sin apuros Si estás buscando un destino donde bajar un cambio, tocar el mar con los pies y olvidarte por unos días de la rutina, Cayo Santa María puede ser ese lugar. Este islote al norte de Cuba forma parte de los cayos de Villa Clara, una cadena de playas interminables de arena blanca y agua transparente don',
    href: 'https://www.google.com/url?q=https%3A%2F%2Fwww.lasrosas.com.ar%2Fportal%2Fen-cuba-un-hotel-para-descansar-sin-apuros%2F&sa=D&sntz=1&usg=AOvVaw0jfscOKi5n6gi9LgS9Nnuo',
  },
  {
    texto: 'Grecia y el Mediterráneo a medida: Hellenic Travel Network lanza su Tarifario 2026 con más de 50 circuitos garantizados en español - MIRADAS NOTICIAS *La DMC, con tres décadas de experiencia, presenta nuevas rutas que incluyen Esparta y combinaciones con Turquía, Italia y Egipto. Ejecutivos de la firma recibirán a los agentes en el Pabellón 4 de FITUR en Madrid. Buenos Aires, 12 de enero de 2026. – Consolidando su liderazgo en el Mediterráneo Oriental, Hellenic Travel Network anunció […]',
    href: 'https://www.google.com/url?q=https%3A%2F%2Fmiradasnoticias.com%2F2026%2F01%2F13%2Fgrecia-y-el-mediterraneo-a-medida-hellenic-travel-network-lanza-su-tarifario-2026-con-mas-de-50-circuitos-garantizados-en-espanol%2F&sa=D&sntz=1&usg=AOvVaw3aQSO7RLcmZVmNczVIlpIg',
  },
  {
    texto: 'Promovere celebra nuevos mercados, alojamientos y la conexión con sus agentes La gerente de Promoción, Andrea Tosi, habló con Mensajero y celebró las incorporaciones hoteleras que permiten la presencia de la marca en más destinos.',
    href: 'https://www.google.com/url?q=https%3A%2F%2Fmensajero.com.ar%2Falojamiento-y-gastronomia%2Fpromovere-celebra-nuevos-mercados--alojamientos-y-la-conexion-con-sus-agentes_a69457ddfe1d826efea1edb4a&sa=D&sntz=1&usg=AOvVaw3pYXec2w5Vo-Pm7yiRxl-n',
  },
  {
    texto: 'Caribe: estas son las 5 islas más seguras según la plataforma Going Going analizó datos oficiales y posicionó las 5 islas del Caribe más destacadas en materia de seguridad, infraestructura turística y protección al viajero.',
    href: 'https://www.google.com/url?q=https%3A%2F%2Fargentina.ladevi.info%2Factualidad-latam%2Fcaribe-estas-son-las-5-islas-mas-seguras-segun-la-plataforma-going-n93830&sa=D&sntz=1&usg=AOvVaw06zxbRaDp8eyVOUhvPVvgD',
  },
  {
    texto: 'Varadero: hoteles de alto nivel y experiencias únicas en Cuba - El Enviador Descubra por qué Varadero se consolida como destino estratégico en el Caribe. Analizamos la oferta de Gaviota Hoteles (Playa Vista Azul, Punta Hicacos y Luxury Varadero) y las opciones de excursiones a La Habana para armar paquetes turísticos de alto valor agregado.',
    href: 'https://www.google.com/url?q=https%3A%2F%2Felenviador.com%2F2025%2F12%2F13%2Fvaradero-hoteles-de-alto-nivel-y-experiencias-unicas-en-cuba%2F&sa=D&sntz=1&usg=AOvVaw3tYBrZRNV6U9oEvuaTbe0f',
  },
  {
    texto: 'Hoteles Solaris Obtiene La Certificación Green Key Y Refuerza Su Apuesta Por El Turismo Sostenible En México » Viajo Con Vos Hoteles Solaris obtuvo la certificación Green Key 2025–2026 y refuerza su compromiso con el turismo sostenible en Cancún y Los Cabos.',
    href: 'https://www.google.com/url?q=https%3A%2F%2Fviajoconvos.com.ar%2Fhoteles-solaris-green-key%2F&sa=D&sntz=1&usg=AOvVaw2_pq1IbhIJgLnmYXim2zcV',
  },
  {
    texto: 'Promovêre representará a Hoteles Solaris en el Cono Sur Con la incorporación de Promovêre como nueva representante para Argentina y el Cono Sur, Hoteles Solaris continúa fortaleciendo su presencia en América del Sur.',
    href: 'https://www.google.com/url?q=https%3A%2F%2Fargentina.ladevi.info%2Fnegocios%2Fpromovere-representara-hoteles-solaris-el-cono-sur-n92252&sa=D&sntz=1&usg=AOvVaw0WChIsUueof2dTb3OE9H6X',
  },
  {
    texto: 'Tres playas sin sargazo para disfrutar del Caribe en vacaciones - TURISMO12AR En un contexto en el que el sargazo se ha convertido en un desafío para gran parte del Caribe, tres',
    href: 'https://www.google.com/url?q=https%3A%2F%2Fturismo12ar.com%2F2025%2F11%2F20%2Ftres-playas-sin-sargazo-para-disfrutar-del-caribe-en-vacaciones%2F&sa=D&sntz=1&usg=AOvVaw2HnOsPOZU7vZRFsT4FX96h',
  },
  {
    texto: 'Exitosa 7ma edición de The North Experience Exitosa 7ma edición de The North Experience',
    href: 'https://www.google.com/url?q=https%3A%2F%2Fwww.boardingpax.com%2Fexitosa-7ma-edicion-de-the-north-experience%2F&sa=D&sntz=1&usg=AOvVaw2l_SOq4b0UEnNP18ClbUw1',
  },
  {
    texto: '',
    href: 'https://www.google.com/url?q=https%3A%2F%2Fwww.caribbeannewsdigital.com%2Fes%2Fturismo%2Fislas-caiman-seduce-al-viajero-latinoamericano-con-experiencias-unicas&sa=D&sntz=1&usg=AOvVaw34EiH_8eUEaRxQ0ZUQWKUM',
  },
  {
    texto: 'Islas Caimán seduce al viajero latinoamericano con experiencias únicas',
    href: 'https://www.caribbeannewsdigital.com/es/turismo/islas-caiman-seduce-al-viajero-latinoamericano-con-experiencias-unicas',
  },
  {
    texto: 'Las Islas Caimán consolidan su posición como uno de los destinos más cautivadores del Caribe, impulsadas por una creciente demanda del mercado latinoamericano y una oferta que combina lujo, naturaleza y cultura. Con nuevas acciones promocionales y experiencias emblemáticas, el archipiélago caribeño refuerza su presencia en la región y se posiciona como un destino ideal para quienes buscan vacaciones memorables, auténticas y sofisticadas.',
    href: 'https://www.caribbeannewsdigital.com/es/turismo/islas-caiman-seduce-al-viajero-latinoamericano-con-experiencias-unicas',
  },
  {
    texto: 'Islas Caimán Lanza "Welcome to vaCay" Frente a la realidad de que el 40% de los viajeros regresa de sus vacaciones más cansado, el destino caribeño lanzó Welcome to vaCay Islas Caimán, una plat',
    href: 'https://www.google.com/url?q=https%3A%2F%2Fcontextoturistico.com%2Fislas-caiman-lanza-welcome-to-vacay%2F&sa=D&sntz=1&usg=AOvVaw07Vs6np2EuEppD5qOi58CN',
  },
  {
    texto: 'Enjoy Travel Group reafirma su compromiso con el desarrollo del turismo receptivo y emisivo en la región – tres60.travel En el cierre de la Feria Internacional de Turismo (FIT) 2025, Tres60.Travel dialogó con Pedro Pla, director en República Dominicana de Enjoy Travel Group, quien compartió su balance sobre la participación en esta nueva edición y los logros alcanzados en materia de conectividad y cooperación turística entre ambos países. Pla explicó que el objetivo principal',
    href: 'https://www.google.com/url?q=https%3A%2F%2Ftres60.travel%2Fenjoy-travel-group-reafirma-su-compromiso-con-el-desarrollo-del-turismo-receptivo-y-emisivo-en-la-region%2F&sa=D&sntz=1&usg=AOvVaw2AvAjiCYTR9BGeWM_NFd2W',
  },
  {
    texto: 'ÓLEO Cancún Playa: la propuesta ideal para familias en el Caribe mexicano El hotel ÓLEO Cancún Playa, perteneciente a la cadena ATELIER de Hoteles, se posiciona como una de las propiedades más',
    href: 'https://www.google.com/url?q=https%3A%2F%2Frumbo.ar%2Fwebsite%2Foleo-cancun-playa-la-propuesta-ideal-para-familias-en-el-caribe-mexicano%2F&sa=D&sntz=1&usg=AOvVaw38794ZeNfbQMDqufFNZbLY',
  },
  {
    texto: 'The One Collection, una nueva joya de lujo en Cayo Santa María - Report News El exclusivo destino cubano suma una nueva propuesta hotelera de alta gama. The One Collection es un hotel cinco estrellas solo para adultos. Ubicado en Cayo Las Brujas, el establecimiento cuenta con 67 habitaciones, de las cuales 43 ofrecen vista al mar, y está diseñado para un público exigente que busca privacidad, confort y atención […]',
    href: 'https://www.google.com/url?q=https%3A%2F%2Freportnews.la%2F%3Fp%3D46777%2F%3Fnoredirect%3Dtrue%26utm_source%3Dnewsletter%26utm_medium%3Demail%26utm_campaign%3Dreportnews&sa=D&sntz=1&usg=AOvVaw15LanB0Se3s9OyQ6V-A3Sq',
  },
  {
    texto: 'Lujo, hospitalidad y experiencias únicas: el encanto de Islas Caimán Situado en un rincón privilegiado del Caribe occidental, bañado por aguas cristalinas y un clima perfecto todo el año, Islas Caimán destaca por su',
    href: 'https://www.google.com/url?q=https%3A%2F%2Felciudadanoweb.com%2Flujo-hospitalidad-y-experiencias-unicas-el-encanto-de-islas-caiman%2F&sa=D&sntz=1&usg=AOvVaw39X4iG99URG9RN_uO305YH',
  },
  {
    texto: 'Rumbo dijo presente en Destinos Gaviota de la mano de Promovêre Del 15 al 20 de septiembre, se llevó a cabo en Cayo Santa María, Cuba, la séptima edición de Destinos Gaviota, el evento de turismo más importante del',
    href: 'https://www.google.com/url?q=https%3A%2F%2Felciudadanoweb.com%2Frumbo-dijo-presente-en-destinos-gaviota-de-la-mano-de-promovere%2F&sa=D&sntz=1&usg=AOvVaw0NLHOOeOQmGAiRoqK723Lw',
  },
  {
    texto: 'Promovêre: exitoso fam tour junto a Hoteles Solaris Recientemente tuvo lugar en Cancún un auspicioso fam tour organizado por Hoteles Solaris junto a Promovêre, al que fueron invitados operadores del Cono Sur.',
    href: 'https://www.google.com/url?q=https%3A%2F%2Fargentina.ladevi.info%2Fnegocios%2Fpromovere-exitoso-fam-tour-junto-hoteles-solaris-n87520&sa=D&sntz=1&usg=AOvVaw0GfUHH6WGpvW_HGmkqIChg',
  },
  {
    texto: 'Cayman Airways celebra 57 años con tarifas especiales de aniversario: acceso directo a las Islas Caimán vía Panamá Cayman Airways, la aerolínea bandera de Islas Caimán, celebra con orgullo su 57.º aniversario con una oferta especial que celebra',
    href: 'https://www.google.com/url?q=https%3A%2F%2Frumbo.ar%2Fwebsite%2Fcayman-airways-celebra-57-anos-con-tarifas-especiales-de-aniversario-acceso-directo-a-las-islas-caiman-via-panama%2F&sa=D&sntz=1&usg=AOvVaw3yK9rcmBFTl7sn54P1NBsE',
  },
  {
    texto: 'ATELIER Playa Mujeres brinda por el reconocimiento de tres de sus restaurantes en los premios de Wine Spectator 2025 ATELIER Playa Mujeres, el resort all-inclusive solo para adultos que está marcando la pauta en lujo y hospitalidad, celebra que tres de sus restaurantes',
    href: 'https://www.google.com/url?q=https%3A%2F%2Felciudadanoweb.com%2Fatelier-playa-mujeres-brinda-por-el-reconocimiento-de-tres-de-sus-restaurantes-en-los-premios-de-wine-spectator-2025%2F&sa=D&sntz=1&usg=AOvVaw0A_zS-qyh6Z_nx-PyaKlp4',
  },
  {
    texto: 'Enjoy Travel Group incorpora a Argentina como destino receptivo Enjoy Travel Group ofrece hotelería, paquetes, escapadas y experiencias temáticas en los principales destinos nacionales y se reafirma en el canal B2B.',
    href: 'https://www.google.com/url?q=https%3A%2F%2Fargentina.ladevi.info%2Fnegocios%2Fenjoy-travel-group-incorpora-argentina-como-destino-receptivo-n87162&sa=D&sntz=1&usg=AOvVaw1i3TgVG14ScbOEnX9dHexd',
  },
  {
    texto: 'Vacaciones en Cuba para toda la familia: el innovador concepto Playa Kids y diversión asegurada ¿Estás pensando en viajar al Caribe con chicos? Cuba es uno de los destinos más atractivos para quienes buscan combinar descanso, playas paradisíacas y propuestas pensadas para toda la familia. En Cayo Santa María, Gaviota Hoteles ofrece una opción ideal: el concepto Playa Kids, diseñado especialmente para que niñas y niños disfruten al máximo de […]',
    href: 'https://www.google.com/url?q=https%3A%2F%2Felciudadanoweb.com%2Fvacaciones-en-cuba-para-toda-la-familia-el-innovador-concepto-playa-kids-y-diversion-asegurada%2F&sa=D&sntz=1&usg=AOvVaw0PsLzdPDjGGJ7t8hYH4Qft',
  },
  {
    texto: '',
    href: 'https://www.google.com/url?q=https%3A%2F%2Frumbo.ar%2Fwebsite%2Ffam-tour-en-islas-caiman-agentes-argentinos-brasileros-y-mexicanos-vivieron-una-experiencia-de-lujo%2F&sa=D&sntz=1&usg=AOvVaw1PfzRoqENK3aiaIHgbK44y',
  },
  {
    texto: 'FAM tour en Islas Caimán: Agentes argentinos, brasileros y mexicanos vivieron una experiencia de lujo',
    href: 'https://rumbo.ar/website/fam-tour-en-islas-caiman-agentes-argentinos-brasileros-y-mexicanos-vivieron-una-experiencia-de-lujo/',
  },
  {
    texto: 'Durante tres días, los participantes del FAM recorrieron los hoteles más emblemáticos de Grand Cayman, incluyendo visitas a propiedades como el Marriott Grand Cayman, Kimpton Seafire Resort + Spa, The Ritz-Carlton, Grand Cayman, The Westin Grand Cayman Seven Mile Beach Resort & Spa y el Hampton by Hilton Grand Cayman, Seven Mile Beach, explorando sus instalaciones, servicios y propuestas diferenciadas.',
    href: 'https://rumbo.ar/website/fam-tour-en-islas-caiman-agentes-argentinos-brasileros-y-mexicanos-vivieron-una-experiencia-de-lujo/',
  },
  {
    texto: 'Cayo Santa María: el destino favorito para desconectar En el corazón del archipiélago cubano, Cayo Santa María se consolida como el destino ideal para quienes buscan desconectar de la rutina y reconectar con lo esencial: la belleza natural, la tranquilidad y la inspiración. Con sus aguas turquesas, arenas blancas y clima privilegiado, este Cayo no solo ofrece paisajes de ensueño, sino también experiencias […]',
    href: 'https://www.google.com/url?q=https%3A%2F%2Felciudadanoweb.com%2Fcayo-santa-maria-el-destino-favorito-para-desconectar%2F&sa=D&sntz=1&usg=AOvVaw3zPRCY1r9Ttx1c-UUYfoFE',
  },
  {
    texto: 'Ve más allá de la playa con rutas de senderismo y ciclismo en Islas Caimán Durante años, los viajeros se han sentido atraídos por Islas Caimán por su buceo de primera clase y sus playas',
    href: 'https://www.google.com/url?q=https%3A%2F%2Frumbo.ar%2Fwebsite%2Fve-mas-alla-de-la-playa-con-rutas-de-senderismo-y-ciclismo-en-islas-caiman%2F&sa=D&sntz=1&usg=AOvVaw3YXW2jIv6WksbuCMw8oQB5',
  },
  {
    texto: '',
    href: 'https://www.google.com/url?q=https%3A%2F%2Fwww.eldiariodeturismo.com.ar%2F2025%2F05%2F22%2Flos-tesoros-de-grecia-junto-a-hellenic-travel-network%2F&sa=D&sntz=1&usg=AOvVaw0iq1N-VaPD0AHDJT-Ga9zV',
  },
  {
    texto: 'Los tesoros de Grecia junto a Hellenic Travel Network',
    href: 'https://www.eldiariodeturismo.com.ar/2025/05/22/los-tesoros-de-grecia-junto-a-hellenic-travel-network/',
  },
  {
    texto: 'A lo largo de los años, Hellenic Travel Network ha establecido sólidas alianzas con hoteles, guías certificados, navieras y aerolíneas, lo que se traduce en tarifas competitivas, disponibilidad garantizada y estándares de servicio consistentes. Su equipo operativo multilingüe especializado en el mercado hispanohablante está disponible 24/7, ofreciendo flexibilidad operativa y una gestión ágil de cualquier requerimiento.',
    href: 'https://www.eldiariodeturismo.com.ar/2025/05/22/los-tesoros-de-grecia-junto-a-hellenic-travel-network/',
  },
  {
    texto: '',
    href: 'https://www.google.com/url?q=https%3A%2F%2Fwww.eldiariodeturismo.com.ar%2F2025%2F05%2F07%2Fgaviota-hoteles-presente-en-fitcuba-2025-consolidacion-y-expansion-de-su-oferta-turistica%2F&sa=D&sntz=1&usg=AOvVaw1zzYTsiWr1I4M-iEfjs0cK',
  },
  {
    texto: 'Gaviota Hoteles presente en FIT Cuba 2025',
    href: 'https://www.eldiariodeturismo.com.ar/2025/05/07/gaviota-hoteles-presente-en-fitcuba-2025-consolidacion-y-expansion-de-su-oferta-turistica/',
  },
  {
    texto: 'La 43.ª edición de la Feria Internacional de Turismo FITCuba 2025 se celebró del 28 de abril al 2 de mayo en La Habana, Cuba, con la participación destacada del Grupo de Turismo Gaviota Hoteles. Bajo el lema “Cuba es Única”, el evento reunió a profesionales del sector turístico para promover los atractivos de la isla, con especial énfasis en la naturaleza, la cultura y las tradiciones.',
    href: 'https://www.eldiariodeturismo.com.ar/2025/05/07/gaviota-hoteles-presente-en-fitcuba-2025-consolidacion-y-expansion-de-su-oferta-turistica/',
  },
  {
    texto: 'La mexicana Solaris desembarca en el Cono Sur - Report News La cadena hotelera decidió asociarse con Promovêre para reforzar su posicionamiento en el mercado argentino y ampliar su presencia en la región. Esta alianza estratégica tiene como objetivo incrementar la visibilidad de la oferta de Solaris y sus diferenciales entre los operadores mayoristas y las agencias de viajes locales. La hotelera mexicana tiene una trayectoria […]',
    href: 'https://www.google.com/url?q=https%3A%2F%2Freportnews.la%2Fblog%2F2025%2F04%2F11%2Fla-mexicana-solaris-desembarca-en-el-cono-sur%2F%3Ffbclid%3DPAY2xjawJmNOxleHRuA2FlbQIxMQABp0FkFqqwA-mw-WuEVKm62qkwJbePMY1pKs0NRuM_d4cQbCHN00W_MZPH0D6o_aem_s6VcoopQSQknFR6bxcObNw&sa=D&sntz=1&usg=AOvVaw2jVpGBoTwWdJkPaXLc4QVf',
  },
  {
    texto: '',
    href: 'https://www.google.com/url?q=https%3A%2F%2Fwww.eldiariodeturismo.com.ar%2F2025%2F04%2F14%2Fpromovere-fortalece-su-presencia-en-uruguay-con-una-exitosa-visita-comercial%2F&sa=D&sntz=1&usg=AOvVaw1BAPIv5k0JMk7Px93eEO06',
  },
  {
    texto: 'Promovêre fortalece su presencia en Uruguay con una exitosa visita comercial',
    href: 'https://www.eldiariodeturismo.com.ar/2025/04/14/promovere-fortalece-su-presencia-en-uruguay-con-una-exitosa-visita-comercial/',
  },
  {
    texto: 'En esta oportunidad, Promovêre realizó una visita comercial a Uruguay, con el objetivo de fortalecer su presencia en la Región, acompañada por sus marcas representadas: Hellenic Travel Network, Atelier de Hoteles, Enjoy Travel Group y Gaviota Hoteles',
    href: 'https://www.eldiariodeturismo.com.ar/2025/04/14/promovere-fortalece-su-presencia-en-uruguay-con-una-exitosa-visita-comercial/',
  },
  {
    texto: 'Un viaje imperdible en las Islas Caimán - Report News Promovêre, la empresa que representa el destino en nuestro mercado, comparte las razones que hacen del archipiélago caribeño uno de los destinos que hay que tener en consideración para este año 2025. Las Islas Caimán son la Capital Culinaria del Caribe, pero su atractivo no se limita a este único punto. También cuentan con algunas […]',
    href: 'https://www.google.com/url?q=https%3A%2F%2Freportnews.la%2Fblog%2F2025%2F02%2F26%2Fun-viaje-imperdible-en-las-islas-caiman%2F&sa=D&sntz=1&usg=AOvVaw2AavPMGSSbVD8OMqQLHapJ',
  },
  {
    texto: 'Promovere: Grecia de la mano de Hellenic Travel Network Una vez concluido su paso por FITUR, Promovere realizó un atractivo viaje de reconocimiento en Grecia de la mano de su representación, Hellenic Travel Network.',
    href: 'https://www.google.com/url?q=https%3A%2F%2Fargentina.ladevi.info%2Fnegocios%2Fpromovere-grecia-la-mano-hellenic-travel-network-n79757&sa=D&sntz=1&usg=AOvVaw2kpYfsutmFTTZrDvsgZahZ',
  },
  {
    texto: 'Enjoy Travel Group se fortalece en el Cono Sur - Report News Es gracias al intenso trabajo realizado por los equipos de Promovêre, la empresa que asegura su representación en los países de la región. Desde Promovêre, puntualizan que el crecimiento “exponencial” de la marca Enjoy Travel Group se basa sobre 3 pilares: – Atención personalizada y respuesta constante Andrea Tosi, responsable de comunicación y Promoción de […]',
    href: 'https://www.google.com/url?q=https%3A%2F%2Freportnews.la%2Fblog%2F2025%2F01%2F02%2Fenjoy-travel-group-se-fortalece-en-el-cono-sur%2F&sa=D&sntz=1&usg=AOvVaw1Nbfyl6gh6V-Wnlr3TQxd6',
  },
  {
    texto: 'Descubrí Cuba: guía completa para disfrutar playas sin sargazo, cultura y precios accesibles | Voy por el Mundo Cuba se destaca como un destino turístico excepcional, ofreciendo playas paradisíacas libres de sargazo, una cultura vibrante y precios accesibles que cautivan a cada visitante. En esta nota vas a encontrar consejos útiles para planificar tu viaje y aprovechar al máximo esta joya caribeña.',
    href: 'https://www.google.com/url?q=https%3A%2F%2Fvoydeviaje.lavoz.com.ar%2Fpreview%2FSD4PEMV4BBF77I23ZSMIMONRV4%2F%3F_website%3Dvoy-de-viaje%26_ignoreCache%3Dtrue&sa=D&sntz=1&usg=AOvVaw0SA-GPttZZk3_AZPW23HRa',
  },
  {
    texto: 'Atelier Playa Mujeres, galardonado como el mejor all inclusive de lujo del mundo El establecimiento all inclusive ubicado en Costa Mujeres y perteneciente a la cadena 100% mexicana Atelier de Hoteles, se consagró como el mejor hotel de lujo del mundo en los Luxury Travel Awards 2024. Los premios, creados en 2020, son la cumbre de los logros en la industria de viajes global y ofr',
    href: 'https://www.google.com/url?q=https%3A%2F%2Fcolombia.reportnews.la%2Fblog%2F2024%2F11%2F22%2Fatelier-playa-mujeres-galardonado-como-el-mejor-all-inclusive-de-lujo-del-mundo%2F&sa=D&sntz=1&usg=AOvVaw3iY7GitsXb4qjraAdoEYiI',
  },
  {
    texto: 'Con playas de arena blanca y mar turquesa, zonas coloniales y fuera de la franja de huracanes: 7 islas increíbles del Caribe Los destinos preferidos por los amantes del sol y la playa con acento francés, británico, holandés o español.Las principales virtudes y diferencias de las islas.',
    href: 'https://www.google.com/url?q=https%3A%2F%2Fwww.clarin.com%2Fviajes%2Fplayas-arena-blanca-mar-turquesa-zonas-coloniales-franja-huracanes-7-islas-increibles-caribe_0_pjNsIvculk.html&sa=D&sntz=1&usg=AOvVaw1Azy0QjiDoEjxPpfLbIqBD',
  },
  {
    texto: 'Islas Cayman: ¿Por qué es el destino más deseado? Arenas blancas y apacibles aguas turquesas. Las playas soñadas se conjugan con una sofisticada escena culinaria y convierten a este archipiélago, perteneciente al territorio británico de ultramar, en el primer destino de toda wish list. Este verano celebró la edición número 15 de Cayman Cookout, el festival gastronómico de lujo creado por el chef Eric Ripert en The Ritz-Carlton Gran Cayman, y descubrimos por qué es un lugar que no se compara con nada.',
    href: 'https://www.google.com/url?q=https%3A%2F%2Felle.clarin.com%2Festilo-de-vida%2Fviajes-lujo-gastronomia-islas-cayman_0_VU33B8EUX5.html&sa=D&sntz=1&usg=AOvVaw1U9TYuQCIDpTvpZKGpU4xU',
  },
  {
    texto: 'Islas Caimán: un destino que atrae cada día a más rosarinos ...',
    href: 'https://www.google.com/url?q=https%3A%2F%2Fwww.elciudadanoweb.com%2Fislas-caiman-un-destino-que-atrae-cada-dia-a-mas-rosarinos%2F&sa=D&sntz=1&usg=AOvVaw3RforYDuLZbKrrWJg8vHPo',
  },
  {
    texto: 'Islas Caimán: cómo es la experiencia en uno de los destinos más deseados del Caribe Playas de arena blanca y mar turquesa, gastronomía gourmet, snorkel y buceo. La oportunidad de nadar con rayas.',
    href: 'https://www.google.com/url?q=https%3A%2F%2Fwww.clarin.com%2Fviajes%2Fislas-caiman-experiencia-destinos-deseados-caribe_0_QbdNecQ5n.html&sa=D&sntz=1&usg=AOvVaw2rMhLFvWm7DOK2NYMIcr3b',
  },
  {
    texto: "'Cayman Cookout': Una de las mejores experiencias gourmet se encuentra en las Islas Caimán El Cayman Cookout hace una vez más su aparición en las Islas Caimán donde chefs de talla internacional se dieron cita para rendir un homenaje culinario.",
    href: 'https://www.google.com/url?q=https%3A%2F%2Fwww.forbes.com.mx%2Fforbes-life%2Fgourmet-cayman-cookout-experiencia-gourmet-islas-caiman%2F&sa=D&sntz=1&usg=AOvVaw2mWFnGoWLOFw0wAnGgtYUq',
  },
  {
    texto: '',
    href: 'https://www.google.com/url?q=https%3A%2F%2Freportnews.la%2Fblog%2F2024%2F05%2F29%2Fbeneficios-exclusivos-con-atelier-de-hoteles%2F&sa=D&sntz=1&usg=AOvVaw2kmUkt9hPiGIO6QdSSXOna',
  },
  {
    texto: '',
    href: 'http://www.google.com/url?q=http%3A%2F%2Festaciontrip.com.ar%2Fatelier-playa-mujeres-mucho-mas-que-un-hotel-de-lujo%2F&sa=D&sntz=1&usg=AOvVaw1KOJj-HMchEnGnBMXmzqSQ',
  },
  {
    texto: '',
    href: 'https://www.google.com/url?q=https%3A%2F%2Fviajoconvos.com.ar%2Fxplorer-florida-dmc-disenando-experiencias-inolvidables-en-el-estado-del-sol%2F%23google_vignette&sa=D&sntz=1&usg=AOvVaw2--yZ39qDkkVioKj6mwUIZ',
  },
  {
    texto: 'rer Florida DMC: Diseñando experiencias',
    href: 'https://viajoconvos.com.ar/xplorer-florida-dmc-disenando-experiencias-inolvidables-en-el-estado-del-sol/#google_vignette',
  },
  {
    texto: 'inolvidables en el estado del sol',
    href: 'https://viajoconvos.com.ar/xplorer-florida-dmc-disenando-experiencias-inolvidables-en-el-estado-del-sol/#google_vignette',
  },
  {
    texto: 'Enjoy Travel Group organiza la primera Convención de Potentur 2024 en Cuba Con la presencia de un grupo importante de Agencias de Viajes de México, se desarrolló en Cuba, del 4 al 8 de junio, la Convención…',
    href: 'https://www.google.com/url?q=https%3A%2F%2Frealidadturistica.com%2Frealtur%2Fenjoy-travel-group-organiza-la-primera-convencion-de-potentur-2024-en-cuba%2F&sa=D&sntz=1&usg=AOvVaw1BNuH9Qo6mHtaEh6cy_Nyg',
  },
  {
    texto: 'Paranair ya conecta a Córdoba y Asunción con tres vuelos semanales Será los miércoles, viernes y domingos. Esta semana tuvo lugar el acto inaugural de la llegada de la aerolínea al Aeropuerto Internacional Ambrosio Taravella, que suma un destino internacional.',
    href: 'https://www.google.com/url?q=https%3A%2F%2Fwww.cadena3.com%2Fnoticia%2Fcordoba%2Fparanair-ya-conecta-a-cordoba-y-asuncion-con-tres-vuelos-semanales_382930&sa=D&sntz=1&usg=AOvVaw0uUABJC0-oEdw--JjFBbAx',
  },
  {
    texto: 'Xplorer Florida DMC: “Florida seguirá siendo un destino top en 2024” El responsable comercial y de estrategia de Xplorer Florida DMC revela a Ladevi los nuevos productos de la compañía en 2024.',
    href: 'https://www.google.com/url?q=https%3A%2F%2Fargentina.ladevi.info%2Fflorida%2Fxplorer-florida-dmc-florida-seguira-siendo-un-destino-top-2024-n63219&sa=D&sntz=1&usg=AOvVaw1tv0PLgmxY5mvoyA-Ctdw2',
  },
  {
    texto: 'Euroairlines conectará con más de 300 aerolíneas tras unirse a IATA MITA - AeroErmo Nos destacamos por ser la única publicación especializada reconocida en Latinoamérica que aborda y proyecta temas de aviación de manera innovadora y diferente. Nos enfocamos en abarcar áreas importantes como educación, reparaciones, mantenimiento, operaciones y actualidad tecnológica, así como los últimos avances asociados al desarrollo del sector en Colombia y el mundo',
    href: 'https://www.google.com/url?q=https%3A%2F%2Fwww.aeroermo.com%2Fhome%2Feuroairlines-conectara-con-mas-de-300-aerolineas-tras-unirse-a-iata-mita%2F&sa=D&sntz=1&usg=AOvVaw0e_bM7jeOzJNreXg0OZBbs',
  },
  {
    texto: '¡Localidades agotadas! Paranair trabaja “casi a tope” su ruta ASU-COR: proyecta sumar frecuencias diarias (y nuevos destinos) (Por Diana Lorenzatti) A un mes de la inauguraci&oacute;n de la ruta, probamos el vuelo directo (de 1 hora y 20 minutos) de Paranair que conecta C&oacute;rdoba con Asunci&oacute;n (Paraguay). Qu&eacute; balance hacen de este primer mes y cu&aacute;les son las proyecciones. Se lo preguntamos a Jaime Cassola, gerente general de la aerol&iacute;nea de bandera paraguaya.',
    href: 'https://www.google.com/url?q=https%3A%2F%2Finfonegocios.info%2Fnota-principal%2Flocalidades-agotadas-paranair-trabaja-casi-a-tope-su-ruta-asu-cor-proyecta-sumar-frecuencias-diarias-y-nuevos-destinos&sa=D&sntz=1&usg=AOvVaw3onJbGwXyKj0yKBbOWHhwV',
  },
  {
    texto: 'Promovere y DTP organizan exclusivo FAM en Cuba de la mano de Gaviota Hoteles Promovere, representantes de la cadena hotelera Gaviota Hoteles, llevó a 9 agentes de viaje de Paraguay junto a DTP TRAVEL GROUP a un FAM exclusivo que se realizó del 31 de julio al 5 de agosto en Cuba para conocer sus alojamientos de marca propia ubicados en diversas zonas de la isla.',
    href: 'https://www.google.com/url?q=https%3A%2F%2Fwww.excelenciascuba.com%2Fturismo%2Fpromovere-y-dtp-organizan-exclusivo-fam-en-cuba-de-la-mano-de-gaviota-hoteles%23%3A~%3Atext%3DPromovere%2C%2520representantes%2520de%2520la%2520cadena%2Cdiversas%2520zonas%2520de%2520la%2520isla.&sa=D&sntz=1&usg=AOvVaw2WjBD4cz_Q9cwofgahmLCR',
  },
  {
    texto: 'The One Gallery, una experiencia fascinante para bodas en Cuba - Reportnews El resort cinco estrellas, ubicado en Cayo las Brujas, es la opción ideal para quienes desean tener la ceremonia de sus sueños en un lugar paradisíaco y, a la vez, con precios competitivos en el mercado turístico. The One Gallery resulta perfecto para tenerlo presente a la hora de hablar de bodas en destino, cuando […]',
    href: 'https://www.google.com/url?q=https%3A%2F%2Freportnews.la%2Fblog%2F2024%2F08%2F06%2Fthe-one-gallery-una-experiencia-fascinante-para-bodas-en-cuba%2F&sa=D&sntz=1&usg=AOvVaw3UQeICl9r5SKrrFHP7XNM2',
  },
];

const TRACKING_PARAMS = new Set([
  'fbclid',
  'sa',
  'sntz',
  'usg',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'noredirect',
  'output',
]);

const OUTLET_BY_DOMAIN: Array<{ match: string; name: string }> = [
  { match: 'ladevi.info', name: 'Ladevi' },
  { match: 'eldiariodeturismo.com.ar', name: 'El Diario de Turismo' },
  { match: 'reportnews.la', name: 'Report News' },
  { match: 'rumbo.ar', name: 'Rumbo Trade' },
  { match: 'elle.clarin.com', name: 'Elle / Clarín' },
  { match: 'clarin.com', name: 'Clarín' },
  { match: 'forbes.com.mx', name: 'Forbes México' },
  { match: 'newsinamerica.com', name: 'News in America (PDCC)' },
  { match: 'miradasnoticias.com', name: 'Miradas Noticias' },
  { match: 'contextoturistico.com', name: 'Contexto Turístico' },
  { match: 'dailyweb.com.ar', name: 'Daily Web' },
  { match: 'elciudadanoweb.com', name: 'El Ciudadano' },
  { match: 'online.anyflip.com', name: 'AnyFlip' },
  { match: 'caribbeannewsdigital.com', name: 'Caribbean News Digital' },
  { match: 'mensajero.com.ar', name: 'Mensajero Turístico' },
  { match: 'turismo12ar.com', name: 'Turismo 12 AR' },
  { match: 'lasrosas.com.ar', name: 'Las Rosas' },
  { match: 'elenviador.com', name: 'El Enviador' },
  { match: 'viajoconvos.com.ar', name: 'Viajo Con Vos' },
  { match: 'boardingpax.com', name: 'Boarding Pax' },
  { match: 'tres60.travel', name: 'Tres60.Travel' },
  { match: 'voydeviaje.lavoz.com.ar', name: 'Voy de Viaje (La Voz)' },
  { match: 'estaciontrip.com.ar', name: 'Estación Trip' },
  { match: 'realidadturistica.com', name: 'Realidad Turística' },
  { match: 'cadena3.com', name: 'Cadena 3' },
  { match: 'aeroermo.com', name: 'AeroErmo' },
  { match: 'infonegocios.info', name: 'InfoNegocios' },
  { match: 'excelenciascuba.com', name: 'Excelencias Cuba' },
];

const EXPLICIT_SEPARATORS = [
  ' • PDCC ',
  ' - MIRADAS NOTICIAS ',
  ' - Contexto Turístico ',
  ' - Report News ',
  ' - Reportnews ',
  ' - Rumbo Trade ',
  ' - TURISMO12AR ',
  ' - El Enviador ',
  ' » Viajo Con Vos ',
  ' – tres60.travel ',
  ' | Voy por el Mundo ',
  ' - AeroErmo ',
];

function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&aacute;/gi, 'á')
    .replace(/&eacute;/gi, 'é')
    .replace(/&iacute;/gi, 'í')
    .replace(/&oacute;/gi, 'ó')
    .replace(/&uacute;/gi, 'ú')
    .replace(/&ntilde;/gi, 'ñ')
    .replace(/&uuml;/gi, 'ü')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanExternalUrl(rawHref: string): string | null {
  let target = rawHref.trim();
  if (!target) return null;

  try {
    const parsedInitial = new URL(target);
    // 1. Limpieza de redirecciones de Google Sites (google.com/url?q=...)
    if (
      parsedInitial.hostname.toLowerCase().includes('google.com') &&
      parsedInitial.pathname === '/url'
    ) {
      const q = parsedInitial.searchParams.get('q');
      if (!q) return null;
      target = decodeURIComponent(q);
    }
  } catch {
    return null;
  }

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return null;
  }

  // 2. Desempaquetar URLs AMP de Google CDN (mensajero-com-ar.cdn.ampproject.org/c/s/...)
  if (parsed.hostname.endsWith('.cdn.ampproject.org') && parsed.pathname.startsWith('/c/s/')) {
    try {
      parsed = new URL(`https://${parsed.pathname.slice('/c/s/'.length)}${parsed.search}`);
    } catch {
      // Mantener parsed original si falla
    }
  }

  const hostLower = parsed.hostname.toLowerCase();

  // 3. Ignorar dominio interno promovere.com.ar
  if (hostLower === 'promovere.com.ar' || hostLower.endsWith('.promovere.com.ar')) {
    return null;
  }

  // 4. Limpiar parámetros de tracking y anomalías en ?p=46777/?noredirect=true
  if (parsed.searchParams.has('p')) {
    const pVal = parsed.searchParams.get('p') || '';
    const cleanP = pVal.split('/')[0].split('?')[0];
    if (cleanP) {
      parsed.searchParams.set('p', cleanP);
    }
  }
  for (const key of Array.from(parsed.searchParams.keys())) {
    if (TRACKING_PARAMS.has(key.toLowerCase())) {
      parsed.searchParams.delete(key);
    }
  }

  // 5. Limpiar fragments de tracking (#google_vignette, #:~:text=...)
  if (
    parsed.hash === '#google_vignette' ||
    parsed.hash.startsWith('#:~:text=')
  ) {
    parsed.hash = '';
  }

  // 6. Ignorar homes de medios sin artículo (pathname vacío o '/' sin query de artículo)
  const cleanPath = parsed.pathname.replace(/\/+$/, '');
  const hasMeaningfulQuery = Array.from(parsed.searchParams.keys()).length > 0;
  if (!cleanPath && !hasMeaningfulQuery) {
    return null;
  }

  return parsed.toString();
}

function getCanonicalKey(cleanedUrl: string): string {
  const u = new URL(cleanedUrl);
  const host = u.hostname.toLowerCase().replace(/^www\./, '');
  const path = u.pathname.replace(/\/+$/, '').toLowerCase();
  const query = u.search.toLowerCase();
  const hash = u.hash.toLowerCase();
  return `${host}${path}${query}${hash}`;
}

function detectMediaOutlet(cleanedUrl: string): string {
  const host = new URL(cleanedUrl).hostname.toLowerCase().replace(/^www\./, '');
  for (const entry of OUTLET_BY_DOMAIN) {
    if (host === entry.match || host.endsWith(`.${entry.match}`)) {
      return entry.name;
    }
  }
  const base = host.split('.')[0] || host;
  return base.charAt(0).toUpperCase() + base.slice(1);
}

function extractPublishedDateFromUrl(cleanedUrl: string): string | null {
  const u = new URL(cleanedUrl);
  const fullDateMatch = /\/(20\d{2})\/(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\//.exec(u.pathname);
  if (fullDateMatch) {
    const [, y, m, d] = fullDateMatch;
    return `${y}-${m}-${d}T12:00:00.000Z`;
  }
  return null;
}

function humanizeSlug(cleanedUrl: string): string {
  const u = new URL(cleanedUrl);
  const segments = u.pathname
    .split('/')
    .filter(Boolean)
    .filter((s) => !/^\d+$/.test(s) && s !== 'blog' && s !== 'website' && s !== 'noticias' && s !== 'val');
  const last = (segments[segments.length - 1] || 'nota-de-prensa')
    .replace(/\.html?$/i, '')
    .replace(/-n\d+$/i, '')
    .replace(/_[a-z0-9]{10,}$/i, '');

  const acronyms: Record<string, string> = {
    dmc: 'DMC',
    fit: 'FIT',
    b2b: 'B2B',
    fam: 'FAM',
    iata: 'IATA',
    mita: 'MITA',
  };

  const words = last
    .split(/[-_]+/)
    .filter(Boolean)
    .map((w, idx) => {
      const lower = w.toLowerCase();
      if (acronyms[lower]) return acronyms[lower];
      if (idx === 0) return lower.charAt(0).toUpperCase() + lower.slice(1);
      return lower;
    });

  return words.join(' ');
}

function splitTitleAndSummary(
  texts: string[],
  cleanedUrl: string,
  mediaOutlet: string
): { title: string; summary: string } {
  const cleanedTexts = texts.map(decodeHtmlEntities).filter(Boolean);

  // Caso especial: texto fragmentado de Xplorer Florida DMC ("rer Florida DMC: ..." + "inolvidables...")
  if (
    cleanedTexts.length === 2 &&
    cleanedTexts[0].startsWith('rer Florida DMC')
  ) {
    const joined = `Xplo${cleanedTexts[0]} ${cleanedTexts[1]}`.replace(/\s+/g, ' ').trim();
    return {
      title: joined,
      summary: `Cobertura publicada en ${mediaOutlet} sobre Xplorer Florida DMC.`,
    };
  }

  // Si vienen 2+ textos separados para la misma URL: el 1º es el título y el resto es el extracto
  if (cleanedTexts.length >= 2) {
    const title = cleanedTexts[0];
    const rest = cleanedTexts.slice(1).join(' ').trim();
    return {
      title,
      summary: rest || `Nota publicada en ${mediaOutlet}.`,
    };
  }

  // Si viene 1 solo texto combinado
  if (cleanedTexts.length === 1) {
    const single = cleanedTexts[0];

    // 1. Separadores explícitos con nombre del medio
    for (const sep of EXPLICIT_SEPARATORS) {
      const idx = single.indexOf(sep);
      if (idx > 10) {
        const title = single.slice(0, idx).trim();
        const summary = single.slice(idx + sep.length).trim();
        return {
          title,
          summary: summary || `Nota publicada en ${mediaOutlet}.`,
        };
      }
    }

    // 2. Caso duplicado exacto ("Exitosa 7ma edición... Exitosa 7ma edición...")
    const half = Math.floor(single.length / 2);
    if (single.length > 20 && single.slice(0, half).trim() === single.slice(half).trim()) {
      const title = single.slice(0, half).trim();
      return {
        title,
        summary: `Cobertura publicada en ${mediaOutlet}.`,
      };
    }

    // 3. Separar si tiene "(Por ...)" al inicio del cuerpo
    const bylineIdx = single.indexOf(' (Por ');
    if (bylineIdx > 20) {
      return {
        title: single.slice(0, bylineIdx).trim(),
        summary: single.slice(bylineIdx + 1).trim(),
      };
    }

    // 4. Heurística suave para textos largos donde título + bajada están pegados sin separador
    if (single.length > 130) {
      // Buscar el primer cierre de pregunta/exclamación o transición a oración completa entre chars 35 y 135
      const qIdx = single.indexOf('? ');
      if (qIdx >= 25 && qIdx <= 125) {
        return {
          title: single.slice(0, qIdx + 1).trim(),
          summary: single.slice(qIdx + 2).trim(),
        };
      }

      const quoteEndIdx = single.indexOf('” ');
      if (quoteEndIdx >= 25 && quoteEndIdx <= 125) {
        return {
          title: single.slice(0, quoteEndIdx + 1).trim(),
          summary: single.slice(quoteEndIdx + 2).trim(),
        };
      }

      // Buscar inicio de extracto típico (palabra capitalizada tras espacio después del char 45)
      const leadStarters = [
        ' De la mano de ',
        ' Con la incorporación de ',
        ' Con su óptima ',
        ' Con más de ',
        ' Hoteles Solaris ',
        ' ATELIER Playa Mujeres ',
        ' Promovêre ',
        ' Promovere ',
        ' Enjoy Travel Group ',
        ' El establecimiento ',
        ' El hotel ',
        ' El responsable ',
        ' El Cayman Cookout ',
        ' El Caribe Mexicano ',
        ' Los viajes multidestino ',
        ' Los destinos preferidos ',
        ' Más allá de ',
        ' Desde escapadas ',
        ' Sol, playas ',
        ' Si estás buscando ',
        ' La gerente de ',
        ' Going analizó ',
        ' Frente a la realidad ',
        ' Situado en ',
        ' Del 15 al ',
        ' Recientemente tuvo ',
        ' Cayman Airways, ',
        ' ¿Estás pensando ',
        ' En el corazón ',
        ' Durante años, ',
        ' Una vez concluido ',
        ' Playas de arena ',
        ' Con la presencia ',
        ' Será los ',
        ' Ana Laura Sergio ',
      ];

      for (const starter of leadStarters) {
        const idx = single.indexOf(starter);
        if (idx >= 25 && idx <= 145) {
          return {
            title: single.slice(0, idx).trim(),
            summary: single.slice(idx + 1).trim(),
          };
        }
      }
    }

    return {
      title: single,
      summary: `Cobertura publicada en ${mediaOutlet}.`,
    };
  }

  // Sin texto (solo había imagen en Google Sites): reconstruir título limpio desde el slug
  return {
    title: humanizeSlug(cleanedUrl),
    summary: `Cobertura publicada en ${mediaOutlet}.`,
  };
}

function buildCleanedArticles(rawLinks: RawPressLink[]): CleanedPressArticle[] {
  const grouped = new Map<string, { url: string; texts: string[] }>();

  for (const item of rawLinks) {
    const cleanedUrl = cleanExternalUrl(item.href);
    if (!cleanedUrl) continue;

    const canonicalKey = getCanonicalKey(cleanedUrl);
    const existing = grouped.get(canonicalKey);
    const trimmedText = (item.texto || '').trim();

    if (!existing) {
      grouped.set(canonicalKey, {
        url: cleanedUrl,
        texts: trimmedText ? [trimmedText] : [],
      });
    } else {
      if (trimmedText && !existing.texts.includes(trimmedText)) {
        existing.texts.push(trimmedText);
      }
    }
  }

  const articles: CleanedPressArticle[] = [];
  for (const [canonicalKey, group] of grouped.entries()) {
    const mediaOutlet = detectMediaOutlet(group.url);
    const { title, summary } = splitTitleAndSummary(group.texts, group.url, mediaOutlet);
    const publishedDate = extractPublishedDateFromUrl(group.url);

    articles.push({
      url: group.url,
      canonicalKey,
      title,
      summary,
      mediaOutlet,
      publishedDate,
    });
  }

  return articles;
}

async function run() {
  const connectionString = process.env.DATABASE_URI || '';
  if (!connectionString) {
    console.error('❌ Falta DATABASE_URI para importar notas de prensa.');
    process.exit(1);
  }

  const articles = buildCleanedArticles(RAW_PRESS_LINKS);
  console.log(`🧹 Notas únicas limpias listas para importar: ${articles.length}`);

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  // Obtener URLs ya existentes para deduplicar de forma idempotente
  const existingRes = await client.query<{ article_url: string | null }>(
    `SELECT article_url FROM press_items WHERE article_url IS NOT NULL`
  );
  const existingKeys = new Set<string>();
  for (const row of existingRes.rows) {
    if (!row.article_url) continue;
    try {
      existingKeys.add(getCanonicalKey(row.article_url));
    } catch {
      existingKeys.add(row.article_url.trim().toLowerCase());
    }
  }

  let inserted = 0;
  let skipped = 0;

  // Insertar desde el más antiguo al más reciente para que created_at quede ordenado del más nuevo al más viejo
  for (const art of [...articles].reverse()) {
    if (existingKeys.has(art.canonicalKey)) {
      skipped++;
      continue;
    }

    await client.query(
      `INSERT INTO press_items
        (title, media_outlet, format, summary, article_url, status, published_date, updated_at, created_at)
       VALUES ($1, $2, 'nota'::enum_press_fmt, $3, $4, 'published'::enum_press_st, $5, now(), now())`,
      [art.title, art.mediaOutlet, art.summary, art.url, art.publishedDate]
    );
    existingKeys.add(art.canonicalKey);
    inserted++;
  }

  const totalRes = await client.query<{ total: number }>(
    `SELECT COUNT(*)::int AS total FROM press_items WHERE format = 'nota'`
  );

  console.log(`✅ Importación finalizada:`);
  console.log(`   - Notas únicas procesadas: ${articles.length}`);
  console.log(`   - Insertadas nuevas: ${inserted}`);
  console.log(`   - Omitidas por duplicado: ${skipped}`);
  console.log(`   - Total de notas de prensa en BD: ${totalRes.rows[0].total}`);

  await client.end();
}

run().catch((err) => {
  console.error('❌ Error importando notas de prensa:', err);
  process.exit(1);
});
