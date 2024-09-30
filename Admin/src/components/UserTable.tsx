import { MdDeleteForever } from "react-icons/md";
import { MdOutlineEditOff } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { useState } from "react";
import ConfirmationModal from "./ConfirmationModal";

type UserTableProps = {
  image?: string;
  fName?: string;
  colTwo?: string;
  lName?: string;
  email?: string;
  role?: string;
  phone?: string;
 
  moreDetails?: () => void;
  Edit?: () => void;
  Delete?: () => void;
};

const UserTable: React.FC<UserTableProps> = ({
  image,
  fName,
  lName,
  email,
  role,
  phone,
 
  moreDetails,
  Edit,
  Delete,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleConfirm = () => {
        if (Delete) {
            Delete();  
          }
      console.log('Confirmed');
      setIsModalOpen(false);
    };
  
    const handleCancel = () => {
      // Handle the cancel action here
      console.log('Cancelled');
      setIsModalOpen(false);
    };
  return (<>
    <div className="grid grid-cols-6 border-t  border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-10 md:px-6 2xl:px-7.5">
    
    <div className="col-span-3 flex items-center">
              <div className="grid grid-cols-4 gap-4 sm:flex-row sm:items-center">
                <div className="h-17 w-full rounded-md">
                  <img src={image} alt={fName} className="h-full" />
                </div>
                <p className="col-span-3 text-sm text-black dark:text-white text-ellipsis overflow-hidden max-h-10 self-center pe-4">{fName+" "+lName}</p>
              </div>
            </div>
    

      
            <div className="col-span-1 hidden items-center sm:flex">
              <p className="text-sm text-black dark:text-white truncate overflow-hidden">{role}</p>
            </div>
    
  
 
            <div className="col-span-3 hidden items-center sm:flex">
              <p className="text-sm text-black dark:text-white truncate overflow-hidden">{email}</p>
            </div>
       

      

      
        <div className="col-span-2 flex items-center">
          <p className="text-sm text-black dark:text-white truncate overflow-hidden">{phone}</p>
        </div>
      

      <div className="col-span-1 flex items-center justify-between">

          <span className="hover:cursor-pointer hover:bg-sky-600" onClick={moreDetails}>
            <FaEye size={20} className="hover:!text-blue-500" />
          </span>
        
          <span className="hover:cursor-pointer hover:bg-sky-600" onClick={Edit}>
            <MdOutlineEditOff size={20} />
          </span>
        
        
          <span className="hover:cursor-pointer hover:bg-sky-600"   onClick={() => setIsModalOpen(true)}>
            <MdDeleteForever size={20} />
          </span>
      
      </div>
      



      <ConfirmationModal
        isOpen={isModalOpen}
        message="Are you sure you want to delete this user?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />

    </div>

      
  </>
  );
};

export default UserTable;
