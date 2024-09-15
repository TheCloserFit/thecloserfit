import Link from "next/link"

export default function CookieButton() {
  return (
    <>
      <Link
        href="https://www.iubenda.com/privacy-policy/84472245"
        className="hover:text-brand underline underline-offset-4"
      >
        Cookie Policy
      </Link>
    </>
  )
}
