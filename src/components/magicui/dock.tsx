"use client";

import React, { PropsWithChildren, useRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

import { cn } from "@/lib/utils";

export interface DockProps extends VariantProps<typeof dockVariants> {
    className?: string;
    magnification?: number;
    distance?: number;
    direction?: "top" | "middle" | "bottom" | "left" | "center" | "right";
    orientation?: "horizontal" | "vertical";
    children: React.ReactNode;
}

const DEFAULT_MAGNIFICATION = 60;
const DEFAULT_DISTANCE = 140;

const dockVariants = cva(
    "p-2 flex gap-2 rounded-2xl border supports-backdrop-blur:bg-white/10 supports-backdrop-blur:dark:bg-black/10 backdrop-blur-md",
    {
        variants: {
            orientation: {
                horizontal: "w-max h-[58px] mt-8 flex-row",
                vertical: "h-max w-[58px] ml-8 flex-col",
            },
        },
        defaultVariants: {
            orientation: "horizontal",
        },
    }
);

const Dock = React.forwardRef<HTMLDivElement, DockProps>(
    (
        {
            className,
            children,
            magnification = DEFAULT_MAGNIFICATION,
            distance = DEFAULT_DISTANCE,
            direction = "bottom",
            orientation = "horizontal",
            ...props
        },
        ref
    ) => {
        const mouseX = useMotionValue(Infinity);
        const mouseY = useMotionValue(Infinity);

        const renderChildren = () => {
            return React.Children.map(children, (child: any) => {
                return React.cloneElement(child, {
                    mouseX: mouseX,
                    mouseY: mouseY,
                    magnification: magnification,
                    distance: distance,
                    orientation: orientation,
                });
            });
        };

        return (
            <motion.div
                ref={ref}
                onMouseMove={(e: any) => {
                    mouseX.set(e.pageX);
                    mouseY.set(e.pageY);
                }}
                onMouseLeave={() => {
                    mouseX.set(Infinity);
                    mouseY.set(Infinity);
                }}
                {...props}
                className={cn(dockVariants({ orientation, className }), {
                    "items-start": direction === "top" || direction === "left",
                    "items-center":
                        direction === "middle" || direction === "center",
                    "items-end":
                        direction === "bottom" || direction === "right",
                })}
            >
                {renderChildren()}
            </motion.div>
        );
    }
);

Dock.displayName = "Dock";

export interface DockIconProps {
    size?: number;
    magnification?: number;
    distance?: number;
    mouseX?: any;
    mouseY?: any;
    className?: string;
    children?: React.ReactNode;
    orientation?: "horizontal" | "vertical";
    props?: PropsWithChildren;
}

const DockIcon = ({
    size,
    magnification = DEFAULT_MAGNIFICATION,
    distance = DEFAULT_DISTANCE,
    mouseX,
    mouseY,
    className,
    children,
    orientation = "horizontal",
    ...props
}: DockIconProps) => {
    const ref = useRef<HTMLDivElement>(null);

    const distanceCalc = useTransform(
        orientation === "horizontal" ? mouseX : mouseY,
        (val: number) => {
            const bounds = ref.current?.getBoundingClientRect() ?? {
                x: 0,
                y: 0,
                width: 0,
                height: 0,
            };
            const center =
                orientation === "horizontal"
                    ? val - bounds.x - bounds.width / 2
                    : val - bounds.y - bounds.height / 2;
            return center;
        }
    );

    let sizeSync = useTransform(
        distanceCalc,
        [-distance, 0, distance],
        [40, magnification, 40]
    );

    let _size = useSpring(sizeSync, {
        mass: 0.1,
        stiffness: 150,
        damping: 12,
    });

    return (
        <motion.div
            ref={ref}
            style={
                orientation === "horizontal"
                    ? { width: _size }
                    : { height: _size }
            }
            className={cn(
                "flex aspect-square cursor-pointer items-center justify-center rounded-full",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
};

DockIcon.displayName = "DockIcon";

export { Dock, DockIcon, dockVariants };
