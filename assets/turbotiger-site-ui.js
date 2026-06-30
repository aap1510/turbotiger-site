(function () {
  "use strict";

  var SUPABASE_REST_URL = "https://jzqgudmvquokizvgehow.supabase.co/rest/v1";
  var SUPABASE_KEY = "sb_publishable_eAPW_Kg8SLYpL43JVe104Q__qvEbyDU";
  var DEFAULT_INSTAGRAM = "https://www.instagram.com/turbotiger.com.br";
  var DEFAULT_FACEBOOK = "https://www.facebook.com/turbotiger.com.br";
  var WHATSAPP_MESSAGE = "Ol\u00e1, suporte Turbo Tiger. Estou chamando o atendimento pelo site do Turbo Tiger. Preciso de ajuda.";

  function normalizeValue(value) {
    if (value === null || value === undefined) return "";
    return String(value).trim();
  }

  async function fetchConfig(category, type) {
    try {
      var response = await fetch(SUPABASE_REST_URL + "/rpc/app_config_buscar_rpc", {
        method: "POST",
        cache: "no-store",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: "Bearer " + SUPABASE_KEY,
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          p_categoria: category,
          p_tipo: type
        })
      });

      if (!response.ok) return "";

      var text = await response.text();
      if (!text) return "";

      try {
        return normalizeValue(JSON.parse(text));
      } catch (e) {
        return normalizeValue(text).replace(/^"|"$/g, "");
      }
    } catch (e) {
      return "";
    }
  }

  async function firstConfig(items) {
    for (var i = 0; i < items.length; i += 1) {
      var value = await fetchConfig(items[i][0], items[i][1]);
      if (value) return value;
    }
    return "";
  }

  function digitsOnly(value) {
    return normalizeValue(value).replace(/\D/g, "");
  }

  function whatsappUrl(phone) {
    var number = digitsOnly(phone);
    if (!number) return "";
    return "https://wa.me/" + number + "?text=" + encodeURIComponent(WHATSAPP_MESSAGE);
  }

  function cacheBustUrl(url) {
    url = normalizeValue(url);
    if (!url || /^data:/i.test(url)) return url;
    return url + (url.indexOf("?") >= 0 ? "&" : "?") + "tt_cache=" + Date.now();
  }

  function hasTurboTigerBridge(name) {
    try {
      return !!window[name];
    } catch (e) {
      return false;
    }
  }

  function hasTurboTigerAppMarker() {
    try {
      return new URLSearchParams(window.location.search).get("app") === "1";
    } catch (e) {
      return false;
    }
  }

  function isInsideTurboTigerApp() {
    if (
      hasTurboTigerBridge("TurboTigerHistoricoBridge") ||
      hasTurboTigerBridge("TurboTigerBridge") ||
      hasTurboTigerBridge("TurboTigerApp") ||
      hasTurboTigerAppMarker()
    ) {
      return true;
    }

    return /TurboTiger/i.test(navigator.userAgent || "");
  }

  function propagateTurboTigerAppMarker() {
    document.querySelectorAll("a[href]").forEach(function (link) {
      try {
        var url = new URL(link.href, window.location.href);
        if (url.origin !== window.location.origin) return;
        url.searchParams.set("app", "1");
        link.href = url.toString();
      } catch (e) {}
    });
  }

  function updateSocial(selector, url, imageUrl) {
    document.querySelectorAll(selector).forEach(function (link) {
      if (!url || !imageUrl) {
        link.hidden = true;
        return;
      }
      link.href = url;
      var image = link.querySelector("img");
      if (image) image.src = cacheBustUrl(imageUrl);
      link.hidden = false;
    });
  }

  function updateConfiguredImage(type, imageUrl) {
    document.querySelectorAll("[data-tt-image='" + type + "']").forEach(function (image) {
      if (!imageUrl) {
        image.hidden = true;
        image.removeAttribute("src");
        return;
      }
      image.src = cacheBustUrl(imageUrl);
      image.hidden = false;
    });
  }

  function updateConfiguredBackground(type, imageUrl) {
    document.querySelectorAll("[data-tt-background='" + type + "']").forEach(function (element) {
      if (!imageUrl) {
        element.style.removeProperty("--tt-site-background-url");
        return;
      }
      var safeUrl = cacheBustUrl(imageUrl).replace(/"/g, "%22");
      element.style.setProperty("--tt-site-background-url", "url(\"" + safeUrl + "\")");
    });
  }

  function ensureHeadLink(rel, type) {
    var selector = type ? "link[rel='" + rel + "'][type='" + type + "']" : "link[rel='" + rel + "']";
    var link = document.head.querySelector(selector);
    if (!link) {
      link = document.createElement("link");
      link.rel = rel;
      if (type) link.type = type;
      document.head.appendChild(link);
    }
    return link;
  }

  function replaceExtension(url, extension) {
    url = normalizeValue(url);
    if (!url) return "";
    var hash = "";
    var hashPos = url.indexOf("#");
    if (hashPos >= 0) {
      hash = url.slice(hashPos);
      url = url.slice(0, hashPos);
    }
    var query = "";
    var queryPos = url.indexOf("?");
    if (queryPos >= 0) {
      query = url.slice(queryPos);
      url = url.slice(0, queryPos);
    }
    return url.replace(/\.[^\/.]+$/, extension) + query + hash;
  }

  function updateFavicon(iconUrl) {
    iconUrl = normalizeValue(iconUrl);
    if (!iconUrl) return;

    ensureHeadLink("icon", "image/webp").href = cacheBustUrl(iconUrl);
    ensureHeadLink("shortcut icon", "").href = cacheBustUrl(replaceExtension(iconUrl, ".ico"));
  }

  function setupFixedFooterCopyright() {
    var ticking = false;

    function updateState() {
      var root = document.documentElement;
      var scrollTop = window.pageYOffset || root.scrollTop || 0;
      var viewportHeight = window.innerHeight || root.clientHeight || 0;
      var pageHeight = Math.max(
        root.scrollHeight,
        document.body ? document.body.scrollHeight : 0
      );
      var atEnd = scrollTop + viewportHeight >= pageHeight - 80;

      document.body.classList.toggle("tt-site-footer-end", atEnd);
      ticking = false;
    }

    function requestUpdate() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateState);
    }

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    requestUpdate();
  }

  async function updateTurboTigerContacts() {
    var insideApp = isInsideTurboTigerApp();
    if (insideApp) propagateTurboTigerAppMarker();

    var contacts = await Promise.all([
      fetchConfig("turbotiger_contatos", "instagram"),
      fetchConfig("turbotiger_contatos", "facebook"),
      fetchConfig("turbotiger_imagens", "icone_instagram"),
      fetchConfig("turbotiger_imagens", "icone_facebook"),
      insideApp ? Promise.resolve("") : fetchConfig("turbotiger_imagens", "icone_whatsapp"),
      fetchConfig("turbotiger_imagens", "fundo_geral"),
      fetchConfig("turbotiger_imagens", "logo_geral"),
      fetchConfig("turbotiger_imagens", "tiger_abertura"),
      fetchConfig("turbotiger_imagens", "icone_turbotiger")
    ]);
    var instagram = contacts[0] || DEFAULT_INSTAGRAM;
    var facebook = contacts[1] || DEFAULT_FACEBOOK;
    var instagramIcon = contacts[2];
    var facebookIcon = contacts[3];
    var whatsappIcon = contacts[4];
    var generalBackground = contacts[5];
    var generalLogo = contacts[6];
    var openingTiger = contacts[7];
    var turboTigerIcon = contacts[8];
    var whatsappPhone = insideApp ? "" : await firstConfig([
      ["turbotiger_contatos", "whatsapp"],
      ["whatsapp", "nr_suporte_humano"],
      ["whatsapp", "nr_suporte_ia"],
      ["suporte", "whatsapp"],
      ["whatsapp", "suporte"]
    ]);
    var whatsapp = insideApp ? "" : whatsappUrl(whatsappPhone);

    updateSocial("[data-tt-contact='instagram']", instagram, instagramIcon);
    updateSocial("[data-tt-contact='facebook']", facebook, facebookIcon);
    updateSocial("[data-tt-contact='whatsapp']", whatsapp, whatsappIcon);
    updateConfiguredBackground("fundo_geral", generalBackground);
    updateConfiguredImage("logo_geral", generalLogo);
    updateConfiguredImage("tiger_abertura", openingTiger);
    updateFavicon(turboTigerIcon);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      updateTurboTigerContacts();
      setupFixedFooterCopyright();
    });
  } else {
    updateTurboTigerContacts();
    setupFixedFooterCopyright();
  }
}());
