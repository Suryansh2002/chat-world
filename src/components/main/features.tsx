"use client";

import { motion } from "framer-motion";

function FeatureCard({ title, description, icon, position = "left" }: { title: string, description: string, icon: string, position: "left" | "right" }) {
  return (
    <div className={`flex ${position === "left" ? "justify-start" : "justify-end"} w-full`}>
      <div 
        className={`
          relative
          flex flex-col
          max-w-xl
          bg-gradient-to-br from-gray-950 to-gray-900
          border border-gray-700
          rounded-xl
          overflow-hidden
          shadow-xl
          hover:shadow-2xl
          transition-all duration-300
          group
        `}
      >
        <div className="p-6 space-y-4">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">
            {title}
          </h2>
          <p className="text-gray-300 text-lg font-medium">
            {description}
          </p>
            <img 
              src={icon} 
              alt={title} 
              className="h-96 object-contain rounded-lg border border-gray-700 p-2"
            />
        </div>
        <div className="absolute inset-x-0 h-px bottom-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      </div>
    </div>
  );
}

export function Features() {
  const features:{
    title: string;
    description: string;
    icon: string;
    position: "left" | "right";
  }[] = [
    {
      title: "Chat with Friends",
      description: "Live Chat with no delay, Never lose messages, Chat with friends and family.",
      icon: "screenshots/chat.png",
      position: "left"
    },
    {
      title: "Manage Friends",
      description: "Manage your friends, add new friends, remove friends, and take control of who can message you.",
      icon: "screenshots/manage-friends.png",
      position: "right"
    },
    {
      title: "Personalized Settings",
      description: "Customize your chat experience, change your profile picture.",
      icon: "screenshots/settings.png",
      position: "left"
    }
  ];

  return (
    <div className="w-full py-16 space-y-20 px-4 md:px-10">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.2 }}
        >
          <FeatureCard {...feature} />
        </motion.div>
      ))}
    </div>
  );
}