import { ImageModel } from "./Image";

export interface Product {
  name: string;
  description: string;
  price: number;
  category: string;
  thumbnail: ImageModel;
  images: ImageModel[];
  discount: number;
  stock: number;
}
