import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import axios from 'axios';
import { apiUrl } from '../../utils/apiUrl';
import { useParams } from 'react-router-dom';
import CustomInput from './FromComponents/CustomInput';
import { AuthorInterface, CategoryInterface } from '../../interfaces/BookInterface';
import AutoCompleteSearch from '../../components/AutoCompeleteSearch';

const BookForm = () => {
  const { id } = useParams(); // Gets the id from the URL if it exists
  const [bookData, setBookData] = useState({
    title: '',
    stock: 0,
    price: 0,
    pages: 0,
    author: '',
    category: '',
    publishedDate: '',
    coverImage: '',
    description: ''
  });

  // Initialize as empty arrays
  const [authors, setAuthors] = useState<AuthorInterface[]>([]);
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [loading, setLoading] = useState(true); // Loading state for fetch
  const getToken = () => localStorage.getItem('token');

  // Handle input change
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setBookData({ ...bookData, [name]: value });
  };

  // Fetch data on load
  useEffect(() => {
    // Fetch authors and categories
    const fetchData = async () => {
      try {
        const [authorsRes, categoriesRes] = await Promise.all([
          axios.get(`${apiUrl}/authors`),
          axios.get(`${apiUrl}/category`)
        ]);
        setAuthors(authorsRes.data); // Ensure authors is set to an array
        setCategories(categoriesRes.data); // Ensure categories is set to an array
        console.log("-=-=-=-=-Authors", authors);
        console.log("=-=-=-=-Categories", categories);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    if (id) {
      // Fetch book data for update if ID exists
      axios.get(`${apiUrl}/books/${id}`)
        .then(res => setBookData(res.data.data))
        .catch(err => console.error("Error fetching book:", err));
    }
  }, [id]);

  // Handle form submit
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const token = getToken();
    if (id) {
      axios.patch(`${apiUrl}/books/${id}`, bookData, { 'headers': { 'token': token }})
        .then(() => console.log("Book updated successfully"))
        .catch(err => console.error("Error updating book:", err));
    } else {
      axios.post(`${apiUrl}/books`, bookData, { 'headers': { 'token': token }})
        .then(() => console.log("Book created successfully"))
        .catch(
          err => console.error("Error creating book:", err.response.data.message));
    }
  };


  console.log(bookData);


  const handleAuthorSelect = (selectedAuthor: AuthorInterface) => {
    console.log("Selected Author:", selectedAuthor);
    setBookData((prevData) => ({
        ...prevData,
        author: selectedAuthor._id // Push the selected author's _id to bookData
    }));
};

const handleCategorySelect = (selectedCategory: CategoryInterface) => {
    console.log("Selected Category:", selectedCategory);
    setBookData((prevData) => ({
        ...prevData,
        category: selectedCategory._id // Push the selected category's _id to bookData
    }));
};

  if (loading) {
    return <div>Loading...</div>; // Show loading state while fetching data
  }

  return (
    <>
      <Breadcrumb pageName={id ? "Update Book" : "Add New Book"} />
      <h1 className='font-extrabold text-3xl pb-5'>Book Form</h1>
      <form onSubmit={handleSubmit}>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <CustomInput
            inputLabel='Book Title'
            inputName='title'
            inputPlaceholder='Book Title'
            inputType='text'
            inputValue={bookData.title}
            inputOnChangeValue={handleInputChange}
          />

          <CustomInput
            inputLabel='Book Stock'
            inputName='stock'
            inputPlaceholder='Book Quantity'
            inputType='number'
            inputValue={bookData.stock}
            inputOnChangeValue={handleInputChange}
          />

          <CustomInput
            inputLabel='Book Price'
            inputName='price'
            inputPlaceholder='Book Price'
            inputType='number'
            inputValue={bookData.price}
            inputOnChangeValue={handleInputChange}
          />

          <CustomInput
            inputLabel='Book Page Count'
            inputName='pages'
            inputPlaceholder='Book Page Count'
            inputType='number'
            inputValue={bookData.pages}
            inputOnChangeValue={handleInputChange}
          />

          {/* Author Select */}
          <div className=" block rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Book Author
              </h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
            <span>Current Author: <span className='text-lg font-semibold'> {bookData.author?.name} </span></span>
              <div>
                <AutoCompleteSearch<AuthorInterface>
                  UrlWantToFetch="authors"
                  inputName="author"
                  inputPlaceholder="Search for an author..."
                  searchQuery='name'
                  inputOnSelect={handleAuthorSelect}
                  extractDisplayName={(author: any) => author.name}
                />
              </div>
            </div>
          </div>


          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Book Category
              </h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              <span>Current Category: <span className='text-lg font-semibold'>  {bookData.category?.name}</span></span>
              <div>
                <AutoCompleteSearch<CategoryInterface>
                  UrlWantToFetch="category"
                  inputName="category"
                  inputPlaceholder="Search for an Category..."
                  searchQuery='name'
                  inputOnSelect={handleCategorySelect}
                  extractDisplayName={(category: any) => category.name}
                />
              </div>
            </div>
          </div>


          {/* Published Date */}
          <CustomInput
            inputLabel="Published Date"
            inputName="publishedDate"
            inputType="date"
            inputPlaceholder=''
            inputValue={bookData.publishedDate.split('T')[0]}
            inputOnChangeValue={handleInputChange}
          />

          {/* Book Cover Image */}
          {/* <!-- File upload --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Book Cover Image
              </h3>
            </div>
            <div className="grid grid-cols-4 gap-5.5 p-6.5">
              {bookData.coverImage &&
              <div className='col-span-1 w-full'>
                <img src={bookData.coverImage} alt="" />
              </div>
              }

              <div className={bookData.coverImage ? 'col-span-3 self-end' : 'col-span-4'}>
                <input
                  name="coverImage"
                  onChange={handleInputChange}
                  type="file"
                  className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                />
              </div>


            </div>
          </div>

          <div className="md:col-span-2 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Book Description
              </h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              <div>
                <textarea
                  name="description"
                  value={bookData.description}
                  onChange={handleInputChange}
                  rows={6}
                  placeholder="Book description"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                ></textarea>
              </div>


            </div>
          </div>

        </div>
        <button className='btn btn-primary ms-auto mt-4 px-8 text-xl block'>{id ? 'Update Book' : 'Create Book'}
        </button>
      </form>
    
    </>
  );
};

export default BookForm;
