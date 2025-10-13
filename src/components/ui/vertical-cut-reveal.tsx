"use client";

import { motion, Variants, Transition } from "framer-motion";
import React, { ReactNode, useEffect, useState } from "react";

interface VerticalCutRevealProps {
  children: ReactNode;
  splitBy?: "words" | "characters";
  className?: string;
  containerClassName?: string;
  staggerDuration?: number;
  staggerFrom?: "first" | "last" | "center" | "random";
  reverse?: boolean;
  transition?: Transition;
}

export function VerticalCutReveal({
  children,
  splitBy = "words",
  className = "",
  containerClassName = "",
  staggerDuration = 0.05,
  staggerFrom = "first",
  reverse = false,
  transition = { type: "spring", stiffness: 100, damping: 10 },
}: VerticalCutRevealProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className={containerClassName}>{children}</div>;
  }

  const getTextNodes = (node: ReactNode): string[] => {
    if (typeof node === "string") {
      if (splitBy === "words") {
        return node.split(/(\s+)/).filter((word) => word.trim() !== "");
      } else {
        return node.split("");
      }
    } else if (Array.isArray(node)) {
      return node.flatMap(getTextNodes);
    } else if (React.isValidElement(node)) {
      // Type-safe access to children
      const children = (node.props as { children?: ReactNode }).children;
      return getTextNodes(children);
    }
    return [];
  };

  const textNodes = getTextNodes(children);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDuration,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
    },
    visible: { 
      opacity: 1, 
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      transition,
    },
  };

  const getStaggerDelay = (index: number) => {
    switch (staggerFrom) {
      case "last":
        return (textNodes.length - 1 - index) * staggerDuration;
      case "center":
        const center = Math.floor(textNodes.length / 2);
        return Math.abs(index - center) * staggerDuration;
      case "random":
        return Math.random() * textNodes.length * staggerDuration;
      case "first":
      default:
        return index * staggerDuration;
    }
  };

  const renderTextNodes = () => {
    const nodes = reverse ? [...textNodes].reverse() : textNodes;
    
    return nodes.map((node, index) => (
      <motion.span
        key={index}
        variants={itemVariants}
        custom={getStaggerDelay(reverse ? textNodes.length - 1 - index : index)}
        className={className}
        style={{
          display: "inline-block",
          whiteSpace: splitBy === "characters" ? "pre" : "normal",
        }}
      >
        {node}
      </motion.span>
    ));
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={containerClassName}
    >
      {renderTextNodes()}
    </motion.div>
  );
}