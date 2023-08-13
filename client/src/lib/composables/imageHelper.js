export const getFile = async (event, state, width, height) => {
  state.image = {
    image: null,
    imageSmall: null,
    imageReader: "",
    imageURL: "",
    imageSmallURL: "",
  };

  const selectedFile = event.target.files[0];
  state.image.image = await convertImage(selectedFile, width, height);
  state.image.imageSmall = await convertImage(selectedFile, 180, 260);

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    state.image.imageReader = reader.result;
  });
  reader.readAsDataURL(selectedFile);
};

const convertImage = async (file, width, height) => {
  const resizedBlob = await resizeImage(file, width, height);

  const convertedFile = new File([resizedBlob], "converted.webp", {
    type: "image/webp",
  });
  return convertedFile;
};

const resizeImage = (file, width, height) => {
  const img = new Image();
  img.src = URL.createObjectURL(file);

  return new Promise((resolve) => {
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob((resizedBlob) => {
        resolve(resizedBlob);
      }, "image/webp");
    };
  });
};

export const getImagePath = (image) => {
  const imageUrl = image.split("/");
  const imagePath = imageUrl.slice(imageUrl.length - 2).join("/");
  return decodeURIComponent(imagePath);
};
