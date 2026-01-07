"use client";

import { useSearchParams, useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");

  if (!orderId) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Order Not Found</CardTitle>
            <CardDescription>
              We couldn&apos;t find your order. Please try again or contact
              customer support department.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const returnHome = async () => {
    router.push("/");
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-linear-to-br from-background to-muted/40 py-10">
      <Card className="max-w-md w-full shadow-lg border-primary/30">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl md:text-3xl text-primary flex flex-col items-center gap-2">
            <span role="img" aria-label="success" className="text-4xl mb-2">
              🎉
            </span>
            Order Placed Successfully
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Thank you for your purchase! Your order has been placed and is being
            processed.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-2">
          <div className="text-muted-foreground text-sm">Order ID:</div>
          <div className="font-mono text-lg bg-muted/60 rounded px-3 py-1 mb-2 border border-muted-foreground/10">
            {orderId}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 items-center">
          <Button onClick={returnHome} className="w-full mt-2" size="lg">
            Continue Shopping
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
