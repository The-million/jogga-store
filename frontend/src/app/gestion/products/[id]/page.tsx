import { ProductForm } from "../_form";

export default function EditProductPage({ params }: { params: { id: string } }) {
  return <ProductForm productId={params.id} />;
}
