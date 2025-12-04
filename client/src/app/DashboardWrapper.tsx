'use client'

import React, { useEffect } from 'react'
import Navbar from '../components/NavBar'
import Sidebar from '../components/SideBar'

{/* state provider? */}
{/* This is redux state/Storeprovider provider */}
import StoreProvider, { useAppSelector } from './redux';


const DashboardLayout = ({children}:{children: React.ReactNode}) => {

  {/* Feature 1. Is sidebar collapsed */}
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );

  {/* Feature 2. DarkMode */}
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  useEffect(() =>{
    if (isDarkMode){
      document.documentElement.classList.add('dark');
    } else{
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="flex min-h-screen w-full bg-gray-50 text-gray-900">

      <Sidebar/>
      {/* not sure if its checking darkmode */}
      <main className={` flex w-full flex-col bg-gray-50 dark:bg-gray-900 ${isSidebarCollapsed ? "": "md:pl-64"}`}>
        <Navbar/>
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  )
};

const DashboardWrapper = ({children}:{children: React.ReactNode}) => {
  return(
    <StoreProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </StoreProvider>
  )
}

export default DashboardWrapper