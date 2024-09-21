import React, { useEffect, useState } from 'react'
import Breadcrumb from '../../components/Breadcrumb'
import CustomInput from './FromComponents/CustomInput'
import axios from 'axios';
import { apiUrl } from '../../utils/apiUrl';
import { AuthorInterface } from '../../interfaces/BookInterface';
import { MdDeleteForever, MdOutlineEditOff } from 'react-icons/md';
import { FaEye } from 'react-icons/fa';

const AuthorForm = () => {
  let page = 1;
  const limit = 20;
  const [authorsData, setAuthorsData] = useState<AuthorInterface[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`${apiUrl}/authors?page=${page}&limit=${limit}`)
      setAuthorsData(res.data.data)
      console.log(res.data.data);

    }
    fetchData()
  }, [])
  const handleSubmit = (event: any) => {
    event.preventDefault();
  }
  return (
    <>
      <Breadcrumb pageName="Author Form" />
      <h1 className='font-extrabold text-3xl pb-5'>Book Form</h1>
      <form onSubmit={handleSubmit}>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <CustomInput
            inputLabel='Book Title'
            inputName='title'
            inputPlaceholder='Book Title'
            inputType='text'
          // inputValue={authorData.title}
          // inputOnChangeValue={handleInputChange}
          />
        </div>
      </form>

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
      ))}
    </>
  )
}

export default AuthorForm