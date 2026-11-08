export function ScienceArt() {
  return (
    <div
      className="science-art"
      role="img"
      aria-label="Ilustración de una planta creciendo entre órbitas científicas y formas celulares"
    >
      <div className="art-grid" />
      <svg viewBox="0 0 560 470" fill="none" aria-hidden="true">
        <defs>
          <linearGradient
            id="leaf"
            x1="100"
            y1="100"
            x2="420"
            y2="450"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#b6d8a6" />
            <stop offset="1" stopColor="#23765d" />
          </linearGradient>
          <linearGradient id="leaf2">
            <stop stopColor="#427a5e" />
            <stop offset="1" stopColor="#88b78c" />
          </linearGradient>
          <radialGradient id="orb">
            <stop stopColor="#f5fbef" />
            <stop offset="1" stopColor="#b9d5b0" />
          </radialGradient>
        </defs>
        <circle cx="285" cy="237" r="183" fill="#e8efe2" />
        <circle
          cx="285"
          cy="237"
          r="207"
          stroke="#a8c1a9"
          strokeDasharray="3 8"
        />
        <ellipse
          cx="285"
          cy="237"
          rx="225"
          ry="94"
          transform="rotate(-35 285 237)"
          stroke="#a1b9a1"
        />
        <ellipse
          cx="285"
          cy="237"
          rx="132"
          ry="205"
          transform="rotate(-35 285 237)"
          stroke="#c0d0ba"
        />
        <path
          d="M282 401C292 311 281 220 316 115"
          stroke="#346c4e"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M292 287C195 289 144 218 151 148C245 151 300 199 292 287Z"
          fill="url(#leaf)"
        />
        <path
          d="M289 283L167 166M235 231L235 182M234 231L188 230M264 259L267 214"
          stroke="#467a54"
          strokeWidth="2"
          opacity=".6"
        />
        <path
          d="M293 234C288 157 341 95 414 80C426 163 386 227 293 234Z"
          fill="url(#leaf2)"
        />
        <path
          d="M298 229L403 96M341 175L339 130M342 175L391 160M319 201L364 197"
          stroke="#c2dab3"
          strokeWidth="2"
          opacity=".65"
        />
        <path
          d="M284 346C224 349 186 313 181 271C242 267 281 296 284 346Z"
          fill="url(#leaf2)"
        />
        <path
          d="M289 319C294 263 339 240 380 246C368 297 336 325 289 319Z"
          fill="url(#leaf)"
        />
        <path
          d="M282 396L265 415M282 396L301 417M282 396V424"
          stroke="#346c4e"
          strokeWidth="3"
        />
        <ellipse cx="281" cy="424" rx="85" ry="8" fill="#234d32" opacity=".1" />
        <circle cx="102" cy="288" r="22" fill="url(#orb)" />
        <circle cx="457" cy="184" r="12" fill="#62947b" />
        <circle cx="355" cy="421" r="7" fill="#d9b46d" />
        <circle cx="150" cy="70" r="5" fill="#6c9782" />
        <path
          d="M431 335l18-10 18 10v20l-18 10-18-10zM467 335l18-10 18 10v20l-18 10-18-10M449 325v-21"
          stroke="#a9bba3"
          strokeWidth="2"
        />
        <path
          d="M76 154h20m-10-10v20M406 50h14m-7-7v14"
          stroke="#92ae96"
          strokeWidth="2"
        />
      </svg>
      <span className="art-label label-top">
        <span className="tiny-dot" /> La curiosidad es el comienzo
      </span>
      <span className="art-label label-bottom">
        <span className="mini-icon">✳</span> Todo está conectado.
        <small>Descubre cómo.</small>
      </span>
      <span className="art-coordinate">VIDA · CIENCIA · NATURALEZA</span>
    </div>
  );
}
