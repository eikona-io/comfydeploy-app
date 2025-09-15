import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Reusable animated logo card component
export function AnimatedLogoCard({
    logo,
    altText,
    description,
    hoverBgColor,
}: {
    logo: string;
    altText: string;
    description: string;
    hoverBgColor: string;
}) {
    return (
        <motion.div
            className={cn(
                "group relative overflow-hidden cursor-pointer h-full",
                hoverBgColor
            )}
            whileHover="hover"
            initial="initial"
            variants={{
                initial: { scale: 1 },
                hover: { scale: 1 }
            }}
            transition={{
                duration: 0.4,
                ease: [0.23, 1, 0.32, 1] // Apple-style cubic-bezier
            }}
        >
            <motion.div
                className="absolute inset-0"
                variants={{
                    initial: { opacity: 0.8 },
                    hover: { opacity: 1 }
                }}
                transition={{
                    duration: 0.6,
                    // delay: 0.1,
                    ease: [0.23, 1, 0.32, 1]
                }}
            >
                <motion.img
                    src={logo}
                    alt={altText}
                    className="w-12 h-8 sm:w-16 sm:h-10 object-contain filter brightness-0 dark:filter dark:brightness-0 dark:invert group-hover:brightness-0 group-hover:invert-0"
                    variants={{
                        initial: {
                            x: "-50%",
                            y: "-50%",
                            scale: 1,
                            position: "absolute",
                            top: "50%",
                            left: "50%"
                        },
                        hover: {
                            x: "-50%",
                            y: "-100%",
                            scale: 0.7,
                            position: "absolute",
                            top: "100%",
                            left: "50%",
                            opacity: 0.3,
                        }
                    }}
                    transition={{
                        duration: 0.5,
                        delay: 0.15,
                        ease: [0.23, 1, 0.32, 1]
                    }}
                />
                <motion.div
                    className="absolute font-serif w-full text-center h-full flex items-center justify-center text-xl text-balance font-medium text-transparent group-hover:text-gray-700 dark:group-hover:text-white px-2"
                    variants={{
                        initial: {
                            opacity: 0,
                            y: 0,
                            // scale: 0.9
                        },
                        hover: {
                            opacity: 1,
                            y: -8,
                            // scale: 1
                        }
                    }}
                    transition={{
                        duration: 0.4,
                        delay: 0.4,
                        ease: [0.23, 1, 0.32, 1]
                    }}
                >
                    {description}
                </motion.div>
            </motion.div>
        </motion.div>
    );
}