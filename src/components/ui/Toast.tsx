import React, { useEffect, useState } from "react";
import { Bell, Info, Calendar, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ToastProps {
    message: string;
    isVisible: boolean;
    onClose: () => void;
}

export default function Toast({ message, isVisible, onClose }: ToastProps) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(onClose, 5000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    const isEvent = message.toLowerCase().includes("event");

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, x: 20, y: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: 20, transition: { duration: 0.2 } }}
                    className="fixed bottom-6 right-6 z-[100]"
                >
                    <div className="bg-white/80 backdrop-blur-md border border-purple-100 shadow-2xl rounded-2xl overflow-hidden min-w-[320px] max-w-[400px] flex flex-col ring-1 ring-black/5">
                        <div className="p-4 flex gap-4 items-start">
                            <div className={`p-2 rounded-xl flex-shrink-0 ${isEvent ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"}`}>
                                {isEvent ? <Calendar className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                            </div>

                            <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900 mb-1">New Notification</p>
                                <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
                            </div>

                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition p-1 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <motion.div
                            initial={{ width: "100%" }}
                            animate={{ width: "0%" }}
                            transition={{ duration: 5, ease: "linear" }}
                            className="h-1 bg-purple-500"
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
