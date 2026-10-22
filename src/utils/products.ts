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
    imageUrl: '/books/dom-casmurro.jpg',
    title: 'Dom Casmurro',
    description:
      'Machado de Assis · Bentinho narra a dúvida que marcou sua vida: Capitu o traiu ou não?',
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
    quantity: 40,
    isAvailable: true,
  },
  {
    id: 3,
    imageUrl: '/books/1984.jpg',
    title: '1984',
    description:
      'George Orwell · Um clássico distópico sobre vigilância, poder e a manipulação da verdade.',
    price: 49.9,
    quantity: 30,
    isAvailable: true,
  },
  {
    id: 4,
    imageUrl: '/books/a-hora-da-estrela.jpg',
    title: 'A Hora da Estrela',
    description:
      'Clarice Lispector · A história de Macabéa, narrada com sensibilidade e questionamentos.',
    price: 34.9,
    quantity: 18,
    isAvailable: true,
  },
  {
    id: 5,
    imageUrl: '/books/grande-sertao-veredas.jpg',
    title: 'Grande Sertão: Veredas',
    description:
      'Guimarães Rosa · A travessia de Riobaldo pelo sertão, entre jagunços, amor e dúvida.',
    price: 69.9,
    quantity: 0,
    isAvailable: false,
  },
];