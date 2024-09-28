import React, { useState } from 'react'
import Breadcrumb from '../../components/Breadcrumb'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from '../../utils/apiUrl';
import AlertModal from '../../components/AlertModal';
import LoadingSpinner from '../../components/LoadingSpinner';

const UserFrom = () => {
   const { state } = useLocation();
   const navigate = useNavigate();
   
   const [isAlertOpen, setAlertOpen] = useState(false); 
   const [isLoading, setIsLoading] = useState(false); 
   const [formData, setFormData] = useState({
    fName: state?.user?.fName || '',
    lName: state?.user?.lName || '',
    email: state?.user?.email || '',
    role: state?.user?.role || '',
    phone: state?.user?.phone || '',
    profilePic: state?.user?.profilePic || '',
  });
  const [errors, setErrors] = useState({
    fName: '',
    lName: '',
    email: '',
    role: '',
    phone: '',
  });
  const validateForm = () => {
    const newErrors = {
      fName: '',
      lName: '',
      email: '',
      role: '',
      phone: '',
    };

    // Validate First Name
  // Validate First Name
  if (!formData.fName.trim()) {
    newErrors.fName = 'First Name is required';
  } else if (formData.fName.includes(' ')) {
    newErrors.fName = 'First Name cannot contain spaces';
  } else if (formData.fName.length < 3 || formData.fName.length > 15) {
    newErrors.fName = 'First Name must be between 3 and 15 characters';
  }

    // Validate Last Name
    if (!formData.lName.trim()) {
      newErrors.lName = 'Last Name is required';
    } else if (formData.lName.includes(' ')) {
      newErrors.lName = 'Last Name cannot contain spaces';
    } else if (formData.lName.length < 3 || formData.lName.length > 15) {
      newErrors.lName = 'Last Name must be between 3 and 15 characters';
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

  // Validate Role
  const validRoles = ['admin', 'user'];
  if (!formData.role.trim()) {
    newErrors.role = 'Role is required';
  } else if (!validRoles.includes(formData.role)) {
    newErrors.role = 'Role must be "admin" or "user"';
  }

    // Validate Phone (optional)
    // if (!formData.phone.trim()) {
    //   newErrors.phone = 'Phone number is required';
    // }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === '');
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  
    // Clear the error message for the current input field if valid
    if (name === 'fName') {
      if (value.includes(' ')) {
        setErrors((prevErrors) => ({ ...prevErrors, fName: 'First Name cannot contain spaces' }));
      } else if (value.trim() && (value.length < 3 || value.length > 15)) {
        setErrors((prevErrors) => ({ ...prevErrors, fName: 'First Name must be between 3 and 15 characters' }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, fName: '' }));
      }
    }
  
    if (name === 'lName') {
      if (value.includes(' ')) {
        setErrors((prevErrors) => ({ ...prevErrors, lName: 'Last Name cannot contain spaces' }));
      } else if (value.trim() && (value.length < 3 || value.length > 15)) {
        setErrors((prevErrors) => ({ ...prevErrors, lName: 'Last Name must be between 3 and 15 characters' }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, lName: '' }));
      }
    }
  
    if (name === 'email' && value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setErrors((prevErrors) => ({ ...prevErrors, email: 'Invalid email format' }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, email: '' }));
      }
    }
  
    if (name === 'role' && value.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, role: '' }));
    }
  
    if (name === 'phone' && value.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, phone: '' }));
    }
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        await axios.patch(`${apiUrl}/user-settings/admin/users/${state.user._id}`, formData, {
          headers: { token },
        });
        setAlertOpen(true);
          
      } catch (err) {
        console.error('Error updating user:', err);
      }finally {
        setIsLoading(false); // End loading
      }
    } else {
      console.log('Validation errors:', errors);
    }
  };
//  alert close
  const closeAlert = () => {
    setAlertOpen(false);
    navigate('/users'); // Navigate back to the users list after closing
  };
  return (
    <>
      <Breadcrumb  pageName="Edit User info" />
     
      <form onSubmit={handleSubmit}>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
              First Name
              </h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              <div>
              <input
              type="text"
              name="fName"
              placeholder="First Name"
              value={formData.fName}
              onChange={handleInputChange}
                                   className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
             {errors.fName && <p className="text-danger">{errors.fName}</p>}
              </div>
            </div>
          </div>
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
              Last Name
              </h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              <div>
              <input
              type="text"
              name="lName"
              placeholder="Last Name"
              value={formData.lName}
              onChange={handleInputChange}
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
              {errors.lName && <p className="text-danger">{errors.lName}</p>}
              </div>
            </div>
          </div>
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
              Email
              </h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              <div>
              <input
              type="text"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
            {errors.email && <p className="text-danger">{errors.email}</p>}
              </div>
            </div>
          </div>
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                role
              </h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
        <div>
          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          >
            
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          {errors.role && <p className="text-danger">{errors.role}</p>}
        </div>
      </div>

          </div>
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
              Phone
              </h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              <div>
              <input
              type="text"
              name="phone"
              placeholder="phone"
              value={formData.phone}
              onChange={handleInputChange}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
              </div>
            </div>
          </div>
        
  
       
  
          {/* <!-- File upload --> */}
          {/* <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                User Cover Image
              </h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              <div>
                <input
                  type="file"
                  className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                />
              </div>


            </div>
          </div> */}
      </div>
      <button className='block ms-auto px-8 text-lg btn my-5' disabled={isLoading}>
          {isLoading ? <LoadingSpinner size="text-sm" color="text-white" /> : 'Edit'}
        </button>
      </form>

       {/* alert */}
      <AlertModal message='edit user successfully' onClose={closeAlert} isOpen={isAlertOpen} />
    </>
  )
}

export default UserFrom