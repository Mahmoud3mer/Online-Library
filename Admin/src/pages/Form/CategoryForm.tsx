import React, { useState } from 'react'
import Breadcrumb from '../../components/Breadcrumb'
import CustomInput from './FromComponents/CustomInput'
import CategoryTable from '../../components/CategoryTable';
import axios from 'axios';
import { apiUrl } from '../../utils/apiUrl';
import AutoCompleteSearch from '../../components/AutoCompeleteSearch';
import { CategoryInterface } from '../../interfaces/BookInterface';
import { useNavigate, useParams } from 'react-router-dom';

const CategoryForm = () => {

  const { id } = useParams(); // Gets the id from the URL if it exists
  const [categoryData, setCategoryData] = useState({
    name: '',
    image: ''
  });

  // const [loading, setLoading] = useState(true); // Loading state for fetch
  const getToken = () => localStorage.getItem('token');
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setCategoryData({ ...categoryData, [name]: value });
  };

  const handleCategoryImage = (e: any) => {
    setCategoryData({ ...categoryData, image: e.target.files[0] })
  }



  const handleSubmit = (e: any) => {
    e.preventDefault();
    const token = getToken();

    const formData = new FormData();
    formData.append('name', categoryData.name);
    formData.append('bio', categoryData.bio);
    if (categoryData.image) {
      formData.append('image', categoryData.image);
    }

    if (id) {
      axios.patch(`${apiUrl}/category/${id}`, formData, { 'headers': { 'token': token } })
        .then(() => console.log("Category updated successfully"))
        .catch(err => console.error("Error updating Category:", err));
    } else {
      axios.post(`${apiUrl}/category`, formData, { 'headers': { 'token': token } })
        .then(() => console.log("Book created successfully", formData))
        .catch(
          err => console.error("Error creating book:", err.response.data.message, formData));
    }
  };


  console.log(categoryData);


  const handleCategorySelect = (selectedCategory: CategoryInterface) => {
    console.log("Selected Category:", selectedCategory);
    navigate(`/forms/category-form/${selectedCategory._id}`)
    setCategoryData(selectedCategory);
  };

  const navigate = useNavigate()
  const handleCreateBtn = () => {
    navigate(`/forms/category-form`)
  }
  // if (loading) {
  //   return <div>Loading...</div>; // Show loading state while fetching data
  // }
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

      {id &&
        <span className='bg-[#0e0edb] cursor-pointer rounded ms-auto my-4 px-8 py-4 text-xl text-center block w-fit' onClick={() => handleCreateBtn()}>Create New Book</span>
      }


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
                  <img src={categoryData.image} alt="" />
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
        <button className='btn btn-primary ms-auto my-4 px-8 text-xl block'>{id ? 'Update Category' : 'Add New Category'}
        </button>
      </form>



      <CategoryTable />
    </>
  )
}

export default CategoryForm;