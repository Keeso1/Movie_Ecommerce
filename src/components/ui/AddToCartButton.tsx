"use client"; // This component should be client-side

import { useCart } from "@/context/CartContext"; // Use the CartContext to add items to the cart

interface AddToCartButtonProps {
  movie: {
    id: string;
    title: string;
    price: number;
    imageUrl: string;
  };
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ movie }) => {
  const { addToCart } = useCart(); // Use the addToCart function from the CartContext

  const handleAddToCart = () => {
    addToCart({
      movieId: movie.id,
      title: movie.title,
      price: movie.price,
      quantity: 1,
      imageUrl: movie.imageUrl ?? "", // Default to empty string if no image URL
    });
  };

  return (
    <button
      onClick={handleAddToCart}
      className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
    >
      Add to Cart
    </button>
  );
};

export default AddToCartButton;
