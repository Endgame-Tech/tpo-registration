// import React from "react";
// import { Link } from "react-router";
// // import {
// //   MdOutlineSpaceDashboard,
// //   MdOutlineTipsAndUpdates,
// // } from "react-icons/md";
// // import { IoAnalytics, IoSettingsOutline } from "react-icons/io5";
// // import { IoIosNotificationsOutline } from "react-icons/io";
// // import { GiHamburgerMenu } from "react-icons/gi";

// export default function Dashboard() {
//   const tabs = [
//     {
//       display_name: "Dashboard",
//       url_name: "dashboard",
//       icon: <MdOutlineSpaceDashboard />,
//     },
//     {
//       display_name: "Analytics",
//       url_name: "analytics",
//       icon: <IoAnalytics />,
//     },
//     {
//       display_name: "Board Updates",
//       url_name: "board-updates",
//       icon: <MdOutlineTipsAndUpdates />,
//     },
//     // {
//     //   display_name: "Edit",
//     //   url_name: "/edit",
//     //   icon: <AiOutlineEdit />,
//     // },
//     // {
//     //   display_name: "Settings",
//     //   url_name: "/settings",
//     //   icon: <IoSettingsOutline />,
//     // },
//   ];
//   return (
//     <div
//       className={`grid md:grid-cols-[auto,_1fr] min-h-screen font-poppins bg-[#232323]`}
//     >
//       <aside
//         // className={`${raleway.className} py-8 px-4 gap-8 grid grid-rows-[auto,_1fr,_auto]`}
//         className={`duration-300 z-20 bg-[#232323] grid grid-rows-[auto,_1fr,_auto] gap-4 max-w-[300px]  `}
//       >
//         <div className="flex gap-8 justify-center p-4">
//           <Link to="/" className={``}>
//             <img
//               src="logo.png"
//               alt="The New Nigeria Project Logo"
//               className="w-24 mb-4"
//             />
//           </Link>
//         </div>
//         <ul className="flex flex-col gap-2 p-4">
//           {tabs.map((tab) => (
//             <li key={tab.display_name} className="w-full">
//               <Link
//                 to={`/dashboard/${tab.url_name}`}
//                 className={`${
//                   tab.url_name === "dashboard"
//                     ? "bg-[#159F4740] text-[#159F47]"
//                     : " hover:bg-[#159F4720] hover:text-[#159F47]"
//                 } p-2 rounded-lg flex gap-4 items-center text-xl group relative z-20 text-[#159F47] duration-300`}
//               >
//                 <div className="w-[10px] bg-[#159F47] h-[90%] hidden group-hover:flex absolute -left-[20px] rounded-r-lg"></div>
//                 <div>{tab.icon}</div>
//                 <p className={"w-full"}>{tab.display_name}</p>
//               </Link>
//             </li>
//           ))}
//         </ul>
//       </aside>
//       <main className="flex flex-col items-center p-4 md:p-10  bg-[#2B2B2B] rounded-tl-2xl overflow-y-auto gap-8">
//         <div className="w-full">
//           <div className="flex justify-between w-full text-[#B5B5B5]">
//             <p className="text-4xl">Overview</p>
//             <div className="flex gap-2 items-center">
//               <figure className="w-[25px] h-[25px] bg-gray-300 text-[#718EBF] rounded-full grid place-content-center">
//                 <IoSettingsOutline />
//               </figure>
//               <figure className="w-[25px] h-[25px] bg-gray-300 text-[#FE5C73] rounded-full grid place-content-center">
//                 <IoIosNotificationsOutline />
//               </figure>

//               <figure className="w-[25px] h-[25px] bg-gray-300 rounded-full grid place-content-center">
//                 N
//               </figure>
//             </div>
//           </div>

//           <div className="flex items-center">
//             <div className="w-1.5 h-1.5 bg-[#464646] rounded-full"></div>
//             <div className="w-full h-[2px] bg-[#464646]"></div>
//             <div className="w-1.5 h-1.5 bg-[#464646] rounded-full"></div>
//           </div>
//         </div>

//         <div className="w-full">
//           <div className="grid gap-4 grid-cols-fluid-sm ">
//             <Card
//               title={"User"}
//               mainStats={"54,685"}
//               subStats={"80% are Verified"}
//             />
//             <Card
//               title={"Total Voters"}
//               mainStats={"44,685"}
//               subStats={"40% are Verified"}
//             />
//             <Card
//               title={"Volunteer"}
//               mainStats={"51,499"}
//               subStats={"30% are Verified"}
//             />
//             <Card
//               title={"Active Users"}
//               mainStats={"54,000"}
//               subStats={"95% are Verified"}
//             />
//             <Card
//               title={"Deactivated Accounts"}
//               mainStats={"4,685"}
//               subStats={"80% are Verified"}
//             />
//           </div>
//         </div>

//         <div className="w-full bg-[#00000020] p-8 rounded-xl">
//           <div className="grid gap-4">
//             <p className="text-white text-xl">Users</p>
//             <div className="p-4 bg-[#00000020] rounded-xl w-full">
//               <table className="w-full">
//                 <thead>
//                   <tr className="font-normal text-[#FFA048]">
//                     <td>Profile</td>
//                     <td>Name</td>
//                     <td>Position</td>
//                     <td>State</td>
//                     <td>Occupation</td>
//                     <td>Volunteer</td>
//                     <td>Action</td>
//                   </tr>
//                 </thead>
//                 <tbody className="text-[#C6C6C6]">
//                   <tr className="text-base p-2">
//                     <td>
//                       <figure className="w-[25px] h-[25px] bg-gray-300 rounded-full grid place-content-center text-black">
//                         N
//                       </figure>
//                     </td>
//                     <td className="">
//                       <div className="grid gap-1">
//                         <p>Musa Bada</p>

//                         <p className=" text-xs flex gap-1 items-center">
//                           <span className="text-[#FFFFFF]">ID:</span>
//                           <span className="bg-[#159F4720] rounded p-1">
//                             0u86gdyv88372
//                           </span>
//                         </p>
//                       </div>
//                     </td>
//                     <td>Voter</td>
//                     <td> Kano</td>
//                     <td> Student</td>
//                     <td> Yes</td>
//                     <td>
//                       <GiHamburgerMenu />
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>
//           <div></div>
//         </div>
//       </main>
//     </div>
//   );
// }

// function Card({ title, icon = <IoSettingsOutline />, mainStats, subStats }) {
//   return (
//     <div className="bg-[#00000030] rounded-lg p-4 text-white gap-2">
//       <div className="flex justify-between">
//         <p>{title}</p>
//         <div className="w-[25px] h-[25px] bg-[#159F47] text-black rounded-full grid place-content-center">
//           {icon}
//         </div>
//       </div>
//       <p className="text-4xl text-[#159F47]">{mainStats}</p>
//       <div className="text-xs text-[#B5B5B5]">{subStats}</div>
//     </div>
//   );
// }
