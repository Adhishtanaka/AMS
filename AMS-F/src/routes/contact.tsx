import React, { useState } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/Footer';

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitMessage('Thank you for your message. We will get back to you soon!');
      setFormData({ firstName: '', lastName: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitMessage('There was an error sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gray-50">
        {/* Background with Image */}
        <div
          className="bg-img w-full flex justify-center items-center"
          style={{
            backgroundImage: `url('images/patrick-fusenich-kg7AIotQVIo-unsplash.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Contact Form */}
          <div className="w-full max-w-xl py-32  bg-opacity-90 rounded-lg shadow-lg lg:w-6/12 min-h-fit">
            <h2 className="mb-6 text-3xl font-bold text-center text-white py-5">Contact Us</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="w-full sm:w-1/2">
                  <label htmlFor="firstName" className="block text-sm font-semibold text-gray-300">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 text-gray-200 border border-gray-500 rounded-md outline-none bg-gray-300 bg-opacity-40"
                  />
                </div>
                <div className="w-full sm:w-1/2">
                  <label htmlFor="lastName" className="block text-sm font-semibold text-gray-300">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 text-gray-200 border border-gray-500 rounded-md outline-none bg-gray-300 bg-opacity-40"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-gray-200 border border-gray-500 rounded-md outline-none bg-gray-300 bg-opacity-40"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-300">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 text-gray-100 border border-gray-500 rounded-md outline-none bg-gray-300 bg-opacity-40"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-2 text-white bg-[#2b2b68] rounded-md"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>

              {submitMessage && (
                <div
                  className={`mt-4 p-4 rounded-md ${
                    submitMessage.includes('error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}
                >
                  {submitMessage}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
