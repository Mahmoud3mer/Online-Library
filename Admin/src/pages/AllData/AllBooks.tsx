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
          

        

            <BooksTable />


        </div>
    )
}

export default AllBooks