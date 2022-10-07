import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { userIcon } from "../../assets/icons";
import { UserType } from "../../models";
import { fetchUsers } from "../api/tweets";
import UserList from "../../components/UserList";
import Base from "../../templates/Base";
import TweetSearch from "../../components/TweetSearch";

export default function Users() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [allUsers, setAllUsers] = useState<UserType[]>([]);
  const [filterUsers, setFilterUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  const search = () => {
    router.push(`/users/${user}`);
  };

  const onTextChange = (text: string) => {
    const fUsers = allUsers.filter((k) => k.user.toBase58().includes(text));
    setUser(text);
    setFilterUsers(fUsers);
  };

  useEffect(() => {
    fetchUsers()
      .then((fetchedUsers) => {
        setAllUsers(fetchedUsers);
        setFilterUsers(fetchedUsers);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Base>
      <div className="flex w-full">
        <div className="mr-16 grow" style={{ position: "relative" }}>
          <div className="mb-8 flex space-x-6 whitespace-nowrap border-b border-gray-300/50">
            <h2 className="-mb-px flex border-b-2 border-sky-500 pb-2.5 font-semibold leading-6 text-gray-700">
              Users
            </h2>
          </div>
          <TweetSearch
            placeholder="user public key"
            disabled={!user}
            modelValue={user}
            setModelValue={onTextChange}
            search={search}
          >
            {userIcon}
          </TweetSearch>
          <UserList users={filterUsers} loading={loading} />
        </div>
        <div className="relative mb-8 w-72"></div>
      </div>
    </Base>
  );
}
