import React, { useState, useEffect } from 'react'
import { FaEye } from 'react-icons/fa';
import { MdDeleteForever, MdOutlineEditOff } from 'react-icons/md';
import { apiUrl } from '../utils/apiUrl';
import axios from 'axios';
import { CategoryInterface } from '../interfaces/BookInterface';
import ConfirmationModal from './ConfirmationModal';
import Pagination from './Pagination';
import { useNavigate } from 'react-router-dom';

const CategoryTable = () => {

    const [category, setCategory] = useState<CategoryInterface[]>([]);
    const [detailedCategory, setDetailedCategory] = useState<Partial<CategoryInterface>>({});
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null); // Holds the ID of the Category to be deleted

    const [page, setPage] = useState(1);
    const [numberOfPages, setnumberOfPages] = useState(0)
    const limit = 2;

    const getToken = () => localStorage.getItem('token')
    useEffect(() => {
        axios.get(`${apiUrl}/category?page=${page}&limit=${limit}`)
            .then((res) => {
                setCategory(res.data.data)
                setnumberOfPages(res.data.metaData.numberOfPages)

            })
            .catch((err) => {
                console.log("Error", err);
            })
    }, [page, category.length])

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleMoreDetails = (categoryId: string) => {
        axios.get(`${apiUrl}/category/${categoryId}`)
            .then((res) => {
                setDetailedCategory(res.data.category);

            })
        document.getElementById('my_modal_3')?.showModal();
    };



    const navigate = useNavigate()

    const handleEdit = (CategoryId: string) => {
        navigate(`/forms/category-form/${CategoryId}`)
    };

    const handleDelete = async (categoryId: string) => {
        try {
            const token = getToken();
            await axios.delete(
                `${apiUrl}/category/${categoryId}`,
                { headers: { token: token || "" } } // Ensure token is passed as a string
            );
            setCategory(category.filter(category => category._id !== categoryId));
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    const handleConfirmDelete = () => {
        if (selectedCategoryId) {
            handleDelete(selectedCategoryId);  // Proceed with deletion after confirmation
            setIsDeleteModalOpen(false);   // Close the modal
        }
    };

    const openDeleteModal = (categoryId: string) => {
        setSelectedCategoryId(categoryId);  // Store the category ID to be deleted
        setIsDeleteModalOpen(true); // Open the delete confirmation modal
    };

    // console.log(detailedCategory);

    return (
        <>
            <div className="mt-10 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="py-6 px-4 md:px-6 xl:px-7.5">
                    <h4 className="text-xl font-semibold text-black dark:text-white">
                        All Categories
                    </h4>
                </div>

            </div>

            <div className="grid grid-cols-4 gap-3">

                {category && category.map((category, index) => (
                    <div className={index % 2 === 0 ? "bg-white dark:bg-form-input" : "bg-[#f9f9f9] dark:bg-strokedark"} key={category._id}>

                        <div className="card-container">

                                <div className="rounded-md p-2">
                                    <img src={category.image} alt={category.name} className='h-30 w-full'/>
                                </div>
                            <div className="content p-2">
                                <p className="text-center text-black dark:text-white py-4">{category.name}</p>
                                <div className=" flex justify-center gap-4">
                                    <div className="hover:cursor-pointer hover:text-meta-5 p-1" onClick={() => handleMoreDetails(category._id)}>
                                        <FaEye size={20} />
                                    </div>
                                    <span className="hover:cursor-pointer hover:text-meta-8" onClick={() => handleEdit(category._id)}>
                                        <MdOutlineEditOff size={20} />
                                    </span>
                                    <span className="hover:cursor-pointer hover:text-danger" onClick={() => openDeleteModal(category._id)}>
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
                                <h3 className="font-bold text-lg">Category Details</h3>
                                <h5 className="font-semibold py-4">Details for Category ID: {detailedCategory._id}</h5>
                                <section className="grid grid-cols-3">
                                    <div>
                                        <img src={detailedCategory.image} alt={detailedCategory.name} className="w-full" />
                                    </div>
                                    <div className="col-span-2 ms-10">
                                        <h6 className="py-10 font-semibold pb-2 border-b mb-4">
                                        Category Name : 
                                            <span className="font-bold text-xl"> {detailedCategory.name}</span>
                                        </h6>
                                    </div>
                                </section>
                                {/* Display more details about the Category */}
                            </div>
                        </dialog>

                        <ConfirmationModal
                            isOpen={isDeleteModalOpen}
                            message="Are you sure you want to delete this Category?"
                            onConfirm={handleConfirmDelete}
                            onCancel={() => setIsDeleteModalOpen(false)}
                        />
                    </div>

                ))
                }
            </div>

            {/* Pagingation */}
            <div className='py-3 flex justify-center'>
                <Pagination totalPages={numberOfPages} currentPage={page} onPageChange={handlePageChange} />
            </div>
        </>
    )
}

export default CategoryTable