"use client";
import React from "react";

type SmoothAnchorProps = {
    children: React.ReactNode;
    href: string;
} & React.HTMLAttributes<HTMLAnchorElement>;

export default function SmoothAnchor({
    children,
    href,
    ...props
}: SmoothAnchorProps) {
    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (href) {
            // Target the selected element, then scroll to it
            const target = document.querySelector(href);
            if (target) {
                event.preventDefault();
                target.scrollIntoView({ behavior: "smooth" });
            }
        }
    };

    return (
        <a href={href} onClick={handleClick} {...props}>
            {children}
        </a>
    );
}
