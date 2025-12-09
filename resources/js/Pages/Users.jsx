import { UserList } from '@/Components/Users/UserList'
import UserSearch from '@/Components/Users/UserSearch'
import UsersLayout from '@/Layouts/UsersLayout'
import React from 'react'
import { usePage } from "@inertiajs/react";

export default function Users() {
  const {url}=usePage();

  return (
    <UsersLayout>
      <UserSearch url={url}/>
      <UserList url={url}/>
    </UsersLayout>
  )
}
