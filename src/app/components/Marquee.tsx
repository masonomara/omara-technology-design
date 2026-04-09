import Image from "next/image";

const set = (
  <>
    <span className="marqueeTitle">Everything changes</span>
    <Image
      className="marqueeWave"
      src="/waves-background.svg"
      alt=""
      height={22}
      width={22}
    />
    <span className="marqueeTitle">Be creative</span>
    <Image
      className="marqueeWave"
      src="/waves-background.svg"
      alt=""
      height={22}
      width={22}
    />
    <span className="marqueeTitle">Explore timeless work</span>
    <Image
      className="marqueeWave"
      src="/waves-background.svg"
      alt=""
      height={22}
      width={22}
    />
  </>
);

export default function Marquee() {
  return (
    <div className="marqueeContainer">
      <div className="marquee">
        {set}
        {set}
        {set}
        {set}
        {set}
        {set}
        {set}
        {set}
        {set}
        {set}
        {set}
        {set}
      </div>
    </div>
  );
}
