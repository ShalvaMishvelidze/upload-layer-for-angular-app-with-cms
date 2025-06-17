"use client";
import Bin from "@/icons/bin";
import Plus from "@/icons/plus";
import { ImageModel } from "@/interfaces/Image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { deleteFromCloudinary, uploadToCloudinary } from "@/utils/actions";
import { Product } from "@/interfaces/Product";

const ImageUpload = ({
  setMainData,
}: {
  setMainData: Dispatch<SetStateAction<Product>>;
}) => {
  const [data, setData] = useState<{
    thumbnail: ImageModel;
    images: ImageModel[];
  }>({
    thumbnail: { url: null, id: null },
    images: [],
  });
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    setMainData((prev) => ({
      ...prev,
      thumbnail: data.thumbnail,
      images: data.images,
    }));
  }, [data]);

  return (
    <div className="flex flex-col gap-[12px] w-full">
      <p className="text-[28px] font-semibold">Thumbnail:</p>

      {data.thumbnail.url ? (
        <div className="relative w-full h-[200px]">
          <img
            src={data.thumbnail.url}
            alt="Thumbnail"
            className="w-full h-[200px] object-cover rounded-[5px] shadow-md"
            width="200"
          />
          <button
            className="size-[20px] flex justify-center items-center rounded-full bg-red-100 hover:bg-red-200 absolute right-[-3px] top-[-3px] shadow-sm cursor-pointer"
            type="button"
            onClick={() => {
              deleteFromCloudinary(data.thumbnail.id!).then(() =>
                setData((prev) => ({
                  ...prev,
                  thumbnail: { url: null, id: null },
                  images: prev.images.filter(
                    (img) => img.id !== data.thumbnail.id
                  ),
                }))
              );
            }}
          >
            <Bin size={15} />
          </button>
        </div>
      ) : (
        <label className="w-full h-[200px] border-[2px] rounded-[5px] border-dashed border-blue-400 flex items-center justify-center cursor-pointer bg-blue-100 hover:bg-blue-200 transition-colors duration-300 group">
          <Plus size={100} />
          <input
            onChange={(e) => {
              uploadToCloudinary(e.target.files![0]).then((res) => {
                setData((prev) => ({
                  thumbnail: res,
                  images: [res, ...prev.images],
                }));
                setTouched(true);
              });
            }}
            accept="image/*"
            type="file"
            className="hidden"
          />
        </label>
      )}

      {touched && !data.thumbnail.url && (
        <p className="text-red-500 text-sm mt-1">Thumbnail is required.</p>
      )}

      <p className="text-[22px] font-semibold">Images:</p>

      <div className="flex items-center gap-[4%]">
        {data.images.map((image) => {
          return (
            <div key={image.id} className="relative w-1/6 h-[50px]">
              <img
                src={image.url || ""}
                className="w-full h-[50px] object-cover rounded-[5px] shadow-md"
                width="200"
              />
              <button
                className="size-[20px] flex justify-center items-center rounded-full bg-red-100 hover:bg-red-200 absolute right-[-3px] top-[-3px] shadow-sm"
                type="button"
                onClick={() => {
                  deleteFromCloudinary(image.id!).then(() =>
                    setData((prev) => ({
                      ...prev,
                      images: prev.images.filter((img) => img.id !== image.id),
                    }))
                  );
                }}
              >
                <Bin size={15} />
              </button>
            </div>
          );
        })}

        <label
          className="w-1/6 h-[50px] border-[2px] rounded-[5px] border-dashed border-blue-400 flex items-center justify-center cursor-pointer bg-blue-100 hover:bg-blue-200 group transition-colors duration-300"
          title={!data.thumbnail.url ? "Please upload a thumbnail first." : ""}
        >
          <Plus size={30} />
          <input
            onChange={(e) => {
              uploadToCloudinary(e.target.files![0]).then((res) => {
                setData((prev) => ({ ...prev, images: [...prev.images, res] }));
              });
            }}
            accept="image/*"
            type="file"
            className="hidden"
            disabled={data.images.length >= 5 || !data.thumbnail.url}
          />
        </label>
      </div>
    </div>
  );
};
export default ImageUpload;
