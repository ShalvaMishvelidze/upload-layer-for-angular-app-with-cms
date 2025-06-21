"use server";

import { ImageModel } from "@/interfaces/Image";
import { Product } from "@/interfaces/Product";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function validateToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    redirect("http://angular.myapp.local");
  }

  return token;
}

export async function uploadToCloudinary(file: File) {
  try {
    await validateToken();
    const response = await fetch(`${process.env.BASE_URL}/cloudinary/sign`, {
      method: "POST",
    });

    const data = await response.json();
    const { signature, timestamp, folder, apiKey, cloudName } = data;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);
    formData.append("folder", folder);

    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    const cloudinaryData = await cloudinaryResponse.json();
    return { url: cloudinaryData.secure_url, id: cloudinaryData.public_id };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
  }
}

export async function deleteFromCloudinary(publicId: string) {
  try {
    await validateToken();

    await fetch(`${process.env.BASE_URL}/cloudinary/delete`, {
      method: "DELETE",
      body: JSON.stringify({ publicId }),
    });
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
  }
}

export async function deleteImagesParallel(images: ImageModel[]) {
  try {
    const token = await validateToken();

    await fetch(`${process.env.BASE_URL}/cloudinary/delete-many`, {
      method: "DELETE",
      body: JSON.stringify(images.map((image) => image.id)),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error deleting images:", error);
  }
}

export async function saveAsDraft(product: any) {
  try {
    const token = await validateToken();

    await fetch(`${process.env.BASE_URL}/product/draft`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });
  } catch (error) {
    console.error("Error saving draft:", error);
  }
}

export async function getDraft(): Promise<Product | undefined> {
  try {
    const token = await validateToken();

    const response = await fetch(`${process.env.BASE_URL}/product/draft`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    const {
      name,
      description,
      price,
      category,
      discount,
      stock,
      thumbnail,
      images,
    } = data.draft;

    return {
      name,
      description,
      price,
      category,
      discount,
      stock,
      thumbnail,
      images,
    };
  } catch (error) {
    console.error("Error fetching draft:", error);
  }
}

export async function deleteDraft() {
  try {
    const token = await validateToken();

    await fetch(`${process.env.BASE_URL}/product/draft`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err: any) {
    console.error("Error deleting draft:", err?.error, err?.code);
  }
}

export async function createNewProduct(product: Product) {
  try {
    const token = await validateToken();

    const response = await fetch(`${process.env.BASE_URL}/product/create`, {
      method: "POST",
      body: JSON.stringify(product),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    redirect(
      `http://angular.myapp.local/dashboard/my-products/${data.product.id}`
    );
  } catch (error) {
    console.error("Error creating new product:", error);
  }
}

export async function generateProductDescription(name: string) {
  try {
    const token = await validateToken();

    const response = await fetch(
      `${process.env.BASE_URL}/product/generate-description`,
      {
        method: "POST",
        body: JSON.stringify({ name }),
      }
    );
    const data = await response.json();
    return data.description;
  } catch (error) {
    console.error("Error generating product description:", error);
  }
}

export async function redirectToMyProducts() {
  redirect("http://angular.myapp.local/dashboard/my-products");
}
