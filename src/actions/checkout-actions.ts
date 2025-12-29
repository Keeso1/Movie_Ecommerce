"use server";

type AddressFormData = {
  street: string;
  city: string;
  postalCode: string;
  country: string;
};

export async function createOrder(addressData: AddressFormData) {
  console.log("Received checkout submission:", addressData);
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { success: true };
}
