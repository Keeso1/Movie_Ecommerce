export type Products = {
  id: string;
  name: string;
  price: number;
};

export const products: Products[] = [
  { id: "1", name: "item 1", price: 100 },
  { id: "2", name: "item 2", price: 120 },
  { id: "3", name: "item 3", price: 130 },
];
export function getProductById(id: string): Products | undefined {
  return products.find((product) => product.id === id);
}
