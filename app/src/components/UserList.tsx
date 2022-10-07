import { useAnchorWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";
import Link from "next/link";
import { UserType } from "../models";

interface UserListProps {
  users: UserType[];
  loading: boolean;
}

export default function UserList(props: UserListProps) {
  const { users, loading } = props;
  const wallet = useAnchorWallet();

  return (
    <>
      {loading || !wallet ? (
        <div className="p-8 text-center text-gray-500">Loading...</div>
      ) : (
        <div className="overflow-x-auto relative">
          <table className="w-full text-sm text-left text-gray-700 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="py-3 px-3"></th>
                <th scope="col" className="py-3 px-3">
                  User
                </th>
                <th scope="col" className="py-3 px-3"></th>
                <th scope="col" className="py-3 px-3">
                  LAST POST
                </th>
                <th scope="col" className="py-3 px-3">
                  TOTAL POSTS
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, key) => {
                const userRoute =
                  wallet.publicKey.toBase58() === user.user.toBase58()
                    ? "/profile"
                    : `/users/${user.user.toBase58()}`;
                return (
                  <tr
                    key={key}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <td className="py-4 pl-6 pr-3">{`#${key + 1}`}</td>
                    <td className="py-4 px-3">
                      <Link href={userRoute}>
                        <a>
                          <Image
                            src={`https://avatars.dicebear.com/api/jdenticon/${user.user.toBase58()}.svg`}
                            alt={user.user.toBase58()}
                            width="35"
                            height="35"
                          />
                        </a>
                      </Link>
                    </td>
                    <td className="py-4 px-3">
                      <Link href={userRoute}>
                        <a className="font-semibold hover:underline">
                          {user.user.toBase58()}
                        </a>
                      </Link>
                      <br />
                      <span className="text-gray-400">{user.user_display}</span>
                    </td>
                    <td className="py-4 px-3">
                      <Link href={`/tweets/${user.tweet.toBase58()}`}>
                        <a className="hover:underline">
                          <span>{user.created_ago}</span>
                        </a>
                      </Link>
                      <br />
                      <span className="border border-solid border-sky-500 rounded-full">
                        <Link href={`/tags/${user.last_tag}`}>
                          <a className="text-primary-500 text-sm hover:underline px-1 py-0">
                            {`#${user.last_tag}`}
                          </a>
                        </Link>
                      </span>
                    </td>
                    <td className="py-4 px-3 text-center">
                      <Link href={userRoute}>
                        <a className="hover:underline">{user.total_posts}</a>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
