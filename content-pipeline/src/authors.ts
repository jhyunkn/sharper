export interface AuthorSeed {
  id: string;
  name: string;
  title: string;
  domain: string;
  subDomain?: string;
  era: string;
  nationality?: string;
  born?: number;
  died?: number;
  archetypes: string[]; // which archetypes this author primarily resonates with
}

export const AUTHORS: AuthorSeed[] = [
  // ── PHILOSOPHY ───────────────────────────────────────────────────────────────
  { id: 'socrates', name: 'Socrates', title: 'Greek Philosopher', domain: 'philosophy', subDomain: 'dialectics', era: 'ancient', nationality: 'Greek', born: -470, died: -399, archetypes: ['sage', 'rebel'] },
  { id: 'plato', name: 'Plato', title: 'Greek Philosopher', domain: 'philosophy', subDomain: 'idealism', era: 'ancient', nationality: 'Greek', born: -428, died: -348, archetypes: ['sage', 'mystic'] },
  { id: 'aristotle', name: 'Aristotle', title: 'Greek Philosopher & Scientist', domain: 'philosophy', subDomain: 'ethics', era: 'ancient', nationality: 'Greek', born: -384, died: -322, archetypes: ['sage', 'hero'] },
  { id: 'marcus-aurelius', name: 'Marcus Aurelius', title: 'Roman Emperor & Stoic Philosopher', domain: 'philosophy', subDomain: 'stoicism', era: 'ancient', nationality: 'Roman', born: 121, died: 180, archetypes: ['hero', 'sage'] },
  { id: 'seneca', name: 'Seneca', title: 'Roman Stoic Philosopher', domain: 'philosophy', subDomain: 'stoicism', era: 'ancient', nationality: 'Roman', born: -4, died: 65, archetypes: ['hero', 'sage'] },
  { id: 'epictetus', name: 'Epictetus', title: 'Greek Stoic Philosopher', domain: 'philosophy', subDomain: 'stoicism', era: 'ancient', nationality: 'Greek', born: 50, died: 135, archetypes: ['hero', 'sage'] },
  { id: 'laozi', name: 'Lao Tzu', title: 'Ancient Chinese Philosopher, Tao Te Ching', domain: 'philosophy', subDomain: 'taoism', era: 'ancient', nationality: 'Chinese', archetypes: ['mystic', 'sage'] },
  { id: 'confucius', name: 'Confucius', title: 'Chinese Philosopher & Teacher', domain: 'philosophy', subDomain: 'confucianism', era: 'ancient', nationality: 'Chinese', born: -551, died: -479, archetypes: ['sage', 'caregiver'] },
  { id: 'zhuangzi', name: 'Zhuangzi', title: 'Ancient Chinese Philosopher', domain: 'philosophy', subDomain: 'taoism', era: 'ancient', nationality: 'Chinese', archetypes: ['mystic', 'explorer'] },
  { id: 'descartes', name: 'René Descartes', title: 'French Philosopher & Mathematician', domain: 'philosophy', subDomain: 'rationalism', era: 'enlightenment', nationality: 'French', born: 1596, died: 1650, archetypes: ['sage', 'creator'] },
  { id: 'spinoza', name: 'Baruch Spinoza', title: 'Dutch Philosopher', domain: 'philosophy', subDomain: 'pantheism', era: 'enlightenment', nationality: 'Dutch', born: 1632, died: 1677, archetypes: ['sage', 'mystic'] },
  { id: 'kant', name: 'Immanuel Kant', title: 'German Philosopher', domain: 'philosophy', subDomain: 'ethics', era: 'enlightenment', nationality: 'German', born: 1724, died: 1804, archetypes: ['sage', 'hero'] },
  { id: 'hume', name: 'David Hume', title: 'Scottish Philosopher & Empiricist', domain: 'philosophy', subDomain: 'empiricism', era: 'enlightenment', nationality: 'Scottish', born: 1711, died: 1776, archetypes: ['sage', 'rebel'] },
  { id: 'rousseau', name: 'Jean-Jacques Rousseau', title: 'French Philosopher', domain: 'philosophy', subDomain: 'political philosophy', era: 'enlightenment', nationality: 'French', born: 1712, died: 1778, archetypes: ['rebel', 'explorer'] },
  { id: 'voltaire', name: 'Voltaire', title: 'French Enlightenment Philosopher & Writer', domain: 'philosophy', subDomain: 'enlightenment', era: 'enlightenment', nationality: 'French', born: 1694, died: 1778, archetypes: ['rebel', 'sage'] },
  { id: 'nietzsche', name: 'Friedrich Nietzsche', title: 'German Philosopher', domain: 'philosophy', subDomain: 'existentialism', era: 'modern', nationality: 'German', born: 1844, died: 1900, archetypes: ['rebel', 'creator'] },
  { id: 'kierkegaard', name: 'Søren Kierkegaard', title: 'Danish Philosopher & Theologian', domain: 'philosophy', subDomain: 'existentialism', era: 'modern', nationality: 'Danish', born: 1813, died: 1855, archetypes: ['mystic', 'rebel'] },
  { id: 'schopenhauer', name: 'Arthur Schopenhauer', title: 'German Philosopher', domain: 'philosophy', subDomain: 'pessimism', era: 'modern', nationality: 'German', born: 1788, died: 1860, archetypes: ['mystic', 'sage'] },
  { id: 'heidegger', name: 'Martin Heidegger', title: 'German Philosopher', domain: 'philosophy', subDomain: 'phenomenology', era: 'modern', nationality: 'German', born: 1889, died: 1976, archetypes: ['mystic', 'sage'] },
  { id: 'sartre', name: 'Jean-Paul Sartre', title: 'French Existentialist Philosopher', domain: 'philosophy', subDomain: 'existentialism', era: 'modern', nationality: 'French', born: 1905, died: 1980, archetypes: ['rebel', 'explorer'] },
  { id: 'beauvoir', name: 'Simone de Beauvoir', title: 'French Existentialist Philosopher & Feminist', domain: 'philosophy', subDomain: 'feminism', era: 'modern', nationality: 'French', born: 1908, died: 1986, archetypes: ['rebel', 'explorer'] },
  { id: 'camus', name: 'Albert Camus', title: 'French Philosopher & Nobel Laureate', domain: 'philosophy', subDomain: 'absurdism', era: 'modern', nationality: 'French', born: 1913, died: 1960, archetypes: ['rebel', 'hero'] },
  { id: 'wittgenstein', name: 'Ludwig Wittgenstein', title: 'Austrian-British Philosopher', domain: 'philosophy', subDomain: 'language', era: 'modern', nationality: 'Austrian', born: 1889, died: 1951, archetypes: ['sage', 'creator'] },
  { id: 'foucault', name: 'Michel Foucault', title: 'French Philosopher & Social Theorist', domain: 'philosophy', subDomain: 'post-structuralism', era: 'contemporary', nationality: 'French', born: 1926, died: 1984, archetypes: ['rebel', 'sage'] },
  { id: 'simone-weil', name: 'Simone Weil', title: 'French Philosopher & Mystic', domain: 'philosophy', subDomain: 'mysticism', era: 'modern', nationality: 'French', born: 1909, died: 1943, archetypes: ['mystic', 'caregiver'] },
  { id: 'pascal', name: 'Blaise Pascal', title: 'French Mathematician & Philosopher', domain: 'philosophy', subDomain: 'theology', era: 'enlightenment', nationality: 'French', born: 1623, died: 1662, archetypes: ['mystic', 'sage'] },
  { id: 'mill', name: 'John Stuart Mill', title: 'British Philosopher & Economist', domain: 'philosophy', subDomain: 'utilitarianism', era: 'modern', nationality: 'British', born: 1806, died: 1873, archetypes: ['caregiver', 'sage'] },
  { id: 'rawls', name: 'John Rawls', title: 'American Political Philosopher', domain: 'philosophy', subDomain: 'justice', era: 'contemporary', nationality: 'American', born: 1921, died: 2002, archetypes: ['caregiver', 'sage'] },

  // ── PSYCHOLOGY ───────────────────────────────────────────────────────────────
  { id: 'jung', name: 'Carl Jung', title: 'Swiss Psychiatrist & Psychoanalyst', domain: 'psychology', subDomain: 'analytical psychology', era: 'modern', nationality: 'Swiss', born: 1875, died: 1961, archetypes: ['mystic', 'sage'] },
  { id: 'freud', name: 'Sigmund Freud', title: 'Austrian Neurologist, Founder of Psychoanalysis', domain: 'psychology', subDomain: 'psychoanalysis', era: 'modern', nationality: 'Austrian', born: 1856, died: 1939, archetypes: ['sage', 'rebel'] },
  { id: 'frankl', name: 'Viktor Frankl', title: 'Austrian Psychiatrist & Holocaust Survivor', domain: 'psychology', subDomain: 'logotherapy', era: 'modern', nationality: 'Austrian', born: 1905, died: 1997, archetypes: ['hero', 'sage'] },
  { id: 'fromm', name: 'Erich Fromm', title: 'German Social Psychologist & Philosopher', domain: 'psychology', subDomain: 'humanistic psychology', era: 'modern', nationality: 'German', born: 1900, died: 1980, archetypes: ['lover', 'caregiver'] },
  { id: 'maslow', name: 'Abraham Maslow', title: 'American Psychologist', domain: 'psychology', subDomain: 'humanistic psychology', era: 'modern', nationality: 'American', born: 1908, died: 1970, archetypes: ['explorer', 'sage'] },
  { id: 'rogers', name: 'Carl Rogers', title: 'American Psychologist', domain: 'psychology', subDomain: 'humanistic psychology', era: 'modern', nationality: 'American', born: 1902, died: 1987, archetypes: ['caregiver', 'explorer'] },
  { id: 'william-james', name: 'William James', title: 'American Philosopher & Psychologist', domain: 'psychology', subDomain: 'pragmatism', era: 'modern', nationality: 'American', born: 1842, died: 1910, archetypes: ['hero', 'sage'] },
  { id: 'csikszentmihalyi', name: 'Mihaly Csikszentmihalyi', title: 'Hungarian-American Psychologist', domain: 'psychology', subDomain: 'positive psychology', era: 'contemporary', nationality: 'Hungarian-American', born: 1934, died: 2021, archetypes: ['creator', 'explorer'] },
  { id: 'kahneman', name: 'Daniel Kahneman', title: 'Israeli-American Psychologist & Nobel Laureate', domain: 'psychology', subDomain: 'behavioral economics', era: 'contemporary', nationality: 'Israeli-American', born: 1934, archetypes: ['sage', 'explorer'] },
  { id: 'brene-brown', name: 'Brené Brown', title: 'American Research Professor & Author', domain: 'psychology', subDomain: 'vulnerability research', era: 'contemporary', nationality: 'American', born: 1965, archetypes: ['lover', 'hero'] },
  { id: 'peterson', name: 'Jordan Peterson', title: 'Canadian Psychologist & Author', domain: 'psychology', subDomain: 'depth psychology', era: 'contemporary', nationality: 'Canadian', born: 1962, archetypes: ['hero', 'sage'] },
  { id: 'adler', name: 'Alfred Adler', title: 'Austrian Psychiatrist', domain: 'psychology', subDomain: 'individual psychology', era: 'modern', nationality: 'Austrian', born: 1870, died: 1937, archetypes: ['hero', 'caregiver'] },
  { id: 'winnicott', name: 'D.W. Winnicott', title: 'British Pediatrician & Psychoanalyst', domain: 'psychology', subDomain: 'object relations', era: 'modern', nationality: 'British', born: 1896, died: 1971, archetypes: ['caregiver', 'creator'] },

  // ── LITERATURE ───────────────────────────────────────────────────────────────
  { id: 'dostoevsky', name: 'Fyodor Dostoevsky', title: 'Russian Novelist', domain: 'literature', subDomain: 'existential fiction', era: 'modern', nationality: 'Russian', born: 1821, died: 1881, archetypes: ['mystic', 'rebel'] },
  { id: 'tolstoy', name: 'Leo Tolstoy', title: 'Russian Novelist & Philosopher', domain: 'literature', subDomain: 'realism', era: 'modern', nationality: 'Russian', born: 1828, died: 1910, archetypes: ['caregiver', 'sage'] },
  { id: 'kafka', name: 'Franz Kafka', title: 'Czech-German Novelist', domain: 'literature', subDomain: 'absurdism', era: 'modern', nationality: 'Czech', born: 1883, died: 1924, archetypes: ['rebel', 'mystic'] },
  { id: 'woolf', name: 'Virginia Woolf', title: 'English Modernist Writer', domain: 'literature', subDomain: 'modernism', era: 'modern', nationality: 'British', born: 1882, died: 1941, archetypes: ['creator', 'rebel'] },
  { id: 'hemingway', name: 'Ernest Hemingway', title: 'American Nobel Laureate Novelist', domain: 'literature', subDomain: 'minimalism', era: 'modern', nationality: 'American', born: 1899, died: 1961, archetypes: ['hero', 'explorer'] },
  { id: 'toni-morrison', name: 'Toni Morrison', title: 'American Nobel Laureate Novelist', domain: 'literature', subDomain: 'African-American literature', era: 'contemporary', nationality: 'American', born: 1931, died: 2019, archetypes: ['caregiver', 'rebel'] },
  { id: 'james-baldwin', name: 'James Baldwin', title: 'American Novelist & Activist', domain: 'literature', subDomain: 'civil rights literature', era: 'modern', nationality: 'American', born: 1924, died: 1987, archetypes: ['rebel', 'lover'] },
  { id: 'gabriel-marquez', name: 'Gabriel García Márquez', title: 'Colombian Nobel Laureate Novelist', domain: 'literature', subDomain: 'magical realism', era: 'contemporary', nationality: 'Colombian', born: 1927, died: 2014, archetypes: ['creator', 'mystic'] },
  { id: 'borges', name: 'Jorge Luis Borges', title: 'Argentine Writer & Poet', domain: 'literature', subDomain: 'magical realism', era: 'modern', nationality: 'Argentine', born: 1899, died: 1986, archetypes: ['sage', 'mystic'] },
  { id: 'nabokov', name: 'Vladimir Nabokov', title: 'Russian-American Novelist', domain: 'literature', subDomain: 'modernism', era: 'modern', nationality: 'Russian-American', born: 1899, died: 1977, archetypes: ['creator', 'sage'] },
  { id: 'chekhov', name: 'Anton Chekhov', title: 'Russian Playwright & Short Story Writer', domain: 'literature', subDomain: 'realism', era: 'modern', nationality: 'Russian', born: 1860, died: 1904, archetypes: ['caregiver', 'sage'] },
  { id: 'shakespeare', name: 'William Shakespeare', title: 'English Playwright & Poet', domain: 'literature', subDomain: 'drama', era: 'renaissance', nationality: 'British', born: 1564, died: 1616, archetypes: ['creator', 'lover'] },
  { id: 'george-orwell', name: 'George Orwell', title: 'English Novelist & Political Commentator', domain: 'literature', subDomain: 'political fiction', era: 'modern', nationality: 'British', born: 1903, died: 1950, archetypes: ['rebel', 'sage'] },
  { id: 'ursula-leguin', name: 'Ursula K. Le Guin', title: 'American Science Fiction & Fantasy Author', domain: 'literature', subDomain: 'speculative fiction', era: 'contemporary', nationality: 'American', born: 1929, died: 2018, archetypes: ['explorer', 'mystic'] },
  { id: 'octavia-butler', name: 'Octavia Butler', title: 'American Science Fiction Writer', domain: 'literature', subDomain: 'speculative fiction', era: 'contemporary', nationality: 'American', born: 1947, died: 2006, archetypes: ['rebel', 'creator'] },
  { id: 'james-joyce', name: 'James Joyce', title: 'Irish Modernist Novelist', domain: 'literature', subDomain: 'modernism', era: 'modern', nationality: 'Irish', born: 1882, died: 1941, archetypes: ['creator', 'rebel'] },
  { id: 'proust', name: 'Marcel Proust', title: 'French Modernist Novelist', domain: 'literature', subDomain: 'modernism', era: 'modern', nationality: 'French', born: 1871, died: 1922, archetypes: ['mystic', 'lover'] },

  // ── POETRY ───────────────────────────────────────────────────────────────────
  { id: 'rumi', name: 'Rumi', title: '13th-Century Persian Poet & Sufi Mystic', domain: 'poetry', subDomain: 'sufism', era: 'medieval', nationality: 'Persian', born: 1207, died: 1273, archetypes: ['mystic', 'lover'] },
  { id: 'hafez', name: 'Hafez', title: 'Persian Lyric Poet', domain: 'poetry', subDomain: 'sufism', era: 'medieval', nationality: 'Persian', born: 1315, died: 1390, archetypes: ['lover', 'mystic'] },
  { id: 'rilke', name: 'Rainer Maria Rilke', title: 'Bohemian-Austrian Poet', domain: 'poetry', subDomain: 'symbolism', era: 'modern', nationality: 'Austrian', born: 1875, died: 1926, archetypes: ['mystic', 'lover'] },
  { id: 'emily-dickinson', name: 'Emily Dickinson', title: 'American Poet', domain: 'poetry', subDomain: 'lyric poetry', era: 'modern', nationality: 'American', born: 1830, died: 1886, archetypes: ['mystic', 'creator'] },
  { id: 'whitman', name: 'Walt Whitman', title: 'American Poet', domain: 'poetry', subDomain: 'transcendentalism', era: 'modern', nationality: 'American', born: 1819, died: 1892, archetypes: ['explorer', 'lover'] },
  { id: 'neruda', name: 'Pablo Neruda', title: 'Chilean Nobel Laureate Poet', domain: 'poetry', subDomain: 'surrealism', era: 'modern', nationality: 'Chilean', born: 1904, died: 1973, archetypes: ['lover', 'rebel'] },
  { id: 'mary-oliver', name: 'Mary Oliver', title: 'American Poet', domain: 'poetry', subDomain: 'nature poetry', era: 'contemporary', nationality: 'American', born: 1935, died: 2019, archetypes: ['mystic', 'explorer'] },
  { id: 'sylvia-plath', name: 'Sylvia Plath', title: 'American Poet & Novelist', domain: 'poetry', subDomain: 'confessional poetry', era: 'modern', nationality: 'American', born: 1932, died: 1963, archetypes: ['rebel', 'creator'] },
  { id: 'maya-angelou', name: 'Maya Angelou', title: 'American Poet & Civil Rights Activist', domain: 'poetry', subDomain: 'civil rights poetry', era: 'contemporary', nationality: 'American', born: 1928, died: 2014, archetypes: ['hero', 'caregiver'] },
  { id: 'langston-hughes', name: 'Langston Hughes', title: 'American Poet & Harlem Renaissance Figure', domain: 'poetry', subDomain: 'Harlem Renaissance', era: 'modern', nationality: 'American', born: 1902, died: 1967, archetypes: ['rebel', 'creator'] },
  { id: 'keats', name: 'John Keats', title: 'English Romantic Poet', domain: 'poetry', subDomain: 'romanticism', era: 'modern', nationality: 'British', born: 1795, died: 1821, archetypes: ['lover', 'creator'] },
  { id: 'yeats', name: 'W.B. Yeats', title: 'Irish Nobel Laureate Poet', domain: 'poetry', subDomain: 'symbolism', era: 'modern', nationality: 'Irish', born: 1865, died: 1939, archetypes: ['mystic', 'creator'] },
  { id: 't-s-eliot', name: 'T.S. Eliot', title: 'American-British Modernist Poet', domain: 'poetry', subDomain: 'modernism', era: 'modern', nationality: 'American-British', born: 1888, died: 1965, archetypes: ['mystic', 'sage'] },

  // ── SCIENCE ──────────────────────────────────────────────────────────────────
  { id: 'einstein', name: 'Albert Einstein', title: 'German-American Theoretical Physicist, Nobel Laureate', domain: 'science', subDomain: 'physics', era: 'modern', nationality: 'German-American', born: 1879, died: 1955, archetypes: ['creator', 'sage'] },
  { id: 'darwin', name: 'Charles Darwin', title: 'English Naturalist & Biologist', domain: 'science', subDomain: 'biology', era: 'modern', nationality: 'British', born: 1809, died: 1882, archetypes: ['explorer', 'sage'] },
  { id: 'feynman', name: 'Richard Feynman', title: 'American Physicist & Nobel Laureate', domain: 'science', subDomain: 'physics', era: 'modern', nationality: 'American', born: 1918, died: 1988, archetypes: ['creator', 'explorer'] },
  { id: 'carl-sagan', name: 'Carl Sagan', title: 'American Astronomer & Science Communicator', domain: 'science', subDomain: 'astronomy', era: 'contemporary', nationality: 'American', born: 1934, died: 1996, archetypes: ['sage', 'explorer'] },
  { id: 'marie-curie', name: 'Marie Curie', title: 'Polish-French Physicist & Chemist, Dual Nobel Laureate', domain: 'science', subDomain: 'physics', era: 'modern', nationality: 'Polish-French', born: 1867, died: 1934, archetypes: ['hero', 'creator'] },
  { id: 'hawking', name: 'Stephen Hawking', title: 'British Theoretical Physicist', domain: 'science', subDomain: 'cosmology', era: 'contemporary', nationality: 'British', born: 1942, died: 2018, archetypes: ['hero', 'sage'] },
  { id: 'tesla', name: 'Nikola Tesla', title: 'Serbian-American Inventor & Electrical Engineer', domain: 'science', subDomain: 'engineering', era: 'modern', nationality: 'Serbian-American', born: 1856, died: 1943, archetypes: ['creator', 'rebel'] },
  { id: 'rachel-carson', name: 'Rachel Carson', title: 'American Marine Biologist & Conservationist', domain: 'science', subDomain: 'ecology', era: 'modern', nationality: 'American', born: 1907, died: 1964, archetypes: ['caregiver', 'rebel'] },
  { id: 'neil-degrasse-tyson', name: 'Neil deGrasse Tyson', title: 'American Astrophysicist & Science Communicator', domain: 'science', subDomain: 'astrophysics', era: 'contemporary', nationality: 'American', born: 1958, archetypes: ['sage', 'explorer'] },
  { id: 'ada-lovelace', name: 'Ada Lovelace', title: 'British Mathematician, First Computer Programmer', domain: 'science', subDomain: 'mathematics', era: 'modern', nationality: 'British', born: 1815, died: 1852, archetypes: ['creator', 'explorer'] },
  { id: 'alan-turing', name: 'Alan Turing', title: 'British Mathematician & Computer Scientist', domain: 'science', subDomain: 'computer science', era: 'modern', nationality: 'British', born: 1912, died: 1954, archetypes: ['creator', 'sage'] },

  // ── ART ──────────────────────────────────────────────────────────────────────
  { id: 'da-vinci', name: 'Leonardo da Vinci', title: 'Italian Renaissance Polymath & Artist', domain: 'art', subDomain: 'renaissance', era: 'renaissance', nationality: 'Italian', born: 1452, died: 1519, archetypes: ['creator', 'sage'] },
  { id: 'michelangelo', name: 'Michelangelo', title: 'Italian Renaissance Sculptor & Painter', domain: 'art', subDomain: 'renaissance', era: 'renaissance', nationality: 'Italian', born: 1475, died: 1564, archetypes: ['creator', 'hero'] },
  { id: 'van-gogh', name: 'Vincent van Gogh', title: 'Dutch Post-Impressionist Painter', domain: 'art', subDomain: 'post-impressionism', era: 'modern', nationality: 'Dutch', born: 1853, died: 1890, archetypes: ['creator', 'rebel'] },
  { id: 'picasso', name: 'Pablo Picasso', title: 'Spanish Cubist Artist', domain: 'art', subDomain: 'cubism', era: 'modern', nationality: 'Spanish', born: 1881, died: 1973, archetypes: ['creator', 'rebel'] },
  { id: 'frida-kahlo', name: 'Frida Kahlo', title: 'Mexican Surrealist Painter', domain: 'art', subDomain: 'surrealism', era: 'modern', nationality: 'Mexican', born: 1907, died: 1954, archetypes: ['rebel', 'creator'] },
  { id: 'georgia-okeeffe', name: "Georgia O'Keeffe", title: 'American Modernist Painter', domain: 'art', subDomain: 'modernism', era: 'modern', nationality: 'American', born: 1887, died: 1986, archetypes: ['creator', 'explorer'] },
  { id: 'warhol', name: 'Andy Warhol', title: 'American Pop Artist', domain: 'art', subDomain: 'pop art', era: 'contemporary', nationality: 'American', born: 1928, died: 1987, archetypes: ['rebel', 'creator'] },
  { id: 'basquiat', name: 'Jean-Michel Basquiat', title: 'American Neo-Expressionist Artist', domain: 'art', subDomain: 'neo-expressionism', era: 'contemporary', nationality: 'American', born: 1960, died: 1988, archetypes: ['rebel', 'creator'] },
  { id: 'yayoi-kusama', name: 'Yayoi Kusama', title: 'Japanese Contemporary Artist', domain: 'art', subDomain: 'contemporary art', era: 'contemporary', nationality: 'Japanese', born: 1929, archetypes: ['mystic', 'creator'] },
  { id: 'banksy', name: 'Banksy', title: 'British Street Artist & Political Activist', domain: 'art', subDomain: 'street art', era: 'contemporary', nationality: 'British', archetypes: ['rebel', 'creator'] },
  { id: 'agnes-martin', name: 'Agnes Martin', title: 'Canadian-American Abstract Painter', domain: 'art', subDomain: 'minimalism', era: 'contemporary', nationality: 'Canadian-American', born: 1912, died: 2004, archetypes: ['mystic', 'creator'] },

  // ── ARCHITECTURE ─────────────────────────────────────────────────────────────
  { id: 'frank-lloyd-wright', name: 'Frank Lloyd Wright', title: 'American Architect', domain: 'architecture', subDomain: 'organic architecture', era: 'modern', nationality: 'American', born: 1867, died: 1959, archetypes: ['creator', 'rebel'] },
  { id: 'le-corbusier', name: 'Le Corbusier', title: 'Swiss-French Modernist Architect', domain: 'architecture', subDomain: 'modernism', era: 'modern', nationality: 'Swiss-French', born: 1887, died: 1965, archetypes: ['creator', 'rebel'] },
  { id: 'mies-van-der-rohe', name: 'Mies van der Rohe', title: 'German-American Architect', domain: 'architecture', subDomain: 'modernism', era: 'modern', nationality: 'German-American', born: 1886, died: 1969, archetypes: ['sage', 'creator'] },
  { id: 'louis-kahn', name: 'Louis Kahn', title: 'American Architect', domain: 'architecture', subDomain: 'monumentalism', era: 'modern', nationality: 'American', born: 1901, died: 1974, archetypes: ['mystic', 'creator'] },
  { id: 'tadao-ando', name: 'Tadao Ando', title: 'Japanese Architect, Pritzker Prize Laureate', domain: 'architecture', subDomain: 'critical regionalism', era: 'contemporary', nationality: 'Japanese', born: 1941, archetypes: ['mystic', 'creator'] },
  { id: 'zaha-hadid', name: 'Zaha Hadid', title: 'Iraqi-British Architect, Pritzker Prize Laureate', domain: 'architecture', subDomain: 'deconstructivism', era: 'contemporary', nationality: 'Iraqi-British', born: 1950, died: 2016, archetypes: ['rebel', 'creator'] },
  { id: 'renzo-piano', name: 'Renzo Piano', title: 'Italian Architect, Pritzker Prize Laureate', domain: 'architecture', subDomain: 'high-tech architecture', era: 'contemporary', nationality: 'Italian', born: 1937, archetypes: ['creator', 'explorer'] },
  { id: 'peter-zumthor', name: 'Peter Zumthor', title: 'Swiss Architect, Pritzker Prize Laureate', domain: 'architecture', subDomain: 'phenomenology', era: 'contemporary', nationality: 'Swiss', born: 1943, archetypes: ['mystic', 'creator'] },
  { id: 'kengo-kuma', name: 'Kengo Kuma', title: 'Japanese Architect', domain: 'architecture', subDomain: 'critical regionalism', era: 'contemporary', nationality: 'Japanese', born: 1954, archetypes: ['creator', 'sage'] },

  // ── MUSIC ─────────────────────────────────────────────────────────────────────
  { id: 'beethoven', name: 'Ludwig van Beethoven', title: 'German Classical Composer', domain: 'music', subDomain: 'classical', era: 'modern', nationality: 'German', born: 1770, died: 1827, archetypes: ['hero', 'creator'] },
  { id: 'miles-davis', name: 'Miles Davis', title: 'American Jazz Musician & Composer', domain: 'music', subDomain: 'jazz', era: 'modern', nationality: 'American', born: 1926, died: 1991, archetypes: ['creator', 'rebel'] },
  { id: 'bob-dylan', name: 'Bob Dylan', title: 'American Singer-Songwriter & Nobel Laureate', domain: 'music', subDomain: 'folk rock', era: 'contemporary', nationality: 'American', born: 1941, archetypes: ['rebel', 'creator'] },
  { id: 'david-bowie', name: 'David Bowie', title: 'English Singer-Songwriter & Cultural Icon', domain: 'music', subDomain: 'rock', era: 'contemporary', nationality: 'British', born: 1947, died: 2016, archetypes: ['creator', 'explorer'] },
  { id: 'nina-simone', name: 'Nina Simone', title: 'American Singer, Songwriter & Civil Rights Activist', domain: 'music', subDomain: 'jazz', era: 'contemporary', nationality: 'American', born: 1933, died: 2003, archetypes: ['rebel', 'lover'] },
  { id: 'john-coltrane', name: 'John Coltrane', title: 'American Jazz Musician & Composer', domain: 'music', subDomain: 'jazz', era: 'modern', nationality: 'American', born: 1926, died: 1967, archetypes: ['mystic', 'creator'] },
  { id: 'prince', name: 'Prince', title: 'American Musician & Cultural Icon', domain: 'music', subDomain: 'funk', era: 'contemporary', nationality: 'American', born: 1958, died: 2016, archetypes: ['creator', 'rebel'] },
  { id: 'patti-smith', name: 'Patti Smith', title: 'American Punk Poet & Musician', domain: 'music', subDomain: 'punk', era: 'contemporary', nationality: 'American', born: 1946, archetypes: ['rebel', 'creator'] },
  { id: 'john-lennon', name: 'John Lennon', title: 'British Musician & Peace Activist', domain: 'music', subDomain: 'rock', era: 'contemporary', nationality: 'British', born: 1940, died: 1980, archetypes: ['rebel', 'lover'] },

  // ── BUSINESS & LEADERSHIP ────────────────────────────────────────────────────
  { id: 'steve-jobs', name: 'Steve Jobs', title: 'Co-Founder of Apple Inc.', domain: 'business', subDomain: 'technology', era: 'contemporary', nationality: 'American', born: 1955, died: 2011, archetypes: ['creator', 'hero'] },
  { id: 'warren-buffett', name: 'Warren Buffett', title: 'American Investor & Philanthropist', domain: 'business', subDomain: 'investing', era: 'contemporary', nationality: 'American', born: 1930, archetypes: ['sage', 'hero'] },
  { id: 'oprah-winfrey', name: 'Oprah Winfrey', title: 'American Media Executive & Philanthropist', domain: 'business', subDomain: 'media', era: 'contemporary', nationality: 'American', born: 1954, archetypes: ['caregiver', 'hero'] },
  { id: 'peter-drucker', name: 'Peter Drucker', title: 'Austrian-American Management Consultant & Author', domain: 'business', subDomain: 'management', era: 'modern', nationality: 'Austrian-American', born: 1909, died: 2005, archetypes: ['sage', 'creator'] },
  { id: 'naval-ravikant', name: 'Naval Ravikant', title: 'American Entrepreneur & Philosopher', domain: 'business', subDomain: 'venture capital', era: 'contemporary', nationality: 'American', born: 1974, archetypes: ['sage', 'explorer'] },
  { id: 'paul-graham', name: 'Paul Graham', title: 'British-American Entrepreneur & Essayist', domain: 'business', subDomain: 'startups', era: 'contemporary', nationality: 'British-American', born: 1964, archetypes: ['sage', 'creator'] },
  { id: 'simon-sinek', name: 'Simon Sinek', title: 'British-American Author & Motivational Speaker', domain: 'business', subDomain: 'leadership', era: 'contemporary', nationality: 'British-American', born: 1973, archetypes: ['caregiver', 'hero'] },
  { id: 'brene-brown-biz', name: 'Brené Brown', title: 'American Research Professor & Leadership Author', domain: 'business', subDomain: 'leadership', era: 'contemporary', nationality: 'American', born: 1965, archetypes: ['caregiver', 'hero'] },
  { id: 'sheryl-sandberg', name: 'Sheryl Sandberg', title: 'American Business Executive & Author', domain: 'business', subDomain: 'leadership', era: 'contemporary', nationality: 'American', born: 1969, archetypes: ['hero', 'rebel'] },
  { id: 'indra-nooyi', name: 'Indra Nooyi', title: 'Indian-American Business Executive, Former CEO of PepsiCo', domain: 'business', subDomain: 'leadership', era: 'contemporary', nationality: 'Indian-American', born: 1955, archetypes: ['hero', 'caregiver'] },
  { id: 'elon-musk', name: 'Elon Musk', title: 'South African-American Entrepreneur & Engineer', domain: 'business', subDomain: 'technology', era: 'contemporary', nationality: 'South African-American', born: 1971, archetypes: ['hero', 'creator'] },
  { id: 'james-clear', name: 'James Clear', title: 'American Author of Atomic Habits', domain: 'business', subDomain: 'productivity', era: 'contemporary', nationality: 'American', born: 1986, archetypes: ['hero', 'sage'] },

  // ── SPIRITUALITY & WISDOM ────────────────────────────────────────────────────
  { id: 'buddha', name: 'Siddhartha Gautama (The Buddha)', title: 'Spiritual Teacher & Founder of Buddhism', domain: 'spirituality', subDomain: 'buddhism', era: 'ancient', nationality: 'Nepali', born: -563, died: -483, archetypes: ['sage', 'mystic'] },
  { id: 'dalai-lama', name: 'Dalai Lama XIV', title: 'Tibetan Buddhist Spiritual Leader', domain: 'spirituality', subDomain: 'buddhism', era: 'contemporary', nationality: 'Tibetan', born: 1935, archetypes: ['caregiver', 'mystic'] },
  { id: 'alan-watts', name: 'Alan Watts', title: 'British Philosopher & Zen Interpreter', domain: 'spirituality', subDomain: 'zen', era: 'modern', nationality: 'British', born: 1915, died: 1973, archetypes: ['mystic', 'explorer'] },
  { id: 'thich-nhat-hanh', name: 'Thich Nhat Hanh', title: 'Vietnamese Buddhist Monk & Peace Activist', domain: 'spirituality', subDomain: 'buddhism', era: 'contemporary', nationality: 'Vietnamese', born: 1926, died: 2022, archetypes: ['caregiver', 'mystic'] },
  { id: 'meister-eckhart', name: 'Meister Eckhart', title: 'German Theologian & Mystic', domain: 'spirituality', subDomain: 'christian mysticism', era: 'medieval', nationality: 'German', born: 1260, died: 1328, archetypes: ['mystic', 'sage'] },
  { id: 'krishnamurti', name: 'Jiddu Krishnamurti', title: 'Indian Philosopher & Speaker', domain: 'spirituality', subDomain: 'non-duality', era: 'modern', nationality: 'Indian', born: 1895, died: 1986, archetypes: ['rebel', 'mystic'] },
  { id: 'ram-dass', name: 'Ram Dass', title: 'American Spiritual Teacher', domain: 'spirituality', subDomain: 'spirituality', era: 'contemporary', nationality: 'American', born: 1931, died: 2019, archetypes: ['mystic', 'caregiver'] },
  { id: 'thomas-merton', name: 'Thomas Merton', title: 'American Trappist Monk & Mystic', domain: 'spirituality', subDomain: 'christian mysticism', era: 'modern', nationality: 'American', born: 1915, died: 1968, archetypes: ['mystic', 'sage'] },
  { id: 'eckhart-tolle', name: 'Eckhart Tolle', title: 'German-Canadian Spiritual Author', domain: 'spirituality', subDomain: 'presence', era: 'contemporary', nationality: 'German-Canadian', born: 1948, archetypes: ['mystic', 'caregiver'] },

  // ── ACTIVISM & SOCIAL CHANGE ─────────────────────────────────────────────────
  { id: 'martin-luther-king', name: 'Martin Luther King Jr.', title: 'American Civil Rights Leader', domain: 'activism', subDomain: 'civil rights', era: 'modern', nationality: 'American', born: 1929, died: 1968, archetypes: ['hero', 'caregiver'] },
  { id: 'nelson-mandela', name: 'Nelson Mandela', title: 'South African President & Anti-Apartheid Leader', domain: 'activism', subDomain: 'anti-apartheid', era: 'contemporary', nationality: 'South African', born: 1918, died: 2013, archetypes: ['hero', 'rebel'] },
  { id: 'angela-davis', name: 'Angela Davis', title: 'American Political Activist & Academic', domain: 'activism', subDomain: 'black liberation', era: 'contemporary', nationality: 'American', born: 1944, archetypes: ['rebel', 'caregiver'] },
  { id: 'bell-hooks', name: 'bell hooks', title: 'American Author & Cultural Critic', domain: 'activism', subDomain: 'feminism', era: 'contemporary', nationality: 'American', born: 1952, died: 2021, archetypes: ['rebel', 'caregiver'] },
  { id: 'malala-yousafzai', name: 'Malala Yousafzai', title: 'Pakistani Activist & Nobel Peace Laureate', domain: 'activism', subDomain: 'education rights', era: 'contemporary', nationality: 'Pakistani', born: 1997, archetypes: ['hero', 'caregiver'] },
  { id: 'greta-thunberg', name: 'Greta Thunberg', title: 'Swedish Climate Activist', domain: 'activism', subDomain: 'climate', era: 'contemporary', nationality: 'Swedish', born: 2003, archetypes: ['rebel', 'hero'] },
  { id: 'gandhi', name: 'Mahatma Gandhi', title: 'Indian Independence Leader', domain: 'activism', subDomain: 'nonviolence', era: 'modern', nationality: 'Indian', born: 1869, died: 1948, archetypes: ['hero', 'caregiver'] },

  // ── FILM & CINEMA ────────────────────────────────────────────────────────────
  { id: 'bergman', name: 'Ingmar Bergman', title: 'Swedish Film Director', domain: 'film', subDomain: 'art cinema', era: 'modern', nationality: 'Swedish', born: 1918, died: 2007, archetypes: ['mystic', 'creator'] },
  { id: 'kurosawa', name: 'Akira Kurosawa', title: 'Japanese Film Director', domain: 'film', subDomain: 'art cinema', era: 'modern', nationality: 'Japanese', born: 1910, died: 1998, archetypes: ['creator', 'hero'] },
  { id: 'tarkovsky', name: 'Andrei Tarkovsky', title: 'Russian Film Director', domain: 'film', subDomain: 'art cinema', era: 'modern', nationality: 'Russian', born: 1932, died: 1986, archetypes: ['mystic', 'creator'] },
  { id: 'kubrick', name: 'Stanley Kubrick', title: 'American Film Director', domain: 'film', subDomain: 'art cinema', era: 'contemporary', nationality: 'American', born: 1928, died: 1999, archetypes: ['creator', 'sage'] },
  { id: 'agnes-varda', name: 'Agnès Varda', title: 'Belgian-French Film Director', domain: 'film', subDomain: 'French New Wave', era: 'contemporary', nationality: 'Belgian-French', born: 1928, died: 2019, archetypes: ['explorer', 'creator'] },
  { id: 'wong-kar-wai', name: 'Wong Kar-wai', title: 'Hong Kong Film Director', domain: 'film', subDomain: 'art cinema', era: 'contemporary', nationality: 'Chinese-Hong Kong', born: 1958, archetypes: ['lover', 'creator'] },

  // ── TECHNOLOGY & INNOVATION ──────────────────────────────────────────────────
  { id: 'buckminster-fuller', name: 'Buckminster Fuller', title: 'American Architect, Systems Theorist & Futurist', domain: 'technology', subDomain: 'design science', era: 'modern', nationality: 'American', born: 1895, died: 1983, archetypes: ['creator', 'explorer'] },
  { id: 'marshall-mcluhan', name: 'Marshall McLuhan', title: 'Canadian Media Theorist', domain: 'technology', subDomain: 'media theory', era: 'modern', nationality: 'Canadian', born: 1911, died: 1980, archetypes: ['sage', 'explorer'] },
  { id: 'stewart-brand', name: 'Stewart Brand', title: 'American Writer & Futurist', domain: 'technology', subDomain: 'counterculture', era: 'contemporary', nationality: 'American', born: 1938, archetypes: ['explorer', 'rebel'] },
  { id: 'grace-hopper', name: 'Grace Hopper', title: 'American Computer Scientist & US Navy Admiral', domain: 'technology', subDomain: 'computer science', era: 'modern', nationality: 'American', born: 1906, died: 1992, archetypes: ['hero', 'creator'] },
  { id: 'tim-berners-lee', name: 'Tim Berners-Lee', title: 'British Computer Scientist, Inventor of the World Wide Web', domain: 'technology', subDomain: 'internet', era: 'contemporary', nationality: 'British', born: 1955, archetypes: ['creator', 'caregiver'] },

  // ── SPORT & ATHLETICS ────────────────────────────────────────────────────────
  { id: 'muhammad-ali', name: 'Muhammad Ali', title: 'American Professional Boxer & Activist', domain: 'sport', subDomain: 'boxing', era: 'contemporary', nationality: 'American', born: 1942, died: 2016, archetypes: ['hero', 'rebel'] },
  { id: 'serena-williams', name: 'Serena Williams', title: 'American Professional Tennis Player', domain: 'sport', subDomain: 'tennis', era: 'contemporary', nationality: 'American', born: 1981, archetypes: ['hero', 'rebel'] },
  { id: 'michael-jordan', name: 'Michael Jordan', title: 'American Professional Basketball Player', domain: 'sport', subDomain: 'basketball', era: 'contemporary', nationality: 'American', born: 1963, archetypes: ['hero', 'creator'] },
  { id: 'kobe-bryant', name: 'Kobe Bryant', title: 'American Professional Basketball Player', domain: 'sport', subDomain: 'basketball', era: 'contemporary', nationality: 'American', born: 1978, died: 2020, archetypes: ['hero', 'creator'] },
  { id: 'roger-federer', name: 'Roger Federer', title: 'Swiss Professional Tennis Player', domain: 'sport', subDomain: 'tennis', era: 'contemporary', nationality: 'Swiss', born: 1981, archetypes: ['hero', 'sage'] },

  // ── FASHION & DESIGN ────────────────────────────────────────────────────────
  { id: 'coco-chanel', name: 'Coco Chanel', title: 'French Fashion Designer', domain: 'art', subDomain: 'fashion', era: 'modern', nationality: 'French', born: 1883, died: 1971, archetypes: ['rebel', 'creator'] },
  { id: 'dieter-rams', name: 'Dieter Rams', title: 'German Industrial Designer', domain: 'art', subDomain: 'industrial design', era: 'contemporary', nationality: 'German', born: 1932, archetypes: ['sage', 'creator'] },
  { id: 'charles-eames', name: 'Charles Eames', title: 'American Designer & Architect', domain: 'architecture', subDomain: 'design', era: 'modern', nationality: 'American', born: 1907, died: 1978, archetypes: ['creator', 'caregiver'] },
  { id: 'massimo-vignelli', name: 'Massimo Vignelli', title: 'Italian-American Graphic Designer', domain: 'art', subDomain: 'graphic design', era: 'contemporary', nationality: 'Italian-American', born: 1931, died: 2014, archetypes: ['sage', 'creator'] },

  // ── HUMOR & WIT ─────────────────────────────────────────────────────────────
  { id: 'oscar-wilde', name: 'Oscar Wilde', title: 'Irish Playwright & Poet', domain: 'literature', subDomain: 'wit', era: 'modern', nationality: 'Irish', born: 1854, died: 1900, archetypes: ['rebel', 'creator'] },
  { id: 'mark-twain', name: 'Mark Twain', title: 'American Humorist & Novelist', domain: 'literature', subDomain: 'satire', era: 'modern', nationality: 'American', born: 1835, died: 1910, archetypes: ['rebel', 'explorer'] },
  { id: 'george-carlin', name: 'George Carlin', title: 'American Stand-Up Comedian & Social Critic', domain: 'humor', subDomain: 'stand-up', era: 'contemporary', nationality: 'American', born: 1937, died: 2008, archetypes: ['rebel', 'sage'] },
  { id: 'joan-rivers', name: 'Joan Rivers', title: 'American Stand-Up Comedian', domain: 'humor', subDomain: 'stand-up', era: 'contemporary', nationality: 'American', born: 1933, died: 2014, archetypes: ['rebel', 'hero'] },

  // ── MODERN VOICES / MENTORS ─────────────────────────────────────────────────
  { id: 'tim-ferriss', name: 'Tim Ferriss', title: 'American Entrepreneur & Author', domain: 'business', subDomain: 'lifestyle design', era: 'contemporary', nationality: 'American', born: 1977, archetypes: ['explorer', 'hero'] },
  { id: 'seth-godin', name: 'Seth Godin', title: 'American Author & Entrepreneur', domain: 'business', subDomain: 'marketing', era: 'contemporary', nationality: 'American', born: 1960, archetypes: ['creator', 'rebel'] },
  { id: 'cal-newport', name: 'Cal Newport', title: 'American Author & Computer Science Professor', domain: 'business', subDomain: 'productivity', era: 'contemporary', nationality: 'American', born: 1982, archetypes: ['sage', 'creator'] },
  { id: 'mark-manson', name: 'Mark Manson', title: 'American Self-Help Author', domain: 'business', subDomain: 'self-help', era: 'contemporary', nationality: 'American', born: 1984, archetypes: ['rebel', 'hero'] },
  { id: 'derek-sivers', name: 'Derek Sivers', title: 'American Entrepreneur & Musician', domain: 'business', subDomain: 'creativity', era: 'contemporary', nationality: 'American', born: 1969, archetypes: ['creator', 'explorer'] },
  { id: 'austin-kleon', name: 'Austin Kleon', title: 'American Author & Artist', domain: 'art', subDomain: 'creativity', era: 'contemporary', nationality: 'American', born: 1983, archetypes: ['creator', 'explorer'] },
  { id: 'elizabeth-gilbert', name: 'Elizabeth Gilbert', title: 'American Author', domain: 'literature', subDomain: 'creativity', era: 'contemporary', nationality: 'American', born: 1969, archetypes: ['creator', 'explorer'] },
];

export const DOMAIN_LIST = [...new Set(AUTHORS.map((a) => a.domain))];
export const ARCHETYPE_LIST = ['sage', 'explorer', 'creator', 'caregiver', 'rebel', 'lover', 'hero', 'mystic'];
