import Product3DViewer from "../../../components/website/Product3DViewer";

/** Product media gallery - wraps the shared 3D / image viewer. */
export default function ProductGallery({ product }) {
  return (
    <Product3DViewer
      images={product.gallery?.length ? product.gallery : [product.image]}
      modelUrl={product.model}
      name={product.name}
    />
  );
}
