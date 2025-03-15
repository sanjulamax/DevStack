import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <div className="p-3    border-2 rounded-t-xl bg-white text-black flex flex-col sm:flex-row justify-around align-middle gap-4">
      <div className="flex flex-col items-center sm:items-start">
        <span className="font-semibold">About Me</span>
        <Link target="blank" href="https://sanjulamax.github.io/portfolio/">
          <i className="fa-solid fa-user mr-1"></i>Visit My Portfolio
        </Link>
      </div>
      <div className="flex flex-col items-center sm:items-start">
        <span className="font-semibold">Contact Me</span>
        <Link href="mailto:savinduabeywickrama4@gmail.com">
          <i className="fa-regular fa-envelope mr-1"></i>Email Me
        </Link>
      </div>
      <div className="flex flex-col items-center sm:items-start">
        <span className="font-semibold">Find Me On Social Medias</span>
        <Link
          href="https://www.linkedin.com/in/savindu-abeywickrama-58a828311/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fa-brands fa-linkedin mr-1"></i>linkedin
        </Link>
        <Link target="blank" href="https://github.com/sanjulamax">
          <i className="fa-brands fa-github mr-1"></i>Github
        </Link>
      </div>
      <div className="flex items-center text-center sm:text-left justify-center">
        © 2024 DevStack. All rights reserved.<br></br> Developed By Savindu
        Abeywickrama
      </div>
    </div>
  );
};

export default Footer;
