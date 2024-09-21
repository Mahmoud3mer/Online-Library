/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'

type InputInterfaceProps = {
    inputLabel: string;
    inputName: string;
    inputPlaceholder: string;
    inputType: any;
    inputValue: any;
    inputOnChangeValue: any;
}

const CustomInput: React.FC<InputInterfaceProps> = ({ inputLabel, inputName, inputPlaceholder, inputType, inputValue, inputOnChangeValue }) => {


    return (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                    {inputLabel}
                </h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
                <div>
                    <input
                        name={inputName}
                        value={inputValue}
                        onChange={inputOnChangeValue}
                        type={inputType}
                        placeholder={inputPlaceholder}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                </div>
            </div>
        </div>
    )
}

export default CustomInput;