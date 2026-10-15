/**
 * Site-wide settings that change between the staging copy and production.
 */
export const siteConfig = {
  /**
   * URL that receives the "diagnosi operativa" form as a JSON POST
   * ({ name, email, message }) — e.g. a Formspree endpoint or your own API.
   *
   * Empty string = demo mode: the form validates and shows the success state,
   * but NOTHING is sent anywhere (a console notice says so). Set this before
   * the page is used with real prospects.
   */
  contactEndpoint: '',

  /** Target of the "Privacy" link in the footer (the privacy policy page). */
  privacyUrl: '#',
} as const;
