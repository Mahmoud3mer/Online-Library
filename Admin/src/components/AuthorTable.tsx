import React, { useState, useEffect } from 'react'
import { FaEye } from 'react-icons/fa';
import { MdDeleteForever, MdOutlineEditOff } from 'react-icons/md';
import { apiUrl } from '../utils/apiUrl';
import axios from 'axios';
import { AuthorInterface } from '../interfaces/BookInterface';
import ConfirmationModal from './ConfirmationModal';

const AuthorTable = () => {
    const [authors, setAuthors] = useState<AuthorInterface[]>([]);
    const [detailedAuthor, setDetailedAuthor] = useState<Partial<AuthorInterface>>({});
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedBookId, setSelectedBookId] = useState<string | null>(null); // Holds the ID of the book to be deleted

    const [page, setPage] = useState(1);
    const limit = 2;

    const getToken = () => localStorage.getItem('token')
    useEffect(() => {
      axios.get(`${apiUrl}/books?page=${page}&limit=${limit}`)
        .then((res) => {
          setBooks(res.data.data)
          // console.log(res.data);
  
        })
        .catch((err) => {
          console.log("Error", err);
        })
    }, [page,books.length])
  
  
    const handleMoreDetails = (bookId: string) => {
      axios.get(`${apiUrl}/books/${bookId}`)
        .then((res) => {
          setDetailedBook(res.data.data);
          console.log(res.data.data);
  
        })
      document.getElementById('my_modal_3')?.showModal();
    };
  




    const handleEdit = (AuthorId: string) => {
        console.log(AuthorId);
    };

    const handleDelete = async (authorId: string) => {
        try {
            const token = getToken();
            await axios.delete(
                `http://localhost:3000/authors/${authorId}`,
                { headers: { token: token || "" } } // Ensure token is passed as a string
            );
            setAuthors(authors.filter(author => author._id !== authorId));
        } catch (error) {
            console.error('Error deleting author:', error);
        }
    };

    const handleConfirmDelete = () => {
        if (selectedAuthorId) {
            handleDelete(selectedAuthorId);  // Proceed with deletion after confirmation
            setIsDeleteModalOpen(false);   // Close the modal
        }
    };

    const openDeleteModal = (authorId: string) => {
        setSelectedAuthorId(authorId);  // Store the author ID to be deleted
        setIsDeleteModalOpen(true); // Open the delete confirmation modal
    };

    return (
        <>
            <div className="mt-10 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="py-6 px-4 md:px-6 xl:px-7.5">
                    <h4 className="text-xl font-semibold text-black dark:text-white">
                        All Authors
                    </h4>
                </div>

                <div className="grid grid-cols-6 gap-3 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-10 md:px-6 2xl:px-7.5">
                    <div className="col-span-2 sm:col-span-2 flex items-center">
                        <p className="font-medium">Author Image</p>
                    </div>
                    <div className="col-span-2 sm:col-span-2 items-center sm:flex">
                        <p className="font-medium">Author Name</p>
                    </div>
                    <div className="col-span-3 hidden sm:col-span-4 items-center sm:flex">
                        <p className="font-medium">Author Bio</p>
                    </div>
                    <div className="col-span-2 sm:col-span-2 items-center sm:flex">
                        <p className="font-medium">Actions</p>
                    </div>
                </div>
            </div>

            {authorsData && authorsData.map((author, index) => (
                <>
                    <div className={index % 2 === 0 ? "bg-white dark:bg-form-input" : "bg-[#f9f9f9] dark:bg-strokedark"} key={author._id}>

                        <div className="grid grid-cols-6 gap-3 border-stroke py-3 px-4 dark:border-strokedark sm:grid-cols-10 md:px-6 2xl:px-7.5 table" >
                            <div className="col-span-2 sm:col-span-2 flex items-center">
                                <div className="h-17 w-full rounded-md">
                                    <img src={author.image} alt={author.name} className="h-full" />
                                </div>
                            </div>
                            <p className="col-span-2 sm:col-span-2  text-sm text-black dark:text-white text-ellipsis overflow-hidden max-h-10 self-center pe-4">{author.name}</p>

                            <div className="col-span-3 sm:col-span-4 hidden items-center sm:flex">
                                <p className="text-sm text-black dark:text-white text-ellipsis overflow-hidden max-h-15">{author.bio}</p>
                            </div>

                            <div className="col-span-2 flex items-center justify-between">
                                <div className="hover:cursor-pointer hover:text-meta-5 p-1" onClick={() => handleMoreDetails(author._id)}>
                                    <FaEye size={20} />
                                </div>
                                <span className="hover:cursor-pointer hover:text-meta-8" onClick={() => handleEdit(author._id)}>
                                    <MdOutlineEditOff size={20} />
                                </span>
                                <span className="hover:cursor-pointer hover:text-danger" onClick={() => openDeleteModal(author._id)}>
                                    <MdDeleteForever size={20} />
                                </span>
                            </div>
                        </div>
                    </div>

                    <dialog id="my_modal_3" className="modal">
                        <div className="modal-box w-11/12 max-w-4xl dark:bg-black"> {/* Customize size here */}
                            <form method="dialog">
                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                            </form>
                            <h3 className="font-bold text-lg">Book Details</h3>
                            <h5 className="font-semibold py-4">Details for book ID: {detailedBook._id}</h5>
                            <section className="grid grid-cols-3">
                                <div>
                                    <img src={author.image} alt={detailedBook.title} className="w-full" />
                                </div>
                                <div className="col-span-2 ms-10">
                                    <h6 className="font-semibold pb-2 border-b mb-4">
                                        <span className="">Book Title : </span>{detailedBook.title}
                                    </h6>
                                    <p className="py-1"><span className="font-semibold">Author name : </span>{detailedBook?.author?.name}</p>
                                
                                </div>
                            </section>
                            {/* Display more details about the book */}
                        </div>
                    </dialog>

                    <ConfirmationModal
                        isOpen={isDeleteModalOpen}
                        message="Are you sure you want to delete this book?"
                        onConfirm={handleConfirmDelete}
                        onCancel={() => setIsDeleteModalOpen(false)}
                    />
                </div >
          </>

    ))
}
            
        </>
    )
}

export default AuthorTable