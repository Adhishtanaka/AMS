import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { handleErrorResult, handleSuccessResult } from "../util/TostMessage";
import api from "../util/api";

interface CarData {
  carTitle: string;
  carDescription: string;
  modelId: string;
  performanceClassId: string;
  year: string;
  price: string;
  carTypeId: string;
}

interface Model {
  modelId: number;
  modelName: string;
}

interface PerformanceClass {
  id: number;
  className: string;
}

interface CarType {
  id: number;
  typeName: string;
}

const AddCarForm: React.FC = () => {
  const [carData, setCarData] = useState<CarData>({
    carTitle: "",
    carDescription: "",
    modelId: "",
    performanceClassId: "",
    year: "",
    price: "",
    carTypeId: "",
  });
  const [images, setImages] = useState<File[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [performanceClasses, setPerformanceClasses] = useState<
    PerformanceClass[]
  >([]);
  const [carTypes, setCarTypes] = useState<CarType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchSelectOptions();
  }, []);

  const fetchSelectOptions = async (): Promise<void> => {
    setLoading(true);
    try {
      const modelsRes = await api.get<Model[]>("/Public/GetAllModels");
      setModels(modelsRes.data);

      const carTypesRes = await api.get<CarType[]>("/Public/GetAllCarTypes");
      setCarTypes(carTypesRes.data);

      const carPCRes = await api.get<PerformanceClass[]>("/Public/GetAllCarPC");
      setPerformanceClasses(carPCRes.data);
    } catch (err) {
      handleErrorResult("Failed to fetch select options");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setCarData({ ...carData, [name]: value });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();

    Object.keys(carData).forEach((key) => {
      formData.append(key, carData[key as keyof CarData]);
    });

    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      await api.post("/Seller/AddCar", formData);
      handleSuccessResult("Car added successfully");
    } catch (err) {
      handleErrorResult("Failed to add car");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <div>
        <label
          htmlFor="carTitle"
          className="block text-sm font-medium text-gray-700"
        >
          Car Title
        </label>
        <input
          id="carTitle"
          name="carTitle"
          type="text"
          value={carData.carTitle}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label
          htmlFor="carDescription"
          className="block text-sm font-medium text-gray-700"
        >
          Car Description
        </label>
        <textarea
          id="carDescription"
          name="carDescription"
          value={carData.carDescription}
          onChange={handleInputChange}
          required
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label
          htmlFor="modelId"
          className="block text-sm font-medium text-gray-700"
        >
          Model
        </label>
        <select
          id="modelId"
          name="modelId"
          value={carData.modelId}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">Select a model</option>
          {models.map((model) => (
            <option key={model.modelId} value={model.modelId.toString()}>
              {model.modelName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="performanceClassId"
          className="block text-sm font-medium text-gray-700"
        >
          Performance Class
        </label>
        <select
          id="performanceClassId"
          name="performanceClassId"
          value={carData.performanceClassId}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">Select a performance class</option>
          {performanceClasses.map((pc) => (
            <option key={pc.id} value={pc.id.toString()}>
              {pc.className}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="yearId"
          className="block text-sm font-medium text-gray-700"
        >
          Year
        </label>
        <input
          id="yearId"
          name="yearId"
          type="number"
          min="1950"
          max={new Date().getFullYear()}
          step="1"
          value={carData.year}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label
          htmlFor="carTypeId"
          className="block text-sm font-medium text-gray-700"
        >
          Car Type
        </label>
        <select
          id="carTypeId"
          name="carTypeId"
          value={carData.carTypeId}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">Select a car type</option>
          {carTypes.map((type) => (
            <option key={type.id} value={type.id.toString()}>
              {type.typeName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="price"
          className="block text-sm font-medium text-gray-700"
        >
          Price
        </label>
        <input
          id="price"
          name="price"
          type="number"
          value={carData.price}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label
          htmlFor="images"
          className="block text-sm font-medium text-gray-700"
        >
          Images
        </label>
        <input
          id="images"
          name="images"
          type="file"
          onChange={handleImageChange}
          multiple
          accept="image/*"
          className="mt-1 block w-full text-sm text-slate-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-violet-50 file:text-violet-700
            hover:file:bg-violet-100"
        />
      </div>
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Add Car
      </button>
    </form>
  );
};

export default AddCarForm;
