import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { handleErrorResult, handleSuccessResult } from "../util/TostMessage";
import api from "../util/api";


interface CarData {
  carTitle: string;
  carDescription: string;
  modelId: number;
  performanceClassId: number;
  year: number;
  price: number;
  carTypeId: number;
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
    modelId: 0,
    performanceClassId: 0,
    year: new Date().getFullYear(), // Default to current year
    price: 0,
    carTypeId: 0,
  });
  const [images, setImages] = useState<File[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [performanceClasses, setPerformanceClasses] = useState<PerformanceClass[]>([]);
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

    // Parsing numeric values properly
    setCarData({
      ...carData,
      [name]: name === "year" || name === "modelId" || name === "performanceClassId" || name === "carTypeId" || name === "price"
        ? Number(value) 
        : value,
    });
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

    // Append all fields as required by the backend
    formData.append("carTitle", carData.carTitle);
    formData.append("carDescription", carData.carDescription);
    formData.append("modelId", carData.modelId.toString());  // Convert numbers to string
    formData.append("performanceClassId", carData.performanceClassId.toString());
    formData.append("year", carData.year.toString());
    formData.append("price", carData.price.toString());
    formData.append("carTypeId", carData.carTypeId.toString());

    // Append images
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
    return <div className="py-4 text-center">Loading...</div>;
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-sm p-6 m-6 mx-auto space-y-5 bg-gray-100 rounded-lg shadow-lg">
        <h1 className="mb-6 text-2xl font-bold text-gray-800 sm:text-2xl">Add A Car</h1>
        <div>
          <label htmlFor="carTitle" className="block text-sm font-semibold text-gray-800">
            Car Title
          </label>
          <input
            id="carTitle"
            name="carTitle"
            type="text"
            value={carData.carTitle}
            onChange={handleInputChange}
            required
            className="block w-full rounded-md border border-gray-300 shadow-sm py-1 focus:border-[#838399] outline-none"
          />
        </div>

        <div>
          <label htmlFor="carDescription" className="block text-sm font-semibold text-gray-800">
            Car Description
          </label>
          <textarea
            id="carDescription"
            name="carDescription"
            value={carData.carDescription}
            onChange={handleInputChange}
            required
            rows={3}
            className="block w-full rounded-md border border-gray-300 shadow-sm py-1 focus:border-[#838399] outline-none"
          />
        </div>

        <div>
          <label htmlFor="modelId" className="block text-sm font-semibold text-gray-800">
            Model
          </label>
          <select
            id="modelId"
            name="modelId"
            value={carData.modelId}
            onChange={handleInputChange}
            required
            className="block w-full rounded-md border border-gray-300 shadow-sm py-1 focus:border-[#838399] outline-none"
          >
            <option value="">Select a model</option>
            {models.map((model) => (
              <option key={model.modelId} value={model.modelId}>
                {model.modelName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="performanceClassId" className="block text-sm font-semibold text-gray-800">
            Performance Class
          </label>
          <select
            id="performanceClassId"
            name="performanceClassId"
            value={carData.performanceClassId}
            onChange={handleInputChange}
            required
            className="block w-full rounded-md border border-gray-300 shadow-sm py-1 focus:border-[#838399] outline-none"
          >
            <option value="">Select a performance class</option>
            {performanceClasses.map((pc) => (
              <option key={pc.id} value={pc.id}>
                {pc.className}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="yearId" className="block text-sm font-semibold text-gray-800">
            Year
          </label>
          <input
            id="yearId"
            name="year"
            type="number"
            min="1950"
            max={new Date().getFullYear()}
            value={carData.year}
            onChange={handleInputChange}
            required
            className="block w-full rounded-md border border-gray-300 shadow-sm py-1 focus:border-[#838399] outline-none"
          />
        </div>

        <div>
          <label htmlFor="carTypeId" className="block text-sm font-semibold text-gray-800">
            Car Type
          </label>
          <select
            id="carTypeId"
            name="carTypeId"
            value={carData.carTypeId}
            onChange={handleInputChange}
            required
            className="block w-full rounded-md border border-gray-300 shadow-sm py-1 focus:border-[#838399] outline-none"
          >
            <option value="">Select a car type</option>
            {carTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.typeName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-semibold text-gray-800">
            Price
          </label>
          <input
            id="price"
            name="price"
            type="number"
            value={carData.price}
            onChange={handleInputChange}
            required
            className="block w-full rounded-md border border-gray-300 shadow-sm py-1 focus:border-[#838399] outline-none"
          />
        </div>

        <div>
          <label htmlFor="images" className="block text-sm font-semibold text-gray-800">
            Images
          </label>
          <input
            id="images"
            name="images"
            type="file"
            onChange={handleImageChange}
            multiple
            accept="image/*"
            className="mt-2 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#000080]/10 file:text-[#000080] hover:file:bg-[#000080]/20"
          />
        </div>

        <button
          type="submit"
          className="w-full py-1 px-4 mt-3 bg-[#222246] text-white rounded-md shadow-sm font-medium hover:bg-[#161646] focus:outline-none"
        >
          Add Car
        </button>
      </form>
    </>
  );
};

export default AddCarForm;
