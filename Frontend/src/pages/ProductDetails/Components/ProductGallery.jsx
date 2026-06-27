import Product3DViewer from "../../../components/website/Product3DViewer";

/** Product media gallery - wraps the shared 3D / image viewer.
 *  `mediaRef` is forwarded to the wrapper so siblings (e.g. the Add-to-Cart
 *  button) can locate the currently displayed image for the fly-to-cart origin. */
export default function ProductGallery({ product, mediaRef }) {
  return (
    <div ref={mediaRef}>
      <Product3DViewer
        images={product.gallery?.length ? product.gallery : [product.image]}
        modelUrl={product.model}
        name={product.name}
      />
    </div>
  );
}
