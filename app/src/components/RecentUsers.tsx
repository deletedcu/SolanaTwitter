import Link from "next/link";
import { SuperEllipseImg } from "react-superellipse";
import useWorkspace from "../hooks/useWorkspace";
import { UserType } from "../models";

export default function RecentUsers({ users }: { users: UserType[] }) {
  const workspace = useWorkspace();
  const owner = workspace && workspace.wallet.publicKey.toBase58();

  return (
    <div className="h-full overflow-y-auto">
      <div className="card bg-fill-secondary py-3 px-6">
        {users.map((user, i) => {
          const userRoute =
            user.user.toBase58() === owner
              ? "/profile"
              : `/users/${user.user.toBase58()}`;
          return (
            <div
              key={i}
              className="border-b border-skin-primary py-3 last:border-b-0"
            >
              <div className="flex items-center">
                <div className="mr-3 p-0.5">
                  <SuperEllipseImg
                    width={36}
                    height={36}
                    href={`https://avatars.dicebear.com/api/jdenticon/${user.user.toBase58()}.svg`}
                    r1={0.1}
                    r2={0.3}
                    strokeColor="rgba(156, 163, 175, 0.3)"
                    strokeWidth={1}
                  />
                </div>
                <div>
                  <div>
                    <Link href={userRoute}>
                      <a className="hover:underline font-semibold text-color-primary">
                        {user.user_display}
                      </a>
                    </Link>
                  </div>
                  <time>
                    <Link href={`/tweets/${user.tweet.toBase58()}`}>
                      <a className="text-sm text-color-third hover:underline">
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
