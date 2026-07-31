# -*- coding: utf-8 -*-
"""Generate pages/login.html with proper UTF-8 Arabic (avoids tool encoding corruption)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "pages" / "login.html"

# All Arabic via Unicode escapes so this file stays ASCII-safe.
T = {
    "title_ar": "\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644 \u2014 Solvfast PMS",
    "hero_title": "\u0623\u062f\u0650\u0631 \u0641\u0646\u062f\u0642\u0643<br />\u0628\u0630\u0643\u0627\u0621 \u0623\u0643\u0628\u0631",
    "hero_desc": (
        "\u062a\u062d\u0643\u0645 \u0628\u0627\u0644\u062d\u062c\u0648\u0632\u0627\u062a\u060c "
        "\u0631\u0627\u0642\u0628 \u0627\u0644\u0625\u0634\u063a\u0627\u0644\u060c "
        "\u0648\u062d\u0633\u0651\u0646 \u0627\u0644\u062a\u0633\u0639\u064a\u0631 "
        "\u0641\u064a \u0627\u0644\u0648\u0642\u062a \u0627\u0644\u0641\u0639\u0644\u064a."
    ),
    "feat1": "\u062a\u062a\u0628\u0639 \u0627\u0644\u0625\u0634\u063a\u0627\u0644 \u0641\u064a \u0627\u0644\u0648\u0642\u062a \u0627\u0644\u0641\u0639\u0644\u064a",
    "feat2": "\u0631\u0624\u0649 \u062a\u0633\u0639\u064a\u0631 \u0630\u0643\u064a\u0629",
    "feat3": "\u062a\u062d\u0644\u064a\u0644\u0627\u062a \u0627\u0644\u0636\u064a\u0648\u0641 \u062d\u0633\u0628 \u0627\u0644\u062c\u0646\u0633\u064a\u0629",
    "copyright": "\u062c\u0645\u064a\u0639 \u0627\u0644\u062d\u0642\u0648\u0642 \u0645\u062d\u0641\u0648\u0638\u0629 \u0644\u0640 Solvfast \u00a9 2026",
    "welcome": "\u0645\u0631\u062d\u0628\u0627\u064b \u0628\u0643 \u0641\u064a",
    "access": "\u0627\u062f\u062e\u0644 \u0625\u0644\u0649 \u0644\u0648\u062d\u0629 \u0625\u062f\u0627\u0631\u0629 \u0627\u0644\u0641\u0646\u062f\u0642",
    "username": "\u0627\u0633\u0645 \u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645",
    "password": "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631",
    "forget": "\u0646\u0633\u064a\u062a \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631\u061f",
    "remember": "\u062a\u0630\u0643\u0631\u0646\u064a",
    "login": "\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644",
    "help": "\u0645\u0634\u0643\u0644\u0629 \u0641\u064a \u0627\u0633\u0645 \u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645\u061f",
    "helplink": "\u0627\u0636\u063a\u0637 \u0647\u0646\u0627",
    "arabic": "\u0627\u0644\u0639\u0631\u0628\u064a\u0629",
}

html = f"""<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{T['title_ar']}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {{
      theme: {{
        extend: {{
          colors: {{
            primary: {{ DEFAULT: '#0027B7', soft: '#EEF2FF' }},
            secondary: '#079DD8',
            loginGray: '#E5E6E9',
          }},
          fontFamily: {{ sans: ['Cairo', 'sans-serif'] }},
        }},
      }},
    }};
  </script>
  <link rel="stylesheet" href="../assets/css/app.css" />
  <style>
    /* Keep visual layout LTR (hero left, form right) like Marhaba;
       text direction still follows html[dir]. */
    .login-page {{
      min-height: 100vh;
      display: flex;
      flex-direction: row;
      direction: ltr;
    }}
    html[dir="rtl"] .login-hero,
    html[dir="rtl"] .login-main {{
      direction: rtl;
    }}
    .login-hero {{
      position: relative;
      width: 42%;
      min-height: 100vh;
      background-color: #0027B7;
      background-image: url("../assets/img/login-bg.png");
      background-size: cover;
      background-position: center;
      color: #fff;
      display: none;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 3rem 3.5rem 4.5rem;
      overflow: hidden;
    }}
    .login-hero::before {{
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(0, 39, 183, 0.72) 0%, rgba(0, 27, 120, 0.88) 100%);
      pointer-events: none;
    }}
    .login-hero > * {{ position: relative; z-index: 1; }}
    .login-hero-body {{
      width: 100%;
      max-width: 28rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }}
    .login-hero-title {{
      font-size: clamp(2.25rem, 3.5vw, 3.5rem);
      font-weight: 800;
      line-height: 1.1;
      letter-spacing: -0.03em;
      margin: 0 0 1.25rem;
      text-align: center;
    }}
    .login-hero-desc {{
      font-size: 1.1rem;
      line-height: 1.55;
      color: rgba(255, 255, 255, 0.92);
      margin: 0 auto 2rem;
      max-width: 28rem;
      text-align: center;
    }}
    .login-features {{
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
    }}
    .login-feature {{
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 1.25rem;
      color: #fff;
      font-size: 1rem;
      font-weight: 500;
      text-align: start;
    }}
    .login-feature-icon {{
      width: 2.875rem;
      height: 2.875rem;
      border-radius: 0.75rem;
      background: rgba(255, 255, 255, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }}
    .login-hero-foot {{
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
      padding: 1.25rem 2rem;
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.75);
      font-weight: 500;
      text-align: center;
    }}
    .login-main {{
      flex: 1;
      min-height: 100vh;
      background: #E5E6E9;
      display: flex;
      flex-direction: column;
      padding: 1rem 1rem 2rem;
    }}
    .login-lang {{
      display: flex;
      justify-content: flex-end;
      padding: 0.25rem 0.5rem 0;
    }}
    .login-lang-btn {{
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      border: 0;
      background: transparent;
      color: #636562;
      font: inherit;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      padding: 0.35rem 0.5rem;
    }}
    .login-lang-btn:hover {{ color: #0027B7; }}
    .login-form-wrap {{
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem 0 2rem;
    }}
    .login-card {{
      width: 100%;
      max-width: 26rem;
      background: #fff;
      border-radius: 15px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05), 0 5px 10px rgba(0, 0, 0, 0.03);
      padding: 1.75rem 2rem 2rem;
    }}
    .login-card h2 {{
      margin: 0.5rem 0 0.35rem;
      font-size: 1.75rem;
      font-weight: 700;
      color: #0027B7;
      line-height: 1.25;
    }}
    .login-card .login-sub {{
      margin: 0 0 1.5rem;
      color: #212529;
      font-size: 0.95rem;
      font-weight: 500;
    }}
    .login-field {{ margin-bottom: 1.1rem; }}
    .login-field label {{
      display: block;
      margin-bottom: 0.35rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: #373a36;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }}
    .login-field input {{
      width: 100%;
      height: 2.4rem;
      padding: 0.5rem 0.75rem;
      border: 1px solid #a6a7a5;
      border-radius: 4px;
      font: inherit;
      font-size: 0.875rem;
      color: #495057;
      background: #fff;
      outline: none;
      transition: border-color 0.15s;
    }}
    .login-field input:focus {{ border-color: #0027B7; }}
    .login-row {{
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      margin: -0.35rem 0 1.25rem;
      flex-wrap: wrap;
    }}
    .login-forget {{
      font-size: 0.8rem;
      font-weight: 600;
      color: #0027B7;
      text-decoration: none;
      white-space: nowrap;
    }}
    .login-forget:hover {{ text-decoration: underline; }}
    .login-remember {{
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0;
      font-size: 0.875rem;
      color: #636562;
      font-weight: 500;
      cursor: pointer;
      user-select: none;
    }}
    .login-remember input {{
      width: 1rem;
      height: 1rem;
      accent-color: #0027B7;
      cursor: pointer;
    }}
    .login-submit {{
      width: 100%;
      height: 2.45rem;
      border: 0;
      border-radius: 4px;
      background: #0027B7;
      color: #fff;
      font: inherit;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      margin-bottom: 1.25rem;
    }}
    .login-submit:hover {{ background: #0030d4; }}
    .login-help {{
      text-align: center;
      font-size: 0.8rem;
      color: #636562;
      margin: 0;
    }}
    .login-help a {{
      color: #0027B7;
      font-weight: 700;
      text-decoration: none;
    }}
    .login-help a:hover {{ text-decoration: underline; }}
    .login-mobile-brand {{
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.25rem;
    }}
    .login-mobile-brand .mark {{
      width: 2.75rem;
      height: 2.75rem;
      border-radius: 0.85rem;
      background: #0027B7;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 1.1rem;
    }}
    @media (min-width: 1024px) {{
      .login-hero {{ display: flex; }}
      .login-mobile-brand {{ display: none; }}
      .login-main {{ padding: 1rem 1.25rem 0; }}
      .login-card {{ padding: 1.5rem 3.5rem 2rem; max-width: 28rem; }}
    }}
  </style>
</head>
<body class="font-sans">
  <div class="login-page">
    <aside class="login-hero" aria-hidden="false">
      <div class="login-hero-body">
        <h1 class="login-hero-title" data-i18n="heroTitle">{T['hero_title']}</h1>
        <p class="login-hero-desc" data-i18n="heroDesc">{T['hero_desc']}</p>
        <div class="login-features">
          <div class="login-feature">
            <div class="login-feature-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            </div>
            <span data-i18n="feat1">{T['feat1']}</span>
          </div>
          <div class="login-feature">
            <div class="login-feature-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            </div>
            <span data-i18n="feat2">{T['feat2']}</span>
          </div>
          <div class="login-feature">
            <div class="login-feature-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            </div>
            <span data-i18n="feat3">{T['feat3']}</span>
          </div>
        </div>
      </div>
      <div class="login-hero-foot">
        <span data-i18n="copyright">{T['copyright']}</span>
      </div>
    </aside>

    <section class="login-main">
      <div class="login-lang">
        <button type="button" class="login-lang-btn" id="langToggle" aria-label="Switch language">
          <span id="langToggleLabel">English</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        </button>
      </div>

      <div class="login-form-wrap">
        <div class="w-full max-w-md px-2">
          <div class="login-mobile-brand">
            <div class="mark">S</div>
            <div class="font-extrabold text-xl text-slate-800">Solvfast PMS</div>
          </div>

          <div class="login-card">
            <h2><span data-i18n="welcome">{T['welcome']}</span> <span>Solvfast</span></h2>
            <p class="login-sub" data-i18n="access">{T['access']}</p>

            <form action="dashboard.html" method="get">
              <div class="login-field">
                <label for="username" data-i18n="username">{T['username']}</label>
                <input id="username" name="username" type="text" required autocomplete="username"
                  data-i18n-placeholder="usernamePh" placeholder="{T['username']}"
                  value="manager@pmsdemo.solvfaster.com" />
              </div>

              <div class="login-field">
                <label for="password" data-i18n="password">{T['password']}</label>
                <input id="password" name="password" type="password" required autocomplete="current-password"
                  data-i18n-placeholder="passwordPh" placeholder="{T['password']}"
                  value="manager@pmsdemo.solvfaster.com" />
              </div>

              <div class="login-row">
                <label class="login-remember">
                  <input type="checkbox" name="remember" />
                  <span data-i18n="remember">{T['remember']}</span>
                </label>
                <a href="#" class="login-forget" data-i18n="forget">{T['forget']}</a>
              </div>

              <button type="submit" class="login-submit" data-i18n="login">{T['login']}</button>
            </form>

            <p class="login-help">
              <span data-i18n="help">{T['help']}</span>
              <a href="#" data-i18n="helpLink">{T['helplink']}</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>

  <script>
    (function () {{
      var dict = {{
        ar: {{
          title: {T['title_ar']!r},
          heroTitle: {T['hero_title']!r},
          heroDesc: {T['hero_desc']!r},
          feat1: {T['feat1']!r},
          feat2: {T['feat2']!r},
          feat3: {T['feat3']!r},
          copyright: {T['copyright']!r},
          welcome: {T['welcome']!r},
          access: {T['access']!r},
          username: {T['username']!r},
          password: {T['password']!r},
          usernamePh: {T['username']!r},
          passwordPh: {T['password']!r},
          forget: {T['forget']!r},
          remember: {T['remember']!r},
          login: {T['login']!r},
          help: {T['help']!r},
          helpLink: {T['helplink']!r},
          toggle: "English",
        }},
        en: {{
          title: "Login \\u2014 Solvfast PMS",
          heroTitle: "Manage Your<br />Hotel Smarter",
          heroDesc: "Control bookings, monitor occupancy, and optimize pricing in real time.",
          feat1: "Real-time occupancy tracking",
          feat2: "Smart pricing insights",
          feat3: "Guest analytics by nationality",
          copyright: "All rights reserved to Solvfast \\u00a9 2026",
          welcome: "Welcome to",
          access: "Access your Management console",
          username: "User Name",
          password: "Password",
          usernamePh: "User Name",
          passwordPh: "Password",
          forget: "Forget Password ?",
          remember: "Remember me",
          login: "Login",
          help: "Problem with username?",
          helpLink: "Click here",
          toggle: {T['arabic']!r},
        }},
      }};

      var lang = localStorage.getItem("solvfast-login-lang") || "ar";

      function apply(langCode) {{
        var t = dict[langCode];
        if (!t) return;
        document.documentElement.lang = langCode;
        document.documentElement.dir = langCode === "ar" ? "rtl" : "ltr";
        document.title = t.title;
        document.querySelectorAll("[data-i18n]").forEach(function (el) {{
          var key = el.getAttribute("data-i18n");
          if (t[key] != null) el.innerHTML = t[key];
        }});
        document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {{
          var key = el.getAttribute("data-i18n-placeholder");
          if (t[key] != null) el.setAttribute("placeholder", t[key]);
        }});
        var toggleLabel = document.getElementById("langToggleLabel");
        if (toggleLabel) toggleLabel.textContent = t.toggle;
        localStorage.setItem("solvfast-login-lang", langCode);
      }}

      apply(lang);

      document.getElementById("langToggle").addEventListener("click", function () {{
        lang = lang === "ar" ? "en" : "ar";
        apply(lang);
      }});
    }})();
  </script>
</body>
</html>
"""

OUT.write_text(html, encoding="utf-8")
text = OUT.read_text(encoding="utf-8")
assert "\u0645\u0631\u062d\u0628\u0627" in text, "Arabic welcome missing"
assert "????" not in text, "mojibake present"
print(f"Wrote {OUT} ({OUT.stat().st_size} bytes)")
