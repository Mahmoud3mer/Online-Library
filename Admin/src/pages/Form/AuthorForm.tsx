import React, { useState } from 'react'
import Breadcrumb from '../../components/Breadcrumb'
import CustomInput from './FromComponents/CustomInput'
import AuthorTable from '../../components/AuthorTable';
import axios from 'axios';
import { apiUrl } from '../../utils/apiUrl';
import AutoCompleteSearch from '../../components/AutoCompeleteSearch';
import { AuthorInterface } from '../../interfaces/BookInterface';
import { useNavigate, useParams } from 'react-router-dom';

const AuthorForm = () => {

  const { id } = useParams(); // Gets the id from the URL if it exists
  const [authorData, setAuthorData] = useState({
    name: '',
    bio: '',
    image: ''
  });

  // const [loading, setLoading] = useState(true); // Loading state for fetch
  const getToken = () => localStorage.getItem('token');
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setAuthorData({ ...authorData, [name]: value });
  };

  const handleAuthorImage = (e: any) => {
    setAuthorData({ ...authorData, image: e.target.files[0] })
  }



  const handleSubmit = (e: any) => {
    e.preventDefault();
    const token = getToken();

    const formData = new FormData();
    formData.append('name', authorData.name);
    formData.append('bio', authorData.bio);
    if (authorData.image) {
      formData.append('image', authorData.image);
    }

    if (id) {
      axios.patch(`${apiUrl}/authors/${id}`, formData, { 'headers': { 'token': token } })
        .then(() => console.log("Author updated successfully"))
        .catch(err => console.error("Error updating Author:", err));
    } else {
      axios.post(`${apiUrl}/authors`, formData, { 'headers': { 'token': token } })
        .then(() => console.log("Book created successfully", formData))
        .catch(
          err => console.error("Error creating book:", err.response.data.message, formData));
    }
  };


  console.log(authorData);


  const handleAuthorSelect = (selectedAuthor: AuthorInterface) => {
    console.log("Selected Author:", selectedAuthor);
    navigate(`/forms/author-form/${selectedAuthor._id}`)
    setAuthorData(selectedAuthor);
  };

  const navigate = useNavigate()
  const handleCreateBtn = () => {
    navigate(`/forms/author-form`)
  }
  // if (loading) {
  //   return <div>Loading...</div>; // Show loading state while fetching data
  // }
  return (
    <>
      <Breadcrumb pageName="Author Form" />
      <h1 className='font-extrabold text-3xl pb-5'>Author Form</h1>

      <div className=" block rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mb-5">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Book Author
          </h3>
        </div>
        <div className="flex flex-col gap-5.5 p-6.5">
          <span>Current Author: <span className='text-lg font-semibold'> {authorData.name} </span></span>
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

      {id &&
        <span className='bg-[#0e0edb] cursor-pointer rounded ms-auto my-4 px-8 py-4 text-xl text-center block w-fit' onClick={() => handleCreateBtn()}>Create New Book</span>
      }


      <form onSubmit={handleSubmit}>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <CustomInput
            inputLabel='Author Name'
            inputName='name'
            inputPlaceholder='Author name'
            inputType='text'
            inputValue={authorData.name}
            inputOnChangeValue={handleInputChange}
          />
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Author Image
              </h3>
            </div>
            <div className="grid grid-cols-4 gap-5.5 p-6.5">
              {authorData.image &&
                <div className='col-span-1 w-full'>
                  <img src={authorData.image} alt="" />
                </div>
              }

              <div className={authorData.image ? 'col-span-3 self-end' : 'col-span-4'}>
                <input
                  name="image"
                  onChange={handleAuthorImage}
                  type="file"
                  className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                />
              </div>


            </div>
          </div>


          <div className="md:col-span-2 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Author Bio
              </h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              <div>
                <textarea
                  name="bio"
                  value={authorData.bio}
                  onChange={handleInputChange}
                  rows={6}
                  placeholder="Author Bio"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                ></textarea>
              </div>


            </div>
          </div>

        </div>
        <button className='btn btn-primary ms-auto my-4 px-8 text-xl block'>{id ? 'Update Author' : 'Add New Author'}
        </button>
      </form>



      <AuthorTable />
    </>
  )
}

export default AuthorForm