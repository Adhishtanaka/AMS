import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../util/api';

const SellerAddCar = () => {
  const [pName, setPName] = useState('');
  const [pDescription, setPDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [images, setImages] = useState<File[]>([]);
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('pName', pName);
    formData.append('pDescription', pDescription);
    formData.append('price', price.toString());

    images.forEach((image) => {
      formData.append('images', image);
    });

    try {
      await api.post('http://localhost:5000/api/Seller/AddCar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/'); 
    } catch (error) {
      console.error('Error adding car:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-6">
      <div className="w-full max-w-md p-8 px-12 py-12 bg-white rounded-lg shadow-lg">
      <h2 className="mb-6 font-bold text-center text-gray-900 sm:text-2xl">Add a New Car</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div  className='text-gray-700 '>
            <label className= "block mb-2 text-sm font-medium text-gray-500">Car Name</label>
            <input
              type="text"
              value={pName}
              onChange={(e) => setPName(e.target.value)}
              required
              className="block w-full py-2 pl-3 pr-5 mt-1 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-[#263657] focus:border-[#2d3c67] sm:text-sm"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-500">Description</label>
            <textarea
              value={pDescription}
              onChange={(e) => setPDescription(e.target.value)}
              className="block w-full py-2 pl-3 pr-5 mt-1 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-[#263657] focus:border-[#2d3c67] sm:text-sm"
              rows={3}
              required
            ></textarea>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-500">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              className="block w-full py-2 pl-3 pr-5 mt-1 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-[#263657] focus:border-[#2d3c67] sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-500">Car Images</label>
            <input
              type="file"
              multiple
              onChange={handleImageChange}
              className="w-full"
            />
          </div>
          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(image)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-auto border rounded"
                />
              ))}
            </div>
          )}
          <button
            type="submit"
            className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white transition duration-150 ease-in-out border border-transparent rounded-md shadow-sm bg-[#1D2945] hover:bg-[#243357]"
          >
            Add Car
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellerAddCar;
