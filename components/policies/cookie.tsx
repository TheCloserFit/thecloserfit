import Link from "next/link"

export default function CookieButton() {
  return (
    <>
      <Link
        href="/cookies"
        className="hover:text-brand underline underline-offset-4"
      >
        Cookie Policy
      </Link>
    </>
  )
}
