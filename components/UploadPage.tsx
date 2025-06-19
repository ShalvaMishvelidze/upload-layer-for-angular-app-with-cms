"use client";
import ImageUpload from "@/components/ImageUpload";
import { Product } from "@/interfaces/Product";
import { saveAsDraft } from "@/utils/actions";
import { useEffect, useRef, useState } from "react";
import {
  btn_green,
  btn_red,
  main,
  title,
  upload_section,
} from "./UploadPage.styles";
import CustomInput from "./CustomInput";

const UploadPage = () => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [data, setData] = useState<Product>({
    name: "",
    description: "",
    price: 0,
    category: "",
    discount: 0,
    stock: 0,
    thumbnail: { url: null, id: null },
    images: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      saveAsDraft(data);
    }, 2000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [
    data.name,
    data.description,
    data.price,
    data.category,
    data.discount,
    data.stock,
  ]);

  useEffect(() => {
    // saveAsDraft(data, token!);
  }, [data.thumbnail, data.images]);

  return (
    <main className={main}>
      <section className={upload_section}>
        <h2 className={title}>New Product</h2>
        <ImageUpload setMainData={setData} />
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <CustomInput
            name="name"
            placeholder="Product Name"
            onChange={handleChange}
          />
          <div>
            <label htmlFor="description" className="block font-medium">
              Description
            </label>
            <textarea
              id="description"
              placeholder="Description(optional)"
              className="w-full border rounded px-3 py-2"
            ></textarea>
          </div>

          <div>
            <label htmlFor="discount" className="block font-medium">
              Discount* (%)
            </label>
            <input
              id="discount"
              type="number"
              min="0"
              max="100"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="price" className="block font-medium">
              Price* ($)
            </label>
            <input
              id="price"
              type="number"
              min="0"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="stock" className="block font-medium">
              Stock*
            </label>
            <input
              id="stock"
              type="number"
              min="0"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="category" className="block font-medium">
              Category*
            </label>
            <input
              id="category"
              type="text"
              placeholder="Category"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="flex gap-4 pt-2">
            <button type="button" className={btn_red}>
              Clear
            </button>
            <button type="submit" className={btn_green}>
              Create
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};
export default UploadPage;
