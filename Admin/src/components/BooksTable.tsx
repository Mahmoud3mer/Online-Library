import { MdDeleteForever } from "react-icons/md";
import { MdOutlineEditOff } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { useEffect, useState } from "react";
import { BookInterface } from "../interfaces/BookInterface";
import axios from "axios";
import { apiUrl } from "../utils/apiUrl";
import ConfirmationModal from "./ConfirmationModal";




const BooksTable = () => {
  const [books, setBooks] = useState<Array<BookInterface>>([]);
  const [detailedBook, setDetailedBook] = useState<Partial<BookInterface>>({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null); // Holds the ID of the book to be deleted
  const [page, setPage] = useState(1);
  const limit = 5;

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


  const handleEdit = (BookId: string) => {
    console.log(BookId);
  };

  const handleDelete = async (bookId: string) => {
    try {
      const token = getToken();
      await axios.delete(
        `http://localhost:3000/books/${bookId}`, 
        { headers: { token: token || "" } } // Ensure token is passed as a string
      );
      setBooks(books.filter(book => book._id !== bookId));
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedBookId) {
      handleDelete(selectedBookId);  // Proceed with deletion after confirmation
      setIsDeleteModalOpen(false);   // Close the modal
    }
  };

  const openDeleteModal = (bookId: string) => {
    setSelectedBookId(bookId);  // Store the book ID to be deleted
    setIsDeleteModalOpen(true); // Open the delete confirmation modal
  };

  return (
    <>
      {books && books.map((book, index) => (
        <div className={index % 2 === 0 ? "bg-white dark:bg-form-input" : "bg-[#f9f9f9] dark:bg-strokedark"} key={book._id}>

          <div className="grid grid-cols-6 border-stroke py-3 px-4 dark:border-strokedark sm:grid-cols-10 md:px-6 2xl:px-7.5 table" >
            <div className="col-span-3 flex items-center">
              <div className="grid grid-cols-4 gap-4 sm:flex-row sm:items-center">
                <div className="h-17 w-full rounded-md">
                  <img src={book.coverImage} alt={book.title} className="h-full" />
                </div>
                <p className="col-span-3 text-sm text-black dark:text-white text-ellipsis overflow-hidden max-h-10 self-center pe-4">{book.title}</p>
              </div>
            </div>

            <div className="col-span-2 hidden items-center sm:flex">
              <p className="text-sm text-black dark:text-white truncate overflow-hidden">{book.author.name}</p>
            </div>

            <div className="col-span-2 hidden items-center sm:flex">
              <p className="text-sm text-black dark:text-white truncate overflow-hidden">{book.category.name}</p>
            </div>

            <div className="col-span-1 flex items-center">
              <p className="text-sm text-black dark:text-white">{book.price}</p>
            </div>

            <div className="col-span-1 flex items-center">
              <p className="text-sm text-black dark:text-white">{book.stock}</p>
            </div>

            <div className="col-span-1 flex items-center justify-between">
              <div className="hover:cursor-pointer hover:text-meta-5 p-1" onClick={() => handleMoreDetails(book._id)}>
                <FaEye size={20} />
              </div>
              <span className="hover:cursor-pointer hover:text-meta-8" onClick={() => handleEdit(book._id)}>
                <MdOutlineEditOff size={20} />
              </span>
              <span className="hover:cursor-pointer hover:text-danger" onClick={() => openDeleteModal(book._id)}>
                <MdDeleteForever size={20} />
              </span>
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
                  <img src={detailedBook.coverImage} alt={detailedBook.title} className="w-full"/>
                </div>
                <div className="col-span-2 ms-10">
                  <h6 className="font-semibold pb-2 border-b mb-4">
                    <span className="">Book Title : </span>{detailedBook.title}
                  </h6>
                  <p className="py-1"><span className="font-semibold">Author name : </span>{detailedBook?.author?.name}</p>
                  <p className="py-1"><span className="font-semibold">Category : </span>{detailedBook?.category?.name}</p>
                  <p className="py-1"><span className="font-semibold">Description : </span>{detailedBook.description}</p>
                  <p className="py-1"><span className="font-semibold">Stock : </span>{detailedBook.stock}</p>
                  <p className="py-1"><span className="font-semibold">Average Rating : </span>{detailedBook.averageRating}</p>
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
        </div>
      ))}
    </>
  )
}

export default BooksTable;