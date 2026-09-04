# frozen_string_literal: true

require "al_cookie"

# Temporary site-local compatibility patch for al_cookie 1.0.0.
#
# Vanilla CookieConsent v3 passes callback metadata rather than a category map.
# Querying acceptedCategory keeps Google Consent Mode aligned with the visitor's
# saved choice on first consent, preference changes, and subsequent page loads.
module AlCookieConsentOverride
  module_function

  def replace_exact(source, needle, replacement, expected_count: 1)
    actual_count = source.scan(needle).length
    unless actual_count == expected_count
      raise "al_cookie override is stale: expected #{expected_count} occurrence(s) of #{needle.inspect}, found #{actual_count}"
    end

    source.gsub(needle, replacement)
  end

  module SetupRenderer
    def render_setup_script(context)
      script = super
      script = AlCookieConsentOverride.replace_exact(script, "onFirstConsent: function (consentData)", "onConsent: function ()")
      script = AlCookieConsentOverride.replace_exact(script, "onChange: function (consentData)", "onChange: function ()")
      script = AlCookieConsentOverride.replace_exact(script, "updateConsentMode(consentData);", "updateConsentMode();", expected_count: 2)
      script = AlCookieConsentOverride.replace_exact(script, "function updateConsentMode(consentData)", "function updateConsentMode()")
      script = AlCookieConsentOverride.replace_exact(
        script,
        "    var categories = consentData.categories || consentData;\n\n" \
          "    if (!categories || typeof categories !== \"object\") {\n" \
          "      console.warn(\"Invalid consent data structure:\", consentData);\n" \
          "      return;\n" \
          "    }\n",
        "    var analyticsGranted = window.CookieConsent.acceptedCategory(\"analytics\");\n"
      )
      AlCookieConsentOverride.replace_exact(script, "categories.analytics", "analyticsGranted", expected_count: 2)
    end
  end

  module ScriptsTag
    def render(context)
      html = super
      AlCookieConsentOverride.replace_exact(
        html,
        "/assets/al_cookie/js/cookie-theme-sync.js",
        "/lib/assets/al_cookie/js/cookie-theme-sync.js"
      )
    end
  end
end

AlCookie.singleton_class.prepend(AlCookieConsentOverride::SetupRenderer)
AlCookie::CookieScriptsTag.prepend(AlCookieConsentOverride::ScriptsTag)
