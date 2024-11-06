"use client";

import React from "react";
import twitterX from "@/assets/twitter.png";
import telegram from "@/assets/telegram.png";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const communityList = [
  {
    title: "X",
    img: twitterX,
    path: "https://x.com/TheFightFist",
  },
  {
    title: "Telegram",
    img: telegram,
    path: "https://t.me/+CjzwzintOdJjNGNi",
  },
];

const Community = () => {
  return (
    <div className="overflow-hidden">
      <div className="flex flex-col justify-center items-center text-center pb-10 px-4 md:px-10">
        <div className="flex flex-row gap-5 py-3 flex-wrap justify-center">
          {communityList.map((community, index) => (
            <motion.div
              key={index}
              className="box"
              animate={{
                scale: [1, 1.2, 1.2, 1, 1],
                rotate: [0, 0, 180, 180, 0],
                borderRadius: ["0%", "0%", "50%", "50%", "0%"],
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                times: [0, 0.2, 0.5, 0.8, 1],
                repeat: Infinity,
                repeatDelay: 1,
              }}
            >
              <Link href={community.path} target="_blank">
                <Image
                  src={community.img}
                  alt={community.title}
                  width={50}
                  height={50}
                  className="bg-white rounded-lg border border-white"
                />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Community;
