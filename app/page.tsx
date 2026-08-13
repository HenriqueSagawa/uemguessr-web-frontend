import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Idea } from "@/components/idea";
import { HowItWorks } from "@/components/how-it-works";
import { Demo } from "@/components/demo";
import { GameModes } from "@/components/game-modes";
import { Competitive } from "@/components/competitive";
import { Quiz } from "@/components/quiz";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div>
      <Header />
      <main>
        <Hero />
        <Idea />
        <HowItWorks />
        <Demo />
        <GameModes />
        <Competitive />
        <Quiz />
      </main>
      <Footer />
    </div>
  );
}