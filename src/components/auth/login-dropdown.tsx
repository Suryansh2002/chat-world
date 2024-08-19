"use client";
import { Dropdown, DropdownItem, DropdownTrigger, DropdownMenu } from "@nextui-org/dropdown";
import { Avatar } from "@nextui-org/avatar";
import { signOut } from "next-auth/react";

export function LoginDropdown({name, email, image}: {name: string, email: string, image: string}) {
    return <Dropdown placement="bottom-end">
    <DropdownTrigger>
      <Avatar
        isBordered
        as="button"
        className="transition-transform hover:scale-x-110"
        color="secondary"
        name={name}
        size="sm"
        src={image}
      />
    </DropdownTrigger>
    <DropdownMenu aria-label="Profile Actions" variant="flat">
      <DropdownItem key="profile" className="h-14 gap-2">
        <p className="font-semibold">Signed in as</p>
        <p className="font-semibold">{email}</p>
      </DropdownItem>
      <DropdownItem key="logout" color="danger" onClick={()=>{signOut()}}>
        Sign out
      </DropdownItem>
    </DropdownMenu>
  </Dropdown>
}