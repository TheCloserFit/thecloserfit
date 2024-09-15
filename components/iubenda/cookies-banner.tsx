"use client"

import React, { useState } from "react"

import { Icons } from "@/components/icons"

import { Button } from "../ui/button"
import CookieButton from "./cookie"
import PrivacyButton from "./privacy"

const CookiesBanner: React.FC = () => {
  const [acceptedCookies, setAcceptedCookies] = useState<boolean>(
    !!localStorage.getItem("cookiesAccepted")
  )
  const [manageCookiesOpen, setManageCookiesOpen] = useState<boolean>(false)
  const [isOverlayActive, setIsOverlayActive] = useState<boolean>(true)
  const [declineCookiesOpen, setDeclineCookiesOpen] = useState<boolean>(false)

  const acceptAndCloseCookies = () => {
    localStorage.setItem("cookiesAccepted", "true")
    setAcceptedCookies(true)
    setIsOverlayActive(false)
  }

  const toggleManageCookies = () => {
    setManageCookiesOpen(!manageCookiesOpen)
    setIsOverlayActive(true)
  }

  const toggleDeclineCookies = () => {
    setDeclineCookiesOpen(!declineCookiesOpen)
    setIsOverlayActive(true)
  }

  if (acceptedCookies) {
    return null
  }

  if (declineCookiesOpen) {
    return (
      <div>
        {isOverlayActive && (
          <div className="overlay fixed inset-0 bg-black/50 z-50"></div>
        )}
        <div className="fixed bottom-10 inset-x-10 bg-[#DCDCDC] text-black pt-8 px-4 flex md:max-w-[20%] flex-col justify-center z-40 rounded-3xl">
          <p className="">
            Se non accetti i cookies non potrai accedere ad alcuna funzionalità
            del sito. Chiudendo questo banner o cliccando su Accetta, dichiari
            di accettare i cookies presenti, pertanto potrai accedere a tutte le
            funzionalità del sito
          </p>
          <div className="flex justify-around mb-3">
            <button
              onClick={toggleDeclineCookies}
              className="px-4 py-2 text-sm font-light"
            >
              <u>Indietro</u>
            </button>
            <Button onClick={acceptAndCloseCookies}>Accetta</Button>
          </div>
          <button
            className="mt-2 text-xl font-light absolute top-2 right-4"
            onClick={acceptAndCloseCookies}
          >
            <Icons.close className="size-4" />
          </button>
        </div>
      </div>
    )
  }

  if (manageCookiesOpen) {
    return (
      <div>
        {isOverlayActive && (
          <div className="overlay fixed inset-0 bg-black/50 z-40"></div>
        )}
        <div className="fixed bottom-10 inset-x-10 bg-[#DCDCDC] md:max-w-[20%] text-black pt-8 px-4 flex flex-col justify-center z-40 rounded-3xl">
          <p className="">
            La piattaforma The Closer Fit, il sito e tutti i nostri servizi
            ritengono i coookies elencati nella&nbsp;
            <CookieButton />
            &nbsp; essenziali per il funzionamento del sito, per permettere
            all’utente di ricevere un servizio adeguato in merito alle sue
            finalità, e fornire a The Closer Fit un servizio qualitativo. Se non
            accetti non potrai accedere ad alcuna funzionalità del sito.
            Chiudendo questo banner dichiari di accettare.
          </p>
          <div className="flex justify-around mb-3">
            <button
              onClick={toggleDeclineCookies}
              className="px-4 py-2 text-sm font-light"
            >
              <u>Rifiuta</u>
            </button>
            <Button onClick={acceptAndCloseCookies}>Accetta</Button>
          </div>
          <button
            className="mt-2 text-xl font-light absolute top-2 right-4"
            onClick={acceptAndCloseCookies}
          >
            <Icons.close className="size-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {isOverlayActive && (
        <div className="overlay fixed inset-0 bg-black/50 z-40"></div>
      )}
      <div className="fixed bottom-10 inset-x-10 bg-[#DCDCDC] md:max-w-[20%] text-black pt-8 px-4 flex flex-col justify-center z-40 rounded-3xl">
        <p className="">
          Utilizziamo i cookies al fine di raccogliere ed utilizzare dati come
          dichiarato nella&nbsp;
          <PrivacyButton />
          &nbsp; e nella&nbsp;
          <CookieButton />
          &nbsp;che fornisce informazioni dettagliate su come e quando li
          utilizziamo.
        </p>
        <div className="flex justify-around mb-3">
          <button
            className="px-4 py-2 text-sm font-light"
            onClick={toggleManageCookies}
          >
            <u>Gestisci i cookies</u>
          </button>
          <Button onClick={acceptAndCloseCookies}>Accetta</Button>
        </div>
        <button
          className="mt-2 text-xl font-light absolute top-2 right-4"
          onClick={acceptAndCloseCookies}
        >
          <Icons.close className="size-4" />
        </button>
      </div>
    </div>
  )
}

export default CookiesBanner
