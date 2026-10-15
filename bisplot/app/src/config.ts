/**
 * Site-wide settings that change between the staging copy and production.
 */
export const siteConfig = {
  /**
   * URL that receives the "diagnosi operativa" form as a JSON POST
   * ({ name, email, procedure }) — e.g. a Formspree endpoint or your own API.
   *
   * Empty string = demo mode: the form validates and shows the success state,
   * but NOTHING is sent anywhere (a console notice says so). Set this before
   * the page is used with real prospects.
   */
  contactEndpoint: '',

  /** Footer "Privacy" link — the privacy policy page. */
  privacyUrl: '#',

  /** Footer "Note legali" link — company details and legal notes. */
  legalNotesUrl: '#',
} as const;
