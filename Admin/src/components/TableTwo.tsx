import { MdDeleteForever } from "react-icons/md";
import { MdOutlineEditOff } from "react-icons/md";
import { FaEye } from "react-icons/fa";

type TableTwoProps = {
  image?: string;
  colOne?: string;
  colTwo?: string;
  colThree?: string;
  colFour?: string;
  colFive?: string;
  moreDetails?: () => void;
  Edit?: () => void;
  Delete?: () => void;
};

const TableTwo: React.FC<TableTwoProps> = ({
  image,
  colOne,
  colTwo,
  colThree,
  colFour,
  colFive,
  moreDetails,
  Edit,
  Delete,
}) => {
  return (
    <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-10 md:px-6 2xl:px-7.5">
      {colOne && (
        <div className="col-span-3 flex items-center">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {image && (
              <div className="h-12.5 w-15 rounded-md">
                <img src={image} alt="Product" />
              </div>
            )}
            <p className="text-sm text-black dark:text-white">{colOne}</p>
          </div>
        </div>
      )}

      {colTwo && (
        <div className="col-span-2 hidden items-center sm:flex">
          <p className="text-sm text-black dark:text-white">{colTwo}</p>
        </div>
      )}

      {colThree && (
        <div className="col-span-2 hidden items-center sm:flex">
          <p className="text-sm text-black dark:text-white">{colThree}</p>
        </div>
      )}

      {colFour && (
        <div className="col-span-1 flex items-center">
          <p className="text-sm text-black dark:text-white">{colFour}</p>
        </div>
      )}

      {colFive && (
        <div className="col-span-1 flex items-center">
          <p className="text-sm text-black dark:text-white">{colFive}</p>
        </div>
      )}

      <div className="col-span-1 flex items-center justify-between">
        {moreDetails && (
          <span className="hover:cursor-pointer hover:bg-sky-600" onClick={moreDetails}>
            <FaEye size={20} className="hover:!text-blue-500" />
          </span>
        )}
        {Edit && (
          <span className="hover:cursor-pointer hover:bg-sky-600" onClick={Edit}>
            <MdOutlineEditOff size={20} />
          </span>
        )}
        {Delete && (
          <span className="hover:cursor-pointer hover:bg-sky-600" onClick={Delete}>
            <MdDeleteForever size={20} />
          </span>
        )}
      </div>
    </div>
  );
};

export default TableTwo;
