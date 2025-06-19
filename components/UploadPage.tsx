"use client";
import ImageUpload from "@/components/ImageUpload";
import { Product } from "@/interfaces/Product";
import {
  createNewProduct,
  deleteDraft,
  deleteImagesParallel,
  getDraft,
  saveAsDraft,
} from "@/utils/actions";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  btn_green,
  btn_red,
  main,
  title,
  upload_section,
} from "./UploadPage.styles";
import CustomInput from "./CustomInput";

const initialProduct: Product = {
  name: "",
  description: "",
  price: 0,
  category: "",
  discount: 0,
  stock: 0,
  thumbnail: { url: null, id: null },
  images: [],
};

const UploadPage = () => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [data, setData] = useState<Product>(initialProduct);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useLayoutEffect(() => {
    getDraft().then((draft) => {
      console.log(draft);

      setData(draft);
    });
  }, []);

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
    saveAsDraft(data);
  }, [data.thumbnail, data.images]);

  return (
    <main className={main}>
      <section className={upload_section}>
        <h2 className={title}>New Product</h2>
        <ImageUpload data={data} setData={setData} />
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <CustomInput
            name="name"
            placeholder="Product Name"
            onChange={handleChange}
            value={data.name}
          />
          <div>
            <label htmlFor="description" className="block font-medium">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Description(optional)"
              className="w-full border rounded px-3 py-2"
              onChange={handleChange}
              value={data.description}
            ></textarea>
          </div>
          <CustomInput
            name="discount"
            placeholder="Discount (%)"
            onChange={handleChange}
            type="number"
            value={data.discount}
          />
          <CustomInput
            name="price"
            placeholder="Product Price"
            onChange={handleChange}
            type="number"
            value={data.price}
          />
          <CustomInput
            name="stock"
            placeholder="Product Stock"
            onChange={handleChange}
            type="number"
            value={data.stock}
          />
          <CustomInput
            name="category"
            placeholder="Product Category"
            onChange={handleChange}
            value={data.category}
          />
          <div className="flex gap-4 pt-2">
            <button
              type="button"
              className={btn_red}
              onClick={() =>
                deleteImagesParallel(data.images).then(() =>
                  deleteDraft().then(() => setData(initialProduct))
                )
              }
            >
              Clear
            </button>
            <button
              type="submit"
              className={btn_green}
              onClick={() => createNewProduct(data)}
            >
              Create
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};
export default UploadPage;
