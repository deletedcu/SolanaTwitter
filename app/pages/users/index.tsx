import { useRouter } from "next/router";
import { useState } from "react";
import Search from "../../templates/Search";
import { userIcon } from "../../public/assets/icons";

export default function Users() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [viewedUser, setViewedUser] = useState("");

  const search = () => {
    router.push(`/users/${user}`);
    setViewedUser(user);
  };

  return (
    <Search
      icon={userIcon}
      placeholder="public key"
      modelValue={user}
      setModelValue={setUser}
      search={search}
    />
  );
}
