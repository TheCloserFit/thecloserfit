import Link from "next/link"

export default function TermsButton() {
  return (
    <>
      <Link
        href="/terms"
        className="hover:text-brand underline underline-offset-4"
      >
        Terms of Service
      </Link>
    </>
  )
}
