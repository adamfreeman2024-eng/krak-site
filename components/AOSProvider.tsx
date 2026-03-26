"use client"

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export const AOSProvider = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      easing: "ease-in-out-quart",
      delay: 100,
    });
  }, []);

  return null; // Он ничего не рисует, только запускает скрипт
};