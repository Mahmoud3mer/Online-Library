/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import axios from "axios";
import { apiUrl } from "../../utils/apiUrl";
import { useParams } from "react-router-dom";
import CustomInput from "./FromComponents/CustomInput";
import {
  AuthorInterface,
  CategoryInterface,
} from "../../interfaces/BookInterface";
import AutoCompleteSearch from "../../components/AutoCompeleteSearch";
import Swal from "sweetalert2";
import LoadingSpinner from "../../components/LoadingSpinner";
const BookForm = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [initialBookData, setInitialBookData] = useState<any>(null);
  const [authors, setAuthors] = useState<AuthorInterface[]>([]);
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState("");
  const [bookData, setBookData] = useState({
    title: "",
    stock: "",
    price: "",
    pages: "",
    author: "",
    category: "",
    publishedDate: "",
    coverImage: null,
    description: "",
  });

  const [Errors, setErrors] = useState({
    titleError: "",
    stockError: "",
    priceError: "",
    pagesError: "",
    authorError: "",
    categoryError: "",
    publishedDateError: "",
    coverImageError: "",
    descriptionError: "",
  });

  const validateForm = () => {
    const newErrors = {
      titleError:
        bookData.title.length === 0
          ? "Book Title is required"
          : bookData.title.length < 3
          ? "Title minimum length 3"
          : bookData.title.length > 100
          ? "Title maximum length 100"
          : "",
      stockError:
        bookData.stock == ""
          ? "Stock field is Required"
          : +bookData.stock < 0
          ? "Stock must be a positive number"
          : "",
      priceError:
        bookData.price == ""
          ? "Stock field is Required"
          : +bookData.price < 0
          ? "Price must be a positive number"
          : "",
      pagesError:
        bookData.pages == ""
          ? "Stock field is Required"
          : +bookData.pages < 0
          ? "Page count must be a positive number"
          : "",
      authorError: !bookData.author ? "Select author for this book" : "",
      categoryError: !bookData.category ? "Select category for this book" : "",
      publishedDateError: !bookData.publishedDate
        ? "Select Published date for this book"
        : "",
      coverImageError: !bookData.coverImage
        ? "Book cover image is required"
        : "",
      descriptionError:
        bookData.description.length === 0
          ? "Book description is required"
          : bookData.description.length < 10
          ? "Book description minimum length 10"
          : bookData.description.length > 500
          ? "Book description maximum length 500"
          : "",
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const getToken = () => localStorage.getItem("token");


  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setBookData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    validateForm(); 
  };

  const handleCoverImgChange = (e: any) => {
    const file = e.target.files[0];
    setBookData({ ...bookData, coverImage: file });

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchBookById = () => {
    axios
      .get(`${apiUrl}/books/${id}`)
      .then((res) => {
        setBookData(res.data.data);
        setInitialBookData(res.data.data); // Save the initial data for comparison
      })
      .catch((err) => console.error("Error fetching book:", err));
  };

  // Fetch data on load
  const fetchCategoriesAuthors = async () => {
    try {
      const [authorsRes, categoriesRes] = await Promise.all([
        axios.get(`${apiUrl}/authors`),
        axios.get(`${apiUrl}/category`),
      ]);
      setAuthors(authorsRes.data); 
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoriesAuthors();
    if (id) {
      fetchBookById();
    }
  }, [id]);

  // Handle form submit
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const token = getToken();
    if (!validateForm()) {
      Swal.fire({
        icon: "error",
        title: "Please fill in all required fields!",
      });
      return;
    }

    setIsLoading(true);

    // FormData object
    const formData = new FormData();

    if (id) {
      // For updating an existing book
      formData.append("title", bookData.title);
      formData.append("stock", bookData.stock);
      formData.append("price", bookData.price);
      formData.append("pages", bookData.pages);
      formData.append("publishedDate", bookData.publishedDate);
      formData.append("description", bookData.description);

      // Only append author if it has been changed
      if (bookData.author && bookData.author !== initialBookData.author) {
        formData.append("author", bookData.author);
      }

      if (bookData.category && bookData.category !== initialBookData.category) {
        formData.append("category", bookData.category);
      }

      if (bookData.coverImage) {
        formData.append("coverImage", bookData.coverImage);
      }

      axios
        .patch(`${apiUrl}/books/${id}`, formData, { headers: { token: token } })
        .then((res) => {
          Swal.fire({
            icon: "success",
            title: `${res.data.data.title}<br> \n Updated Successfully!`,
            showConfirmButton: true,
            timer: 2000,
          });
          console.log(res);
          fetchBookById();
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: err.response?.data?.message || "Something went wrong!",
          });
        })
        .finally(() => setIsLoading(false));
    } else {
      formData.append("title", bookData.title);
      formData.append("stock", bookData.stock);
      formData.append("price", bookData.price);
      formData.append("pages", bookData.pages);
      formData.append("author", bookData.author);
      formData.append("category", bookData.category);
      formData.append("publishedDate", bookData.publishedDate);
      formData.append("description", bookData.description);

      if (bookData.coverImage) {
        formData.append("coverImage", bookData.coverImage);
      }

      axios
        .post(`${apiUrl}/books`, formData, { headers: { token: token } })
        .then((res) => {
          Swal.fire({
            icon: "success",
            title: `${res.data.data.title}<br> \n Created Successfully!`,
            showConfirmButton: true,
            timer: 2000,
          });
          console.log(res);
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text:
              err.response?.statusText + " Follow Fields Instructions" ||
              "Something went wrong!",
          });
          console.log(err.response.data.message);
        })
        .finally(() => setIsLoading(false));
    }
  };

  const handleAuthorSelect = (selectedAuthor: AuthorInterface) => {
    console.log("Selected Author:", selectedAuthor);
    setBookData((prevData) => ({
      ...prevData,
      author: selectedAuthor._id,
    }));
  };

  const handleCategorySelect = (selectedCategory: CategoryInterface) => {
    console.log("Selected Category:", selectedCategory);
    setBookData((prevData) => ({
      ...prevData,
      category: selectedCategory._id,
    }));
  };

  if (loading) {
    return <div><LoadingSpinner color="white"/></div>;
  }

  return (
    <>
      <Breadcrumb pageName={id ? "Update Book" : "Add New Book"} />
      <h1 className="font-extrabold text-3xl pb-5">Book Form</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="relative">
            <CustomInput
              inputLabel="Book Title"
              inputName="title"
              inputPlaceholder="Book Title"
              inputType="text"
              inputValue={bookData.title}
              inputOnChangeValue={handleInputChange}
            />
            {Errors.titleError && (
              <span className="text-meta-7 absolute bottom-0 left-8">
                {Errors.titleError}
              </span>
            )}
          </div>

          <div className="relative">
            <CustomInput
              inputLabel="Book Stock"
              inputName="stock"
              inputPlaceholder="Book Quantity"
              inputType="text"
              inputValue={bookData.stock}
              inputOnChangeValue={handleInputChange}
            />
            {Errors.stockError && (
              <span className="text-meta-7 absolute bottom-0 left-8">
                {Errors.stockError}
              </span>
            )}{" "}
            {/* Display error under field */}
          </div>

          <div className="relative">
            <CustomInput
              inputLabel="Book Price"
              inputName="price"
              inputPlaceholder="Book Price"
              inputType="text"
              inputValue={bookData.price}
              inputOnChangeValue={handleInputChange}
            />
            {Errors.priceError && (
              <span className="text-meta-7 absolute bottom-0 left-8">
                {Errors.priceError}
              </span>
            )}
          </div>

          <div className="relative">
            <CustomInput
              inputLabel="Book Page Count"
              inputName="pages"
              inputPlaceholder="Book Page Count"
              inputType="text"
              inputValue={bookData.pages}
              inputOnChangeValue={handleInputChange}
            />
            {Errors.pagesError && (
              <span className="text-meta-7 absolute bottom-0 left-8">
                {Errors.pagesError}
              </span>
            )}
          </div>
          {/* Author Select */}
          <div className="relative block rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Book Author
              </h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              <span>
                Current Author:{" "}
                <span className="text-lg font-semibold">
                  {" "}
                  {bookData.author?.name}{" "}
                </span>
              </span>
              <div>
                <AutoCompleteSearch<AuthorInterface>
                  UrlWantToFetch="authors"
                  inputName="author"
                  inputPlaceholder="Search for an author..."
                  searchQuery="name"
                  inputOnSelect={handleAuthorSelect}
                  extractDisplayName={(author: any) => author.name}
                />
              </div>
            </div>
            {Errors.authorError && (
              <span className="text-meta-7 absolute bottom-0 left-8">
                {Errors.authorError}
              </span>
            )}{" "}
            {/* Display error under field */}
          </div>

          <div className="relative rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Book Category
              </h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              <span>
                Current Category:{" "}
                <span className="text-lg font-semibold">
                  {" "}
                  {bookData.category?.name}
                </span>
              </span>
              <div>
                <AutoCompleteSearch<CategoryInterface>
                  UrlWantToFetch="category"
                  inputName="category"
                  inputPlaceholder="Search for an Category..."
                  searchQuery="name"
                  inputOnSelect={handleCategorySelect}
                  extractDisplayName={(category: any) => category.name}
                />
              </div>
            </div>
            {Errors.categoryError && (
              <span className="text-meta-7 absolute bottom-0 left-8">
                {Errors.categoryError}
              </span>
            )}{" "}
            {/* Display error under field */}
          </div>

          <div className="relative">
            {/* Published Date */}
            <CustomInput
              inputLabel="Published Date"
              inputName="publishedDate"
              inputType="date"
              inputPlaceholder=""
              inputValue={bookData.publishedDate.split("T")[0]}
              inputOnChangeValue={handleInputChange}
            />
            {Errors.publishedDateError && (
              <span className="text-meta-7 absolute bottom-0 left-8">
                {Errors.publishedDateError}
              </span>
            )}{" "}
            {/* Display error under field */}
          </div>
          {/* Book Cover Image */}
          {/* <!-- File upload --> */}
          <div className="relative rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Book Cover Image
              </h3>
            </div>
            <div className="grid grid-cols-4 gap-5.5 p-6.5">
              {bookData.coverImage && (
                <div className="col-span-1 w-full">
                  <img
                    src={previewImage ? previewImage : bookData.coverImage}
                    alt=""
                  />
                </div>
              )}

              <div
                className={
                  bookData.coverImage ? "col-span-3 self-end" : "col-span-4"
                }
              >
                <input
                  name="coverImage"
                  onChange={handleCoverImgChange}
                  type="file"
                  className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                />
              </div>
            </div>
            {Errors.coverImageError && (
              <span className="text-meta-7 absolute bottom-0 left-8">
                {Errors.coverImageError}
              </span>
            )}{" "}
            {/* Display error under field */}
          </div>

          <div className="relative md:col-span-2 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
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
            {Errors.descriptionError && (
              <span className="text-meta-7 absolute bottom-0 left-8">
                {Errors.descriptionError}
              </span>
            )}{" "}
            {/* Display error under field */}
          </div>
        </div>
        <button
          className={
            isLoading
              ? "btn btn-primary ms-auto mt-4 px-8 text-xl block cursor-progress"
              : "btn btn-primary ms-auto mt-4 px-8 text-xl block"
          }
        >
          {isLoading
            ? id
              ? "Updating..."
              : "Creating..."
            : id
            ? "Update Book"
            : "Create Book"}
        </button>
      </form>
    </>
  );
};

export default BookForm;
