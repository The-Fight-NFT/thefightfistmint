"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import ttsLogo from "@/assets/TTS_Logo.png";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { AiOutlineClose } from "react-icons/ai";
import { CgMenuGridO } from "react-icons/cg";
import { motion, AnimatePresence } from "framer-motion";
import CustomConnectButton from "./connectWallet3rd";

const navLinks = [
  { title: "HOME", path: "https://fightfist.io/" },
  { title: "FIGHT NFT", path: "https://mint.fightfist.io/" },
  { title: "SWAP", path: "https://fightfist.io/comingsoon" },
  { title: "STAKE", path: "https://fightfist.io/comingsoon" },
  { title: "ART GALLERY", path: "https://fightfist.io/comingsoon" },
  { title: "WHITEPAPER", path: "https://fightfist.io/whitepaper" },
];

const menuVariants = {
  open: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.3,
    },
  },
  closed: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.3,
    },
  },
};

const NavbarGreen = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header className="flex items-center justify-between p-5">
      {/* Logo (Hidden on mobile) */}
      <div className="hidden md:flex items-center pl-5">
        <Link href="https://fightfist.io">
          <Image src={ttsLogo} alt="Logo" width={80} height={80} />
        </Link>
      </div>

      {/* Navigation Links and Connect Wallet */}
      <div className="flex items-center space-x-4">
        <nav>
          <NavigationMenu
            id="navigation"
            className="bg-black p-3 border border-slate-300 rounded-3xl hidden md:flex"
          >
            <NavigationMenuList className="space-x-4">
              {navLinks.map((nav, index) => (
                <NavigationMenuItem key={index}>
                  <Link href={nav.path} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={`${navigationMenuTriggerStyle()} bg-transparent text-white`}
                    >
                      {nav.title}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Mobile Button (Visible only on mobile) */}
          <div className="md:hidden absolute top-0 left-0 mt-6 ml-6 z-50">
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? (
                <AiOutlineClose className="w-8 h-8 text-white" />
              ) : (
                <CgMenuGridO className="w-8 h-8 text-white" />
              )}
            </button>
          </div>
        </nav>
        <div className="pr-2">
          <CustomConnectButton />
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="md:hidden z-40 fixed inset-0 w-full h-full flex flex-col items-center justify-center bg-black/80 overflow-hidden"
          >
            <div className="flex flex-col items-center py-5 space-y-4">
              {navLinks.map((nav, index) => (
                <div
                  key={index}
                  className="px-6 py-5 font-semibold text-white cursor-pointer"
                >
                  <Link href={nav.path} passHref>
                    <span className="hover:text-blue-500">{nav.title}</span>
                  </Link>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default NavbarGreen;
