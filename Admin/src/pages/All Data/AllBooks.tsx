import React from 'react'
import BooksTable from '../../components/BooksTable';


const AllBooks = () => {
    
    return (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="py-6 px-4 md:px-6 xl:px-7.5">
                <h4 className="text-xl font-semibold text-black dark:text-white">
                    All Books
                </h4>
            </div>

            <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-10 md:px-6 2xl:px-7.5">
                <div className="col-span-3 flex items-center">
                    <p className="font-medium">Book Name</p>
                </div>
                <div className="col-span-2 hidden items-center sm:flex">
                    <p className="font-medium">Author</p>
                </div>
                <div className="col-span-2 hidden items-center sm:flex">
                    <p className="font-medium">Category</p>
                </div>
                <div className="col-span-1 flex items-center">
                    <p className="font-medium">Price</p>
                </div>
                <div className="col-span-1 flex items-center">
                    <p className="font-medium">Stock</p>
                </div>
                <div className="col-span-1 flex items-center">
                    <p className="font-medium">Actions</p>
                </div>
            </div>
            
            <BooksTable />
            
        </div>
    )
}

export default AllBooks