import Link from "next/link"

export default function PrivacyButton() {
  return (
    <>
      <Link
        href="/privacy"
        className="hover:text-brand underline underline-offset-4"
      >
        Privacy Policy
      </Link>
    </>
  )
}
