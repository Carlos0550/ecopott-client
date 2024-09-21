export const GroupImagesIntoProducts = (productsImages, products) => {
    return products.map((product) => {
      const imagenesAgrupadas = productsImages.filter(
        (imagen) => imagen.id_product_image === product.id_product
      );
  
      return {
        ...product, 
        imagenes: imagenesAgrupadas,
      };
    });
  };
  