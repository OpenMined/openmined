export default {
  ignoreErrors: [
    // Random plugins/extensions
    'top.GLOBALS',
    // See: http://blog.errorception.com/2012/03/tale-of-unfindable-js-error.html
    'originalCreateNotification',
    'canvas.contentDocument',
    'MyApp_RemoveAllHighlights',
    'http://tt.epicplay.com',
    "Can't find variable: ZiteReader",
    'jigsaw is not defined',
    'ComboSearch is not defined',
    'http://loading.retry.widdit.com/',
    'atomicFindClose',
    // Facebook borked
    'fb_xd_fragment',
    // ISP "optimizing" proxy - `Cache-Control: no-transform` seems to
    // reduce this. (thanks @acdha)
    // See http://stackoverflow.com/questions/4113268
    'bmi_SafeAddOnload',
    'EBCallBackMessageReceived',
    // See http://toolbar.conduit.com/Developer/HtmlAndGadget/Methods/JSInjection.aspx
    'conduitPage',
    // Courses specific errors that we want to filter out
    `Unexpected token '<'`,
    `expected expression, got '<'`,
    `Failed to get document because the client is offline.`,
    `IndexedDb`,
    `QuotaExceededError`,
    `Loading chunk`,
    `ChunkLoadError`,
    `Network Error`,
    `Cannot read property 'createObjectStore' of undefined`,
    // Ad blocker
    `SecurityError: Blocked a frame with origin "https://courses.openmined.org" from accessing a cross-origin frame. Protocols, domains, and ports must match.`,
    `Resource blocked by content blocker`,
    // User is offline, firebase throws an Error
    `installations/app-offline`,
    // Firebase enablePersistence "re-run"
    `Firestore has already been started and persistence can no longer be enabled. You can only call enablePersistence() before calling any other methods on a Firestore object.`,
    // Firestore internal error
    `FIRESTORE (7.24.0) INTERNAL ASSERTION`,
    // All IDBTransactions, IDBDatabase...
    `IDB`,
    // Network
    `timeout, interrupted connection or unreachable host`,
    // Useless credential error
    `The user's credential is no longer valid. The user must sign in again.`,
  ],
  denyUrls: [
    // Facebook flakiness
    /graph\.facebook\.com/i,
    // Facebook blocked
    /connect\.facebook\.net\/en_US\/all\.js/i,
    // Woopra flakiness
    /eatdifferent\.com\.woopra-ns\.com/i,
    /static\.woopra\.com\/js\/woopra\.js/i,
    // Chrome extensions
    /extensions\//i,
    /^chrome:\/\//i,
    // Other plugins
    /127\.0\.0\.1:4001\/isrunning/i, // Cacaoweb
    /webappstoolbarba\.texthelp\.com\//i,
    /metrics\.itunes\.apple\.com\.edgesuite\.net\//i,
  ],
};
