import Image from "next/image";
import background from "@/assets/TopBG.png";
// import Footer from "@/components/Footer";
import MintERC721 from "@/components/mintpage/mintPhase";
import Community from "@/components/mintpage/Community";

export default function Home() {
  return (
    <div className="relative flex flex-col min-h-screen">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center contrast-200 brightness-50 saturate-200 -z-10"
        style={{
          backgroundImage: `url(${background.src})`,
          backgroundSize: "fill",
          backgroundPosition: "center",
        }}
      >
        <Image
          src={background}
          alt="background"
          fill={true}
          style={{ objectFit: "cover" }}
          placeholder="blur" // Enables the blur placeholder
          blurDataURL={background.blurDataURL} // Automatically generates blur if imported image has it
        />
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-center z-20 pt-10">
        <MintERC721 />
      </div>

      {/* COMMUNITY */}
      <div className="z-20">
        <Community />
      </div>

      {/* Footer */}
      {/* <footer className="w-full z-10">
        <Footer />
      </footer> */}
    </div>
  );
}
