import type { Product } from '@/types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Aurelia Chain',
    price: 180,
    category: 'necklaces',
    image: '/product_1.jpg',
    description: 'Delicate gold chain with engraved nameplate'
  },
  {
    id: '2',
    name: 'Coral Drop Earrings',
    price: 145,
    category: 'earrings',
    image: '/product_2.jpg',
    description: 'Organic coral-inspired drops with blue topaz'
  },
  {
    id: '3',
    name: 'Tide Ring',
    price: 125,
    category: 'rings',
    image: '/product_3.jpg',
    description: 'Wave-shaped band in polished gold'
  },
  {
    id: '4',
    name: 'Peony Pendant',
    price: 220,
    category: 'necklaces',
    image: '/product_4.jpg',
    description: 'Delicate peony flower charm with pearl center'
  },
  {
    id: '5',
    name: 'Saltwater Hoops',
    price: 135,
    category: 'earrings',
    image: '/product_5.jpg',
    description: 'Textured hoops inspired by ocean waves'
  },
  {
    id: '6',
    name: 'Dune Cuff',
    price: 195,
    category: 'bracelets',
    image: '/product_6.jpg',
    description: 'Wide cuff with organic sand dune texture'
  },
  {
    id: '7',
    name: 'Lagoon Studs',
    price: 110,
    category: 'earrings',
    image: '/product_7.jpg',
    description: 'Blue topaz studs in textured gold settings'
  },
  {
    id: '8',
    name: 'Drift Necklace',
    price: 240,
    category: 'necklaces',
    image: '/product_8.jpg',
    description: 'Long necklace with driftwood-inspired pendant'
  },
  {
    id: '9',
    name: 'Harbour Ring',
    price: 155,
    category: 'rings',
    image: '/product_9.jpg',
    description: 'Signet ring with wave engraving'
  }
];

export const collectionCategories = [
  { id: 'necklaces', name: 'Necklaces', image: '/collection_necklaces.jpg' },
  { id: 'earrings', name: 'Earrings', image: '/collection_earrings.jpg' },
  { id: 'rings', name: 'Rings', image: '/collection_rings.jpg' },
];
