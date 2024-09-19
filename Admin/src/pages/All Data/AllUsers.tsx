import React from 'react'
import TableTwo from '../../components/TableTwo'

const AllUsers = () => {

    const handleMoreDetails = () => {
        console.log("More details clicked");
      };
    
      const handleEdit = () => {
        console.log("Edit clicked");
      };
    
      const handleDelete = () => {
        console.log("Delete clicked");
      };
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
    <div className="py-6 px-4 md:px-6 xl:px-7.5">
        <h4 className="text-xl font-semibold text-black dark:text-white">
            Top Products
        </h4>
    </div>

    <div className="grid grid-cols-10 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-10 md:px-6 2xl:px-7.5">
        <div className="col-span-3 flex items-center">
            <p className="font-medium">User Name</p>
        </div>
        <div className="col-span-2 hidden items-center sm:flex">
            <p className="font-medium">Category</p>
        </div>
        <div className="col-span-2 hidden items-center sm:flex">
            <p className="font-medium">Author</p>
        </div>
        <div className="col-span-1 flex items-center">
            <p className="font-medium">Price</p>
        </div>
        <div className="col-span-1 flex items-center">
            <p className="font-medium">Stock</p>
        </div>
        <div className="col-span-1 flex items-center">
            <p className="font-medium">Profit</p>
        </div>
    </div>
       <TableTwo
       image="https://example.com/image.jpg"
       colOne="User name"
       colTwo="Author Name"
       colThree="Published Year"
       colFour="Category"
       colFive="Price"
       moreDetails={handleMoreDetails}
       Edit={handleEdit}
       Delete={handleDelete}
     />
    
</div>  )
}

export default AllUsers