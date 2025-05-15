import { useState, useEffect } from "react";

type AccessLevel = "scan" | "modify" | "control" | "none";

export function usePaperPermission(paperId: string, userEmail: string) {
  const [accessLevel, setAccessLevel] = useState<AccessLevel>('none');

  useEffect(() => {
    if (!paperId || !userEmail) {
      setAccessLevel('none');
      return;
    }

    fetch(`http://localhost:8000/permissions/paper/${paperId}/${encodeURIComponent(userEmail)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch paper permission");
        return res.text();
      })
      .then((level) => {
        setAccessLevel(level as AccessLevel);
      })
      .catch((err) => {
        console.error(err);
        setAccessLevel('none');
      })
  }, [paperId, userEmail]);

  return accessLevel;
}
