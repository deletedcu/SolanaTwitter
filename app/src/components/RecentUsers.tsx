import Image from "next/image";
import Link from "next/link";
import { UserType } from "../models";

export default function RecentUsers({
  users,
  owner,
}: {
  users: UserType[];
  owner: string;
}) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="card bg-skin-secondary py-3 px-6">
        {users.map((user, i) => {
          const userRoute =
            user.user.toBase58() === owner
              ? "/profile"
              : `/users/${user.user.toBase58()}`;
          return (
            <div
              key={i}
              className="border-b border-current py-3 last:border-b-0"
            >
              <div className="flex items-center">
                <div className="mr-3 p-0.5">
                  <Image
                    src={`https://avatars.dicebear.com/api/jdenticon/${user.user.toBase58()}.svg`}
                    width={40}
                    height={40}
                    alt={user.user.toBase58()}
                  />
                </div>
                <div>
                  <div>
                    <Link href={userRoute}>
                      <a className="hover:underline font-semibold text-skin-primary">
                        {user.user_display}
                      </a>
                    </Link>
                  </div>
                  <time>
                    <Link href={`/tweets/${user.tweet.toBase58()}`}>
                      <a className="text-sm text-skin-third hover:underline">
                        {user.created_ago}
                      </a>
                    </Link>
                  </time>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
