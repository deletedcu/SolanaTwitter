import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Search from "../../templates/Search";
import { userIcon } from "../../public/assets/icons";
import { UserType } from "../../models";
import { fetchUsers } from "../api/tweets";
import UserList from "../../components/UserList";

export default function Users() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [viewedUser, setViewedUser] = useState("");
  const [allUsers, setAllUsers] = useState<UserType[]>([]);
  const [filterUsers, setFilterUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  const search = () => {
    router.push(`/users/${user}`);
    setViewedUser(user);
  };

  const fetchTweetUsers = () => {
    fetchUsers()
      .then((fetchedUsers) => {
        setAllUsers(fetchedUsers);
        setFilterUsers(fetchedUsers);
      })
      .finally(() => setLoading(false));
  };

  const onTextChange = (text: string) => {
    const fUsers = allUsers.filter((k) => k.user.toBase58().includes(text));
    setUser(text);
    setFilterUsers(fUsers);
  };

  useEffect(() => {
    fetchTweetUsers();
  }, []);

  return (
    <Search
      icon={userIcon}
      placeholder="user public key"
      modelValue={user}
      setModelValue={onTextChange}
      search={search}
    >
      <UserList users={filterUsers} loading={loading} />
    </Search>
  );
}
