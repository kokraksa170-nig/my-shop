import { useEffect, useState } from "react";

export function usePushNotifications() {
  const [permission, setPermission] = useState(Notification.permission);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setSupported(true);
    }
  }, []);

  async function requestPermission() {
    if (!supported) return false;
    const result = await Notification.requestPermission();
    setPermission(result);
    return result === "granted";
  }

  // Show a local notification (no server needed)
  async function showNotification(title, body, url = "/orders") {
    if (permission !== "granted") return;
    const reg = await navigator.serviceWorker.ready;
    reg.showNotification(title, {
      body,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      data: { url },
      actions: [
        { action: "view", title: "View Order" }
      ]
    });
  }

  return { permission, supported, requestPermission, showNotification };
}
