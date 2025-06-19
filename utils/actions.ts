"use server";

import { ImageModel } from "@/interfaces/Image";
import { Product } from "@/interfaces/Product";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function uploadToCloudinary(file: File) {
  try {
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
    throw error;
  }
}

export async function deleteFromCloudinary(publicId: string) {
  const response = await fetch(`${process.env.BASE_URL}/cloudinary/delete`, {
    method: "DELETE",
    body: JSON.stringify({ publicId }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Error deleting from Cloudinary: ${errorData.message}`);
  }
}

export async function deleteImagesParallel(images: ImageModel[]) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    redirect("http://angular.myapp.local");
  }

  await fetch(`${process.env.BASE_URL}/cloudinary/delete-many`, {
    method: "DELETE",
    body: JSON.stringify(images.map((image) => image.id)),
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function saveAsDraft(product: any) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    redirect("http://angular.myapp.local");
  }

  await fetch(`${process.env.BASE_URL}/product/draft`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(product),
  });
}

export async function getDraft() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    redirect("http://angular.myapp.local");
  }

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
}

export async function deleteDraft() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      redirect("http://angular.myapp.local");
    }

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
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    redirect("http://angular.myapp.local");
  }

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
  ); // Redirect to the newly created product page
}

export async function generateProductDescription(name: string) {
  const response = await fetch(
    `${process.env.BASE_URL}/product/generate-description`,
    {
      method: "POST",
      body: JSON.stringify({ name }),
    }
  );
  const data = await response.json();
  return data.description;
}
