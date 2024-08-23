import React from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem} from "@nextui-org/navbar";
import { Login } from "./auth/login";

export async function MainNavbar() {
  return (
    <Navbar maxWidth="full" isBordered className="border-b-2 shadow">
      <NavbarContent>
        <NavbarBrand>
          <p className="font-semibold text-inherit">ChatWorld</p>
        </NavbarBrand>
        <NavbarContent justify="center">
          {/* <NavbarItem>
            <Link href="/">Home</Link>
          </NavbarItem> */}
        </NavbarContent>
      </NavbarContent>


      <NavbarContent as="div" justify="end">
        <NavbarItem>
          <Login />
        </NavbarItem>
      </NavbarContent>        
    </Navbar>
  );
}
