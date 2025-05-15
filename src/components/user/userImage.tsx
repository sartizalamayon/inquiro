import { useSession } from "next-auth/react"
import Image from "next/image"

export default function UserImage() {
    const session = useSession()
    const image = session.data?.user?.image || "" 
    const name = session.data?.user?.name || "User"
    return (
        <Image
  src={image || "https://github.com/shadcn.png"}
  alt={name || "User"}
  width={40}
  height={40}
  className="rounded-full"
/>

    )
    }