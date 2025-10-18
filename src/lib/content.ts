// Base bíblica, oraciones y acciones prácticas organizadas por raíz

export type RootCategory = 
  | 'spiritual' 
  | 'identity' 
  | 'family' 
  | 'trauma' 
  | 'relationships' 
  | 'mental' 
  | 'behavior';

export interface Scripture {
  id: string;
  reference: string;
  text: string;
  application: string;
  roots: string[];
  categories: RootCategory[];
}

export interface Prayer {
  id: string;
  title: string;
  content: string;
  roots: string[];
  categories: RootCategory[];
}

export interface Action {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  roots: string[];
  categories: RootCategory[];
  type: 'spiritual' | 'practical' | 'community';
}

export const SCRIPTURES: Scripture[] = [
  // Identidad en Cristo
  {
    id: 'efesios-1-4',
    reference: 'Efesios 1:4-5',
    text: 'Dios nos escogió en él antes de la fundación del mundo, para que fuésemos santos y sin mancha delante de él, en amor habiéndonos predestinado para ser adoptados hijos suyos por medio de Jesucristo.',
    application: 'Tu identidad no viene de tus luchas, sino de quién dice Dios que eres: escogido/a, amado/a, adoptado/a.',
    roots: ['falta-identidad-cristo', 'creer-mentiras', 'baja-autoestima', 'inseguridades', 'verguenza'],
    categories: ['identity', 'spiritual']
  },
  {
    id: '2-corintios-5-17',
    reference: '2 Corintios 5:17',
    text: 'De modo que si alguno está en Cristo, nueva criatura es; las cosas viejas pasaron; he aquí todas son hechas nuevas.',
    application: 'Tu pasado no te define. En Cristo eres una nueva creación. Hoy puedes empezar de nuevo.',
    roots: ['falta-identidad-cristo', 'verguenza', 'creer-mentiras', 'trauma'],
    categories: ['identity', 'spiritual']
  },
  {
    id: 'romanos-8-1',
    reference: 'Romanos 8:1',
    text: 'Ahora, pues, ninguna condenación hay para los que están en Cristo Jesús.',
    application: 'La culpa y la vergüenza no vienen de Dios. Él te ofrece gracia, no condenación.',
    roots: ['verguenza', 'culpa', 'creer-mentiras'],
    categories: ['identity', 'spiritual']
  },
  
  // Sanidad y restauración
  {
    id: 'salmo-147-3',
    reference: 'Salmo 147:3',
    text: 'Él sana a los quebrantados de corazón, y venda sus heridas.',
    application: 'Dios no solo ve tu dolor, está comprometido a sanarlo. Permítele tocar tus heridas más profundas.',
    roots: ['trauma', 'rechazo', 'abuso', 'violacion', 'burlas', 'relaciones-rotas'],
    categories: ['trauma', 'mental']
  },
  {
    id: 'isaias-61-1',
    reference: 'Isaías 61:1-3',
    text: 'Me ha enviado a vendar a los quebrantados de corazón... a ordenar que a los afligidos de Sion se les dé gloria en lugar de ceniza, óleo de gozo en lugar de luto, manto de alegría en lugar del espíritu angustiado.',
    application: 'Dios promete intercambiar tu dolor por sanidad, tu tristeza por gozo. Este es su corazón hacia ti.',
    roots: ['depresion', 'angustia', 'trauma', 'soledad', 'aislamiento'],
    categories: ['trauma', 'mental']
  },

  // Perdón
  {
    id: '1-juan-1-9',
    reference: '1 Juan 1:9',
    text: 'Si confesamos nuestros pecados, él es fiel y justo para perdonar nuestros pecados, y limpiarnos de toda maldad.',
    application: 'La confesión abre la puerta a la limpieza. Dios está listo para perdonarte y restaurarte hoy.',
    roots: ['falta-confesion', 'verguenza', 'no-perdonar', 'corazon-endurecido'],
    categories: ['spiritual']
  },
  {
    id: 'efesios-4-32',
    reference: 'Efesios 4:32',
    text: 'Antes sed benignos unos con otros, misericordiosos, perdonándoos unos a otros, como Dios también os perdonó a vosotros en Cristo.',
    application: 'Perdonar libera tu corazón. No es justificar el daño, es soltarlo para que Dios lo maneje.',
    roots: ['no-perdonar', 'amargura', 'relaciones-rotas'],
    categories: ['spiritual', 'relationships']
  },

  // Intimidad con Dios
  {
    id: 'santiago-4-8',
    reference: 'Santiago 4:8',
    text: 'Acercaos a Dios, y él se acercará a vosotros.',
    application: 'Dios no está lejos. Un paso tuyo hacia Él, y Él corre a tu encuentro.',
    roots: ['falta-intimidad-dios', 'evitar-voz-dios', 'vacio-espiritual', 'corazon-endurecido'],
    categories: ['spiritual']
  },
  {
    id: 'juan-15-5',
    reference: 'Juan 15:5',
    text: 'Yo soy la vid, vosotros los pámpanos; el que permanece en mí, y yo en él, éste lleva mucho fruto; porque separados de mí nada podéis hacer.',
    application: 'La victoria no viene de tu fuerza, sino de permanecer conectado a Cristo. Prioriza esa conexión hoy.',
    roots: ['falta-intimidad-dios', 'vacio-espiritual', 'cansancio'],
    categories: ['spiritual']
  },

  // Familia y relaciones
  {
    id: 'salmo-68-5-6',
    reference: 'Salmo 68:5-6',
    text: 'Padre de huérfanos y defensor de viudas es Dios en su santa morada. Dios hace habitar en familia a los desamparados.',
    application: 'Si tu familia terrenal falló, Dios quiere ser el Padre que nunca tuviste. Él te da una familia espiritual.',
    roots: ['papa-ausente', 'mama-ausente', 'familia-rota', 'falta-amor-paternal', 'soledad'],
    categories: ['family', 'relationships']
  },

  // Límites y dominio propio
  {
    id: '1-corintios-10-13',
    reference: '1 Corintios 10:13',
    text: 'No os ha sobrevenido ninguna tentación que no sea humana; pero fiel es Dios, que no os dejará ser tentados más de lo que podéis resistir, sino que dará también juntamente con la tentación la salida.',
    application: 'Dios siempre provee una salida. Hoy, identifica cuál es esa salida y tómala.',
    roots: ['falta-limites', 'cansancio', 'naturalizar-antinatural'],
    categories: ['behavior', 'spiritual']
  },
  {
    id: 'galatas-5-1',
    reference: 'Gálatas 5:1',
    text: 'Estad, pues, firmes en la libertad con que Cristo nos hizo libres, y no estéis otra vez sujetos al yugo de esclavitud.',
    application: 'Cristo ya pagó por tu libertad. No vuelvas a las cadenas de las que Él te liberó.',
    roots: ['falta-limites', 'amistades-toxicas', 'naturalizar-antinatural'],
    categories: ['behavior', 'spiritual']
  },

  // Propósito y diseño de Dios
  {
    id: 'jeremias-29-11',
    reference: 'Jeremías 29:11',
    text: 'Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis.',
    application: 'Dios tiene un plan bueno para tu vida. Confía en su diseño, no en lo que el mundo dice.',
    roots: ['dudar-diseno-dios', 'cuestiono-biblia', 'rebeldia', 'vacio-espiritual'],
    categories: ['spiritual', 'identity']
  },
  {
    id: 'salmo-139-14',
    reference: 'Salmo 139:14',
    text: 'Te alabaré; porque formidables, maravillosas son tus obras; estoy maravillado, y mi alma lo sabe muy bien.',
    application: 'Fuiste diseñado/a con propósito. Tu cuerpo, tu identidad, todo fue creado intencionalmente por Dios.',
    roots: ['dudar-diseno-dios', 'inseguridades', 'baja-autoestima', 'comparaciones'],
    categories: ['identity', 'spiritual']
  },

  // Fortaleza en la debilidad
  {
    id: '2-corintios-12-9',
    reference: '2 Corintios 12:9',
    text: 'Y me ha dicho: Bástate mi gracia; porque mi poder se perfecciona en la debilidad.',
    application: 'Tu debilidad no descalifica la obra de Dios. De hecho, es donde más brilla su poder.',
    roots: ['cansancio', 'angustia', 'depresion', 'baja-autoestima'],
    categories: ['mental', 'spiritual']
  },

  // Esperanza
  {
    id: 'romanos-15-13',
    reference: 'Romanos 15:13',
    text: 'Y el Dios de esperanza os llene de todo gozo y paz en el creer, para que abundéis en esperanza por el poder del Espíritu Santo.',
    application: 'Aunque hoy sea difícil, hay esperanza. El Espíritu Santo puede llenarte de paz y gozo.',
    roots: ['pensamientos-muerte', 'depresion', 'angustia', 'vacio-espiritual'],
    categories: ['mental', 'spiritual']
  }
];

export const PRAYERS: Prayer[] = [
  {
    id: 'identidad-cristo',
    title: 'Oración por mi identidad',
    content: `Padre celestial,
Hoy reconozco que he buscado mi identidad en lugares equivocados. Perdóname.
Te entrego mis inseguridades, mis mentiras, mi vergüenza.
Recibo tu verdad: soy tu hijo/a amado/a, escogido/a, sin condenación.
Ayúdame a caminar hoy creyendo lo que Tú dices de mí, no lo que yo siento.
En el nombre de Jesús, amén.`,
    roots: ['falta-identidad-cristo', 'creer-mentiras', 'baja-autoestima', 'verguenza', 'inseguridades'],
    categories: ['identity', 'spiritual']
  },
  {
    id: 'sanidad-trauma',
    title: 'Oración por sanidad de heridas',
    content: `Señor Jesús,
Tú conoces el dolor que cargo. Tú viste lo que me pasó y cómo me marcó.
Hoy traigo ante ti [nombre la herida si puedes, o solo di "mis heridas"].
Reconozco que solo Tú puedes sanarme.
Te entrego este dolor. Sana mi corazón quebrantado.
Recibo tu promesa de vendas para mis heridas, de gozo en lugar de luto.
Camino hoy con la esperanza de que estás restaurando lo que se rompió.
Amén.`,
    roots: ['trauma', 'abuso', 'violacion', 'rechazo', 'burlas', 'discriminacion'],
    categories: ['trauma']
  },
  {
    id: 'perdon',
    title: 'Oración de perdón',
    content: `Padre,
Reconozco que he pecado. [Si puedes, menciona específicamente].
No justifico mis acciones. Fueron reales y tuvieron consecuencias.
Pero hoy recibo tu promesa: si confieso, Tú eres fiel para perdonar y limpiar.
Perdóname. Límpiame.
[Si necesitas perdonar a alguien más:]
También elijo perdonar a [persona]. Suelto la amargura. Te entrego la justicia.
Recibo tu gracia y tu poder para caminar en libertad hoy.
En Jesús, amén.`,
    roots: ['falta-confesion', 'no-perdonar', 'verguenza', 'amargura', 'corazon-endurecido'],
    categories: ['spiritual']
  },
  {
    id: 'intimidad-dios',
    title: 'Oración por intimidad con Dios',
    content: `Señor,
He estado lejos. He evitado tu voz, endurecido mi corazón.
Pero hoy doy un paso hacia ti.
Acércame. Háblame. Ayúdame a escuchar.
Quiero conocerte de verdad, no solo de oídas.
Espíritu Santo, enséñame a permanecer en Cristo.
Que mi fuente sea Él, no las cosas que me han esclavizado.
Amén.`,
    roots: ['falta-intimidad-dios', 'evitar-voz-dios', 'vacio-espiritual', 'corazon-endurecido'],
    categories: ['spiritual']
  },
  {
    id: 'limites',
    title: 'Oración por límites',
    content: `Dios,
Reconozco que he dejado entrar cosas que no debía.
He naturalizado lo que Tú llamas antinatural.
Perdóname por no poner límites.
Dame sabiduría para saber dónde trazar la línea.
Dame valentía para mantenerla.
Ayúdame a decir "no" cuando sea necesario.
Y cuando falle, recuérdame que tu gracia es mayor.
En Cristo, amén.`,
    roots: ['falta-limites', 'naturalizar-antinatural', 'amistades-toxicas'],
    categories: ['behavior', 'spiritual']
  },
  {
    id: 'familia',
    title: 'Oración por sanidad familiar',
    content: `Padre celestial,
Mi familia terrenal ha fallado [o me ha fallado].
Pero Tú prometes ser Padre de huérfanos, defensor de los desamparados.
Sé mi Padre hoy. Llena el vacío que dejaron.
Sana las heridas de rechazo, ausencia, abuso.
Dame una familia espiritual que me edifique.
Y si es tu voluntad, restaura lo que está roto en mi familia natural.
Confío en ti, Abba Padre.
Amén.`,
    roots: ['papa-ausente', 'mama-ausente', 'familia-rota', 'falta-amor-paternal'],
    categories: ['family']
  },
  {
    id: 'proposito',
    title: 'Oración por propósito',
    content: `Señor,
A veces dudo de tu diseño. Cuestiono tu plan.
Perdóname por creer que el mundo sabe más que Tú.
Recibo tu verdad: fui creado/a con propósito.
No soy un error. No soy un accidente.
Ayúdame a confiar en tu diseño, incluso cuando no lo entienda.
Muéstrame el propósito para el cual me creaste.
En Jesús, amén.`,
    roots: ['dudar-diseno-dios', 'cuestiono-biblia', 'vacio-espiritual'],
    categories: ['spiritual', 'identity']
  },
  {
    id: 'esperanza',
    title: 'Oración en momentos oscuros',
    content: `Dios,
Hoy está oscuro. Me siento sin esperanza.
Pero incluso en este momento, te busco.
Tú eres el Dios de esperanza.
Llena mi corazón de tu paz, de tu gozo, aunque no lo sienta todavía.
Recuérdame que este no es el final de mi historia.
Que hay propósito, que hay futuro.
Ayúdame a dar un paso más hoy.
Solo uno. Contigo.
Amén.`,
    roots: ['pensamientos-muerte', 'depresion', 'angustia', 'soledad', 'aislamiento'],
    categories: ['mental', 'spiritual']
  }
];

export const ACTIONS: Action[] = [
  // Espirituales
  {
    id: 'leer-salmo',
    title: 'Lee un Salmo en voz alta',
    description: 'Abre el libro de Salmos (especialmente 23, 34, 51, 139) y lee uno en voz alta. Permite que las palabras resuenen en tu corazón.',
    difficulty: 'easy',
    roots: ['falta-intimidad-dios', 'vacio-espiritual', 'angustia', 'depresion'],
    categories: ['spiritual', 'mental'],
    type: 'spiritual'
  },
  {
    id: 'adoracion-5min',
    title: '5 minutos de adoración',
    description: 'Pon una canción de adoración (que te guste) y cierra los ojos. Enfócate en Dios, no en tus problemas.',
    difficulty: 'easy',
    roots: ['falta-intimidad-dios', 'vacio-espiritual', 'corazon-endurecido'],
    categories: ['spiritual'],
    type: 'spiritual'
  },
  {
    id: 'carta-dios',
    title: 'Escribe una carta a Dios',
    description: 'Toma papel y lápiz. Escribe lo que sientes, sin filtro. Dios puede manejarlo. Luego escribe lo que crees que Él te diría.',
    difficulty: 'medium',
    roots: ['evitar-voz-dios', 'falta-intimidad-dios', 'angustia', 'soledad'],
    categories: ['spiritual', 'mental'],
    type: 'spiritual'
  },
  {
    id: 'ayuno-digital',
    title: 'Ayuno digital de 24 horas',
    description: 'Elimina redes sociales y contenido no edificante por 24 horas. Usa ese tiempo para orar, leer la Biblia o hablar con alguien.',
    difficulty: 'hard',
    roots: ['falta-limites', 'comparaciones', 'amistades-toxicas', 'naturalizar-antinatural'],
    categories: ['behavior', 'spiritual'],
    type: 'spiritual'
  },
  {
    id: 'confesar-lider',
    title: 'Confiesa a tu líder/mentor',
    description: 'Santiago 5:16 dice "confesaos unos a otros". Llama o reúnete con alguien de confianza y comparte tu lucha. La luz deshace la oscuridad.',
    difficulty: 'hard',
    roots: ['falta-confesion', 'verguenza', 'aislamiento', 'soledad'],
    categories: ['spiritual', 'relationships'],
    type: 'community'
  },

  // Prácticas
  {
    id: 'eliminar-disparador',
    title: 'Elimina un disparador hoy',
    description: 'Identifica UNA cosa que te dispara (app, contacto, lugar) y elimínala o bloquéala HOY. No mañana. Hoy.',
    difficulty: 'medium',
    roots: ['falta-limites', 'amistades-toxicas', 'naturalizar-antinatural'],
    categories: ['behavior'],
    type: 'practical'
  },
  {
    id: 'ejercicio-fisico',
    title: '20 minutos de ejercicio',
    description: 'Sal a caminar, corre, haz flexiones. Mueve tu cuerpo. Ayuda a procesar emociones y reduce ansiedad.',
    difficulty: 'easy',
    roots: ['angustia', 'depresion', 'cansancio', 'ansiedad'],
    categories: ['mental'],
    type: 'practical'
  },
  {
    id: 'llamar-amigo',
    title: 'Llama a alguien que te edifique',
    description: 'No mensajes. Una llamada real. Habla con alguien que te acerque a Dios, no que te aleje.',
    difficulty: 'medium',
    roots: ['soledad', 'aislamiento', 'amistades-toxicas', 'relaciones-rotas'],
    categories: ['relationships'],
    type: 'community'
  },
  {
    id: 'dormir-temprano',
    title: 'Duerme 7-8 horas esta noche',
    description: 'El cansancio debilita tu resistencia. Prioriza el descanso. Apaga dispositivos 1 hora antes de dormir.',
    difficulty: 'medium',
    roots: ['cansancio', 'angustia', 'falta-limites'],
    categories: ['mental', 'behavior'],
    type: 'practical'
  },
  {
    id: 'diario-gratitud',
    title: 'Escribe 3 cosas por las que estás agradecido/a',
    description: 'Aunque sea difícil, encuentra 3 cosas. Puede ser algo pequeño: "el sol", "un amigo", "que tengo comida".',
    difficulty: 'easy',
    roots: ['depresion', 'angustia', 'comparaciones', 'baja-autoestima'],
    categories: ['mental'],
    type: 'practical'
  },
  {
    id: 'carta-perdon',
    title: 'Escribe una carta de perdón (no enviarla)',
    description: 'Escribe a la persona que te lastimó o a ti mismo/a. Expresa el dolor, luego escribe "elijo perdonar". No la envíes, solo suéltalo.',
    difficulty: 'hard',
    roots: ['no-perdonar', 'amargura', 'trauma', 'rechazo', 'abuso'],
    categories: ['trauma', 'spiritual'],
    type: 'spiritual'
  },
  {
    id: 'buscar-consejeria',
    title: 'Agenda una sesión de consejería',
    description: 'Busca un consejero cristiano profesional. No tienes que caminar esto solo/a. La terapia + fe es poderosa.',
    difficulty: 'hard',
    roots: ['trauma', 'abuso', 'violacion', 'depresion', 'pensamientos-muerte'],
    categories: ['trauma', 'mental'],
    type: 'community'
  },
  {
    id: 'lista-mentiras-verdades',
    title: 'Lista mentiras vs. verdades',
    description: 'Divide una hoja en dos. Izquierda: mentiras que crees sobre ti. Derecha: qué dice la Biblia. Lee la derecha en voz alta.',
    difficulty: 'medium',
    roots: ['creer-mentiras', 'baja-autoestima', 'inseguridades', 'dudar-diseno-dios'],
    categories: ['identity'],
    type: 'spiritual'
  },
  {
    id: 'servir-alguien',
    title: 'Sirve a alguien hoy',
    description: 'Sal de tu cabeza sirviendo a otro. Puede ser algo pequeño: escuchar, ayudar con algo, compartir comida.',
    difficulty: 'medium',
    roots: ['aislamiento', 'depresion', 'vacio-espiritual', 'comparaciones'],
    categories: ['relationships', 'spiritual'],
    type: 'community'
  },
  {
    id: 'accountability-app',
    title: 'Instala una app de accountability',
    description: 'Busca apps como Covenant Eyes o Accountability. Comparte el acceso con tu mentor. La transparencia genera libertad.',
    difficulty: 'hard',
    roots: ['falta-limites', 'naturalizar-antinatural', 'falta-confesion'],
    categories: ['behavior'],
    type: 'practical'
  }
];

// Función para obtener contenido relevante basado en raíces identificadas
export function getRelevantContent(rootIds: string[], categories: RootCategory[]) {
  const scoredScriptures = SCRIPTURES.map(s => ({
    item: s,
    score: s.roots.filter(r => rootIds.includes(r)).length +
           s.categories.filter(c => categories.includes(c)).length * 0.5
  }));

  const scoredPrayers = PRAYERS.map(p => ({
    item: p,
    score: p.roots.filter(r => rootIds.includes(r)).length +
           p.categories.filter(c => categories.includes(c)).length * 0.5
  }));

  const scoredActions = ACTIONS.map(a => ({
    item: a,
    score: a.roots.filter(r => rootIds.includes(r)).length +
           a.categories.filter(c => categories.includes(c)).length * 0.5
  }));

  return {
    scriptures: scoredScriptures
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 2)
      .map(s => s.item),
    prayers: scoredPrayers
      .filter(p => p.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 1)
      .map(p => p.item),
    actions: scoredActions
      .filter(a => a.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(a => a.item)
  };
}
