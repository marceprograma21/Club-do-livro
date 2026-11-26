export interface IProduct {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
  isAvailable: boolean;
}


export const PRODUCTS: IProduct[] = [
  {
    id: 1,
    imageUrl: '/books/alvo marcado.jpg',
    title: 'Alvo Marcado',
    description:
      'Nas ruas iluminadas por neon de uma metrópole implacável, um jovem estrategista descobre que o preço da verdade é uma mira nas suas costas. Caçado por corporações corruptas e pelo crime organizado, ele terá que usar seu conhecimento e coragem para sobreviver, virar o jogo e destruir o sistema antes que seja tarde demais.',
    price: 39.9,
    quantity: 25,
    isAvailable: true,
  },
  {
    id: 2,
    imageUrl: '/books/a batalha final.jpg',
    title: 'A Batalha Final',
    description:
      'Em meio ao caos de uma terra devastada pela guerra, um jovem guerreiro deve liderar seu exército contra forças implacáveis para proteger seu reino e esculpir seu próprio destino.',
    price: 29.9,
    quantity: 0,
    isAvailable: false,
  },
  {
    id: 3,
    imageUrl: '/books/Matemática - 1º ESO (Oxford  GENiOX).jpg',
    title: 'Matemática - 1º ESO (Oxford / GENiOX)',
    description:
      'Perfeito para estudantes do ensino secundário que buscam um material didático moderno, visualmente atrayente e de alta qualidade da prestigiada editora Oxford.',
    price: 49.9,
    quantity: 30,
    isAvailable: true,
  },
  {
    id: 4,
    imageUrl: '/books/Programador ADS_ Da Teoria à Prática.jpg',
    title: 'Programador ADS_ Da Teoria à Prática',
    description:
      'Livro sobre programação e Análise e Desenvolvimento de Sistemas (ADS), com foco em desenvolvimento web, bancos de dados, redes e Linux, unindo teoria e prática para desenvolver habilidades na área de tecnologia.',
    price: 34.9,
    quantity: 18,
    isAvailable: true,
  },
  {
    id: 5,
    imageUrl: '/books/O Caminho do Shinobi Solitario.jpg',
    title: 'O Caminho do Shinobi Solitario',
    description:
      'Nem mesmo o Hokage mais poderoso escapou da papelada e do caos na Academia. Preso entre missões de rank D intermináveis, pergaminhos empoeirados e rolos de jutsus por classificar, nosso protagonista descobre que o verdadeiro desafio ninja não é vencer a Akatsuki, mas sim sobreviver à bagunça! Junte-se a esta aventura divertida e única na Vila Oculta da Folha. Dattebayo!',
    price: 69.9,
    quantity: 0,
    isAvailable: false,
  },
  {
      id: 6,
    imageUrl: '/books/Dragon Ball Z A Saga de Alex. O Despertar do Novo Guerreiro.jpg',
    title: 'Dragon Ball Z A Saga de Alex - O Despertar do Novo Guerreiro',
    description:
      'Após uma misteriosa anomalia dimensional, Alex aparece no universo de Dragon Ball Z ostentando seu visual característico. Sem saber muito bem como chegou até ali, ele se vê em meio à tensa chegada dos Saiyajins. Agora, com uma energia desconhecida latente em seu interior, Alex precisará se adaptar a este novo mundo e se preparar para o combate iminente ao lado dos Guerreiros Z, enquanto Vegeta observa com curiosidade e desafio a sua chegada',
    price: 19.9,
    quantity: 30,
    isAvailable: true,
  },
    {
      id: 7,
    imageUrl: '/books/O peso dos sonhos.jpg',
    title: 'O peso dos sonhos',
    description:
      'Entre turnos cansativos, aulas, incertezas e um futuro em construção, ele carrega algo que não cabe em escala: sonhos.Este é o relato de um jovem que, mesmo longe de casa, enfrenta a vida com foco, disciplina e a certeza de que tudo o que vale a pena exige esforço. Mais do que uma história sobre dificuldades, é sobre escolhas, superação e o desejo de construir uma vida melhor — sem deixar para trás quem sempre esteve com ele: a própria vontade de vencer.',
    price: 39.98,
    quantity: 30,
    isAvailable: true,
  },
];