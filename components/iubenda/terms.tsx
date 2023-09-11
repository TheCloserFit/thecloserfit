import Link from "next/link"

export default function TermsButton() {
  return (
    <>
      <Link
        href="https://www.iubenda.com/terms-and-conditions/84472245"
        className="hover:text-brand underline underline-offset-4"
      >
        Terms of Service
      </Link>
    </>
  )
}
