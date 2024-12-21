export function fabricImage(imgURL: string) {
  const imgElement = new Image();
  imgElement.src = imgURL;
  return imgElement;
}
