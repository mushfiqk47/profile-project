import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";
import CartDrawer from "@/components/cart/CartDrawer";
import { ToastContainer } from "@/components/ui/Toast";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FreshCart BD — Premium Local Grocery Delivery in Dhaka",
  description: "Fresh hand-picked groceries delivered to your doorstep in Dhaka. Organic produce, local favorites, and daily household essentials.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dmSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var attributesToRemove = ['bis_skin_checked', 'bis_register'];
                var isTargetAttribute = function(name) {
                  return name && (attributesToRemove.indexOf(name) !== -1 || name.indexOf('__processed_') === 0);
                };
                var cleanNode = function(node) {
                  if (node.nodeType === 1) {
                    for (var i = node.attributes.length - 1; i >= 0; i--) {
                      var attr = node.attributes[i];
                      if (isTargetAttribute(attr.name)) {
                        node.removeAttribute(attr.name);
                      }
                    }
                    var descendants = node.querySelectorAll('a, body, div, html');
                    for (var i = 0; i < descendants.length; i++) {
                      var el = descendants[i];
                      for (var j = el.attributes.length - 1; j >= 0; j--) {
                        var attr = el.attributes[j];
                        if (isTargetAttribute(attr.name)) {
                          el.removeAttribute(attr.name);
                        }
                      }
                    }
                  }
                };
                if (typeof document !== 'undefined') {
                  cleanNode(document.documentElement);
                  var observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                      if (mutation.type === 'attributes') {
                        var name = mutation.attributeName;
                        if (isTargetAttribute(name)) {
                          mutation.target.removeAttribute(name);
                        }
                      } else if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(cleanNode);
                      }
                    });
                  });
                  observer.observe(document.documentElement, {
                    attributes: true,
                    childList: true,
                    subtree: true
                  });
                }
              })();
            `
          }}
        />
      </head>
      <body 
        className="min-h-full flex flex-col bg-bg-page text-neutral-900 selection:bg-brand-primary selection:text-brand-primary-foreground"
        suppressHydrationWarning
      >
        <Header />
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        <Footer />
        <MobileNav />
        <CartDrawer />
        <ToastContainer />
      </body>
    </html>
  );
}
