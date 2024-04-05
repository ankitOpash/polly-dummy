"use client";
import Image from "next/image";
import React, { useRef, useState } from "react";
import Slider, { Settings } from "react-slick";

interface Props {
  images: string[];
}

const settings: Settings = {
  dots: false,
  lazyLoad: "anticipated",
  infinite: true,
  speed: 100,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  autoplay: false,
  className: "w-[500px]",
};

const keyStr =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

const triplet = (e1: number, e2: number, e3: number) =>
  keyStr.charAt(e1 >> 2) +
  keyStr.charAt(((e1 & 3) << 4) | (e2 >> 4)) +
  keyStr.charAt(((e2 & 15) << 2) | (e3 >> 6)) +
  keyStr.charAt(e3 & 63);

const rgbDataURL = (r: number, g: number, b: number) =>
  `data:image/gif;base64,R0lGODlhAQABAPAA${triplet(0, r, g) + triplet(b, 255, 255)
  }/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`;

export default function ProductImageGallery(props: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { images } = props;
  const slider = useRef<Slider>(null);

  return (
    <div className="border border-solid  lg:h-[38.5rem] flex flex-col justify-between items-center">
      <Slider
        {...settings}
        afterChange={(currentSlide: any) => {
          setCurrentSlide(currentSlide);
        }}
        ref={slider}
      >
        {images.map((img, index) => (
          <Image
            key={index}
            src={`/${img}`}
            alt="testing"
            width={500}
            height={500}
            layout="responsive"
          />
        ))}
      </Slider>
      <div className="flex py-2 gap-2 px-2  border border-solid">
        {images.map((img, index) => (
          <Image
            onClick={() => slider.current?.slickGoTo(index)}
            className={index === currentSlide ? "ring ring-[#009F7F] border-r-2" : "border border-solid"}
            key={index}
            src={`/${img}`}
            alt="testing"
            width={80}
            height={80}
          />
        ))}
      </div>
    </div>
  );
}
