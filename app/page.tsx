// app/page.tsx

// 1. Import the NAMED export { RateCalculatorUI } using curly braces
// 2. Point to the correct file in this folder: "./homepage-backup"
import { RateCalculatorUI } from "./homepage-backup";

// 3. Render that component
export default function HomePage() {
  return <RateCalculatorUI />;
}
