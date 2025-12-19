'use client'

import React, { useState } from 'react'
import Image from 'next/image';
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  ChevronDown, Microscope, ChevronUp, Users, User, Settings,
  Search, Briefcase, Home, LockIcon, LucideIcon, X, AlertCircle,
  ShieldAlert, AlertTriangle, AlertOctagon, Layers3, Atom, Network, ListChecks
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/app/redux';
import Link from 'next/link';
import { setIsSidebarCollapsed } from '@/state';
import { useGetAuthUserQuery,useGetProjectsQuery } from '@/state/api';

import { signOut } from "aws-amplify/auth";

/* ------------------ Variants ------------------ */

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 120 } },
};

/* Accordion animation */
const accordionVariants: Variants = {
  collapsed: { height: 0, opacity: 0, transition: { duration: 0.2 } },
  expanded: { height: "auto", opacity: 1, transition: { type: "spring", stiffness: 110, damping: 14 } },
};

/* Active Icon Pulse */
const activeIconPulse: Variants = {
  initial: {
    scale: 1,
  },
  animate: {
    scale: [1, 1.15, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};
/* ------------------ MAIN SIDEBAR ------------------ */
const Sidebar = () => {
  const [showProjects, setShowProjects] = useState(true);
  const [showPriority, setShowPriority] = useState(true);

  const { data: projects } = useGetProjectsQuery();
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);

  const { data: currentUser } = useGetAuthUserQuery({});
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
  if (!currentUser) return null;
  const currentUserDetails = currentUser?.userDetails;

  return (
    <>
      {/* Backdrop Mobile */}
      <AnimatePresence>
        {!isSidebarCollapsed && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => dispatch(setIsSidebarCollapsed(true))}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Panel */}
      <motion.div
        className="
    fixed left-0 top-0 h-screen w-64 z-40
    flex flex-col justify-start
    backdrop-blur-xl 
    bg-white/15 dark:bg-gray-900/20
    border-r border-white/20 dark:border-gray-700/30
    rounded-r-3xl
    shadow-[0_8px_30px_rgba(0,0,0,0.15)]
    p-2 "
        initial={{ x: -260 }}
        animate={{ x: isSidebarCollapsed ? -260 : 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 18 }}
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="border-b border-white/20 dark:border-gray-700">
          <div className="flex min-h-[56px] w-64 items-center justify-between px-6 pt-3">
            <div className='text-xl font-bold text-gray-800 dark:text-white'>MediPlus</div>
            <button className='py-3' onClick={() => dispatch(setIsSidebarCollapsed(true))}>
              <X className='h-6 w-6 text-gray-800 hover:text-gray-500 dark:text-white' />
            </button>
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div variants={itemVariants}>
          <div className='flex-shrink-0 flex w-64 items-center gap-5 border-y border-white/20 
            px-8 py-4 dark:border-gray-700/40'>
            <Image src='https://hc-s3-images.s3.us-east-2.amazonaws.com/logo.png' alt='Team Logo' width={40} height={40} className='rounded-full' />
            <div>
              <h3 className='text-md font-bold tracking-wide dark:text-gray-200'>Antony Team</h3>
              <div className='mt-1 flex items-start gap-2'>
                <LockIcon className='mt-[0.1rem] h-3 w-3 text-gray-500 dark:text-gray-400' />
                <p className='text-xs text-gray-500'>Private</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Scrollable Links Section */}
        <div className="flex-1 overflow-y-auto w-full pb-8">
          <nav className="w-full">
            <AnimatedLink icon={Home} label="Home" href="/" />
            <AnimatedLink icon={Atom} label="MoleculesBank" href="/moleculesbank" />
            <AnimatedLink icon={Network} label="Model" href="/model" />
            <AnimatedLink icon={ListChecks} label="Properties" href="/properties" />
            <AnimatedLink icon={Search} label="Research" href="/research" />
            <AnimatedLink icon={Microscope} label="DeepSearch" href="/deepsearch" />
            <AnimatedLink icon={Briefcase} label="Timeline" href="/timeline" />
            <AnimatedLink icon={Search} label="Search" href="/search" />
            <AnimatedLink icon={Settings} label="Settings" href="/settings" />
            <AnimatedLink icon={User} label="Users" href="/users" />
            <AnimatedLink icon={Users} label="Teams" href="/teams" />
          </nav>

          {/* Projects Accordion */}
          <AccordionButton
            label="Projects"
            isOpen={showProjects}
            toggle={() => setShowProjects(!showProjects)}
          />
          <AnimatePresence initial={false}>
            {showProjects && (
              <motion.div
                key="projects"
                variants={accordionVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                className="overflow-hidden ml-6 mt-2 flex flex-col gap-1"
              >
                {projects?.map((project) => (
                  <AnimatedLink
                    key={project.id}
                    icon={Briefcase}
                    label={project.name}
                    href={`/projects/${project.id}`}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Priority Accordion */}
          <AccordionButton
            label="Priority"
            isOpen={showPriority}
            toggle={() => setShowPriority(!showPriority)}
          />
          <AnimatePresence initial={false}>
            {showPriority && (
              <motion.div
                key="priority"
                variants={accordionVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                className="overflow-hidden ml-6 mt-2 flex flex-col gap-1"
              >
                <AnimatedLink icon={AlertCircle} label="Urgent" href="/priority/urgent" />
                <AnimatedLink icon={ShieldAlert} label="High" href="/priority/high" />
                <AnimatedLink icon={AlertTriangle} label="Medium" href="/priority/medium" />
                <AnimatedLink icon={AlertOctagon} label="Low" href="/priority/low" />
                <AnimatedLink icon={Layers3} label="Backlog" href="/priority/backlog" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      <div className="z-10 mt-32 flex w-full flex-col items-center gap-4 bg-white px-8 py-4 dark:bg-black md:hidden">
        <div className="flex w-full items-center">
          <div className="align-center flex h-9 w-9 justify-center">
            {!!currentUserDetails?.profilePictureUrl ? (
              <Image
                src={`https://pm-s3-images.s3.us-east-2.amazonaws.com/${currentUserDetails?.profilePictureUrl}`}
                alt={currentUserDetails?.username || "User Profile Picture"}
                width={100}
                height={50}
                className="h-full rounded-full object-cover"
              />
            ) : (
              <User className="h-6 w-6 cursor-pointer self-center rounded-full dark:text-white" />
            )}
          </div>
          <span className="mx-3 text-gray-800 dark:text-white">
            {currentUserDetails?.username}
          </span>
          <button
            className="self-start rounded bg-blue-400 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 md:block"
            onClick={handleSignOut}
          >
            Sign out
          </button>
        </div>
      </div>
    </>
  )
}

/* ------------------ Animated Sidebar Link ------------------ */
interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

const AnimatedLink = ({ href, icon: Icon, label }: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className="w-full">
      <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 160, damping: 12 }}
        className={`relative flex cursor-pointer items-center gap-3 
          transition-colors hover:bg-gray-100/50 dark:hover:bg-gray-800/50 
          ${isActive ? "bg-blue-50/60 dark:bg-gray-700 text-blue-600 dark:text-white" : ""}
          px-8 py-3 rounded-md`}
      >
        {isActive && (
          <motion.div
            layoutId="active-link"
            className="absolute left-0 top-0 h-full w-[5px] bg-blue-500 dark:bg-blue-300 rounded-r"
          />
        )}

        {/* ACTIVE PULSING ICON */}
        <motion.div
          variants={activeIconPulse}
          initial="initial"
          animate={isActive ? "animate" : "initial"}
          className="flex items-center"
        >
          <Icon className="h-10 w-7 dark:text-gray-100" />
        </motion.div>

        <span className="font-medium text-gray-800 dark:text-gray-100">{label}</span>
      </motion.div>
    </Link>
  );
};

/* ------------------ Accordion Button ------------------ */
interface AccordionButtonProps {
  label: string;
  isOpen: boolean;
  toggle: () => void;
}
const AccordionButton = ({ label, isOpen, toggle }: AccordionButtonProps) => (
  <motion.button
    onClick={toggle}
    className="flex w-full items-center justify-between px-8 py-3 text-gray-600 
      hover:bg-gray-50/40 dark:hover:bg-gray-800/50 transition-colors font-semibold"
  >
    <span>{label}</span>
    <motion.div
      animate={{ rotate: isOpen ? 180 : 0 }}
      transition={{ type: "spring", stiffness: 160, damping: 12 }}
    >
      <ChevronDown />
    </motion.div>
  </motion.button>
);

export default Sidebar;
