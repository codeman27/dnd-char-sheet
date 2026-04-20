/**
 * RemoteLoginSuccess
 *
 * Landing page for the nostrconnect callback on mobile.
 * When a signer app (Primal, Amber, etc.) completes authorization it
 * redirects back to /remoteloginsuccess. The original tab's nostrconnect
 * listener resolves via relay independently — this page just needs to
 * exist so the user isn't shown a 404, and can close the tab / return.
 */

const RemoteLoginSuccess = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: '#1a1d2e' }}
    >
      <div className="text-center px-8 space-y-6 max-w-sm">
        {/* Shield / success icon */}
        <div className="text-7xl">🛡️</div>

        <div className="space-y-2">
          <h1 className="font-cinzel text-lg font-semibold" style={{ color: '#e6c35a', letterSpacing: '1px' }}>
            Signed In
          </h1>
          <p className="font-handwriting text-base" style={{ color: '#8a9ab8' }}>
            Authorization complete. You can close this tab and return to the character sheet.
          </p>
        </div>

        <button
          className="font-cinzel text-xs uppercase tracking-wider px-6 py-3 rounded border transition-colors"
          style={{ background: '#2f3550', color: '#e6c35a', border: '1px solid #7a6218' }}
          onClick={() => window.close()}
        >
          Close Tab
        </button>
      </div>
    </div>
  );
};

export default RemoteLoginSuccess;
