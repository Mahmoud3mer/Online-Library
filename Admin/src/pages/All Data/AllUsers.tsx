import React, { useEffect, useState } from 'react'
import { apiUrl } from '../../utils/apiUrl';
import axios from 'axios';
import UserTable from '../../components/UserTable';

 
type User = {
    _id: string;
    profilePic?: string;
    fName: string;
    lName: string;
    email: string;
    role: string;
    phone: string;
  };
  
const AllUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const getToken = () => localStorage.getItem('token');
    useEffect(() => {
        const token = getToken();
        axios.get(`${apiUrl}/user-settings/admin/users?page=${page}&limit=${limit}`, { 'headers': { 'token': token }})
        .then((res) => {
            setUsers(res.data.data)
            console.log(res.data.data);
            
        })
        .catch((err) => {
            console.log("Error",err);
        })
    },[])

    const handleMoreDetails = () => {
        console.log("More details clicked");
      };
    
      const handleEdit = () => {
        console.log("Edit clicked");
      };
    
      const handleDelete = async (userId: string) => {
        try {
            const token = getToken();
            await axios.delete(`http://localhost:3000/user-settings/admin/users/${userId}`, { 'headers': { 'token': token }});
            setUsers(users.filter(user => user._id !== userId));
          } catch (error) {
            console.error('Error deleting user:', error);
          }
      };
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
    <div className="py-6 px-4 md:px-6 xl:px-7.5">
        <h4 className="text-xl font-semibold text-black dark:text-white">
            Users
        </h4>
    </div>

    <div className="grid grid-cols-10 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-10 md:px-6 2xl:px-7.5">
        <div className="col-span-1 flex items-center">
            <p className="font-medium">image</p>
        </div>
        <div className="col-span-1 hidden items-center sm:flex">
            <p className="font-medium">FName</p>
        </div>
        <div className="col-span-2 hidden items-center sm:flex">
            <p className="font-medium">LName</p>
        </div>
        <div className="col-span-2 flex items-center">
            <p className="font-medium">email</p>
        </div>
        <div className="col-span-1 flex items-center">
            <p className="font-medium">role</p>
        </div>
        <div className="col-span-2 flex items-center">
            <p className="font-medium">phone</p>
        </div>
        <div className="col-span-1 flex items-center">
            <p className="font-medium">Profit</p>
        </div>
    </div>

    {users && users.map((user) => (
               <UserTable key={user._id}
               image={user.profilePic}
               fName={user.fName}
               lName={user.lName}
               email={user.email}
               role={user.role}
               phone={user.phone}
               moreDetails={handleMoreDetails}
               Edit={handleEdit}
               Delete={() => handleDelete(user._id)}
             />
            ))}
    
    
</div>  
)
}

export default AllUsers