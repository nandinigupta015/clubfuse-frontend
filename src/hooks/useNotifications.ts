import { useState, useEffect, useCallback, useRef } from "react";

export interface Notification {
    id: number;
    message: string;
    read_status: "read" | "unread";
    sent_time: string;
}

const API = "http://127.0.0.1:5000";

export function useNotifications() {
    const studentId = localStorage.getItem("student_id");
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [currentToast, setCurrentToast] = useState<string | null>(null);
    const lastIdRef = useRef<number | null>(null);

    const fetchNotifications = useCallback(async () => {
        if (!studentId) return;
        try {
            const res = await fetch(`${API}/api/notifications/${studentId}`);
            const data: Notification[] = await res.json();

            if (Array.isArray(data)) {
                // If we have data and it's the first fetch, set the reference point
                if (lastIdRef.current === null && data.length > 0) {
                    lastIdRef.current = Math.max(...data.map(n => n.id));
                }
                // If we already have a reference, check for new ones
                else if (lastIdRef.current !== null && data.length > 0) {
                    const maxId = Math.max(...data.map(n => n.id));
                    if (maxId > lastIdRef.current) {
                        // Find the newest notification(s)
                        const news = data.filter(n => n.id > (lastIdRef.current || 0));
                        if (news.length > 0) {
                            setCurrentToast(news[0].message);
                        }
                        lastIdRef.current = maxId;
                    }
                }

                setNotifications(data);
            }
        } catch {
            // silently ignore network errors for polling
        }
    }, [studentId]);

    // Fetch on mount + poll every 30s
    useEffect(() => {
        fetchNotifications();
        const timer = setInterval(fetchNotifications, 5_000);
        return () => clearInterval(timer);
    }, [fetchNotifications]);

    const markRead = async (id: number) => {
        await fetch(`${API}/api/notifications/${id}/read`, { method: "PUT" });
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read_status: "read" } : n))
        );
    };

    const markAllRead = async () => {
        if (!studentId) return;
        await fetch(`${API}/api/notifications/read-all/${studentId}`, {
            method: "PUT",
        });
        setNotifications((prev) =>
            prev.map((n) => ({ ...n, read_status: "read" }))
        );
    };

    const clearToast = () => setCurrentToast(null);

    const unreadCount = notifications.filter(
        (n) => n.read_status === "unread"
    ).length;

    return {
        notifications,
        unreadCount,
        markRead,
        markAllRead,
        fetchNotifications,
        currentToast,
        clearToast
    };
}
