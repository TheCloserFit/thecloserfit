import { OnboardinFile } from "@/components/onboarding/file"

export default function OnboardingPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="font-heading text-5xl underline decoration-primary md:text-6xl">
        Resume
      </h1>
      <OnboardinFile redirect="/interviews" />
    </div>
  )
}
