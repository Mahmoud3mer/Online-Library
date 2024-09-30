/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import Breadcrumb from '../../components/Breadcrumb'
import CustomInput from './FromComponents/CustomInput'
import CategoryTable from '../../components/CategoryTable';
import axios from 'axios';
import { apiUrl } from '../../utils/apiUrl';
import AutoCompleteSearch from '../../components/AutoCompeleteSearch';
import { CategoryInterface } from '../../interfaces/BookInterface';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import LoadingSpinner from '../../components/LoadingSpinner';

const CategoryForm = () => {

  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [categoryData, setCategoryData] = useState({
    name: '',
    image: null
  });

  const resetForm = () => {
    setCategoryData({
      name: '',
      image: null
    })
  }

  const fetchCategory = async () => {
    try {
      const res = await axios.get(`${apiUrl}/category/${id}`);
      setCategoryData(res.data.category);
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        console.error("Category not found", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Category not found!',
        });
      } else {
        console.error("An error occurred", error);
      }
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (id) {
      fetchCategory()
        .then(() => setLoading(false))
        .catch(() => setLoading(false));
    } else {
      setLoading(false)
    }
  }, [id])
  const getToken = () => localStorage.getItem('token');
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setCategoryData({ ...categoryData, [name]: value });
  };

  const handleCategoryImage = (e: any) => {
    const file = e.target.files[0];
    setCategoryData({ ...categoryData, image: file })
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSubmit = (e: any) => {
    e.preventDefault();
    const token = getToken();

    const formData = new FormData();
    formData.append('name', categoryData.name);
    if (categoryData.image) {
      formData.append('image', categoryData.image);
    }
    setIsLoading(true)
    if (id) {
      axios.patch(`${apiUrl}/category/${id}`, formData, { 'headers': { 'token': token } })
        .then((res) => {
          Swal.fire({
            icon: 'success',
            title: `${res.data.data.name}<br> \n Updated Successfully!`,
            showConfirmButton: true,
            timer: 2000
          });
          resetForm();
        }

        )
        .catch(err =>
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Something went wrong!`,
          })
        ).finally(
          () => {
            setIsLoading(false)
          })
    } else {
      axios.post(`${apiUrl}/category`, formData, { 'headers': { 'token': token } })
        .then((res) =>
          Swal.fire({
            icon: 'success',
            title: `${res.data.category.name}<br> \n Created Successfully!`,
            showConfirmButton: true,
            timer: 2000
          })
        )
        .catch(err =>
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Something went wrong!`,
          })
        ).finally(() => {
          setIsLoading(false)
        })
    }
  };



  const handleCategorySelect = (selectedCategory: any) => {
    // console.log("Selected Category:", selectedCategory);
    navigate(`/forms/category-form/${selectedCategory._id}`)
    setCategoryData(selectedCategory);
  };

  const navigate = useNavigate()
  const handleClearBtn = () => {
    resetForm()
    navigate(`/forms/category-form`)
  }
  if (loading) {
    return <div><LoadingSpinner color='white' /> </div>;
  }
  return (
    <>
      <Breadcrumb pageName="Category Form" />
      <h1 className='font-extrabold text-3xl pb-5'>Category Form</h1>

      <div className=" block rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mb-5">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Book Category
          </h3>
        </div>
        <div className="flex flex-col gap-5.5 p-6.5">
          <span>Current Category: <span className='text-lg font-semibold'> {categoryData.name} </span></span>
          <div>
            <AutoCompleteSearch<CategoryInterface>
              UrlWantToFetch="category"
              inputName="category"
              inputPlaceholder="Search for an category..."
              searchQuery='name'
              inputOnSelect={handleCategorySelect}
              extractDisplayName={(category: any) => category.name}
            />
          </div>
        </div>
      </div>




      <form onSubmit={handleSubmit}>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <CustomInput
            inputLabel='Category Name'
            inputName='name'
            inputPlaceholder='Category name'
            inputType='text'
            inputValue={categoryData.name}
            inputOnChangeValue={handleInputChange}
          />
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Category Image
              </h3>
            </div>
            <div className="grid grid-cols-4 gap-5.5 p-6.5">
              {categoryData.image &&
                <div className='col-span-1 w-full'>
                  <img
                    src={previewImage ? previewImage : categoryData.image}
                    alt=""
                  />
                </div>
              }

              <div className={categoryData.image ? 'col-span-3 self-end' : 'col-span-4'}>
                <input
                  name="image"
                  onChange={handleCategoryImage}
                  type="file"
                  className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                />
              </div>


            </div>
          </div>


        </div>
        <div className='flex'>

          {id &&
            <button className='btn btn-primary mt-4 px-8 text-xl block' onClick={() => handleClearBtn()}>Clear All Feilds</button>
          }
          <button
            className={isLoading ? 'btn btn-primary ms-auto mt-4 px-8 text-xl block cursor-progress' : 'btn btn-primary ms-auto mt-4 px-8 text-xl block'}
          >
            {isLoading ? <LoadingSpinner color='white' /> : (id ? 'Update Category' : 'Create category')}
          </button>
        </div>

      </form>



      <CategoryTable />
    </>
  )
}

export default CategoryForm;