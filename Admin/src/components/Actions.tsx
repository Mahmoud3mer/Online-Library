import React, { useState } from 'react';
import { FaEye } from 'react-icons/fa';
import { MdDeleteForever, MdOutlineEditOff } from 'react-icons/md';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../utils/apiUrl';
import ConfirmationModal from './ConfirmationModal';

interface ActionsProps {
  itemId: string; // The ID of the book or item to act upon
  apiNeedToFetch: string; // The API endpoint to fetch details from
  navigateUrl: string; // The URL for navigation when editing the book
  token: string; // Token for authentication
  onUpdate?: () => void; // Callback to trigger updates after delete
}

const Actions: React.FC<ActionsProps> = ({ itemId, apiNeedToFetch, navigateUrl, token, onUpdate }) => {
  const [detailed, setDetailed] = useState<any>({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch book details
  const handleMoreDetails = async () => {
    try {
      const res = await axios.get(`${apiUrl}/${apiNeedToFetch}/${itemId}`);
      setDetailed(res.data.data);
      console.log(res.data.data);
      document.getElementById('my_modal_3')?.showModal();
    } catch (error) {
      console.error('Error fetching details:', error);
    }
  };

  // Navigate to the edit page
  const handleEdit = () => {
    navigate(`/forms/${navigateUrl}/${itemId}`);
  };
// console.log(token);

  // Handle the deletion of the book
  const handleDelete = async () => {
    try {
      await axios.delete(`${apiUrl}/${apiNeedToFetch}/${itemId}`, 
        { headers: { token: token || "" } 
      });
      setIsDeleteModalOpen(false);
      console.log("Deleted" , itemId);
      
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const handleConfirmDelete = () => {
    handleDelete();
    setIsDeleteModalOpen(false);
  };

  
  return (
    <div className="flex items-center gap-1">
      {/* View Details Button */}
      <div className="hover:cursor-pointer hover:text-meta-5 p-1" onClick={handleMoreDetails}>
        <FaEye size={20} />
      </div>

      {/* Edit Button */}
      <span className="hover:cursor-pointer hover:text-meta-8" onClick={handleEdit}>
        <MdOutlineEditOff size={20} />
      </span>

      {/* Delete Button */}
      <span className="hover:cursor-pointer hover:text-danger" onClick={() => setIsDeleteModalOpen(true)}>
        <MdDeleteForever size={20} />
      </span>

      {/* Book Details Modal */}
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box w-11/12 max-w-4xl dark:bg-black"> {/* Customize size here */}
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg">Book Details</h3>
          <h5 className="font-semibold py-4">Details for book ID: {detailed._id}</h5>
          <section className="grid grid-cols-3">
            <div>
              <img src={detailed.coverImage} alt={detailed.title} className="w-full" />
            </div>
            <div className="col-span-2 ms-10">
              <h6 className="font-semibold pb-2 border-b mb-4">
                <span className="">Book Title: </span>{detailed.title}
              </h6>
              <p className="py-1"><span className="font-semibold">Author: </span>{detailed?.author?.name}</p>
              <p className="py-1"><span className="font-semibold">Category: </span>{detailed?.category?.name}</p>
              <p className="py-1"><span className="font-semibold">Description: </span>{detailed.description}</p>
              <p className="py-1"><span className="font-semibold">Stock: </span>{detailed.stock}</p>
              <p className="py-1"><span className="font-semibold">Average Rating: </span>{detailed.averageRating}</p>
            </div>
          </section>
        </div>
      </dialog>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        message="Are you sure you want to delete this book?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default Actions;
