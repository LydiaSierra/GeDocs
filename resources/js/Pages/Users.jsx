import { UserList } from '@/Components/Users/UserList'
import UserSearch from '@/Components/Users/UserSearch'
import UsersLayout from '@/Layouts/UsersLayout'
import React from 'react'

export default function Users() {
  return (
    <UsersLayout>
      <UserSearch/>
      <UserList/>
    </UsersLayout>
  )
}
