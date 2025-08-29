import {
    Zap,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { TooltipTrigger } from "../ui/tooltip";
import { Tooltip, TooltipContent, TooltipProvider } from "../ui/tooltip";
import { InfoItem } from "./InfoItem";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, animate } from "framer-motion";

const formatTime = (seconds: number) => {
    if (seconds < 1) {
        return `${(seconds * 1000).toFixed(0)}ms`;
    } else if (seconds < 60) {
        return `${seconds.toFixed(1)}s`;
    } else if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds.toFixed(1)}s` : `${minutes}m`;
    } else {
        const hours = Math.floor(seconds / 3600);
        const remainingMinutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        if (remainingMinutes === 0 && remainingSeconds === 0) {
            return `${hours}h`;
        } else if (remainingSeconds === 0) {
            return `${hours}h ${remainingMinutes}m`;
        } else {
            return `${hours}h ${remainingMinutes}m ${remainingSeconds.toFixed(1)}s`;
        }
    }
};

function LiveTime({ since, until, className }: { since: Date, until?: Date, className?: string }) {
    const timerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (until) {
            return;
        }
        let requestId: number;
        let cancelled = false;
        const callback = () => {
            const now = new Date();
            const diff = now.getTime() - since.getTime()

            // console.log(diff);
            if (diff > 0) {
                timerRef.current!.textContent = formatTime(diff / 1000);
            } else {
                timerRef.current!.textContent = "";
            }

            if (cancelled) {
                return;
            }

            requestId = requestAnimationFrame(callback);
        }
        requestId = requestAnimationFrame(callback);
        return () => {
            cancelAnimationFrame(requestId);
            cancelled = true;
        }
    }, [since, until]);

    const diff = (until ? until.getTime() - since.getTime() : 0)

    return <motion.div
        initial={{ opacity: 0, y: -10, x: "50%" }}
        animate={{ opacity: 1, y: 0, x: "50%" }}
        exit={{ opacity: 0, y: -10, x: "50%" }}
        className={cn("text-xs text-muted-foreground font-mono", className)} ref={timerRef} >
        {diff > 0 ? formatTime(diff / 1000) : ""}
    </motion.div >;
}

export function RunTimeline({ run }: { run: any }) {
    // Use for testing
    const fakeRun = {
        "status": "not-started",
        "id": "d286e588-69f3-477d-b803-fad3bce4d1aa",
        "created_at": "2025-08-29T02:35:19.907Z",
        "queued_at": "2025-08-29T02:35:24.720Z",
        "started_at": "2025-08-29T02:35:32.483Z",
        "ended_at": "2025-08-29T02:35:38.666Z",

        // "updated_at": "2025-08-29T02:35:38.666Z",
        "workflow_id": "fb8d1f35-2a14-4bec-aca8-71098b251fe9",
        "user_id": "user_2ZA6vuKD3IJXju16oJVQGLBcWwg",
        "org_id": "org_2bWQ1FoWC3Wro391TurkeVG77pC",
        "origin": "public-share",
        "gpu": "A10G",
        "machine_version": null,
        "machine_type": "comfy-deploy-serverless",
        "modal_function_call_id": "fc-01K3STVX2VHDAWPEF6DX41N3SN",
        "webhook_status": null,
        "webhook_intermediate_status": false,
        "batch_id": null,
        "workflow_version_id": "ae27e2c2-9eeb-4250-b2d4-437a8ba76f27",
        // "deployment_id": null,
        // "duration": 18.758887,
        // "comfy_deploy_cold_start": 4.813004,
        // "cold_start_duration": 7.763247,
        // "cold_start_duration_total": 12.576251,
        // "run_duration": 6.182636
    }
    // run = fakeRun;

    const start = run.created_at ? new Date(run.created_at) : undefined;
    const queued = run.queued_at ? new Date(run.queued_at) : undefined;
    const started = run.started_at ? new Date(run.started_at) : undefined;
    const end = run.ended_at ? new Date(run.ended_at) : undefined;

    if (run.status == "cancelled") {
        return (
            <></>
        );
    }

    return (
        <div className="my-12 h-4 flex flex-row bg-gray-200 dark:bg-gray-800 relative">
            <RunTimelineItem start={start} since={start} until={queued} final={end} label="Queue" className="bg-[repeating-linear-gradient(45deg,theme(colors.gray.300)_0px,theme(colors.gray.300)_6px,theme(colors.gray.200)_6px,theme(colors.gray.200)_12px)]" />
            <RunTimelineItem start={start} since={queued} until={started} final={end} label="Cold" className="bg-blue-400" />
            <RunTimelineItem start={start} since={started} until={end} final={end} label="Execution" className="bg-green-400" />

            <div className={cn("text-xs text-muted-foreground font-mono", "absolute -top-6 left-0")}>
                0ms
            </div>
            <motion.div className="absolute left-0 text-xs text-muted-foreground h-[20px] -top-[2px] w-[2px] rounded bg-gray-600">
            </motion.div>
        </div>
    );
}

export function RunTimelineItem({ start, since, until, final, label, className }: { start?: Date, since?: Date, until?: Date, final?: Date, label?: string, className?: string }) {
    const timerRef = useRef<HTMLButtonElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const [evade, setEvade] = useState(false);
    const [hideLabel, setHideLabel] = useState(false);

    useEffect(() => {
        let requestId: number;
        let cancelled = false;
        const callback = () => {
            const now = new Date();

            const finalTime = final ? final.getTime() : now.getTime();

            const total = finalTime - (start ? start.getTime() : 0);

            const width = ((until ? until.getTime() : new Date().getTime()) - since!.getTime()) / total;

            timerRef.current!.style.width = `${width * 100}%`;

            if (width < 0.1) {
                setEvade(true);
            } else {
                setEvade(false);
            }

            if (width < 0.05) {
                setHideLabel(true);
            } else {
                setHideLabel(false);
            }

            if (tooltipRef.current) {
                tooltipRef.current.textContent = formatTime(((until ? until.getTime() : new Date().getTime()) - since!.getTime()) / 1000);
            }

            if (cancelled) {
                return;
            }

            requestId = requestAnimationFrame(callback);
        }
        requestId = requestAnimationFrame(callback);
        return () => {
            cancelled = true;
            cancelAnimationFrame(requestId);
        }
    }, [since, until]);

    return (
        <Tooltip>
            <TooltipContent ref={tooltipRef} className="text-xs text-muted-foreground font-mono">
                {since && formatTime(((until ? until.getTime() : new Date().getTime()) - since!.getTime()) / 1000)}
            </TooltipContent>
            <TooltipTrigger asChild ref={timerRef} className={cn("transition-all shadow-sm duration-200 h-4 relative overflow-visible", className, since ? "" : "bg-gray-200")}>
                <motion.div layout>
                    <AnimatePresence>
                        {start && <LiveTime since={start} until={until} className={cn("transition-all duration-200 absolute -top-6 right-0 w-fit transform translate-x-1/2 whitespace-nowrap z-10", evade ? "-top-10" : "")} />}

                        {!hideLabel && <motion.div className="absolute right-0 text-xs text-muted-foreground h-[20px] -top-[2px] w-[2px] rounded bg-gray-600">
                        </motion.div>}

                        {since && label && !hideLabel && <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute -bottom-6 left-0 text-xs text-muted-foreground"
                        >{label}</motion.div>}
                    </AnimatePresence>
                </motion.div>
            </TooltipTrigger>
        </Tooltip>
    );
}