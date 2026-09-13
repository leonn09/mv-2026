import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./App.css";
import marcusPng from "./assets/Marcus.png";
import bday from "./assets/1stBirthday.png";
import marcusCircle from "./assets/marcusCircle.png";
import church from "./assets/Church.jpg";
import jollibee from "./assets/Jollibee.jpg";
import googleMapsLogo from "./assets/google-maps.svg";

const targetDate = new Date("2026-09-20T10:00:00");

function getTimeRemaining() {
  const difference = targetDate.getTime() - Date.now();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining);
  const [isRsvpModalOpen, setIsRsvpModalOpen] = useState(false);
  const [rsvpChoice, setRsvpChoice] = useState("yes");
  const [guestName, setGuestName] = useState("");
  const [partySize, setPartySize] = useState(1);
  const [comment, setComment] = useState("");
  const [rsvpConfirmation, setRsvpConfirmation] = useState("");
  const openTimerRef = useRef(null);

  useEffect(() => {
    const countdownTimer = window.setInterval(() => {
      setTimeRemaining(getTimeRemaining());
    }, 1000);

    return () => window.clearInterval(countdownTimer);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isRsvpModalOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isRsvpModalOpen]);

  const handleOpen = () => {
    if (openTimerRef.current) {
      window.clearTimeout(openTimerRef.current);
    }

    setIsOpen(true);
    setShowDetails(false);

    openTimerRef.current = window.setTimeout(() => {
      setShowDetails(true);
    }, 900);
  };

  const countdownItems = [
    { label: "Days", value: timeRemaining.days },
    { label: "Hours", value: timeRemaining.hours },
    { label: "Mins", value: timeRemaining.minutes },
    { label: "Secs", value: timeRemaining.seconds },
  ];

  const handleRsvpSubmit = (event) => {
    event.preventDefault();

    const trimmedName = guestName.trim();
    const payload = {
      attending: rsvpChoice === "yes",
      guestName: trimmedName || "Guest",
      partySize: Number(partySize) || 1,
      comment: comment.trim(),
      submittedAt: new Date().toISOString(),
    };

    console.log("RSVP payload for future Google Sheets integration:", payload);
    setRsvpConfirmation(trimmedName || "Guest");
    setIsRsvpModalOpen(false);
    setGuestName("");
    setPartySize(1);
    setComment("");
    setRsvpChoice("yes");
  };

  const modal = isRsvpModalOpen
    ? createPortal(
        <div
          className="rsvp-overlay"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: "rgba(15, 23, 42, 0.48)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            margin: 0,
            width: "100vw",
            height: "100vh",
          }}
        >
          <div className="rsvp-modal">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#60cdee]">RSVP</p>
                <h4 className="mt-2 font-serif text-3xl text-slate-800">Will you be coming?</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsRsvpModalOpen(false)}
                className="text-xl text-slate-400 transition hover:text-slate-600"
                aria-label="Close RSVP form"
              >
                ×
              </button>
            </div>

            <form className="mt-5 space-y-4" onSubmit={handleRsvpSubmit}>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex cursor-pointer items-center gap-2 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm font-medium text-slate-700">
                  <input
                    type="radio"
                    name="attendance"
                    value="yes"
                    checked={rsvpChoice === "yes"}
                    onChange={() => setRsvpChoice("yes")}
                  />
                  Yes, I will come
                </label>

                <label className="flex cursor-pointer items-center gap-2 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm font-medium text-slate-700">
                  <input
                    type="radio"
                    name="attendance"
                    value="no"
                    checked={rsvpChoice === "no"}
                    onChange={() => setRsvpChoice("no")}
                  />
                  Sorry, cannot make it
                </label>
              </div>

              {rsvpChoice === "yes" ? (
                <>
                  <label className="block text-sm font-medium text-slate-700">
                    Full name
                    <input
                      type="text"
                      value={guestName}
                      onChange={(event) => setGuestName(event.target.value)}
                      placeholder="Your name"
                      className="mt-2 w-full rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-slate-700 outline-none ring-0 transition focus:border-[#60cdee]"
                      required
                    />
                  </label>

                  <label className="block text-sm font-medium text-slate-700">
                    Number of guests attending
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={partySize}
                      onChange={(event) => setPartySize(event.target.value)}
                      className="mt-2 w-full rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-slate-700 outline-none transition focus:border-[#60cdee]"
                      required
                    />
                  </label>

                  <label className="block text-sm font-medium text-slate-700">
                    Message / note
                    <textarea
                      value={comment}
                      onChange={(event) => setComment(event.target.value)}
                      rows="4"
                      placeholder="Leave a short note for the family"
                      className="mt-2 w-full rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-slate-700 outline-none transition focus:border-[#60cdee]"
                    />
                  </label>
                </>
              ) : (
                <div className="rounded-2xl border border-dashed border-sky-200 bg-sky-50 p-4 text-sm text-slate-600">
                  No worries. We’ll still celebrate with you in spirit.
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRsvpModalOpen(false)}
                  className="rounded-full border border-slate-200 px-5 py-2.5 font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#60cdee] px-5 py-2.5 font-semibold uppercase text-white shadow-lg shadow-violet-300/40 transition hover:scale-[1.02]"
                  style={{ letterSpacing: "0.12em" }}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body,
      )
    : null;

  if (showDetails) {
    return (
      <>
        <div className="pointer-events-none fixed bottom-0 right-0 z-50 w-full">
          <div className="relative flex h-[38vh] items-end justify-end overflow-visible">
            <div className="absolute inset-x-0 bottom-0 h-[50%] bg-linear-to-t from-[#f7ebdf] via-[#f7ebdf]/80 to-transparent" />
            <div className="relative z-10 flex w-full items-end justify-between gap-6 px-4 sm:px-8 md:px-12">
              <div className="flex items-center justify-center pb-2">
                <img src={bday} alt="1st birthday theme" className="max-w-60 sm:max-w-70 md:max-w-80" />
              </div>
              <img
                src={marcusPng}
                alt="Marcus"
                className="h-[28vh] w-auto object-contain drop-shadow-[0_18px_25px_rgba(120,53,15,0.16)] sm:h-[32vh] md:h-[40vh]"
              />
            </div>
          </div>
        </div>

        <main
          className="relative z-10 min-h-screen px-5 pt-8 pb-30 text-slate-800 md:px-8 sm:pb-60"
          style={{
            background: "transparent",
          }}
        >
          <div className="reveal-in">
            <div
          className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-5 md:grid-cols-2"
          style={{ minHeight: "78vh" }}
        >
          <section className="flex flex-col items-center p-6 md:p-10">
            <img
              src={marcusCircle}
              alt="Marcus portrait"
              className="my-2 w-40 rounded-full border border-cyan-50 shadow-xl"
            />
            <h1 className="font-serif text-4xl leading-tight text-slate-800 md:text-6xl">Marcus Vik</h1>
            <p className="text-lg">
              is turning <span className="font-bold">ONE</span>
            </p>
            <p className="mt-2 text-center text-sm text-slate-800">
              Please join us as we celebrate the Christening and 1st Birthday of our son.
            </p>

            <div className="mt-6 w-full max-w-xs rounded-2xl border border-sky-200 bg-white/70 p-4 text-center shadow-sm backdrop-blur-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#60cdee]">Countdown</p>
              <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                {countdownItems.map((item) => (
                  <div key={item.label} className="rounded-xl bg-sky-50 px-2 py-3">
                    <div className="font-serif text-xl text-slate-800 md:text-2xl">{item.value}</div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-4 rounded-3xl p-4 md:p-5">
            <div className="relative overflow-hidden rounded-2xl border border-white/60 bg-cyan-50">
              <img src={church} alt="Church" className="absolute inset-0 h-full w-full object-cover opacity-5" />

              <div className="relative z-10 flex flex-col items-center p-5 md:p-6">
                <h2 className="font-serif text-3xl text-slate-800 md:text-3xl">Christening</h2>
                <p className="mt-1 text-slate-600">September 20, 2026</p>
                <p className="text-slate-600">10:00 AM</p>
                <h2 className="mt-4 font-serif text-xl text-slate-800 md:text-2xl">Sto. Rosario Parish</h2>
                <p className="mt-1 text-slate-600">Amaya V, Tanza, Cavite</p>
                <a
                  href="https://maps.google.com/?q=Sto.+Rosario+Parish+Amaya+V+Tanza+Cavite"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open the church location in Google Maps"
                  className="mt-5 flex items-center rounded-full bg-[#60cdee] px-6 py-3 font-semibold uppercase text-white shadow-lg shadow-violet-300/40 transition hover:scale-[1.02]"
                  style={{ letterSpacing: "0.14em" }}
                >
                  Google Maps
                  <img src={googleMapsLogo} alt="Google Maps" className="ml-1 w-4" />
                </a>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-white/60 bg-cyan-50">
              <img src={jollibee} alt="Jollibee" className="absolute inset-0 h-full w-full object-cover opacity-5" />

              <div className="relative z-10 flex flex-col items-center p-5 md:p-6">
                <h2 className="font-serif text-3xl text-slate-800 md:text-3xl">Birthday Party</h2>
                <p className="mt-1 text-slate-600">September 20, 2026</p>
                <p className="text-slate-600">1:00 PM</p>
                <h2 className="mt-4 font-serif text-xl text-slate-800 md:text-2xl">Jollibee Sahud Ulan</h2>
                <p className="mt-1 text-center text-slate-600">Antero Soriano Highway, Sahud Ulan, Tanza, Cavite</p>
                <a
                  href="https://maps.google.com/?q=Jollibee+Sahud+Ulan+Tanza+Cavite"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open the party venue in Google Maps"
                  className="mt-5 flex items-center rounded-full bg-[#60cdee] px-6 py-3 font-semibold uppercase text-white shadow-lg shadow-violet-300/40 transition hover:scale-[1.02]"
                  style={{ letterSpacing: "0.14em" }}
                >
                  Google Maps
                  <img src={googleMapsLogo} alt="Google Maps" className="ml-1 w-4" />
                </a>
              </div>
            </div>
          </section>

          <section className="flex justify-around rounded-3xl p-6 md:p-10">
            <div>
              <p className="my-2 font-serif text-2xl" style={{ letterSpacing: "0.15em" }}>Ninang</p>
              <ul className="text-slate-600">
                <li>Vienna</li>
                <li>Gwen</li>
                <li>Isay</li>
                <li>Aubrey</li>
                <li>Diana</li>
                <li>Vhia</li>
                <li>Yam</li>
                <li>Denxia</li>
                <li>Sopai</li>
                <li>Nympha</li>
              </ul>
            </div>

            <div>
              <p className="my-2 font-serif text-2xl" style={{ letterSpacing: "0.15em" }}>Ninong</p>
              <ul className="text-slate-600">
                <li>Chubz</li>
                <li>Kirt</li>
                <li>Rhovel</li>
                <li>Carlo</li>
                <li>Kuya Jek</li>
                <li>Kuya Gab</li>
                <li>Ron Lester</li>
                <li>Jhozel</li>
                <li>Jimwel</li>
                <li>Dragon Carlo</li>
              </ul>
            </div>
          </section>

          <section className="relative flex flex-col items-center justify-center overflow-hidden rounded-3xl p-6 md:p-10">
            <h2 className="mt-2 font-serif text-2xl text-slate-800 md:text-3xl">Gift Registry</h2>
            <div className="mt-3 flex flex-col items-center text-center text-[#60cdee]">
              <p>Marcus Vik&apos;s</p>
              <p>1st Birthday &amp; Baptismal</p>
              <svg width="561" height="139" viewBox="0 0 561 139" fill="currentColor" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="GiftList" class="h-6 w-24.25 md:h-7 md:w-28.25"><g transform="translate(0, 18.5) scale(0.75)"><path d="M108.665 138.5H91.6602C91.7048 137.66 91.7089 136.815 91.6718 135.965L89.0646 83.2678C109.219 96.4354 110.583 115.484 110.583 116.189L119.768 115.823C119.768 114.857 118.914 95.4818 100.187 80.1268L138.5 81.3076V108.665C138.5 125.142 125.142 138.5 108.665 138.5Z"></path><path d="M138.5 72.172V29.8349C138.5 13.3575 125.142 0 108.665 0H84.9449L87.5315 52.281C90.3683 47.1331 94.3568 42.2172 99.9345 39.0085C109.853 33.1559 117.568 36.448 121.609 41.2032C127.12 47.4215 126.753 57.2977 121.242 63.8818C118.59 66.919 115.41 69.3364 111.653 71.3406L138.5 72.172Z"></path><path d="M57.682 115.823C59.7659 98.8776 77.6116 84.5479 79.8636 83.0344L82.4875 136.331C82.5364 137.061 82.5332 137.786 82.4805 138.5H29.8348C13.3575 138.5 0 125.142 0 108.665V77.0506H0.369493L69.9544 79.1951C63.0801 85.3691 50.4571 98.5609 48.4977 114.726L57.682 115.823Z"></path><path d="M50.383 69.4434C48.3036 68.1096 46.3428 66.629 44.4497 64.9797C36.7349 58.3956 34.1633 48.8852 38.2044 42.6669C41.5108 37.5459 49.9603 34.2538 63.553 40.4722C70.3675 43.7233 75.152 49.2687 78.4791 54.913L75.7756 0H29.8349C13.3575 0 0 13.3575 0 29.8348V67.9058C0.000709341 67.9059 0.00141859 67.906 0.00212776 67.906H0.736887L50.383 69.4434Z"></path><path d="M104.71 46.69C106.547 45.5926 108.384 44.861 110.221 44.861C112.058 44.861 113.527 45.5926 114.629 47.4215C116.834 49.6162 117.201 54.3714 114.262 58.0293C110.221 62.7845 103.608 65.7107 91.1176 68.637C92.9544 61.6871 96.6281 51.4452 104.71 46.69Z"></path><path d="M50.3277 45.9589C48.1234 45.9589 47.0213 46.6905 46.2866 47.4221C44.8171 49.6168 46.2866 54.0062 50.695 58.0298C56.573 63.1508 63.9204 66.4428 74.9415 68.6376C72.7373 62.0534 68.3289 52.543 59.8793 48.5194C56.2056 46.6905 52.8993 45.9589 50.3277 45.9589Z"></path></g><path d="M179.41 113.61Q170.095 113.61 162.678 109.297Q155.26 104.985 150.947 96.417Q146.635 87.85 146.635 74.855Q146.635 65.31 149.108 57.892Q151.58 50.475 156.353 45.242Q161.125 40.01 168.14 37.25Q175.155 34.49 184.355 34.49Q191.255 34.49 196.89 36.1Q202.525 37.71 206.665 40.7Q210.805 43.69 213.163 47.888Q215.52 52.085 215.75 57.375L200.11 62.205Q199.88 57.375 197.637 54.27Q195.395 51.165 191.773 49.612Q188.15 48.06 183.665 48.06Q177.455 48.06 173.027 50.877Q168.6 53.695 166.3 59.502Q164 65.31 164 74.165Q164 80.95 165.322 85.838Q166.645 90.725 169.29 93.945Q171.935 97.165 175.615 98.718Q179.295 100.27 184.125 100.27Q189.185 100.27 192.923 98.602Q196.66 96.935 198.903 93.428Q201.145 89.92 201.375 84.515H187V72.555H217.705V86.47V112H206.205L206.435 92.565H204.365Q202.525 99.465 199.42 104.123Q196.315 108.78 191.428 111.195Q186.54 113.61 179.41 113.61ZM230.01 112V51.625H246.57V112ZM238.405 42.54Q233.575 42.54 230.988 40.528Q228.4 38.515 228.4 34.605Q228.4 30.58 230.988 28.51Q233.575 26.44 238.405 26.44Q243.35 26.44 245.938 28.51Q248.525 30.58 248.525 34.605Q248.525 38.4 245.938 40.47Q243.35 42.54 238.405 42.54ZM264.74 112V73.36H255.195V61.17L271.295 61.86V59.675Q267.27 58.755 264.683 56.742Q262.095 54.73 260.945 51.855Q259.795 48.98 259.795 45.76Q259.795 40.815 262.325 37.192Q264.855 33.57 269.455 31.557Q274.055 29.545 280.265 29.545Q285.555 29.545 289.868 30.867Q294.18 32.19 296.825 34.145L295.79 49.095Q293.03 47.14 289.58 45.875Q286.13 44.61 283.025 44.61Q279.575 44.61 277.332 46.45Q275.09 48.29 275.09 52.43Q275.09 55.305 276.298 56.972Q277.505 58.64 279.288 59.388Q281.07 60.135 282.795 60.365H296.595V73.36H280.84V112ZM328.105 113.38Q317.985 113.38 313.213 108.032Q308.44 102.685 308.44 90.955V64.62H299.7L299.93 51.625H306.025Q309.59 51.625 311.315 50.59Q313.04 49.555 313.385 46.795L314.88 38.17H324.31V51.625H339.605V65.08H324.31V90.265Q324.31 94.405 326.265 96.245Q328.22 98.085 332.245 98.085Q334.43 98.085 336.443 97.625Q338.455 97.165 339.95 96.13V111.54Q336.385 112.69 333.395 113.035Q330.405 113.38 328.105 113.38ZM350.415 112V36.1H366.975V112ZM353.865 112V98.085H399.06V112ZM406.19 112V51.625H422.75V112ZM414.585 42.54Q409.755 42.54 407.168 40.528Q404.58 38.515 404.58 34.605Q404.58 30.58 407.168 28.51Q409.755 26.44 414.585 26.44Q419.53 26.44 422.118 28.51Q424.705 30.58 424.705 34.605Q424.705 38.4 422.118 40.47Q419.53 42.54 414.585 42.54ZM460.47 113.61Q454.375 113.61 449.43 112.46Q444.485 111.31 440.92 109.125Q437.355 106.94 435.17 103.892Q432.985 100.845 432.295 97.05L444.945 91.875Q445.405 94.405 447.475 96.59Q449.545 98.775 453.053 100.097Q456.56 101.42 461.505 101.42Q466.795 101.42 469.67 99.868Q472.545 98.315 472.545 95.44Q472.545 93.255 470.935 91.99Q469.325 90.725 466.22 89.805Q463.115 88.885 458.745 88.08Q454.49 87.045 450.062 85.895Q445.635 84.745 441.898 82.675Q438.16 80.605 435.803 77.212Q433.445 73.82 433.445 68.53Q433.445 63.01 436.435 58.87Q439.425 54.73 445.175 52.373Q450.925 50.015 459.205 50.015Q466.68 50.015 472.315 52.028Q477.95 54.04 481.573 57.778Q485.195 61.515 486.46 66.69L473.005 71.175Q472.545 68.415 470.763 66.345Q468.98 64.275 466.048 63.24Q463.115 62.205 459.205 62.205Q454.26 62.205 451.558 63.815Q448.855 65.425 448.855 68.07Q448.855 70.255 450.638 71.635Q452.42 73.015 455.64 73.877Q458.86 74.74 463.23 75.66Q467.83 76.58 472.2 77.787Q476.57 78.995 480.078 80.95Q483.585 82.905 485.655 86.125Q487.725 89.345 487.725 94.405Q487.725 100.385 484.505 104.698Q481.285 109.01 475.19 111.31Q469.095 113.61 460.47 113.61ZM519.58 113.38Q509.46 113.38 504.688 108.032Q499.915 102.685 499.915 90.955V64.62H491.175L491.405 51.625H497.5Q501.065 51.625 502.79 50.59Q504.515 49.555 504.86 46.795L506.355 38.17H515.785V51.625H531.08V65.08H515.785V90.265Q515.785 94.405 517.74 96.245Q519.695 98.085 523.72 98.085Q525.905 98.085 527.918 97.625Q529.93 97.165 531.425 96.13V111.54Q527.86 112.69 524.87 113.035Q521.88 113.38 519.58 113.38Z"></path></svg>
            </div>
            <a
              href="https://giftlist.com/l/CK8pHWD5b2"
              target="_blank"
              rel="noreferrer"
              className="z-10 mt-2 flex rounded-full bg-[#60cdee] px-6 py-3 font-semibold uppercase text-white shadow-lg shadow-violet-300/40 transition hover:scale-[1.02]"
              style={{ letterSpacing: "0.14em" }}
            >
              Check here
            </a>
            <p className="mt-5 text-center">Other gifts and monetary gifts are also accepted.</p>
          </section>
        </div>

        <section className="mx-auto mt-5 max-w-6xl rounded-3xl border border-sky-100 bg-white/75 p-5 shadow-sm backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div>
              <h3 className="mt-2 font-serif text-2xl text-slate-800">We would love to celebrate with you.</h3>
            </div>

            <button
              type="button"
              onClick={() => setIsRsvpModalOpen(true)}
              className="rounded-full bg-[#60cdee] px-6 py-3 font-semibold uppercase text-white shadow-lg shadow-violet-300/40 transition hover:scale-[1.02]"
              style={{ letterSpacing: "0.14em" }}
            >
              RSVP
            </button>
          </div>

          {rsvpConfirmation ? (
            <p className="mt-4 text-center text-sm font-medium text-slate-700 md:text-left">
              Thank you, {rsvpConfirmation}! Your RSVP has been recorded and is ready to be connected to Google Sheets.
            </p>
          ) : null}
        </section>

          </div>
        </main>
        {modal}
      </>
    );
  }

  return (
    <>
      <main
        className="flex min-h-screen items-center justify-center p-6"
        style={{
          background: "linear-gradient(180deg, #dff9ff 0%, #c8f1ff 38%, #f5fbff 100%)",
        }}
      >
        <button
          type="button"
          onClick={handleOpen}
          aria-label="Open invitation"
          className="flex cursor-pointer flex-col items-center gap-4 border-none bg-transparent p-0"
        >
          <div
            className="relative"
            style={{
              width: "min(78vw, 540px)",
              height: "min(42vw, 320px)",
              minHeight: "240px",
              maxHeight: "320px",
              perspective: "1000px",
            }}
          >
            <div
              className="absolute inset-x-0 bottom-0 z-10 overflow-hidden rounded-b-[28px]"
              aria-hidden="true"
              style={{
                height: "72%",
                background: "linear-gradient(180deg, #8fe3ff 0%, #60cdee 28%, #35c4ec 100%)",
                boxShadow: "0 24px 38px rgba(37, 99, 235, 0.15)",
              }}
            >
              <div
                className="absolute inset-y-0 left-0 w-1/2"
                style={{
                  clipPath: "polygon(0 0, 100% 50%, 0 100%)",
                  background: "linear-gradient(90deg, rgba(19, 103, 146, 0.38) 0%, rgba(96, 205, 238, 0.18) 100%)",
                }}
              />
              <div
                className="absolute inset-y-0 right-0 w-1/2"
                style={{
                  clipPath: "polygon(100% 0, 0 50%, 100% 100%)",
                  background: "linear-gradient(270deg, rgba(19, 103, 146, 0.38) 0%, rgba(96, 205, 238, 0.14) 100%)",
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  clipPath: "polygon(0 100%, 50% 43%, 100% 100%)",
                  background: "linear-gradient(180deg, rgba(255,255,255,0.22), rgba(18, 136, 176, 0.12))",
                }}
              />
            </div>

            <div
              className="absolute left-0 w-full origin-top transition-transform duration-700 ease-out"
              style={{
                top: "28%",
                height: "42%",
                zIndex: isOpen ? 5 : 30,
                clipPath: "polygon(0 0, 50% 100%, 100% 0)",
                background: "linear-gradient(180deg, #a8ebff 0%, #60cdee 36%, #35c4ec 100%)",
                boxShadow: "inset 0 -10px 18px rgba(18, 128, 166, 0.14)",
                transform: isOpen ? "rotateX(-180deg)" : "rotateX(0deg)",
                transformOrigin: "top center",
              }}
              aria-hidden="true"
            />

            <div
              className="absolute inset-x-0 bottom-[12%] z-20 flex items-center justify-center px-5 text-center"
              style={{
                opacity: isOpen ? 1 : 0,
                transition: "opacity 420ms ease, transform 900ms cubic-bezier(0.22,1,0.36,1)",
                transform: isOpen ? "translateY(-120px) scale(1.12)" : "translateY(32px) scale(0.8)",
              }}
            >
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-white/40 blur-md" style={{ width: "92px", height: "92px" }} />
                <img
                  src={marcusCircle}
                  alt="Marcus portrait"
                  className="relative h-24 w-24 rounded-full border-4 border-white object-cover shadow-[0_14px_30px_rgba(96,205,238,0.35)]"
                  style={{
                    transform: isOpen ? "scale(1.08)" : "scale(0.9)",
                    transition: "transform 900ms cubic-bezier(0.22,1,0.36,1)",
                  }}
                />
              </div>
            </div>

            <div
              className={`absolute left-1/2 z-40 grid -translate-x-1/2 place-items-center rounded-full bg-white text-2xl text-[#60cdee] transition-all duration-300 ${
                isOpen ? "scale-90 opacity-0" : "scale-100 opacity-100"
              }`}
              style={{
                top: "53%",
                width: "62px",
                height: "62px",
                boxShadow: "0 12px 24px rgba(30, 41, 59, 0.12)",
              }}
              aria-hidden="true"
            >
              ✦
            </div>
          </div>

          <span
            className={`text-xs font-medium uppercase text-[#60cdee]/80 transition-all duration-300 ${
              isOpen ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
            style={{ letterSpacing: "0.3em", minHeight: "1.2rem" }}
          >
            Click to open
          </span>
        </button>
      </main>

      {modal}
    </>
  );

  return (
    <main
      className="flex min-h-screen items-center justify-center p-6"
      style={{
        background: "linear-gradient(180deg, #dff9ff 0%, #c8f1ff 38%, #f5fbff 100%)",
      }}
    >
      <button
        type="button"
        onClick={handleOpen}
        aria-label="Open invitation"
        className="flex cursor-pointer flex-col items-center gap-4 border-none bg-transparent p-0"
      >
        <div
          className="relative"
          style={{
            width: "min(78vw, 540px)",
            height: "min(42vw, 320px)",
            minHeight: "240px",
            maxHeight: "320px",
            perspective: "1000px",
          }}
        >
          <div
            className="absolute inset-x-0 bottom-0 z-10 overflow-hidden rounded-b-[28px]"
            aria-hidden="true"
            style={{
              height: "72%",
              background: "linear-gradient(180deg, #8fe3ff 0%, #60cdee 28%, #35c4ec 100%)",
              boxShadow: "0 24px 38px rgba(37, 99, 235, 0.15)",
            }}
          >
            <div
              className="absolute inset-y-0 left-0 w-1/2"
              style={{
                clipPath: "polygon(0 0, 100% 50%, 0 100%)",
                background: "linear-gradient(90deg, rgba(19, 103, 146, 0.38) 0%, rgba(96, 205, 238, 0.18) 100%)",
              }}
            />
            <div
              className="absolute inset-y-0 right-0 w-1/2"
              style={{
                clipPath: "polygon(100% 0, 0 50%, 100% 100%)",
                background: "linear-gradient(270deg, rgba(19, 103, 146, 0.38) 0%, rgba(96, 205, 238, 0.14) 100%)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                clipPath: "polygon(0 100%, 50% 43%, 100% 100%)",
                background: "linear-gradient(180deg, rgba(255,255,255,0.22), rgba(18, 136, 176, 0.12))",
              }}
            />
          </div>

          <div
            className="absolute left-0 w-full origin-top transition-transform duration-700 ease-out"
            style={{
              top: "28%",
              height: "42%",
              zIndex: isOpen ? 5 : 30,
              clipPath: "polygon(0 0, 50% 100%, 100% 0)",
              background: "linear-gradient(180deg, #a8ebff 0%, #60cdee 36%, #35c4ec 100%)",
              boxShadow: "inset 0 -10px 18px rgba(18, 128, 166, 0.14)",
              transform: isOpen ? "rotateX(-180deg)" : "rotateX(0deg)",
              transformOrigin: "top center",
            }}
            aria-hidden="true"
          />

          <div
            className="absolute inset-x-0 bottom-[12%] z-20 flex items-center justify-center px-5 text-center"
            style={{
              opacity: isOpen ? 1 : 0,
              transition: "opacity 420ms ease, transform 900ms cubic-bezier(0.22,1,0.36,1)",
              transform: isOpen ? "translateY(-120px) scale(1.12)" : "translateY(32px) scale(0.8)",
            }}
          >
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-white/40 blur-md" style={{ width: "92px", height: "92px" }} />
              <img
                src={marcusCircle}
                alt="Marcus portrait"
                className="relative h-24 w-24 rounded-full border-4 border-white object-cover shadow-[0_14px_30px_rgba(96,205,238,0.35)]"
                style={{
                  transform: isOpen ? "scale(1.08)" : "scale(0.9)",
                  transition: "transform 900ms cubic-bezier(0.22,1,0.36,1)",
                }}
              />
            </div>
          </div>

          <div
            className={`absolute left-1/2 z-40 grid -translate-x-1/2 place-items-center rounded-full bg-white text-2xl text-[#60cdee] transition-all duration-300 ${
              isOpen ? "scale-90 opacity-0" : "scale-100 opacity-100"
            }`}
            style={{
              top: "53%",
              width: "62px",
              height: "62px",
              boxShadow: "0 12px 24px rgba(30, 41, 59, 0.12)",
            }}
            aria-hidden="true"
          >
            ✦
          </div>
        </div>

        <span
          className={`text-xs font-medium uppercase text-[#60cdee]/80 transition-all duration-300 ${
            isOpen ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
          style={{ letterSpacing: "0.3em", minHeight: "1.2rem" }}
        >
          Click to open
        </span>
      </button>
    </main>
  );
}

export default App;
