import Navbar from "@components/Navbar";
import Provider from "./Provider";
import "./globals.css";
import { Inter } from "next/font/google";
import Footer from "@components/footer";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MindCanvas:: Nitesh",
  description: "Generated by iamniteshpandit",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <Navbar />
          <div className={"min-h-screen "}>{children}</div>
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
