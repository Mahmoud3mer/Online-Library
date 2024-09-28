import { lazy } from "react";

const Calendar = lazy(() => import('../pages/Calendar'));
const Chart = lazy(() => import('../pages/Chart'));
const FormElements = lazy(() => import('../pages/Form/FormElements'));
const BookForm = lazy(() => import('../pages/Form/BookForm'));
const AuthorForm = lazy(() => import('../pages/Form/AuthorForm'));
const CategoryForm = lazy(() => import('../pages/Form/CategoryForm'));
const UserForm = lazy(() => import('../pages/Form/UserFrom'));
const FormLayout = lazy(() => import('../pages/Form/FormLayout'));
const Profile = lazy(() => import('../pages/Profile'));
const Settings = lazy(() => import('../pages/Settings'));
const Tables = lazy(() => import('../pages/Tables'));
const AllOrders = lazy(() => import('../pages/AllData/AllOrders'));
const AllBooks = lazy(() => import('../pages/AllData/AllBooks'));
const AllUsers = lazy(() => import('../pages/AllData/AllUsers'));
const Alerts = lazy(() => import('../pages/UiElements/Alerts'));
const Buttons = lazy(() => import('../pages/UiElements/Buttons'));

const coreRoutes = [
  {
    path: "/calendar",
    title: "Calender",
    component: Calendar,
  },
  {
    path: "/profile",
    title: "Profile",
    component: Profile,
  },
  {
    path: "/forms/form-elements",
    title: "Forms Elements",
    component: FormElements,
  },
  {
    path: "/forms/book-form/:id?",
    title: "Book Form",
    component: BookForm,
  },
  {
    path: '/forms/author-form/:id?',
    title: 'Author Form',
    component: AuthorForm,
  },
  {
    path: '/forms/category-form/:id?',
    title: 'Category Form',
    component: CategoryForm,
  },
  {
    path: '/forms/category-form/:id',
    title: 'Category Form',
    component: CategoryForm,
  },
  {
    path: "/forms/user-form",
    title: "User Form",
    component: UserForm,
  },
  {
    path: "/forms/form-layout",
    title: "Form Layouts",
    component: FormLayout,
  },
  {
    path: "/orders",
    title: "Orders",
    component: AllOrders,
  },
  {
    path: "/users",
    title: "Users",
    component: AllUsers,
  },
  {
    path: "/books",
    title: "All Books",
    component: AllBooks,
  },
  {
    path: "/tables",
    title: "Tables",
    component: Tables,
  },
  {
    path: "/settings",
    title: "Settings",
    component: Settings,
  },
  {
    path: "/chart",
    title: "Chart",
    component: Chart,
  },
  {
    path: "/ui/alerts",
    title: "Alerts",
    component: Alerts,
  },
  {
    path: "/ui/buttons",
    title: "Buttons",
    component: Buttons,
  },
];

const routes = [...coreRoutes];
export default routes;
