import { Products } from "@/data/products";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function ProductCard({ product }: { product: Products }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle> {product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Price: {product.price}</p>
        <form>
          <Input type="hidden" name="productId" value={product.id} />
          <Button type="submit">Add to Cart</Button>
        </form>
      </CardContent>
    </Card>
  );
}
