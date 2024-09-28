// import { useTranslation } from 'react-i18next';

// const LanguageSwitcher = () => {
//   const { i18n } = useTranslation();

//   const toggleLanguage = async () => {
//     const newLanguage = i18n.language === 'en' ? 'ar' : 'en';
//     await i18n.changeLanguage(newLanguage);
//     console.log("Current language:", i18n.language);
//   };

//   return (
//     <li>
//       <label
//         className={`relative m-0 block h-7.5 w-14 rounded-full ${
//           i18n.language === 'ar' ? 'bg-primary' : 'bg-stroke'
//         }`}
//       >
//         <input
//           type="checkbox"
//           onChange={toggleLanguage}
//           className="dur absolute top-0 z-50 m-0 h-full w-full cursor-pointer opacity-0"
//         />
//         <span
//           className={`absolute top-1/2 left-[3px] flex h-6 w-6 -translate-y-1/2 translate-x-0 items-center justify-center rounded-full bg-white shadow-switcher duration-75 ease-linear ${
//             i18n.language === 'ar' && '!right-[3px] !translate-x-full'
//           }`}
//         >
//           <span className={i18n.language === 'ar' ? 'hidden' : ''}>
//             EN
//           </span>
//           <span className={i18n.language === 'ar' ? '' : 'hidden'}>
//             AR
//           </span>
//         </span>
//       </label>
//     </li>
//   );
// };

// export default LanguageSwitcher;
