"use server";

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
