import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
      await axios.post('http://localhost:5000/api/Seller/AddCar', formData, {
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-center mb-6">Add a New Car</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Car Name</label>
            <input
              type="text"
              value={pName}
              onChange={(e) => setPName(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Description</label>
            <textarea
              value={pDescription}
              onChange={(e) => setPDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              rows={3}
              required
            ></textarea>
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Car Images</label>
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
                  className="w-full h-auto rounded border"
                />
              ))}
            </div>
          )}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Add Car
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellerAddCar;
