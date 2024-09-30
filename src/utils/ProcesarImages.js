import Pica from 'pica';

export const ProcessImages = async (imagesArray) => {
  const pica = Pica();
console.log("Recibi en el procesador: ", imagesArray)
  const compressedFiles = await Promise.all(
    imagesArray.map(async (file) => {
      // Crear una instancia de Image para cargar el archivo y obtener sus dimensiones
      const img = new Image();
      img.src = URL.createObjectURL(file.originFileObj);

      return new Promise((resolve, reject) => {
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;

          // Mantener la relación de aspecto al redimensionar
          const scale = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scale;

          // Redimensionar con Pica
          const resizedCanvas = await pica.resize(img, canvas, {
            quality: 2, // Calidad de la compresión
          });

          // Convertir el canvas comprimido en un Blob
          const compressedBlob = await pica.toBlob(resizedCanvas, 'image/jpeg', 0.9);

          // Crear un nuevo archivo a partir del Blob
          const compressedFile = new File([compressedBlob], file.name, { type: 'image/jpeg' });

          resolve(compressedFile);
        };
        img.onerror = (err) => reject(err);
      });
    })
  );
  console.log("Imagenes procesadas: ",compressedFiles)

  return compressedFiles;
};
