export const adsConfig = {
  enabled: true,
  primarySmartlink: "https://omg10.com/4/10927743",
  secondarySmartlink:
    "https://www.profitablecpmratenetwork.com/zqrxr7nt?key=bfe0c24e132cb5b553a89c56efa4dd52",
  maxPopupPerSession: 1,
  popupCooldownMs: 300000,
  playerGate: {
    enabled: true,
    requiredClicksBeforeAccess: 4,
    sessionKey: "egyx_player_gate_clicks"
  },
  fullscreenGate: {
    enabled: true,
    requiredClicksBeforeAccess: 2,
    sessionKey: "egyx_fullscreen_gate_clicks"
  }
} as const;
