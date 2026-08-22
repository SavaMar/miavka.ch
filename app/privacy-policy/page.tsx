import type { Metadata } from "next";
import Nav from "@/components/Nav";
import PersonalFooter from "@/components/home/PersonalFooter";

export const metadata: Metadata = {
  title: "Privacy Policy | Mari Miavka",
  description: "Privacy policy for Mari Miavka website forms and communication.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Nav />
      <main className="min-h-[70vh] bg-[#F4F4F0] px-6 pb-20 pt-10 text-brand-black md:px-10 md:pb-24 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <h1
            className="uppercase text-[clamp(2rem,5vw,4rem)] leading-[0.95]"
            style={{ fontFamily: "'TG Girthy', Impact, sans-serif" }}
          >
            Privacy policy
          </h1>
          <div
            className="mt-6 space-y-4 text-sm leading-relaxed text-ui-gray-700 md:text-base"
            style={{ fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif" }}
          >
            <p>
              When you submit a form on this website, I collect the information
              you provide (such as your name, email address, and message) to
              respond to you and deliver requested content.
            </p>
            <p>
              If you subscribe to notes or newsletter updates, your email may be
              used to send relevant updates, including occasional mentions of my
              books, apps, and courses.
            </p>
            <p>
              You can opt out of newsletter emails at any time using the
              unsubscribe link in any email.
            </p>
            <p>
              I do not sell your personal data. Data is processed only for
              communication and service delivery related to this website.
            </p>
            <p>
              For any privacy-related request, contact me directly via the
              contact page.
            </p>
          </div>
        </div>
      </main>
      <PersonalFooter />
    </>
  );
}
