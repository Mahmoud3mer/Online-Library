import React, { useEffect, useState } from 'react'
import { apiUrl } from '../../utils/apiUrl';
import axios from 'axios';
import UserTable from '../../components/UserTable';
import { UserInterface } from '../../interfaces/UserInterface';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../components/Pagination';
import AlertModal from '../../components/AlertModal';
// import AutoCompleteSearch from '../../components/AutoCompeleteSearch';




const AllUsers = () => {
    const [users, setUsers] = useState<UserInterface[]>([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const navigate = useNavigate(); // Use navigate to move between routes
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [alertModalOpen, setAlertModalOpen] = useState(false);
    const [alertTitle, setAlertTitle] = useState(''); // Add this state for the alert title
    const [alertMessage, setAlertMessage] = useState('');
    const [selectedUser, setSelectedUser] = useState<UserInterface | null>(null);
    const [numberOfPages, setnumberOfPages] = useState(0)
    useEffect(() => {
        fetchUsers();
    }, [page, limit, searchTerm]);




    const getToken = () => localStorage.getItem('token');
    const fetchUsers = async () => {
        try {
            const token = getToken();
            // Send the search term as a query parameter
            const response = await axios.get(`${apiUrl}/user-settings/admin/users`, {
                params: {
                    page,
                    limit,
                    name: searchTerm, // Include search query
                },
                headers: { token },
            });

            setnumberOfPages(response.data.metaData.numberOfPages);
            setUsers(response.data.data);
        } catch (err) {
            console.error("Error fetching users", err);
        }
    };


    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };


    const handleMoreDetails = (user: UserInterface) => {
        setSelectedUser(user); // Set the clicked user
        document.getElementById('my_modal_3')?.showModal();
    };


    // This will pass the selected user's data to UserForm component
    const handleEdit = (user: UserInterface) => {
        navigate('/forms/user-form', { state: { user } });
        console.log("edit");

    };

    const handleDelete = async (userId: string) => {
        try {
            const token = getToken();
           const res= await axios.delete(`http://localhost:3000/user-settings/admin/users/${userId}`, { 'headers': { 'token': token || "" } });
           if (res.data.message === "Deleted Success") {
            setUsers(users.filter(user => user._id !== userId));
           
            setAlertTitle('Success!');
            setAlertMessage('User deleted successfully!');
            setAlertModalOpen(true);

        } else if (res.data.message=="Cannot delete this protected admin"){
            setAlertTitle('Not allowed!');
            setAlertMessage('Not allowed to delete the admin !');
            setAlertModalOpen(true);
        }

        } catch (err) {
            console.log(err);
            setAlertMessage('Failed to delete user. Please try again.');
            setAlertTitle('Error');
            setAlertModalOpen(true);


        }
    };

    const closeAlertModal = () => {
        setAlertModalOpen(false);
    };
    return (<>
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="py-6 px-4 md:px-6 xl:px-7.5">
                <h4 className="text-xl font-semibold text-black dark:text-white">
                    Users
                </h4>
            </div>




            <div className="px-4 md:px-6 xl:px-7.5 mb-4 ">
                <input
                    type="text"
                    placeholder="Search by name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
                    className="
                    input input-bordered w-125 
                    bg-white dark:text-stroke border-gray-300
                    dark:bg-strokedark dark:text-gray-200 dark:placeholder-gray-400 dark:border-gray-600
                    transition-all duration-300 ease-in-out 
                    focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200
                    dark:focus:border-blue-400 dark:focus:ring-blue-400
                    rounded-lg shadow-md hover:shadow-lg
                  "
                />
            </div>


            <div className="grid grid-cols-10 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-10 md:px-6 2xl:px-7.5">
                <div className="col-span-1 flex items-center">
                    <p className="font-medium">image</p>
                </div>
                <div className="col-span-2 hidden items-center sm:flex">
                    <p className="font-medium">Name</p>
                </div>
                <div className="col-span-1 flex items-center">
                    <p className="font-medium">role</p>
                </div>
                <div className="col-span-3 flex items-center">
                    <p className="font-medium">email</p>
                </div>

                <div className="col-span-2 flex items-center">
                    <p className="font-medium">phone</p>
                </div>
                <div className="col-span-1 flex items-center">
                    <p className="font-medium">Actions</p>
                </div>
            </div>



            {users && users.map((user, index) => (
                <div className={index % 2 === 0 ? "bg-white dark:bg-form-input" : "bg-[#f9f9f9] dark:bg-strokedark"} key={user._id}>
                    <UserTable
                        image={user.profilePic ? user.profilePic : "https://st3.depositphotos.com/9998432/13335/v/450/depositphotos_133352062-stock-illustration-default-placeholder-profile-icon.jpg"}
                        fName={user.fName}
                        lName={user.lName}
                        email={user.email}
                        role={user.role}
                        phone={user.phone}
                        moreDetails={() => handleMoreDetails(user)}
                        Edit={() => handleEdit(user)}
                        Delete={() => handleDelete(user._id)}
                    />
                </div>
            ))}




        </div>



        {/* user details */}
        {selectedUser && (
            <dialog id="my_modal_3" className="modal">
                <div className="modal-box w-11/12 max-w-4xl dark:bg-black">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg">User Details</h3>
                    <section className="grid grid-cols-3">
                        <div>
                            <img src={selectedUser.profilePic} alt={selectedUser.fName} className="w-full" />
                        </div>
                        <div className="col-span-2 ms-10">
                            <h6 className="font-semibold pb-2 border-b mb-4">
                                <span className="">Name: </span>{selectedUser.fName} {selectedUser.lName}
                            </h6>
                            <p className="py-1"><span className="font-semibold">Email: </span>{selectedUser.email}</p>
                            <p className="py-1"><span className="font-semibold">Role: </span>{selectedUser.role}</p>
                            <p className="py-1"><span className="font-semibold">Phone: </span>{selectedUser.phone}</p>
                            <p className="py-1"><span className="font-semibold">Created At: </span>{selectedUser.createdAt}</p>
                            <p className="py-1"><span className="font-semibold">Is verified  : </span>{selectedUser.isVerified ? "verified" : "not verified"}</p>
                            <p className="py-1"><span className="font-semibold">login method: </span>{selectedUser.loginMethod}</p>
                        </div>
                    </section>
                </div>
            </dialog>
        )}




        {/* Alert Modal */}
        {alertModalOpen && (
            <AlertModal
                isOpen={alertModalOpen}
                onClose={closeAlertModal}
                message={alertMessage}
                title={alertTitle}
            />
        )}
        {/* Pagingation */}
        <div className='py-3 flex justify-center'>
            <Pagination totalPages={numberOfPages} currentPage={page} onPageChange={handlePageChange} />
        </div>


    </>

    )
}

export default AllUsers